import { Link } from 'react-router-dom';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { ProgressRing } from '../../components/ProgressRing';
import { StickerCard } from '../../components/StickerCard';
import { BottomNav } from '../../components/BottomNav';
import { Mascot } from '../../illustrations/Mascot';
import { ALL_CARDS, TRACKS } from '../../content';
import { useStore } from '../../store/useStore';
import { buildQueue } from '../../lib/queue';
import { masteryPercent, resolveStreak, weakCards } from '../../lib/stats';
import { dayKey } from '../../lib/time';

export function HomePage() {
  const progress = useStore((s) => s.progress);
  const streak = useStore((s) => s.streak);
  const settings = useStore((s) => s.settings);
  const session = useStore((s) => s.session);

  const now = Date.now();
  const queue = buildQueue(TRACKS, progress, { newLimit: settings.newCardsPerDay, now });
  const mastery = masteryPercent(progress, ALL_CARDS.length);
  const currentStreak = resolveStreak(streak, now).current;
  const doneToday = session.date === dayKey(now) ? session.reviewed.length : 0;
  const empty = queue.length === 0;
  const weak = weakCards(progress, ALL_CARDS);

  return (
    <>
      <Screen>
        <header className="mb-6 flex items-end justify-between">
          <div>
            {/* 桌面端顶部导航已经有品牌名，这里只在移动端显示，避免重复 */}
            <h1 className="text-3xl font-black tracking-tight text-ink md:sr-only">记忆芯</h1>
            <p className="mt-1 text-sm text-muted md:mt-0 md:text-base">把计算机知识真正记住。</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-brand">{currentStreak} 天</div>
            <div className="text-[11px] font-bold text-muted">连续打卡</div>
          </div>
        </header>

        <StickerCard className="mb-4 flex items-center gap-5 p-5">
          <ProgressRing value={mastery} size={104} />
          <div className="flex-1">
            <div className="text-sm font-black text-ink">
              {empty ? '今天的队列已经清空' : `今天有 ${queue.length} 张卡在等你`}
            </div>
            <div className="mt-1 text-xs leading-relaxed text-muted">
              已复习 {doneToday} 张 · 共 {ALL_CARDS.length} 张知识卡
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper">
              <div
                className="h-full rounded-full bg-mint transition-all duration-300"
                style={{ width: `${mastery}%` }}
              />
            </div>
          </div>
        </StickerCard>

        {empty ? (
          <StickerCard tone="paper" className="mb-4 flex items-center gap-4 p-5">
            <Mascot mood="sleep" size={72} />
            <div>
              <div className="text-base font-black text-ink">今天没事了</div>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                到期的卡都做完了，明天再来。想多学可以先去地图上开新章节。
              </p>
            </div>
          </StickerCard>
        ) : (
          <Link to="/study" className="mb-4 block">
            <Button size="lg" full>
              开始今天的复习 · {queue.length} 张
            </Button>
          </Link>
        )}

        {weak.length > 0 && (
          <Link to="/study?mode=weak" className="mb-4 block">
            <StickerCard
              tone="pink"
              className="flex items-center gap-3 p-4 transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:shadow-pop-lg"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-white text-base font-black text-ink">
                !
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-ink">薄弱 {weak.length} 张</div>
                <p className="mt-0.5 text-[11px] font-bold text-ink/70">答错过、还没记牢的卡</p>
              </div>
              <span className="shrink-0 text-sm font-black text-ink">去练 →</span>
            </StickerCard>
          </Link>
        )}

        <h2 className="mb-3 mt-6 text-sm font-black text-ink">四条主线</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {TRACKS.map((track) => {
            const learned = track.cards.filter((c) => (progress[c.id]?.box ?? 0) >= 4).length;
            const percent = track.cards.length === 0 ? 0 : Math.round((learned / track.cards.length) * 100);
            return (
              <StickerCard key={track.id} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-ink">{track.title}</span>
                  <span className="text-xs font-bold text-muted">
                    {learned}/{track.cards.length}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
                </div>
              </StickerCard>
            );
          })}
        </div>
      </Screen>
      <BottomNav active="home" />
    </>
  );
}
