import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { ButtonLink } from '../../components/ButtonLink';
import { StickerCard } from '../../components/StickerCard';
import { Mascot } from '../../illustrations/Mascot';
import { getIllustration } from '../../illustrations/registry';
import { ALL_CARDS, TRACKS, findChapter, getCard, getDetail } from '../../content';
import type { DetailSection } from '../../content';
import { useStore } from '../../store/useStore';
import { buildCardQueue, buildQueue, chapterState } from '../../lib/queue';
import { resolveStreak, weakCards } from '../../lib/stats';
import { answerRunner, startRunner, type Runner } from './queueMachine';

type Phase = 'explain' | 'question' | 'feedback' | 'done';
type Mode = 'today' | 'weak';

const LETTERS = ['A', 'B', 'C', 'D'];

/**
 * 三种入口：
 * - /study              今天该复习的（到期卡 + 新卡）
 * - /study?chapter=xxx  只学这一章
 * - /study?mode=weak     错题本：答错过且还没记牢的卡
 * 加 &free=1 时忽略到期时间，把这一章全部重练一遍。
 */
export function StudyPage() {
  const [params] = useSearchParams();
  const chapterId = params.get('chapter') ?? undefined;
  const mode: Mode = params.get('mode') === 'weak' ? 'weak' : 'today';
  const free = params.get('free') === '1';
  const sessionKey = `${mode}:${chapterId ?? ''}:${free ? 'free' : ''}`;

  return <StudySession key={sessionKey} chapterId={chapterId} mode={mode} free={free} />;
}

/** 详细讲解面板：讲解面默认收起，答错时默认展开。 */
function DetailPanel({
  cardId,
  detail,
  defaultOpen = false,
}: {
  cardId: string;
  detail: DetailSection[];
  defaultOpen?: boolean;
}) {
  if (detail.length === 0) return null;
  return (
    <details
      key={cardId}
      open={defaultOpen}
      className="group mt-3 rounded-sticker border-[3px] border-ink bg-white"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-black text-ink">详细讲解</span>
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted">
          {detail.length} 节
          <span aria-hidden="true" className="transition-transform group-open:rotate-180">
            ▾
          </span>
        </span>
      </summary>
      <div className="space-y-3.5 border-t-[3px] border-ink px-3 py-3.5">
        {detail.map((section) => (
          <section key={section.heading}>
            <h3 className="text-[13px] font-black text-brand">{section.heading}</h3>
            <p className="mt-1 text-[13px] leading-[1.9] text-ink/85">{section.body}</p>
          </section>
        ))}
      </div>
    </details>
  );
}

