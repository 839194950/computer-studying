import { motion } from 'framer-motion';
import { Icon } from '../../components/Icon';

/** 横幅里的每日经验目标条：白色半透明底，金色填充，达标后换成对勾。 */
export function DailyGoal({ xp, goal }: { xp: number; goal: number }) {
  const ratio = goal > 0 ? Math.min(1, xp / goal) : 0;
  const reached = ratio >= 1;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs font-extrabold">
        <span className="flex items-center gap-1 text-white/85">
          <Icon name="bolt" size={14} className="text-sun" />
          每日目标
        </span>
        <span className="tabular text-white">
          {reached ? '已达成' : `${Math.min(xp, goal)} / ${goal} 经验`}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="每日经验目标"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={Math.min(xp, goal)}
        className="relative h-4 overflow-hidden rounded-full bg-black/20"
      >
        <motion.div
          className="relative h-full rounded-full bg-gradient-to-r from-[#FFD45C] to-[#FFB800]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(ratio * 100, ratio > 0 ? 6 : 0)}%` }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="absolute inset-x-2 top-[3px] h-1 rounded-full bg-white/45" />
        </motion.div>
      </div>
    </div>
  );
}
