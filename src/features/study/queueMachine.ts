import type { QueueItem } from '../../lib/queue';

export interface Runner {
  items: QueueItem[];
  index: number;
  done: boolean;
  wrongs: Record<string, number>;
}

/** 一张卡在同一轮里连错两次就放过它，避免死循环。 */
export const MAX_WRONGS_PER_CARD = 2;

export function startRunner(items: QueueItem[]): Runner {
  return { items, index: 0, done: items.length === 0, wrongs: {} };
}

export function answerRunner(r: Runner, cardId: string, correct: boolean): Runner {
  const current = r.items[r.index];
  if (!current || current.cardId !== cardId) return r;

  if (correct) {
    const index = r.index + 1;
    return { ...r, index, done: index >= r.items.length };
  }

  const count = (r.wrongs[cardId] ?? 0) + 1;
  const rest = r.items.filter((_, i) => i !== r.index);
  const wrongs = { ...r.wrongs, [cardId]: count };

  if (count >= MAX_WRONGS_PER_CARD) {
    const index = Math.min(r.index, rest.length);
    return { ...r, items: rest, index, wrongs, done: index >= rest.length };
  }

  return { ...r, items: [...rest, current], wrongs, done: false };
}
