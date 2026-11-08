import { hardware } from './tracks/hardware';
import { language } from './tracks/language';
import { os } from './tracks/os';
import { security } from './tracks/security';
import { database } from './tracks/database';
import type { Card, Chapter, Track, TrackId } from './types';

export type { Card, Chapter, DetailSection, TeachStep, Track, TrackId } from './types';
export { getDetail } from './details';

export const TRACKS: Track[] = [hardware, language, os, security, database];

export const ALL_CARDS: Card[] = TRACKS.flatMap((t) => t.cards);

export function getTrack(id: TrackId): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}

export function getCard(id: string): Card | undefined {
  return ALL_CARDS.find((c) => c.id === id);
}

export function getChapterCards(trackId: TrackId, chapterId: string): Card[] {
  return ALL_CARDS.filter((c) => c.track === trackId && c.chapter === chapterId);
}

export function getChapter(trackId: TrackId, chapterId: string) {
  return getTrack(trackId)?.chapters.find((ch) => ch.id === chapterId);
}

/** 全局按章节 id 找，章节地图点进去时用来取标题与所属主线。 */
export function findChapter(chapterId: string): { track: Track; chapter: Chapter } | undefined {
  for (const track of TRACKS) {
    const chapter = track.chapters.find((ch) => ch.id === chapterId);
    if (chapter) return { track, chapter };
  }
  return undefined;
}
