import {
  createAppState,
  applyAnswer,
  applyFinish,
  parseState,
  exportState,
  EMPTY_STATE,
} from './useStore';

const now = new Date(2026, 2, 15, 10).getTime();

it('首次作答建立进度，且同一张卡只计一次', () => {
  let s = createAppState(now);
  s = applyAnswer(s, 'c1', true, now);
  s = applyAnswer(s, 'c1', true, now);
  expect(s.progress['c1'].box).toBe(3);
  expect(s.session.reviewed).toEqual(['c1']);
});

it('答错会累计 lapses 与当日错误次数', () => {
  let s = createAppState(now);
  s = applyAnswer(s, 'c1', false, now);
  s = applyAnswer(s, 'c1', false, now);
  s = applyAnswer(s, 'c1', false, now);
  expect(s.session.wrongs['c1']).toBe(3);
  expect(s.progress['c1'].lapses).toBeGreaterThanOrEqual(2);
});

it('完成一轮后记连胜并写当天快照', () => {
  let s = createAppState(now);
  s = applyAnswer(s, 'c1', true, now);
  s = applyFinish(s, 80, now);
  expect(s.session.completed).toBe(true);
  expect(s.streak.current).toBe(1);
  expect(s.snapshots.at(-1)!.date).toBe('2026-03-15');
  expect(s.snapshots.at(-1)!.reviewed).toBe(1);
});

it('同一天重复完成不会重复写快照', () => {
  let s = createAppState(now);
  s = applyAnswer(s, 'c1', true, now);
  s = applyFinish(s, 80, now);
  s = applyFinish(s, 80, now);
  expect(s.snapshots).toHaveLength(1);
});

it('跨天会重置当日会话', () => {
  const tomorrow = new Date(2026, 2, 16, 9).getTime();
  let s = createAppState(now);
  s = applyAnswer(s, 'c1', true, now);
  s = applyAnswer(s, 'c2', true, tomorrow);
  expect(s.session.date).toBe('2026-03-16');
  expect(s.session.reviewed).toEqual(['c2']);
});

it('导出后可原样导入', () => {
  const s = applyAnswer(createAppState(now), 'c1', true, now);
  const parsed = parseState(exportState(s));
  expect(parsed.ok).toBe(true);
  if (parsed.ok) expect(parsed.state.progress['c1'].box).toBe(2);
});

it('损坏或版本不符的导入被拒绝，且不污染数据', () => {
  expect(parseState('not json').ok).toBe(false);
  expect(parseState(JSON.stringify({ version: 99 })).ok).toBe(false);
  expect(parseState(JSON.stringify({ version: 1 })).ok).toBe(false);
  expect(EMPTY_STATE.progress).toEqual({});
});
