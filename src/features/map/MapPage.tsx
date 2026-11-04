import { Screen } from '../../components/Screen';
import { StickerCard } from '../../components/StickerCard';
import { BottomNav } from '../../components/BottomNav';
import { TRACKS } from '../../content';
import { useStore } from '../../store/useStore';
import { chapterState } from '../../lib/queue';
import { ChapterNode } from './ChapterNode';

const TRACK_COLOR: Record<string, string> = {
  hardware: 'bg-sky',
  language: 'bg-brand',
  os: 'bg-sun',
  security: 'bg-pink',
};

export function MapPage() {
  const progress = useStore((s) => s.progress);

  return (
    <>
      <Screen title="章节地图" subtitle="每通关一章，下一章才亮起来。">
        <div className="grid gap-5 sm:grid-cols-2">
          {TRACKS.map((track) => {
            const chapters = track.chapters.filter((ch) => track.cards.some((c) => c.chapter === ch.id));
            return (
              <StickerCard key={track.id} className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`h-4 w-4 rounded-full border-2 border-ink ${TRACK_COLOR[track.id]}`} />
                  <h2 className="text-sm font-black text-ink">{track.title}</h2>
                </div>

                {chapters.length === 0 ? (
                  <p className="rounded-sticker border-2 border-dashed border-ink/25 px-3 py-4 text-center text-[11px] font-bold text-muted">
                    这一条线还在写卡
                  </p>
                ) : (
                  <ul className="m-0 list-none p-0">
                    {chapters.map((chapter, i) => {
                      const cards = track.cards.filter((c) => c.chapter === chapter.id);
                      const learned = cards.filter((c) => (progress[c.id]?.box ?? 0) >= 4).length;
                      return (
                        <ChapterNode
                          key={chapter.id}
                          index={i}
                          title={chapter.title}
                          blurb={chapter.blurb}
                          state={chapterState(track, chapter.id, progress)}
                          learned={learned}
                          total={cards.length}
                          last={i === chapters.length - 1}
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
      <BottomNav active="map" />
    </>
  );
}
