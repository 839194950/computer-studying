import { hardware } from './tracks/hardware';
import { language } from './tracks/language';
import { os } from './tracks/os';
import { security } from './tracks/security';
import type { Card, Track, TrackId } from './types';

export type { Card, Chapter, Track, TrackId } from './types';

export const TRACKS: Track[] = [hardware, language, os, security];

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
