import { Link, useParams } from 'react-router-dom';
import { Screen } from '../../components/Screen';
import { Icon } from '../../components/Icon';
import { Rise } from '../../components/motion';
import { TRACK_THEME } from '../../components/trackTheme';
import { TRACKS, type Track } from '../../content';
import { useStore } from '../../store/useStore';
import { chapterState } from '../../lib/queue';
import { ChapterNode } from './ChapterNode';

function TrackBanner({ track, learned }: { track: Track; learned: number }) {
  const theme = TRACK_THEME[track.id];
  return (
    <header className={`relative overflow-hidden rounded-[24px] p-5 text-white ${theme.banner} shadow-float`}>
      <div aria-hidden className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
          <Icon name={theme.icon} size={26} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black">{track.title}</h2>
          <p className="truncate text-xs font-bold text-white/80">{theme.tagline}</p>
        </div>
        <span className="tabular shrink-0 rounded-xl bg-white/20 px-2.5 py-1 text-xs font-black">
          {learned}/{track.cards.length}
        </span>
      </div>
    </header>
  );
}

export function MapPage() {
  const progress = useStore((s) => s.progress);
  return (
    <Screen title="章节地图" subtitle="选择一条主线，进入它的章节路径。">
      <div className="grid gap-6 lg:grid-cols-2">
        {TRACKS.map((track, i) => (
          <Rise key={track.id} delay={i * 0.06}>
            <Link
              to={`/map/${track.id}`}
              className="block rounded-[24px] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 active:translate-y-[3px]"
            >
              <TrackBanner track={track} learned={track.cards.filter((c) => (progress[c.id]?.box ?? 0) >= 4).length} />
              <p className="mt-3 px-2 text-sm font-extrabold text-muted">
                {track.chapters.filter((ch) => track.cards.some((c) => c.chapter === ch.id)).length} 个章节 · 查看章节路径
              </p>
            </Link>
          </Rise>
        ))}
      </div>
    </Screen>
  );
}

export function TrackMapPage() {
  const { trackId } = useParams();
  const progress = useStore((s) => s.progress);
  const track = TRACKS.find((item) => item.id === trackId);
  const back = <Link to="/map" className="mb-5 inline-block rounded-lg text-sm font-extrabold text-brand hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30">返回章节地图</Link>;

  if (!track) {
    return (
      <Screen title="未找到这条主线" subtitle="这条路径不存在，请返回地图选择一条主线。">
        {back}
      </Screen>
    );
  }

  const theme = TRACK_THEME[track.id];
  const chapters = track.chapters.filter((ch) => track.cards.some((c) => c.chapter === ch.id));
  const learnedAll = track.cards.filter((c) => (progress[c.id]?.box ?? 0) >= 4).length;
  return (
    <Screen title={`${track.title} · 章节路径`} subtitle="每通关一章，下一章才亮起来。">
      {back}
      <div className="mx-auto max-w-xl">
        <TrackBanner track={track} learned={learnedAll} />
        {chapters.filter((chapter) => chapter.guide && chapterState(track, chapter.id, progress) !== 'locked').map((chapter) => (
          <section key={chapter.id} aria-label={`${chapter.title}导读入口`} className="mt-5 rounded-3xl border-2 border-brand/25 bg-brand-soft p-5 shadow-lip">
            <p className="flex items-center gap-2 text-sm font-black text-brand-dark"><Icon name="book" size={20} />章节导读 · 先看懂，再学习</p>
            <h2 className="mt-2 text-lg font-black text-ink">{chapter.title}：从整体认识开始</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{chapter.guide!.intro} 阅读不计学习进度。</p>
            <Link to={`/map/${track.id}/${chapter.id}`} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-extrabold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 focus-visible:ring-offset-2">
              打开章节导读<Icon name="arrow-right" size={16} />
            </Link>
          </section>
        ))}
        {chapters.length === 0 ? (
          <p className="mt-3 rounded-2xl border-2 border-dashed border-line px-3 py-4 text-center text-xs font-bold text-muted">这一条线还在写卡</p>
        ) : (
          <ul key={track.id} aria-label={`${track.title}章节路径`} className="m-0 mt-8 list-none space-y-3 p-0">
            {chapters.map((chapter, i) => {
              const cards = track.cards.filter((c) => c.chapter === chapter.id);
              const learned = cards.filter((c) => (progress[c.id]?.box ?? 0) >= 4).length;
              return (
                <ChapterNode
                  key={chapter.id}
                  chapterId={chapter.id}
                  guidePath={chapter.guide ? `/map/${track.id}/${chapter.id}` : undefined}
                  index={i}
                  title={chapter.title}
                  blurb={chapter.blurb}
                  state={chapterState(track, chapter.id, progress)}
                  learned={learned}
                  total={cards.length}
                  last={i === chapters.length - 1}
                  theme={theme}
                />
              );
            })}
          </ul>
        )}
      </div>
    </Screen>
  );
}
