import { Link } from 'react-router-dom';
import { Screen } from '../../components/Screen';
import { StickerCard } from '../../components/StickerCard';
import { ProgressRing } from '../../components/ProgressRing';
import { BottomNav } from '../../components/BottomNav';
import { ALL_CARDS, TRACKS } from '../../content';
import { useStore } from '../../store/useStore';
import { cardStatus, masteryPercent, weakCards, type CardStatus } from '../../lib/stats';
import { MasteryBar } from './MasteryBar';
import { TrendChart } from './TrendChart';

const LEGEND: { status: CardStatus; label: string; dot: string }[] = [
  { status: 'mastered', label: '记牢了', dot: 'bg-mint' },
  { status: 'learning', label: '刚学会', dot: 'bg-sun' },
  { status: 'forgotten', label: '快忘了', dot: 'bg-pink' },
  { status: 'new', label: '没学过', dot: 'bg-brand/30' },
];

function formatDue(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export function StatsPage() {
  const progress = useStore((s) => s.progress);
  const snapshots = useStore((s) => s.snapshots);
  const now = Date.now();

  const mastery = masteryPercent(progress, ALL_CARDS.length);
  const cards = ALL_CARDS.map((c) => ({ id: c.id, status: cardStatus(progress[c.id], now) }));
  const counts = LEGEND.map((l) => ({
    ...l,
    count: cards.filter((c) => c.status === l.status).length,
  }));
  const weak = weakCards(progress, ALL_CARDS);

  return (
    <>
      <Screen title="记忆图谱" subtitle="颜色说明这张卡在你脑子里的状态。">
        <StickerCard className="mb-4 flex items-center gap-5 p-5">
          <ProgressRing value={mastery} size={104} label="掌握度" />
          <ul className="m-0 flex-1 list-none space-y-1.5 p-0">
            {counts.map((item) => (
              <li key={item.status} className="flex items-center gap-2 text-xs font-bold text-ink">
                <i className={`inline-block h-3 w-3 rounded-[3px] border-2 border-ink ${item.dot}`} />
                <span>{item.label}</span>
                <span className="ml-auto font-mono text-muted">{item.count}</span>
              </li>
            ))}
          </ul>
        </StickerCard>

        <h2 className="mb-2 text-sm font-black text-ink">全部卡片</h2>
        <div className="mb-5">
          <MasteryBar cards={cards} />
        </div>

        {weak.length > 0 && (
          <Link to="/study?mode=weak" className="mb-5 block">
            <div className="flex items-center justify-between rounded-sticker border-[3px] border-ink bg-pink px-4 py-3 transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:shadow-pop-lg">
              <span className="text-sm font-black text-ink">薄弱卡 {weak.length} 张</span>
              <span className="text-xs font-black text-ink">单独练一遍 →</span>
            </div>
          </Link>
        )}

        <h2 className="mb-2 text-sm font-black text-ink">近 30 天掌握度</h2>
        <div className="mb-5">
          <TrendChart snapshots={snapshots} />
        </div>

        <h2 className="mb-2 text-sm font-black text-ink">按主线看</h2>
        <div className="space-y-3">
          {TRACKS.map((track) => {
            const learned = track.cards.filter((c) => (progress[c.id]?.box ?? 0) >= 4).length;
            const due = track.cards
              .map((c) => progress[c.id])
              .filter((p) => p && p.dueAt > now)
              .sort((a, b) => a!.dueAt - b!.dueAt)[0];
            return (
              <StickerCard key={track.id} className="p-4">
                <div className="flex items-center justify-between text-sm font-black text-ink">
                  <span>{track.title}</span>
                  <span className="font-mono text-xs text-muted">
                    {learned}/{track.cards.length}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-bold text-muted">
                  {track.cards.length === 0
                    ? '这一条线还在写卡'
                    : due
                      ? `下一张到期：${formatDue(due.dueAt)}`
                      : '暂无排期，去学一张就会有'}
                </p>
              </StickerCard>
            );
          })}
        </div>
      </Screen>
      <BottomNav active="stats" />
    </>
  );
}
