import { Screen } from '../../components/Screen';
import { Icon } from '../../components/Icon';
import { Rise } from '../../components/motion';
import { TRACK_THEME } from '../../components/trackTheme';
import { TRACKS } from '../../content';
import { useStore } from '../../store/useStore';
import { chapterState } from '../../lib/queue';
import { ChapterNode } from './ChapterNode';

export function MapPage() {
  const progress = useStore((s) => s.progress);

  return (
    <Screen title="章节地图" subtitle="每通关一章，下一章才亮起来。">
      {/* 主线快速跳转 */}
      <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4">
        {TRACKS.map((track) => {
          const theme = TRACK_THEME[track.id];
          return (
            <a
              key={track.id}
              href={`#track-${track.id}`}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 border-line bg-white px-3 py-1.5 text-sm font-extrabold text-ink shadow-[0_3px_0_#E7E3F3] transition-transform active:translate-y-[3px] active:shadow-none`}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${theme.solid}`}>
                <Icon name={theme.icon} size={14} />
              </span>
              {theme.short}
            </a>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {TRACKS.map((track, ti) => {
          const theme = TRACK_THEME[track.id];
          const chapters = track.chapters.filter((ch) => track.cards.some((c) => c.chapter === ch.id));
          const learnedAll = track.cards.filter((c) => (progress[c.id]?.box ?? 0) >= 4).length;
          return (
            <Rise key={track.id} delay={ti * 0.06}>
              <section id={`track-${track.id}`} className="scroll-mt-24">
                <header className={`relative overflow-hidden rounded-[24px] p-5 text-white ${theme.banner} shadow-float`}>
                  <div aria-hidden className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/10" />
                  <div className="relative flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                      <Icon name={theme.icon} size={26} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-black">{track.title}</h2>
                      <p className="truncate text-xs font-bold text-white/80">{theme.tagline}</p>
                    </div>
                    <span className="tabular rounded-xl bg-white/20 px-2.5 py-1 text-xs font-black">
                      {learnedAll}/{track.cards.length}
                    </span>
                  </div>
                </header>

                {chapters.length === 0 ? (
                  <p className="mt-3 rounded-2xl border-2 border-dashed border-line px-3 py-4 text-center text-xs font-bold text-muted">
                    这一条线还在写卡
                  </p>
                ) : (
                  <ul className="m-0 mt-8 list-none space-y-3 p-0">
                    {chapters.map((chapter, i) => {
                      const cards = track.cards.filter((c) => c.chapter === chapter.id);
                      const learned = cards.filter((c) => (progress[c.id]?.box ?? 0) >= 4).length;
                      return (
                        <ChapterNode
                          key={chapter.id}
                          chapterId={chapter.id}
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
              </section>
            </Rise>
          );
        })}
      </div>
    </Screen>
  );
}
