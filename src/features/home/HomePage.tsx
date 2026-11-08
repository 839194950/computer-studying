import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Screen } from '../../components/Screen';
import { ButtonLink } from '../../components/ButtonLink';
import { StickerCard } from '../../components/StickerCard';
import { StatChips } from '../../components/StatChips';
import { ProgressRing } from '../../components/ProgressRing';
import { Icon, type IconName } from '../../components/Icon';
import { Rise } from '../../components/motion';
import { TRACK_THEME } from '../../components/trackTheme';
import { Mascot } from '../../illustrations/Mascot';
import { ALL_CARDS, TRACKS } from '../../content';
import { DEFAULT_SETTINGS, useStore } from '../../store/useStore';
import { buildQueue, chapterState } from '../../lib/queue';
import { masteryPercent, resolveStreak, weakCards } from '../../lib/stats';
import { dayKey } from '../../lib/time';
import { dailyQuests, dayStat, lastSevenDays } from '../../lib/xp';
import { DailyGoal } from './DailyGoal';
import { TrackTile } from './TrackTile';

/** 首次进入的三步说明。固定文案，不随进度变化。 */
const STEPS: { title: string; hint: string; icon: IconName; tone: string }[] = [
  { title: '看懂一张图', hint: '图解一步步点亮，先有画面', icon: 'play', tone: 'bg-sky text-white' },
  { title: '选一个答案', hint: '答错会当场展开详解', icon: 'target', tone: 'bg-brand text-white' },
  { title: '到点再见一次', hint: '快忘的时候自动回来', icon: 'flame', tone: 'bg-flame text-white' },
];

