import { Link } from 'react-router-dom';
import { Screen } from '../../components/Screen';
import { ButtonLink } from '../../components/ButtonLink';
import { ProgressRing } from '../../components/ProgressRing';
import { StickerCard } from '../../components/StickerCard';
import { BottomNav } from '../../components/BottomNav';
import { Mascot } from '../../illustrations/Mascot';
import { ALL_CARDS, TRACKS } from '../../content';
import { useStore } from '../../store/useStore';
import { buildQueue } from '../../lib/queue';
import { masteryPercent, resolveStreak, weakCards } from '../../lib/stats';
import { dayKey } from '../../lib/time';

/** 首次进入的三步说明。固定文案，不随进度变化。 */
const STEPS = [
  { title: '看懂一张图', hint: '图解一步步点亮，先有画面' },
  { title: '选一个答案', hint: '答错会当场展开详解' },
  { title: '到点再见一次', hint: '快忘的时候自动回来' },
];

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
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-brand">{currentStreak} 天</div>
            <div className="text-[11px] font-bold text-muted">连续打卡</div>
          </div>
        </header>

        <StickerCard tone="paper" className="mb-4 p-5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-black text-ink">这是什么</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                把计算机知识真正记住。每张卡先看图解、再答一道题；快忘的时候，它自己回来找你。
              </p>
            </div>
            <Mascot mood="happy" size={64} className="shrink-0" />
          </div>

          <ol className="m-0 mt-3 grid list-none gap-2 p-0 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sun text-[10px] font-black text-ink">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-black text-ink">{step.title}</span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">
                    {step.hint}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-3 text-[11px] font-bold text-muted">
            四条主线 · {ALL_CARDS.length} 张卡：{TRACKS.map((t) => t.title).join(' / ')}
          </p>
        </StickerCard>

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
          <ButtonLink to="/study" size="lg" full className="mb-4">
            开始今天的复习 · {queue.length} 张
          </ButtonLink>
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
              <Link
                key={track.id}
                to="/map"
                className="group block rounded-blob focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <StickerCard className="p-4 transition-[transform,box-shadow,background-color] duration-150 group-hover:-translate-y-[3px] group-hover:bg-brand/[0.06] group-hover:shadow-pop-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
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
              </Link>
            );
          })}
        </div>
      </Screen>
      <BottomNav active="home" />
    </>
  );
}
