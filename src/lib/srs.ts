import { addDays, startOfDay } from './time';

export type Box = 1 | 2 | 3 | 4 | 5;

export interface CardProgress {
  cardId: string;
  box: Box;
  /** 到期时间戳；落在目标日零点表示"那一天起可复习"。 */
  dueAt: number;
  lastReviewedAt: number | null;
  lapses: number;
}

/** 第 1..5 档对应的间隔天数。 */
export const INTERVALS: readonly number[] = [1, 3, 7, 21, 60];

export function newProgress(cardId: string, now: number): CardProgress {
  return { cardId, box: 1, dueAt: startOfDay(now), lastReviewedAt: null, lapses: 0 };
}

/** 下一次到期 = 从今天起第 INTERVALS[box-1] 天的本地零点。 */
export function nextDueAt(box: Box, now: number): number {
  return startOfDay(addDays(now, INTERVALS[box - 1]));
}

export function review(p: CardProgress, correct: boolean, now: number): CardProgress {
  if (correct) {
    // 第一次答对停在第 1 档：今天学、明天复习，避免新卡直接跳到第 4 天。
    const firstTime = p.lastReviewedAt === null;
    const box = (firstTime ? 1 : Math.min(5, p.box + 1)) as Box;
    return { ...p, box, dueAt: nextDueAt(box, now), lastReviewedAt: now };
  }
  const box = Math.max(1, p.box - 1) as Box;
  return { ...p, box, dueAt: now, lastReviewedAt: now, lapses: p.lapses + 1 };
}

export function isDue(p: CardProgress, now: number): boolean {
  return p.dueAt <= now;
}
