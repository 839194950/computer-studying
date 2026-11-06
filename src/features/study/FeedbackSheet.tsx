import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

const PRAISE = ['太棒了！', '答对了！', '漂亮！', '完全正确！', '就是这样！'];

interface FeedbackSheetProps {
  correct: boolean;
  xp: number;
  combo: number;
  correctAnswer: string;
  explanation: string;
  last: boolean;
  onNext: () => void;
  /** 每张卡换一句夸奖，按卡片序号取 */
  seed: number;
}

/** 答题后的底部反馈条：从下方滑入，绿色是对、红色是错，按钮放在拇指够得到的位置。 */
export function FeedbackSheet({ correct, xp, combo, correctAnswer, explanation, last, onNext, seed }: FeedbackSheetProps) {
  if (typeof document === 'undefined') return null;
  const tone = correct
    ? { wrap: 'bg-mint-soft border-[#BDEBD3]', title: 'text-[#137A47]', icon: 'bg-mint text-white' }
    : { wrap: 'bg-bad-soft border-[#FFC9D2]', title: 'text-[#B3243F]', icon: 'bg-bad text-white' };

  return createPortal(
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
      className={`fixed inset-x-0 bottom-0 z-40 border-t-2 ${tone.wrap} pb-[env(safe-area-inset-bottom)]`}
    >
      <div className="mx-auto flex max-w-[760px] flex-col gap-3 px-4 pb-4 pt-4 md:flex-row md:items-end md:gap-6 md:py-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.08 }}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone.icon}`}
            >
              <Icon name={correct ? 'check' : 'close'} size={22} strokeWidth={3.2} />
            </motion.span>
            <div className="min-w-0 flex-1">
              <div className={`flex flex-wrap items-center gap-2 text-lg font-black ${tone.title}`}>
                {correct ? PRAISE[seed % PRAISE.length] : '再想想，这张会再回来'}
                {xp > 0 && (
                  <motion.span
                    initial={{ opacity: 0, y: 8, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.15 }}
                    className="flex items-center gap-0.5 rounded-full bg-sun px-2 py-0.5 text-xs font-black text-ink"
                  >
                    <Icon name="bolt" size={12} />+{xp}
                  </motion.span>
                )}
                {combo >= 2 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.22 }}
                    className="flex items-center gap-0.5 rounded-full bg-flame px-2 py-0.5 text-xs font-black text-white"
                  >
                    <Icon name="flame" size={12} />
                    连对 {combo}
                  </motion.span>
                )}
              </div>
              {!correct && (
                <p className="mt-0.5 text-sm font-extrabold text-[#B3243F]">正确答案：{correctAnswer}</p>
              )}
            </div>
          </div>
          <p className="mt-2 max-h-[22vh] overflow-y-auto text-[13px] font-semibold leading-relaxed text-ink/75">
            {explanation}
          </p>
        </div>
        <div className="md:w-56 md:shrink-0">
          <Button full size="lg" variant={correct ? 'success' : 'danger'} onClick={onNext} autoFocus>
            {last ? '完成' : '下一张'}
          </Button>
          <p className="mt-1.5 hidden text-center text-[11px] font-bold text-muted md:block">Enter 继续 · Esc 退出</p>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}
