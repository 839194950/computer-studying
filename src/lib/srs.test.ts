import { newProgress, review, isDue, nextDueAt, type CardProgress } from './srs';
import { startOfDay, addDays, dayKey } from './time';

const at = (d: number, h = 9) => new Date(2026, 2, d, h, 0).getTime();

it('新卡当天即可复习，处于第 1 档', () => {
  const p = newProgress('c1', at(15));
  expect(p.box).toBe(1);
  expect(isDue(p, at(15))).toBe(true);
});

it('新卡第一次答对停在第一档：第二天就复习，不会跳到第 4 天', () => {
  const p = review(newProgress('c1', at(15, 23)), true, at(15, 23));
  expect(p.box).toBe(1);
  expect(p.dueAt).toBe(startOfDay(addDays(at(15), 1)));
  expect(isDue(p, at(15, 23))).toBe(false);
  expect(isDue(p, at(16, 0))).toBe(true);
});

it('答对沿 1/3/7/21/60 阶梯上升，封顶第 5 档', () => {
  let p = newProgress('c1', at(1));
  const expected = [1, 3, 7, 21, 60];
  expected.forEach((days, i) => {
    p = review(p, true, at(1));
    expect(p.box).toBe(i + 1);
    expect(dayKey(p.dueAt)).toBe(dayKey(addDays(at(1), days)));
  });
  const capped = review(p, true, at(1));
  expect(capped.box).toBe(5);
  expect(dayKey(capped.dueAt)).toBe(dayKey(addDays(at(1), 60)));
});

it('答错降一档、最低第 1 档、并立即重新到期', () => {
  let p: CardProgress = { ...newProgress('c1', at(15)), box: 3, lapses: 0 };
  p = review(p, false, at(15, 10));
  expect(p.box).toBe(2);
  expect(p.lapses).toBe(1);
  expect(p.dueAt).toBeLessThanOrEqual(at(15, 10));

  const q = review(newProgress('c2', at(15)), false, at(15, 10));
  expect(q.box).toBe(1);
});

it('nextDueAt 落在目标日的本地零点', () => {
  expect(nextDueAt(3, at(15, 23))).toBe(startOfDay(addDays(at(15), 7)));
});
