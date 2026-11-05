import type { Box, CardProgress } from './srs';
import { dayKey, daysBetweenKeys } from './time';

export type CardStatus = 'new' | 'learning' | 'mastered' | 'forgotten';

export const BOX_WEIGHT: Record<Box, number> = {
  1: 0.1,
  2: 0.25,
  3: 0.5,
  4: 0.8,
  5: 1,
};

/** 图例四色：没学过 / 快忘了（已过期）/ 记牢了（未过期且 ≥4 档）/ 刚学会。 */
export function cardStatus(p: CardProgress | undefined, now: number): CardStatus {
  if (!p) return 'new';
  if (p.dueAt < now) return 'forgotten';
  if (p.box >= 4) return 'mastered';
  return 'learning';
}

/** 0–100 的加权掌握度。totalCards 为 0 时返回 0。 */
export function masteryPercent(
  progress: Record<string, CardProgress>,
  totalCards: number,
): number {
  if (totalCards <= 0) return 0;
  const sum = Object.values(progress).reduce((acc, p) => acc + BOX_WEIGHT[p.box], 0);
  return Math.round((sum / totalCards) * 100);
}

export interface Streak {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

/** 当天完成一轮：同一天不重复累加，昨天则 +1，否则重新从 1 开始。 */
export function bumpStreak(s: Streak, now: number): Streak {
  const today = dayKey(now);
  if (s.lastActiveDate === today) return s;
  const current = s.lastActiveDate && daysBetweenKeys(s.lastActiveDate, today) === 1 ? s.current + 1 : 1;
  return { current, longest: Math.max(s.longest, current), lastActiveDate: today };
}

/** 启动时校正：昨天没学就把当前连胜清零，最长记录保留。 */
export function resolveStreak(s: Streak, now: number): Streak {
  if (!s.lastActiveDate) return s;
  const gap = daysBetweenKeys(s.lastActiveDate, dayKey(now));
  if (gap <= 1) return s;
  return { ...s, current: 0 };
}

/**
 * 薄弱卡：答错过、且还没到「记牢」档的卡。
 * 排序按答错次数降序、档位升序——错得最多的、记得最浅的排最前。
 */
export function weakCards(
  progress: Record<string, CardProgress>,
  cards: readonly { id: string }[],
): string[] {
  return cards
    .filter((c) => {
      const p = progress[c.id];
      return !!p && p.lapses >= 1 && p.box < 4;
    })
    .sort((a, b) => {
      const pa = progress[a.id]!;
      const pb = progress[b.id]!;
      return pb.lapses - pa.lapses || pa.box - pb.box;
    })
    .map((c) => c.id);
}
