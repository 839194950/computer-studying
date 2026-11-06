import { Icon } from './Icon';
import { CountUp } from './motion';
import { useStore } from '../store/useStore';
import { resolveStreak } from '../lib/stats';
import { levelInfo } from '../lib/xp';

/** 连胜 / 经验 / 等级三枚小徽章，首页和桌面顶栏共用。 */
export function StatChips({ compact = false }: { compact?: boolean }) {
  const streak = useStore((s) => s.streak);
  const xp = useStore((s) => s.xp ?? 0);
  const current = resolveStreak(streak, Date.now()).current;
  const level = levelInfo(xp);
  const pad = compact ? 'px-2.5 py-1' : 'px-3 py-1.5';

  return (
    <div className="flex items-center gap-1.5">
      <span
        title="连续打卡"
        className={`flex items-center gap-1 rounded-full ${pad} text-sm font-black ${
          current > 0 ? 'bg-flame-soft text-flame-dark' : 'bg-[#F0EEF6] text-muted'
        }`}
      >
        <Icon name="flame" size={17} className={current > 0 ? 'animate-flicker text-flame' : ''} />
        <span className="tabular">{current} 天</span>
      </span>
      <span title="累计经验" className={`flex items-center gap-1 rounded-full bg-sun-soft ${pad} text-sm font-black text-[#B07F00]`}>
        <Icon name="bolt" size={16} className="text-sun" />
        <CountUp value={xp} className="tabular" />
      </span>
      <span title={level.title} className={`flex items-center gap-1 rounded-full bg-brand-soft ${pad} text-sm font-black text-brand-dark`}>
        <Icon name="star" size={15} className="text-brand" />
        <span className="tabular">Lv.{level.level}</span>
      </span>
    </div>
  );
}
