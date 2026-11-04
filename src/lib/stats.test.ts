import { cardStatus, masteryPercent, bumpStreak, resolveStreak } from './stats';
import type { CardProgress } from './srs';

const now = new Date(2026, 2, 15, 10).getTime();
const p = (box: 1 | 2 | 3 | 4 | 5, dueAt: number): CardProgress => ({
  cardId: 'x',
  box,
  dueAt,
  lastReviewedAt: now,
  lapses: 0,
});

it('四色状态按"有没有进度 / 是否过期 / 档位"派生', () => {
  expect(cardStatus(undefined, now)).toBe('new');
  expect(cardStatus(p(3, now + 1000), now)).toBe('learning');
  expect(cardStatus(p(4, now + 1000), now)).toBe('mastered');
  expect(cardStatus(p(5, now - 1), now)).toBe('forgotten');
});

it('掌握度是加权百分比，空输入不产生 NaN', () => {
  expect(masteryPercent({}, 0)).toBe(0);
  expect(masteryPercent({}, 4)).toBe(0);
  expect(masteryPercent({ a: p(5, now), b: p(1, now) }, 2)).toBe(55);
});

it('连胜从昨天延续，新用户从 1 开始，同一天不重复累加', () => {
  expect(bumpStreak({ current: 0, longest: 0, lastActiveDate: null }, now).current).toBe(1);
  const s = bumpStreak({ current: 4, longest: 4, lastActiveDate: '2026-03-14' }, now);
  expect(s.current).toBe(5);
  expect(s.longest).toBe(5);
  expect(bumpStreak(s, now).current).toBe(5);
});

it('断签清零但保留最长记录', () => {
  const s = resolveStreak({ current: 7, longest: 9, lastActiveDate: '2026-03-01' }, now);
  expect(s.current).toBe(0);
  expect(s.longest).toBe(9);
});
