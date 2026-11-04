import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { StickerCard } from '../../components/StickerCard';
import { Mascot } from '../../illustrations/Mascot';
import { getIllustration } from '../../illustrations/registry';
import { ALL_CARDS, TRACKS, getCard } from '../../content';
import { useStore } from '../../store/useStore';
import { buildQueue } from '../../lib/queue';
import { answerRunner, startRunner, type Runner } from './queueMachine';

type Phase = 'explain' | 'question' | 'feedback' | 'done';

const LETTERS = ['A', 'B', 'C', 'D'];

export function StudyPage() {
  const answer = useStore((s) => s.answer);
  const finishSession = useStore((s) => s.finishSession);
  const progress = useStore((s) => s.progress);
  const settings = useStore((s) => s.settings);
  const streak = useStore((s) => s.streak);

  const [runner, setRunner] = useState<Runner>(() =>
    startRunner(buildQueue(TRACKS, progress, { newLimit: settings.newCardsPerDay, now: Date.now() })),
  );
  const [phase, setPhase] = useState<Phase>(runner.done ? 'done' : 'explain');
  const [picked, setPicked] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const total = useRef(runner.items.length);

  const current = runner.items[runner.index];
  const card = current ? getCard(current.cardId) : undefined;
  const Illustration = getIllustration(card?.illustration ?? 'spark');
  const isCorrect = picked !== null && card ? picked === card.answerIndex : false;

  function pick(index: number) {
    if (!card || phase !== 'question') return;
    setPicked(index);
    setPhase('feedback');
    answer(card.id, index === card.answerIndex);
  }

  function advance() {
    if (!card) return;
    const next = answerRunner(runner, card.id, isCorrect);
    setRunner(next);
    setPicked(null);
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

  if (phase === 'done' || !card) {
    return (
      <>
        <Screen>
          <StickerCard tone="paper" className="flex flex-col items-center gap-3 p-8 text-center">
            <Mascot mood={finished ? 'happy' : 'sleep'} size={110} />
            <h1 className="text-xl font-black text-ink">
              {total.current === 0 ? '今天没有要复习的卡' : '这一轮清空了'}
            </h1>
            <p className="text-sm leading-relaxed text-muted">
              完成 {total.current} 张 · 连续打卡 {streak.current} 天
            </p>
            <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row">
              <Link to="/" className="flex-1">
                <Button full>回学习台</Button>
              </Link>
              <Link to="/map" className="flex-1">
                <Button full variant="ghost">
                  去地图看看
                </Button>
              </Link>
            </div>
          </StickerCard>
        </Screen>
      </>
    );
  }

  return (
    <Screen>
      <div className="mb-4 flex items-center gap-3">
        <Link to="/" className="text-sm font-bold text-muted">
          ← 退出
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
            {phase === 'explain' ? card.explain : phase === 'question' ? '想清楚再点，不要猜。' : isCorrect ? '答对了，记忆加深。' : '答错了，这张会再回来。'}
          </p>
        </div>

        <div className="flex justify-center bg-paper px-6 py-6">
          <Illustration className="h-32 w-auto" />
        </div>

        <div className="p-5">
          {phase === 'explain' ? (
            <>
              <h2 className="text-lg font-black text-ink">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{card.explain}</p>
              <Button full size="lg" className="mt-5" onClick={() => setPhase('question')}>
                懂了，考考我
              </Button>
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
                <Button full size="lg" className="mt-4" onClick={advance}>
                  {runner.items.length === 1 ? '完成' : '下一张'}
                </Button>
              )}
            </>
          )}
        </div>
      </StickerCard>
    </Screen>
  );
}
