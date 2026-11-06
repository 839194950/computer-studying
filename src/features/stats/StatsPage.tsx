import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Screen } from '../../components/Screen';
import { StickerCard } from '../../components/StickerCard';
import { ProgressRing } from '../../components/ProgressRing';
import { BottomNav } from '../../components/BottomNav';
import { ALL_CARDS, TRACKS, type TrackId } from '../../content';
import { useStore } from '../../store/useStore';
import { cardStatus, masteryPercent, pickFocusTrack, weakCards } from '../../lib/stats';
import { formatMonthDay } from '../../lib/time';
import { CardRow } from './CardRow';
import { readFoldTrack, writeFoldTrack } from './foldState';
import { MasteryBar } from './MasteryBar';
import { STATUS_ORDER, STATUS_STYLE } from './statusStyle';
import { TrendChart } from './TrendChart';

export function StatsPage() {
  const progress = useStore((s) => s.progress);
  const snapshots = useStore((s) => s.snapshots);
  const now = Date.now();
  const [openTrack, setOpenTrack] = useState<TrackId | null | undefined>(readFoldTrack);

  const mastery = masteryPercent(progress, ALL_CARDS.length);
  const cards = ALL_CARDS.map((c) => ({ id: c.id, status: cardStatus(progress[c.id], now) }));
  const counts = STATUS_ORDER.map((status) => ({
    status,
    ...STATUS_STYLE[status],
    count: cards.filter((c) => c.status === status).length,
  }));
  const weak = weakCards(progress, ALL_CARDS);

  // 没手动选过就用默认规则挑一条；手动收起后不再自动展开。
  const activeTrack = openTrack === undefined ? pickFocusTrack(TRACKS, progress, now) : openTrack;
  const toggleTrack = (id: TrackId) => {
    const next = activeTrack === id ? null : id;
    setOpenTrack(next);
    writeFoldTrack(next);
  };

  return (
    <>
      <Screen title="记忆图谱" subtitle="颜色说明这张卡在你脑子里的状态。">
        <StickerCard className="mb-4 flex items-center gap-5 p-5">
          <ProgressRing value={mastery} size={104} label="掌握度" />
          <ul className="m-0 flex-1 list-none space-y-1.5 p-0">
            {counts.map((item) => (
              <li key={item.status} className="flex items-center gap-2 text-xs font-bold text-ink">
                <i className={`inline-block h-3 w-3 rounded-[3px] border-2 border-ink ${item.bg}`} />
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
            const isOpen = activeTrack === track.id;
            return (
              <StickerCard key={track.id} className="p-4">
                <button
                  type="button"
                  onClick={() => toggleTrack(track.id)}
                  aria-expanded={isOpen}
                  aria-controls={`track-${track.id}`}
                  className="flex w-full items-center justify-between gap-2 text-left text-sm font-black text-ink"
                >
                  <span>{track.title}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs font-normal text-muted">
                      {learned}/{track.cards.length}
                    </span>
                    <span
                      aria-hidden
                      className={`text-[10px] text-muted transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                    >
                      ▼
                    </span>
                  </span>
                </button>
                <p className="mt-1 text-[11px] font-bold text-muted">
                  {track.cards.length === 0
                    ? '这一条线还在写卡'
                    : due
                      ? `下一张到期：${formatMonthDay(due.dueAt)}`
                      : '暂无排期，去学一张就会有'}
                </p>
                {isOpen && (
                  <ul
                    id={`track-${track.id}`}
                    role="list"
                    aria-label={`${track.title}的卡片`}
                    className="m-0 mt-2 list-none border-t-2 border-ink/10 p-0"
                  >
                    {track.cards.map((card) => {
                      const p = progress[card.id];
                      return (
                        <CardRow
                          key={card.id}
                          title={card.title}
                          status={cardStatus(p, now)}
                          dueAt={p?.dueAt}
                        />
                      );
                    })}
                  </ul>
                )}
              </StickerCard>
            );
          })}
        </div>
      </Screen>
      <BottomNav active="stats" />
    </>
  );
}
