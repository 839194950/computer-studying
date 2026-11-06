import { motion } from 'framer-motion';
import { Icon } from '../../components/Icon';

const LETTERS = ['A', 'B', 'C', 'D'];

type OptionState = 'idle' | 'correct' | 'wrong' | 'faded';

const STYLE: Record<OptionState, string> = {
  idle: 'border-line bg-white text-ink shadow-[0_4px_0_#E7E3F3] hover:border-[#D6CFF0] hover:bg-[#FBFAFF] active:translate-y-[4px] active:shadow-none',
  correct: 'border-mint bg-mint-soft text-[#137A47] shadow-[0_4px_0_#2FCB7E]',
  wrong: 'border-bad bg-bad-soft text-[#B3243F] shadow-[0_4px_0_#FF5470]',
  faded: 'border-line bg-white text-ink/45 shadow-[0_4px_0_#E7E3F3]',
};

const BADGE: Record<OptionState, string> = {
  idle: 'border-line bg-paper text-muted',
  correct: 'border-mint bg-mint text-white',
  wrong: 'border-bad bg-bad text-white',
  faded: 'border-line bg-paper text-muted/60',
};

interface OptionButtonProps {
  index: number;
  text: string;
  state: OptionState;
  disabled: boolean;
  onPick: () => void;
}

/** 答题选项：按下有下沉感，答对弹一下，答错左右抖。 */
export function OptionButton({ index, text, state, disabled, onPick }: OptionButtonProps) {
  const anim =
    state === 'correct'
      ? { scale: [1, 1.04, 1], x: 0 }
      : state === 'wrong'
        ? { x: [0, -9, 9, -6, 6, 0], scale: 1 }
        : { scale: 1, x: 0 };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onPick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, ...anim }}
      transition={{
        opacity: { duration: 0.25, delay: index * 0.05 },
        y: { duration: 0.3, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.35 },
        x: { duration: 0.4 },
      }}
      className={[
        'flex w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-3.5 text-left text-[15px] font-bold transition-[background-color,border-color,color,box-shadow,transform] duration-150',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30',
        STYLE[state],
        disabled ? 'cursor-default' : '',
      ].join(' ')}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 text-xs font-black transition-colors ${BADGE[state]}`}
      >
        {state === 'correct' ? (
          <>
            <span className="sr-only">{LETTERS[index]}.</span>
            <Icon name="check" size={16} strokeWidth={3.2} />
          </>
        ) : state === 'wrong' ? (
          <>
            <span className="sr-only">{LETTERS[index]}.</span>
            <Icon name="close" size={15} strokeWidth={3.2} />
          </>
        ) : (
          `${LETTERS[index]}.`
        )}
      </span>
      <span className="min-w-0 flex-1">{text}</span>
    </motion.button>
  );
}

export type { OptionState };
