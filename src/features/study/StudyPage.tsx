import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { ButtonLink } from '../../components/ButtonLink';
import { Icon } from '../../components/Icon';
import { TRACK_THEME } from '../../components/trackTheme';
import { Mascot } from '../../illustrations/Mascot';
import { getIllustration } from '../../illustrations/registry';
import { ALL_CARDS, TRACKS, findChapter, getCard, getDetail } from '../../content';
import { DEFAULT_SETTINGS, useStore } from '../../store/useStore';
import { buildCardQueue, buildQueue, chapterState } from '../../lib/queue';
import { resolveStreak, weakCards } from '../../lib/stats';
import { buzz, playSound } from '../../lib/sound';
import { XP_FINISH_BONUS, xpForAnswer } from '../../lib/xp';
import { answerRunner, startRunner, type Runner } from './queueMachine';
import { DetailPanel } from './DetailPanel';
import { FeedbackSheet } from './FeedbackSheet';
import { OptionButton, type OptionState } from './OptionButton';
import { SessionDone } from './SessionDone';

type Phase = 'explain' | 'question' | 'feedback' | 'done';
type Mode = 'today' | 'weak';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * 三种入口：
 * - /study              今天该复习的（到期卡 + 新卡）
 * - /study?chapter=xxx  只学这一章
 * - /study?mode=weak     错题本：答错过且还没记牢的卡
 * 加 &free=1 时忽略到期时间，把这一章全部重练一遍。
 */
const subscribeHydration = (notify: () => void) => {
  const start = useStore.persist.onHydrate(notify);
  const finish = useStore.persist.onFinishHydration(notify);
  return () => { start(); finish(); };
};

export function StudyPage() {
  const hydrated = useSyncExternalStore(subscribeHydration, useStore.persist.hasHydrated, () => false);
  const [params] = useSearchParams();
  const chapterId = params.get('chapter') ?? undefined;
  const mode: Mode = params.get('mode') === 'weak' ? 'weak' : 'today';
  const free = params.get('free') === '1';
  const location = useLocation();
  // 同一自由复习地址再次进入时，也要重建本轮队列与战绩。
  const sessionKey = `${location.key}:${mode}:${chapterId ?? ''}:${free ? 'free' : ''}`;

  // IndexedDB 异步恢复完成后才能建立本轮队列，避免刷新时把旧卡当新卡。
  if (!hydrated) return <Screen title="正在恢复学习进度"><p role="status">正在读取本地存档…</p></Screen>;

  return <StudySession key={sessionKey} chapterId={chapterId} mode={mode} free={free} />;
}

