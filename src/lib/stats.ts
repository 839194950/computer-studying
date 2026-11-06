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

/** 关注优先级：快要忘的 → 刚学会的 → 还没学的。记牢的不参与。 */
const FOCUS_TIERS: CardStatus[] = ['forgotten', 'learning', 'new'];

/**
 * 图谱页默认展开哪条主线：先看谁有「快忘了」的卡，没有就看「刚学会」，
 * 再没有就看「没学过」最多的一条；全都没学过时展开第一条。
 */
export function pickFocusTrack<T extends { id: string; cards: readonly { id: string }[] }>(
  tracks: readonly T[],
  progress: Record<string, CardProgress>,
  now: number,
): T['id'] | null {
  for (const tier of FOCUS_TIERS) {
    let best: T | null = null;
    let bestCount = 0;
    for (const track of tracks) {
      const count = track.cards.filter((c) => cardStatus(progress[c.id], now) === tier).length;
      if (count > bestCount) {
        best = track;
        bestCount = count;
      }
    }
    if (best) return best.id;
  }
  return tracks[0]?.id ?? null;
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
