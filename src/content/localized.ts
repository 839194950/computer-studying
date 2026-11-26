import { TRACKS } from './index';
import { DETAILS } from './details';
import type { TrackId } from './types';
import { localize, useLocale, type Locale } from '../i18n/locale';

function createContent(locale: Locale) {
  const tracks = localize(TRACKS, locale);
  const details = localize(DETAILS, locale);
  const cards = tracks.flatMap((track) => track.cards);
  const getTrack = (id: TrackId) => tracks.find((track) => track.id === id);
  return {
    TRACKS: tracks,
    ALL_CARDS: cards,
    getTrack,
    getCard: (id: string) => cards.find((card) => card.id === id),
    getDetail: (id: string) => details[id] ?? [],
    findChapter: (id: string) => {
      for (const track of tracks) {
        const chapter = track.chapters.find((item) => item.id === id);
        if (chapter) return { track, chapter };
      }
      return undefined;
    },
  };
}

const cache = new Map<Locale, ReturnType<typeof createContent>>();

export function localizedContent(locale: Locale) {
  let content = cache.get(locale);
  if (!content) {
    content = createContent(locale);
    cache.set(locale, content);
  }
  return content;
}

export function useContent() {
  return localizedContent(useLocale());
}
