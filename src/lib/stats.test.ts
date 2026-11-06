import {
  cardStatus,
  masteryPercent,
  bumpStreak,
  resolveStreak,
  weakCards,
  pickFocusTrack,
} from './stats';
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

describe('weakCards', () => {
  const cards = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
  const lp = (id: string, box: 1 | 2 | 3 | 4 | 5, lapses: number): CardProgress => ({
    cardId: id,
    box,
    dueAt: now,
    lastReviewedAt: now,
    lapses,
  });

  it('只挑答错过、且还没记牢的卡', () => {
    const progress = {
      a: lp('a', 2, 3),
      b: lp('b', 4, 5),
      c: lp('c', 1, 1),
      d: lp('d', 3, 0),
    };
    expect(weakCards(progress, cards)).toEqual(['a', 'c']);
  });

  it('错得多的排前面；同错次时档位低的排前面', () => {
    const progress = {
      a: lp('a', 3, 1),
      b: lp('b', 1, 1),
      c: lp('c', 2, 4),
    };
    expect(weakCards(progress, cards)).toEqual(['c', 'b', 'a']);
  });

  it('没有任何进度时返回空数组', () => {
    expect(weakCards({}, cards)).toEqual([]);
  });
});

describe('pickFocusTrack', () => {
  const tracks = [
    { id: 'a', cards: [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }] },
    { id: 'b', cards: [{ id: 'b1' }, { id: 'b2' }] },
  ];
  const at = (id: string, box: 1 | 2 | 3 | 4 | 5, dueAt: number): CardProgress => ({
    cardId: id,
    box,
    dueAt,
    lastReviewedAt: now,
    lapses: 0,
  });

  it('"快忘了"压过数量更多的"没学过"', () => {
    const progress = { b1: at('b1', 2, now - 1) };
    expect(pickFocusTrack(tracks, progress, now)).toBe('b');
  });

  it('同一档位里挑卡数最多的那条', () => {
    const progress = {
      a1: at('a1', 3, now + 1000),
      b1: at('b1', 3, now + 1000),
      b2: at('b2', 3, now + 1000),
    };
    expect(pickFocusTrack(tracks, progress, now)).toBe('b');
  });

  it('"刚学会"压过"没学过"', () => {
    const progress = { a1: at('a1', 2, now + 1000) };
    expect(pickFocusTrack(tracks, progress, now)).toBe('a');
  });

  it('全都没学过时展开第一条，没有主线时返回 null', () => {
    expect(pickFocusTrack(tracks, {}, now)).toBe('a');
    expect(pickFocusTrack([], {}, now)).toBeNull();
  });
});
