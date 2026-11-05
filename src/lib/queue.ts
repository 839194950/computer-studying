import type { Card, Track } from '../content/types';
import { isDue, type CardProgress } from './srs';

export type ChapterState = 'locked' | 'active' | 'done';

export interface QueueItem {
  cardId: string;
  isNew: boolean;
}

function chapterCards(track: Track, chapterId: string): Card[] {
  return track.cards.filter((c) => c.chapter === chapterId);
}

function isChapterDone(track: Track, chapterId: string, progress: Record<string, CardProgress>): boolean {
  const cards = chapterCards(track, chapterId);
  return cards.length > 0 && cards.every((c) => (progress[c.id]?.box ?? 0) >= 4);
}

/** 还没写内容的章节不挡路：算作已满足，但不会被显示成"已通关"。 */
function isChapterSatisfied(
  track: Track,
  chapterId: string,
  progress: Record<string, CardProgress>,
): boolean {
  return chapterCards(track, chapterId).length === 0 || isChapterDone(track, chapterId, progress);
}

/** 首个章节永远可用；之后的章节要等前一章全部记牢才解锁。 */
export function chapterState(
  track: Track,
  chapterId: string,
  progress: Record<string, CardProgress>,
): ChapterState {
  if (isChapterDone(track, chapterId, progress)) return 'done';
  const idx = track.chapters.findIndex((c) => c.id === chapterId);
  if (idx <= 0) return 'active';
  const prev = track.chapters[idx - 1];
  return isChapterSatisfied(track, prev.id, progress) ? 'active' : 'locked';
}

/** 从头按顺序推进，遇到第一个还没通关的章节就停（该章本身算解锁）。 */
export function unlockedChapters(
  track: Track,
  progress: Record<string, CardProgress>,
): string[] {
  const result: string[] = [];
  for (const chapter of track.chapters) {
    result.push(chapter.id);
    if (!isChapterSatisfied(track, chapter.id, progress)) break;
  }
  return result;
}

/** 到期卡（按到期时间升序）+ 新卡（按主线轮转、章内顺序，受每日上限约束）。 */
export function buildQueue(
  tracks: Track[],
  progress: Record<string, CardProgress>,
  opts: { newLimit: number; now: number; chapterId?: string },
): QueueItem[] {
  const { newLimit, now, chapterId } = opts;
  /** 指定章节时只看这一章的卡；不指定就是全局队列。 */
  const inScope = (card: Card) => !chapterId || card.chapter === chapterId;

  const due: QueueItem[] = [];
  for (const track of tracks) {
    for (const card of track.cards) {
      if (!inScope(card)) continue;
      const p = progress[card.id];
      if (p && isDue(p, now)) due.push({ cardId: card.id, isNew: false });
    }
  }
  due.sort((a, b) => (progress[a.cardId]!.dueAt - progress[b.cardId]!.dueAt));

  const newItems: QueueItem[] = [];
  if (newLimit > 0) {
    const learned = (t: Track) => t.cards.filter((c) => progress[c.id]).length;
    const pools = tracks.map((t) => {
      const open = new Set(unlockedChapters(t, progress));
      return {
        track: t,
        cards: t.cards.filter((c) => inScope(c) && open.has(c.chapter) && !progress[c.id]),
      };
    });

    while (newItems.length < newLimit) {
      const candidates = pools.filter((p) => p.cards.length > 0);
      if (candidates.length === 0) break;
      candidates.sort((a, b) => learned(a.track) - learned(b.track));
      const pick = candidates[0];
      newItems.push({ cardId: pick.cards.shift()!.id, isNew: true });
    }
  }

  return [...due, ...newItems];
}
