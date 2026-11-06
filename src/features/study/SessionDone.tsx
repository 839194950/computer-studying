import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Icon, type IconName } from '../../components/Icon';
import { CountUp } from '../../components/motion';
import { Confetti } from '../../components/Confetti';
import { Mascot } from '../../illustrations/Mascot';

interface SessionDoneProps {
  title: string;
  hint: string;
  /** 真的完成了一轮（不是空队列） */
  celebrate: boolean;
  xp: number;
  accuracy: number;
  bestCombo: number;
  actions: ReactNode;
  reduced: boolean;
}

function Tile({
  icon,
  label,
  tone,
  children,
  delay,
}: {
  icon: IconName;
  label: string;
  tone: string;
  children: ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22, delay }}
      className={`overflow-hidden rounded-2xl border-2 ${tone}`}
    >
      <div className="px-2 py-1 text-center text-[11px] font-black uppercase tracking-wide text-white">{label}</div>
      <div className="flex items-center justify-center gap-1 bg-white py-3 text-xl font-black text-ink">
        <Icon name={icon} size={18} />
        {children}
      </div>
    </motion.div>
  );
}

/** 一轮结束：纸屑 + 吉祥物跳起来 + 三块战绩；空队列时只给提示和出口。 */
export function SessionDone({ title, hint, celebrate, xp, accuracy, bestCombo, actions, reduced }: SessionDoneProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      {celebrate && !reduced && <Confetti />}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 16 }}
        className="relative"
      >
        {celebrate && (
          <span aria-hidden className="absolute inset-0 -z-10 scale-150 rounded-full bg-sun/30 blur-2xl" />
        )}
        <Mascot mood={celebrate ? 'happy' : 'sleep'} size={130} />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`mt-4 text-[26px] font-black ${celebrate ? 'text-flame-dark' : 'text-ink'}`}
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-1 max-w-sm text-sm font-semibold leading-relaxed text-muted"
      >
        {hint}
      </motion.p>

      {celebrate && (
        <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-3">
          <Tile icon="bolt" label="经验" tone="border-sun bg-sun" delay={0.3}>
            <CountUp value={xp} from={0} duration={1.1} />
          </Tile>
          <Tile icon="target" label="正确率" tone="border-mint bg-mint" delay={0.4}>
            <span>
              <CountUp value={accuracy} from={0} duration={1.1} />%
            </span>
          </Tile>
          <Tile icon="flame" label="最高连对" tone="border-flame bg-flame" delay={0.5}>
            <CountUp value={bestCombo} from={0} duration={0.9} />
          </Tile>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: celebrate ? 0.65 : 0.3 }}
        className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
      >
        {actions}
      </motion.div>
    </div>
  );
}
