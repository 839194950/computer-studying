import { motion } from 'framer-motion';
import { Icon, type IconName } from '../../components/Icon';
import { StickerCard } from '../../components/StickerCard';
import { Mascot } from '../../illustrations/Mascot';
import { TRACKS } from '../../content';
import { useStore } from '../../store/useStore';
import { achievements, type Achievement } from '../../lib/achievements';
import { resolveStreak } from '../../lib/stats';
import { levelInfo } from '../../lib/xp';

const BADGE_TONE: Record<Achievement['tone'], string> = {
  brand: 'bg-brand shadow-[0_4px_0_#5A3DE6]',
  mint: 'bg-mint shadow-[0_4px_0_#1FA463]',
  sun: 'bg-sun shadow-[0_4px_0_#E0A300]',
  pink: 'bg-pink shadow-[0_4px_0_#E04B7C]',
  sky: 'bg-sky shadow-[0_4px_0_#1A93D0]',
  flame: 'bg-flame shadow-[0_4px_0_#E07A00]',
};

const BADGE_ICON: Record<string, IconName> = {
  first: 'play',
  ten: 'book',
  streak3: 'flame',
  streak7: 'flame',
  chapter: 'check',
  xp500: 'bolt',
  track: 'map',
  master: 'star',
};

/** 「我」页顶部：等级卡 + 成就墙。数据全部从现有进度推出。 */
export function ProfileCard() {
  const xp = useStore((s) => s.xp ?? 0);
  const streak = useStore((s) => s.streak);
  const progress = useStore((s) => s.progress);
  const level = levelInfo(xp);
  const current = resolveStreak(streak, Date.now()).current;
  const list = achievements({ tracks: TRACKS, progress, longestStreak: streak.longest, xp });
  const unlocked = list.filter((a) => a.unlocked).length;

  return (
    <>
      <section className="relative mb-4 overflow-hidden rounded-[26px] bg-gradient-to-br from-[#8A6BFF] to-[#5A3DE6] p-5 text-white shadow-float">
        <div aria-hidden className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-4">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/15">
            <Mascot size={62} mood="happy" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-extrabold text-white/75">Lv.{level.level}</div>
            <div className="text-xl font-black">{level.title}</div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/20">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#FFD45C] to-[#FFB800]"
                initial={{ width: 0 }}
                animate={{ width: `${(level.into / level.span) * 100}%` }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="tabular mt-1 text-[11px] font-bold text-white/75">
              还差 {level.span - level.into} 经验升到 Lv.{level.level + 1}
            </div>
          </div>
        </div>
        <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { label: '累计经验', value: xp, icon: 'bolt' as const },
            { label: '当前连胜', value: current, icon: 'flame' as const },
            { label: '最长连胜', value: streak.longest, icon: 'star' as const },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/15 py-2.5">
              <div className="tabular flex items-center justify-center gap-1 text-lg font-black">
                <Icon name={item.icon} size={15} className="text-sun" />
                {item.value}
              </div>
              <div className="text-[11px] font-bold text-white/75">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <StickerCard className="mb-4 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-black text-ink">成就</h2>
          <span className="text-xs font-bold text-muted">
            {unlocked}/{list.length} 已解锁
          </span>
        </div>
        <ul className="m-0 grid list-none grid-cols-4 gap-x-2 gap-y-4 p-0">
          {list.map((a, i) => (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.05 * i }}
              className="flex flex-col items-center text-center"
              title={`${a.hint}（${a.value}/${a.target}）`}
            >
              <span
                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl text-white ${
                  a.unlocked ? BADGE_TONE[a.tone] : 'bg-[#ECE9F4] text-[#C4BFD6] shadow-[0_4px_0_#DCD8E8]'
                }`}
              >
                <Icon name={a.unlocked ? (BADGE_ICON[a.id] ?? 'star') : 'lock'} size={24} strokeWidth={2.4} />
              </span>
              <span className={`mt-2 text-xs font-black ${a.unlocked ? 'text-ink' : 'text-muted'}`}>{a.title}</span>
              <span className="tabular text-[10px] font-bold text-muted">
                {a.unlocked ? a.hint : `${a.value}/${a.target}`}
              </span>
            </motion.li>
          ))}
        </ul>
      </StickerCard>
    </>
  );
}