function StudySession({ chapterId, mode, free }: { chapterId?: string; mode: Mode; free: boolean }) {  const answer = useStore((s) => s.answer);
  const finishSession = useStore((s) => s.finishSession);
  const progress = useStore((s) => s.progress);
  const settings = useStore((s) => s.settings);
  const streak = useStore((s) => s.streak);
  const navigate = useNavigate();

  const scope = chapterId ? findChapter(chapterId) : undefined;
  const chapterIsDone = scope ? chapterState(scope.track, scope.chapter.id, progress) === 'done' : false;

  const [runner, setRunner] = useState<Runner>(() => {
    if (mode === 'weak') return startRunner(buildCardQueue(weakCards(progress, ALL_CARDS)));
    return startRunner(
      buildQueue(TRACKS, progress, {
        newLimit: settings.newCardsPerDay,
        now: Date.now(),
        chapterId,
        includeAll: free,
      }),
    );
  });
  const [phase, setPhase] = useState<Phase>(runner.done ? 'done' : 'explain');
  const [picked, setPicked] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const total = useRef(runner.items.length);

  const current = runner.items[runner.index];
  const card = current ? getCard(current.cardId) : undefined;
  const Illustration = getIllustration(card?.illustration ?? 'spark');
  const isCorrect = picked !== null && card ? picked === card.answerIndex : false;

  const steps = card?.steps ?? [];
  const detail = card ? getDetail(card.id) : [];
  const safeIndex = Math.min(stepIndex, Math.max(0, steps.length - 1));
  const step = steps[safeIndex];
  const lastStep = safeIndex >= steps.length - 1;
  const focus = step?.focus ?? [];

  const backTo = mode === 'weak' ? '/' : scope ? '/map' : '/';
  /** 顶部返回链接上写的字：告诉用户「现在在哪一章」。 */
  const backText = mode === 'weak' ? '薄弱卡' : scope ? scope.chapter.title : '退出';
  /** 空态主按钮上的字。 */
  const backLabel = mode === 'weak' ? '回学习台' : scope ? '回章节地图' : '回学习台';

  function pick(index: number) {
    if (!card || phase !== 'question') return;
    setPicked(index);
    setPhase('feedback');
    answer(card.id, index === card.answerIndex);
  }

  function nextStep() {
    if (lastStep) {
      setPhase('question');
      return;
    }
    setStepIndex(safeIndex + 1);
  }

  function advance() {
    if (!card) return;
    const next = answerRunner(runner, card.id, isCorrect);
    setRunner(next);
    setPicked(null);
    setStepIndex(0);
    if (next.done) {
      if (!finished) {
        finishSession(ALL_CARDS.length);
        setFinished(true);
      }
      setPhase('done');
    } else {
      setPhase('explain');
    }
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return;

      if (e.key === 'Escape') {
        navigate(backTo);
        return;
      }

      if (phase === 'explain') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          nextStep();
        }
        return;
      }

      if (phase === 'question' && card) {
        let index = -1;
        if (/^[1-4]$/.test(e.key)) index = Number(e.key) - 1;
        else if (/^[a-dA-D]$/.test(e.key)) index = e.key.toLowerCase().charCodeAt(0) - 97;
        if (index >= 0 && index < card.options.length) {
          e.preventDefault();
          pick(index);
        }
        return;
      }

      if (phase === 'feedback' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        advance();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, card, runner, safeIndex, isCorrect, finished, backTo, navigate]);

  if (phase === 'done' || !card) {
    const empty = total.current === 0;
    const title = empty
      ? mode === 'weak'
        ? '暂时没有薄弱卡'
        : scope
          ? '这一章今天没有安排'
          : '今天没有要复习的卡'
      : '这一轮清空了';

    const hint = empty
      ? mode === 'weak'
        ? '答错过的卡都已经记牢了，保持住。'
        : scope
          ? chapterIsDone
            ? '这一章都记牢了，下次复习时间还没到。想练可以再来一遍。'
            : '本章到期的卡和今天的新卡都处理完了，明天再来。'
          : '到期的卡都做完了，明天再来。想多学可以先去地图上开新章节。'
      : `完成 ${total.current} 张 · 连续打卡 ${resolveStreak(streak, Date.now()).current} 天`;

    const canReplay = empty && chapterIsDone && chapterId;

    return (
      <Screen>
        <StickerCard tone="paper" className="flex flex-col items-center gap-3 p-8 text-center">
          <Mascot mood={finished ? 'happy' : 'sleep'} size={110} />
          <h1 className="text-xl font-black text-ink">{title}</h1>
          <p className="text-sm leading-relaxed text-muted">{hint}</p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row">
            {canReplay ? (
              <>
                <ButtonLink to={`/study?chapter=${chapterId}&free=1`} className="flex-1">
                  再练一遍
                </ButtonLink>
                <ButtonLink to="/map" variant="ghost" className="flex-1">
                  回章节地图
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink to={backTo} className="flex-1">
                  {backLabel}
                </ButtonLink>
                <ButtonLink to="/stats" variant="ghost" className="flex-1">
                  去图谱看看
                </ButtonLink>
              </>
            )}
          </div>
        </StickerCard>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="mb-4 flex items-center gap-3">
        <Link to={backTo} className="shrink-0 text-sm font-bold text-muted">
          ← {backText}
        </Link>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full border-2 border-ink bg-white">
          <motion.div
            className="h-full rounded-full bg-brand"
            animate={{ width: `${((runner.index + 1) / Math.max(1, runner.items.length)) * 100}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
        <span className="font-mono text-xs font-bold text-muted">
          {runner.index + 1}/{runner.items.length}
        </span>
      </div>

      <StickerCard className="overflow-hidden">
        <div className="flex items-center gap-3 border-b-[3px] border-ink bg-sun/60 px-4 py-3">
          <Mascot mood={phase === 'feedback' ? (isCorrect ? 'happy' : 'confused') : 'idle'} size={52} />
          <p className="text-xs font-bold leading-relaxed text-ink">
            {phase === 'explain'
              ? card.explain
              : phase === 'question'
                ? '想清楚再点，不要猜。'
                : isCorrect
                  ? '答对了，记忆加深。'
                  : '答错了，这张会再回来。'}
          </p>
        </div>

        <div className="flex justify-center bg-paper px-3 py-4">
          <Illustration className="h-auto w-full max-w-[620px]" focus={focus} />
        </div>

        <div className="p-5">
          {phase === 'explain' ? (
            <>
              <h2 className="text-lg font-black text-ink">{card.title}</h2>

              <div
                className="mt-3 rounded-sticker border-[3px] border-ink bg-paper px-3 py-3"
                aria-live="polite"
              >
                <p className="text-sm font-bold leading-relaxed text-ink">
                  {step?.caption ?? card.explain}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  {steps.map((_, i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className={
                        i === safeIndex
                          ? 'h-2 w-5 rounded-full bg-brand'
                          : i < safeIndex
                            ? 'h-2 w-2 rounded-full bg-brand/40'
                            : 'h-2 w-2 rounded-full bg-ink/15'
                      }
                    />
                  ))}
                  {steps.length > 0 && (
                    <span className="ml-auto font-mono text-[11px] font-bold text-muted">
                      {safeIndex + 1}/{steps.length}
                    </span>
                  )}
                </div>
              </div>

              <DetailPanel cardId={card.id} detail={detail} />

              <Button full size="lg" className="mt-4" onClick={nextStep}>
                {lastStep ? '懂了，考考我' : '看下一步'}
              </Button>
              <p className="mt-2 hidden text-center text-[11px] font-bold text-muted md:block">
                Enter 继续 · Esc 退出
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-black text-ink">{card.question}</h2>
              <div className="mt-4 space-y-2.5">
                {card.options.map((option, index) => {
                  const chosen = picked === index;
                  const showCorrect = phase === 'feedback' && index === card.answerIndex;
                  const showWrong = phase === 'feedback' && chosen && !isCorrect;
                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={phase === 'feedback'}
                      onClick={() => pick(index)}
                      className={[
                        'flex w-full items-center gap-3 rounded-sticker border-[3px] border-ink px-3 py-3 text-left text-sm font-bold transition-transform',
                        showCorrect
                          ? 'bg-mint text-ink'
                          : showWrong
                            ? 'bg-pink text-ink'
                            : 'bg-white text-ink active:translate-x-[2px] active:translate-y-[2px]',
                        phase === 'question' ? 'shadow-pop-sm' : '',
                      ].join(' ')}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper font-mono text-xs">
                        {LETTERS[index]}.
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {phase === 'question' && (
                <p className="mt-3 hidden text-center text-[11px] font-bold text-muted md:block">
                  按 1–4 或 A–D 选择
                </p>
              )}

              {phase === 'feedback' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-sticker border-[3px] border-ink bg-paper p-3"
                >
                  <p className="text-xs leading-relaxed text-ink">{card.explanation}</p>
                </motion.div>
              )}

              {phase === 'feedback' && (
                <DetailPanel cardId={`fb-${card.id}`} detail={detail} defaultOpen={!isCorrect} />
              )}

              {phase === 'feedback' && (
                <>
                  <Button full size="lg" className="mt-4" onClick={advance}>
                    {runner.index >= runner.items.length - 1 ? '完成' : '下一张'}
                  </Button>
                  <p className="mt-2 hidden text-center text-[11px] font-bold text-muted md:block">
                    Enter 继续 · Esc 退出
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </StickerCard>
    </Screen>
  );
}