function greeting(now: number): string {
  const h = new Date(now).getHours();
  if (h < 5) return '夜深了，学两张就睡';
  if (h < 11) return '早上好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}

/** 按日期挑一张「今日知识」，同一天里固定不变。 */
function cardOfTheDay(now: number) {
  const key = dayKey(now);
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return ALL_CARDS[hash % ALL_CARDS.length];
}

export function HomePage() {
  const progress = useStore((s) => s.progress);
  const streak = useStore((s) => s.streak);
  const settings = useStore((s) => s.settings);
  const session = useStore((s) => s.session);
  const daily = useStore((s) => s.daily);
  const snapshots = useStore((s) => s.snapshots);

  const now = Date.now();
  const queue = buildQueue(TRACKS, progress, { newLimit: settings.newCardsPerDay, now });
  const currentStreak = resolveStreak(streak, now).current;
  const doneToday = session.date === dayKey(now) ? session.reviewed.length : 0;
  const empty = queue.length === 0;
  const weak = weakCards(progress, ALL_CARDS);
  const mastery = masteryPercent(progress, ALL_CARDS.length);
  const goal = settings.dailyGoal ?? DEFAULT_SETTINGS.dailyGoal;
  const today = dayStat(daily, now);
  const quests = dailyQuests(today, goal);
  const week = lastSevenDays(
    daily,
    [...snapshots.map((s) => s.date), ...(streak.lastActiveDate ? [streak.lastActiveDate] : [])],
    now,
  );
  const featured = cardOfTheDay(now);
  const featuredTrack = TRACKS.find((t) => t.id === featured.track)!;
  const featuredTheme = TRACK_THEME[featured.track];

  return (
    <Screen>
      <header className="mb-4 flex items-center justify-between gap-3 md:hidden">
        <div className="flex items-center gap-2">
          <Mascot size={34} still />
          {/* 桌面端顶部导航已经有品牌名，这里只在移动端显示 */}
          <h1 className="text-2xl font-black tracking-tight text-ink">记忆芯</h1>
        </div>
        <StatChips compact />
      </header>

      <Link to="/labs" className="mb-5 flex min-h-16 items-center justify-between gap-3 rounded-2xl border-2 border-brand/30 bg-brand-soft p-4 font-extrabold text-brand-dark shadow-lip focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30">
        <span>动手实验室<span className="mt-1 block text-xs font-semibold">进制实验台 · 索引查询演示 · 不计学习进度</span></span><Icon name="arrow-right" size={20} />
      </Link>

      {/* 主横幅：问候 + 今日目标 + 开始按钮 */}
      <Rise>
        <section className="relative mb-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#8A6BFF] via-[#7B5CFF] to-[#5A3DE6] p-5 text-white shadow-float md:p-7">
          <div aria-hidden className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div aria-hidden className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/[0.07]" />
          <div className="relative flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-white/75">
                {greeting(now)}
                {currentStreak > 0 ? ` · 已连续 ${currentStreak} 天` : ''}
              </p>
              <h2 className="mt-1 text-[22px] font-black leading-snug md:text-[28px]">
                {empty ? '今天的队列已经清空' : `今天有 ${queue.length} 张卡在等你`}
              </h2>
              <p className="mt-1 text-xs font-bold text-white/70">
                已复习 {doneToday} 张 · 共 {ALL_CARDS.length} 张知识卡
              </p>
            </div>
            <Mascot mood={empty ? 'sleep' : 'happy'} size={88} className="-mr-1 -mt-1 shrink-0 drop-shadow-lg" />
          </div>

          <div className="relative mt-4">
            <DailyGoal xp={today.xp} goal={goal} />
          </div>

          <div className="relative mt-5">
            {empty ? (
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <div className="text-base font-black">今天没事了</div>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-white/80">
                  到期的卡都做完了，明天再来。想多学可以去地图上开新章节，或者逛逛百科。
                </p>
              </div>
            ) : (
              <ButtonLink
                to="/study"
                size="lg"
                full
                className="!bg-white !text-brand-dark !shadow-[0_5px_0_rgba(43,35,71,0.25)] hover:!bg-[#FBFAFF]"
              >
                <Icon name="play" size={18} />
                开始今天的复习 · {queue.length} 张
                <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  <span className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-brand/10 to-transparent" />
                </span>
              </ButtonLink>
            )}
          </div>
        </section>
      </Rise>

      {weak.length > 0 && (
        <Rise delay={0.05}>
          <Link
            to="/study?mode=weak"
            className="group mb-4 flex items-center gap-3 rounded-blob border-2 border-[#FFCADB] bg-pink-soft p-4 shadow-[0_4px_0_#FFCADB] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-bad text-lg font-black text-white shadow-[0_3px_0_#DB3654]">
              !
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-black text-ink">薄弱 {weak.length} 张</div>
              <p className="mt-0.5 text-xs font-bold text-ink/60">答错过、还没记牢的卡</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm font-black text-pink-dark">
              去练 <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </Rise>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Rise delay={0.08}>
          <StickerCard className="h-full p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-black text-ink">
                <Icon name="gift" size={20} className="text-flame" />
                每日任务
              </h2>
              <span className="text-xs font-bold text-muted">
                {quests.filter((q) => q.value >= q.target).length}/{quests.length} 完成
              </span>
            </div>
            <ul className="m-0 list-none space-y-3 p-0">
              {quests.map((q, i) => {
                const done = q.value >= q.target;
                return (
                  <li key={q.id} className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        done ? 'bg-mint text-white' : 'bg-sun-soft text-[#B07F00]'
                      }`}
                    >
                      <Icon name={done ? 'check' : (['bolt', 'target', 'flame'] as const)[i]} size={18} strokeWidth={2.6} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-sm font-extrabold text-ink">
                        <span>{q.title}</span>
                        <span className="tabular text-xs text-muted">
                          {q.value}/{q.target}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[#EEEBF7]">
                        <motion.div
                          className={`h-full rounded-full ${done ? 'bg-mint' : 'bg-sun'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(q.value / q.target) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </StickerCard>
        </Rise>

        <Rise delay={0.12}>
          <StickerCard className="h-full p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-black text-ink">
                <Icon name="flame" size={20} className="text-flame" />
                打卡日历
              </h2>
              <span className="text-xs font-bold text-muted">最长 {streak.longest} 天</span>
            </div>
            <ol className="m-0 grid list-none grid-cols-7 gap-1.5 p-0">
              {week.map((d, i) => (
                <li key={d.key} className="flex flex-col items-center gap-1.5">
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.15 + i * 0.04 }}
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      d.active
                        ? 'bg-flame text-white shadow-[0_3px_0_#E07A00]'
                        : d.today
                          ? 'border-2 border-dashed border-flame/60 text-flame'
                          : 'bg-[#F0EEF6] text-[#C9C4DA]'
                    }`}
                  >
                    <Icon name={d.active ? 'flame' : 'flame'} size={16} filled={d.active} />
                  </motion.span>
                  <span className={`text-[11px] font-extrabold ${d.today ? 'text-flame-dark' : 'text-muted'}`}>
                    {d.today ? '今' : d.label}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs font-bold leading-relaxed text-muted">
              {currentStreak > 0
                ? `火苗已经烧了 ${currentStreak} 天，今天也别让它灭掉。`
                : '完成今天的一轮，点燃第一簇火苗。'}
            </p>
          </StickerCard>
        </Rise>
      </div>

      <Rise delay={0.16}>
        <StickerCard className="mt-4 p-5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-black text-ink">这是什么</h2>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-muted">
                一本会考你的计算机百科。每张卡先看图解、再答一道题；快忘的时候，它自己回来找你。
              </p>
            </div>
          </div>
          <ol className="m-0 mt-4 grid list-none gap-3 p-0 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex items-start gap-3 rounded-2xl bg-paper p-3">
                <span className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${step.tone}`}>
                  <Icon name={step.icon} size={17} />
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-ink shadow">
                    {index + 1}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black text-ink">{step.title}</span>
                  <span className="mt-0.5 block text-[11px] font-semibold leading-relaxed text-muted">{step.hint}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] font-bold text-muted">
            {TRACKS.length} 条主线 · {ALL_CARDS.length} 张卡：{TRACKS.map((t) => t.title).join(' / ')}
          </p>
        </StickerCard>
      </Rise>

      <Rise delay={0.2}>
        <div className="mb-3 mt-7 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ProgressRing value={mastery} size={52} stroke={7} label="">
              <span className="tabular text-sm font-black text-ink">{mastery}</span>
            </ProgressRing>
            <div>
              <h2 className="text-lg font-black leading-tight text-ink">{TRACKS.length} 条主线</h2>
              <p className="text-xs font-bold text-muted">总掌握度 {mastery}%</p>
            </div>
          </div>
          <Link to="/map" className="text-xs font-extrabold text-brand hover:underline">
            查看地图
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {TRACKS.map((track) => {
            const next = track.chapters.find((ch) => chapterState(track, ch.id, progress) === 'active');
            return (
              <TrackTile
                key={track.id}
                track={track}
                learned={track.cards.filter((c) => (progress[c.id]?.box ?? 0) >= 4).length}
                nextChapter={next?.title}
              />
            );
          })}
        </div>
      </Rise>

      <Rise delay={0.24}>
        <div className="mb-3 mt-7 flex items-end justify-between">
          <h2 className="text-lg font-black text-ink">今日知识</h2>
          <Link to="/wiki" className="text-xs font-extrabold text-brand hover:underline">
            逛逛百科
          </Link>
        </div>
        <Link
          to={`/wiki/${featured.id}`}
          aria-label={`今日知识：${featured.title}`}
          className="group flex items-center gap-4 rounded-blob border-2 border-line bg-white p-4 shadow-lip transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none"
        >
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${featuredTheme.solid} ${featuredTheme.lip}`}>
            <Icon name={featuredTheme.icon} size={26} />
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block text-[11px] font-extrabold ${featuredTheme.text}`}>
              {featuredTrack.title}
            </span>
            <span className="mt-0.5 block text-base font-black text-ink">{featured.title}</span>
            <span className="mt-0.5 block text-xs font-semibold leading-relaxed text-muted">{featured.explain}</span>
          </span>
          <Icon name="arrow-right" size={18} className="shrink-0 text-muted transition-transform group-hover:translate-x-1" />
        </Link>
      </Rise>
    </Screen>
  );
}