function StudySession({ chapterId, mode, free }: { chapterId?: string; mode: Mode; free: boolean }) {
  const answer = useStore((s) => s.answer);
  const gain = useStore((s) => s.gain);
  const finishSession = useStore((s) => s.finishSession);
  const progress = useStore((s) => s.progress);
  const settings = useStore((s) => s.settings);
  const streak = useStore((s) => s.streak);
  const navigate = useNavigate();
  const soundOn = settings.sound ?? DEFAULT_SETTINGS.sound;

  const scope = mode !== 'weak' && chapterId ? findChapter(chapterId) : undefined;
  const invalidChapter = mode !== 'weak' && chapterId !== undefined && !scope;
  const chapterStatus = scope ? chapterState(scope.track, scope.chapter.id, progress) : undefined;
  const chapterIsDone = chapterStatus === 'done';

  const [runner, setRunner] = useState<Runner>(() => {
    if (mode === 'weak') return startRunner(buildCardQueue(weakCards(progress, ALL_CARDS)));
    if (invalidChapter) return startRunner([]);
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
  /** 本轮战绩：只在这一轮里有效，结算页用 */
  const [combo, setCombo] = useState(0);
  const [stats, setStats] = useState({ xp: 0, answered: 0, correct: 0, bestCombo: 0 });
  const [lastXp, setLastXp] = useState(0);
  const total = useRef(runner.items.length);

  const current = runner.items[runner.index];
  const card = current ? getCard(current.cardId) : undefined;
  const Illustration = getIllustration(card?.illustration ?? 'spark');
  const isCorrect = picked !== null && card ? picked === card.answerIndex : false;
  const theme = card ? TRACK_THEME[card.track] : TRACK_THEME.language;

  const steps = card?.steps ?? [];
  const detail = card ? getDetail(card.id) : [];
  const safeIndex = Math.min(stepIndex, Math.max(0, steps.length - 1));
  const step = steps[safeIndex];
  const lastStep = safeIndex >= steps.length - 1;
  const focus = phase === 'explain' ? (step?.focus ?? []) : [];

  const backTo = scope ? `/map/${scope.track.id}` : '/';
  /** 顶部返回链接上写的字：告诉用户「现在在哪一章」。 */
  const backText = mode === 'weak' ? '薄弱卡' : scope ? scope.chapter.title : '退出';
  /** 空态主按钮上的字。 */
  const backLabel = mode === 'weak' ? '回学习台' : scope ? '回章节地图' : '回学习台';

  function pick(index: number) {
    if (!card || phase !== 'question') return;
    const correct = index === card.answerIndex;
    const nextCombo = correct ? combo + 1 : 0;
    const xp = xpForAnswer(correct, nextCombo);
    setPicked(index);
    setPhase('feedback');
    setCombo(nextCombo);
    setLastXp(xp);
    setStats((s) => ({
      xp: s.xp + xp,
      answered: s.answered + 1,
      correct: s.correct + (correct ? 1 : 0),
      bestCombo: Math.max(s.bestCombo, nextCombo),
    }));
    answer(card.id, correct);
    gain({ xp, correct, combo: nextCombo });
    playSound(correct ? 'correct' : 'wrong', soundOn);
    if (!correct) buzz(!settings.reducedMotion);
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
        gain({ xp: XP_FINISH_BONUS });
        setStats((s) => ({ ...s, xp: s.xp + XP_FINISH_BONUS }));
        setFinished(true);
        playSound('finish', soundOn);
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
  }, [phase, card, runner, safeIndex, isCorrect, finished, backTo, navigate, combo]);

  if (phase === 'done' || !card) {
    const empty = total.current === 0;
    const title = empty
      ? mode === 'weak'
        ? '暂时没有薄弱卡'
        : scope
          ? '这一章今天没有安排'
          : '今天没有要复习的卡'
      : '这一轮清空了！';

    const hint = empty
      ? mode === 'weak'
        ? '答错过的卡都已经记牢了，保持住。'
        : scope
          ? chapterIsDone
            ? '这一章都记牢了，下次复习时间还没到。想练可以再来一遍。'
            : '本章到期的卡和今天的新卡都处理完了，明天再来。'
          : '到期的卡都做完了，明天再来。想多学可以先去地图上开新章节。'
      : `完成 ${total.current} 张 · 连续打卡 ${resolveStreak(streak, Date.now()).current} 天`;

    const canReplay = scope && chapterStatus !== 'locked' && (finished || (empty && chapterIsDone));
    const accuracy = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;

    return (
      <Screen withNav={false}>
        <SessionDone
          title={invalidChapter ? '未找到这个章节' : title}
          hint={invalidChapter ? '章节链接可能有误，请回学习台重新选择主线。' : canReplay ? `${hint} 提前复习会重排下次到期时间。` : hint}
          celebrate={finished}
          xp={stats.xp}
          accuracy={accuracy}
          bestCombo={stats.bestCombo}
          reduced={settings.reducedMotion}
          actions={
            canReplay ? (
              <>
                <ButtonLink to={backTo} variant={finished ? 'success' : 'primary'} size="lg" className="flex-1">
                  {backLabel}
                </ButtonLink>
                <ButtonLink to={`/study?chapter=${chapterId}&free=1`} variant="ghost" size="lg" className="flex-1">
                  再练一遍
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink to={backTo} size="lg" variant={finished ? 'success' : 'primary'} className="flex-1">
                  {backLabel}
                </ButtonLink>
                <ButtonLink to="/stats" variant="ghost" size="lg" className="flex-1">
                  去图谱看看
                </ButtonLink>
              </>
            )
          }
        />
      </Screen>
    );
  }

  const progressRatio = (runner.index + (phase === 'feedback' ? 1 : 0)) / Math.max(1, runner.items.length);
  const optionState = (index: number): OptionState => {
    if (phase !== 'feedback') return 'idle';
    if (index === card.answerIndex) return 'correct';
    if (index === picked) return 'wrong';
    return 'faded';
  };
  const bubble =
    phase === 'explain'
      ? (step?.caption ?? card.explain)
      : phase === 'question'
        ? '想清楚再点，不要猜。'
        : isCorrect
          ? '答对了，记忆加深！'
          : '没关系，看看讲解，它会再回来。';

  return (
    <Screen withNav={false} className={phase === 'feedback' ? '!pb-72 md:!pb-48' : ''}>
      <div className="mx-auto max-w-[760px]">
        {/* 顶栏：退出 + 进度条 + 连对 */}
        <div className="mb-5 flex items-center gap-3">
          <Link
            to={backTo}
            className="flex shrink-0 items-center gap-1 rounded-xl px-1.5 py-1 text-sm font-extrabold text-muted transition-colors hover:bg-white hover:text-ink"
          >
            <Icon name="close" size={20} strokeWidth={2.6} />
            <span className="max-w-[6.5rem] truncate">{backText}</span>
          </Link>
          <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-[#E6E2F1]">
            <motion.div
              className={`relative h-full rounded-full ${theme.bar}`}
              initial={false}
              animate={{ width: `${Math.max(progressRatio * 100, 4)}%` }}
              transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            >
              <span className="absolute inset-x-2 top-[3px] h-1 rounded-full bg-white/40" />
            </motion.div>
          </div>
          <AnimatePresence>
            {combo >= 2 && (
              <motion.span
                key="combo"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex shrink-0 items-center gap-0.5 text-sm font-black text-flame"
                title="连对"
              >
                <Icon name="flame" size={18} className="animate-flicker" />
                <span className="tabular">{combo}</span>
              </motion.span>
            )}
          </AnimatePresence>
          <span className="tabular shrink-0 text-xs font-extrabold text-muted">
            {runner.index + 1}/{runner.items.length}
          </span>
        </div>

        {/* 只做进场动画：换卡、讲解→答题时新内容从右侧滑入，旧内容立即让位，不拖慢节奏 */}
        <motion.div
            key={`${card.id}-${runner.index}-${runner.items.length}-${phase === 'explain' ? 'e' : 'q'}`}
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${theme.solid}`}>
                <Icon name={theme.icon} size={15} />
              </span>
              <span className={`text-xs font-black ${theme.text}`}>
                {current?.isNew ? '新知识' : '复习'} · {scope?.chapter.title ?? findChapter(card.chapter)?.chapter.title}
              </span>
            </div>
            <h2 className="text-[22px] font-black leading-snug text-ink md:text-2xl">
              {phase === 'explain' ? card.title : card.question}
            </h2>

            {/* 吉祥物 + 对话气泡 */}
            <div className="mt-4 flex items-end gap-2">
              <Mascot
                mood={phase === 'feedback' ? (isCorrect ? 'happy' : 'confused') : 'idle'}
                size={phase === 'explain' ? 64 : 52}
                className="shrink-0"
              />
              <div className="relative mb-2 min-w-0 flex-1 rounded-2xl border-2 border-line bg-white px-4 py-3 shadow-lip" aria-live="polite">
                <span aria-hidden className="absolute -left-[9px] bottom-4 h-4 w-4 rotate-45 border-b-2 border-l-2 border-line bg-white" />
                <motion.p
                  key={`${phase}-${safeIndex}-${picked ?? ''}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className="relative text-[15px] font-bold leading-relaxed text-ink"
                >
                  {bubble}
                </motion.p>
                {phase === 'explain' && steps.length > 0 && (
                  <div className="relative mt-2 flex items-center gap-1.5">
                    {steps.map((_, i) => (
                      <motion.span
                        key={i}
                        aria-hidden="true"
                        layout
                        className={`h-2 rounded-full ${
                          i === safeIndex ? `w-6 ${theme.bar}` : i < safeIndex ? `w-2 ${theme.bar} opacity-40` : 'w-2 bg-[#E6E2F1]'
                        }`}
                      />
                    ))}
                    <span className="tabular ml-auto text-[11px] font-extrabold text-muted">
                      {safeIndex + 1}/{steps.length}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 概念图 */}
            <div
              className={`mt-3 flex justify-center overflow-hidden rounded-[22px] border-2 border-line bg-white shadow-lip transition-[padding] duration-300 ${
                phase === 'explain' ? 'px-3 py-5' : 'px-3 py-3'
              }`}
            >
              <Illustration
                className={`h-auto w-full transition-[max-width] duration-300 ${phase === 'explain' ? 'max-w-[620px]' : 'max-w-[380px]'}`}
                focus={focus}
              />
            </div>

            {phase === 'explain' ? (
              <>
                <DetailPanel cardId={card.id} detail={detail} />
                <div className="sticky bottom-0 -mx-4 mt-4 bg-gradient-to-t from-paper via-paper to-transparent px-4 pb-4 pt-6">
                  <Button full size="lg" onClick={() => { playSound('step', soundOn); nextStep(); }}>
                    {lastStep ? '懂了，考考我' : '看下一步'}
                  </Button>
                  <p className="mt-2 hidden text-center text-[11px] font-bold text-muted md:block">Enter 继续 · Esc 退出</p>
                </div>
              </>
            ) : (
              <>
                <div className="mt-4 space-y-2.5">
                  {card.options.map((option, index) => (
                    <OptionButton
                      key={index}
                      index={index}
                      text={option}
                      state={optionState(index)}
                      disabled={phase === 'feedback'}
                      onPick={() => pick(index)}
                    />
                  ))}
                </div>
                {phase === 'question' && (
                  <p className="mt-3 hidden text-center text-[11px] font-bold text-muted md:block">按 1–4 或 A–D 选择</p>
                )}
                {phase === 'feedback' && (
                  <DetailPanel cardId={`fb-${card.id}`} detail={detail} defaultOpen={!isCorrect} />
                )}
              </>
            )}
          </motion.div>
      </div>

      {phase === 'feedback' && (
        <FeedbackSheet
          correct={isCorrect}
          xp={lastXp}
          combo={combo}
          correctAnswer={card.options[card.answerIndex]}
          explanation={card.explanation}
          last={answerRunner(runner, card.id, isCorrect).done}
          onNext={advance}
          seed={stats.answered}
        />
      )}
    </Screen>
  );
}
