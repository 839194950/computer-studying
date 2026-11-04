import { startOfDay, endOfDay, dayKey, addDays, daysBetweenKeys } from './time';

const at = (y: number, m: number, d: number, h = 0, min = 0) =>
  new Date(y, m - 1, d, h, min).getTime();

it('startOfDay 返回本地零点', () => {
  expect(startOfDay(at(2026, 3, 15, 23, 50))).toBe(at(2026, 3, 15));
});

it('addDays 能跨月且不丢时分', () => {
  expect(dayKey(addDays(at(2026, 3, 31, 23, 0), 1))).toBe('2026-04-01');
  expect(dayKey(addDays(at(2026, 1, 1, 0, 0), 0))).toBe('2026-01-01');
});

it('endOfDay 是当天最后一毫秒', () => {
  expect(dayKey(endOfDay(at(2026, 3, 15, 8)))).toBe('2026-03-15');
  expect(endOfDay(at(2026, 3, 15, 8))).toBeGreaterThan(startOfDay(at(2026, 3, 15, 8)));
});

it('daysBetweenKeys 按自然日数差', () => {
  expect(daysBetweenKeys('2026-03-15', '2026-03-17')).toBe(2);
  expect(daysBetweenKeys('2026-03-17', '2026-03-15')).toBe(-2);
  expect(daysBetweenKeys('2026-03-15', '2026-03-15')).toBe(0);
});
