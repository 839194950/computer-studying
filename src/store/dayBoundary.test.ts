import { applyAnswer, applyFinish, applyGain, createAppState } from './useStore';

const beforeMidnight = new Date(2026, 10, 9, 23, 59, 59, 999).getTime();
const midnight = new Date(2026, 10, 10).getTime();

it('零点前后作答的SRS日期与每日经验独立，保留前一天的完整记录', () => {
  let state = createAppState(beforeMidnight);
  state = applyAnswer(state, 'hw-cpu-01', true, beforeMidnight);
  state = applyGain(state, { xp: 10, correct: true, combo: 1 }, beforeMidnight);
  const previous = structuredClone(state);
  state = applyAnswer(state, 'hw-cpu-02', true, midnight);
  state = applyGain(state, { xp: 10, correct: true, combo: 1 }, midnight);

  expect(state).toEqual({
    ...previous,
    progress: {
      'hw-cpu-01': { cardId: 'hw-cpu-01', box: 1, dueAt: midnight, lastReviewedAt: beforeMidnight, lapses: 0 },
      'hw-cpu-02': { cardId: 'hw-cpu-02', box: 1, dueAt: new Date(2026, 10, 11).getTime(), lastReviewedAt: midnight, lapses: 0 },
    },
    session: { date: '2026-11-10', reviewed: ['hw-cpu-02'], wrongs: {}, completed: false },
    xp: 20,
    daily: {
      '2026-11-09': { xp: 10, correct: 1, bestCombo: 1 },
      '2026-11-10': { xp: 10, correct: 1, bestCombo: 1 },
    },
  });
});

it('跨日重置错误次数但不清除历史lapses，新一天第一次错误仍即时到期', () => {
  let state = createAppState(beforeMidnight);
  state = applyAnswer(state, 'hw-cpu-01', false, beforeMidnight);
  state = applyAnswer(state, 'hw-cpu-01', false, beforeMidnight);
  expect(state.progress['hw-cpu-01'].dueAt).toBe(midnight);
  const previous = structuredClone(state);
  state = applyAnswer(state, 'hw-cpu-01', false, midnight);

  expect(state).toEqual({
    ...previous,
    progress: { 'hw-cpu-01': { cardId: 'hw-cpu-01', box: 1, dueAt: midnight, lastReviewedAt: midnight, lapses: 3 } },
    session: { date: '2026-11-10', reviewed: ['hw-cpu-01'], wrongs: { 'hw-cpu-01': 1 }, completed: false },
  });
});

it('前一天完成后次日重新作答结算，保留双日快照且同日完成幂等', () => {
  let state = applyAnswer(createAppState(beforeMidnight), 'hw-cpu-01', true, beforeMidnight);
  state = applyFinish(state, 100, beforeMidnight);
  const previous = structuredClone(state);
  state = applyAnswer(state, 'hw-cpu-02', true, midnight);
  state = applyFinish(state, 100, midnight);

  expect(state.streak).toEqual({ current: 2, longest: 2, lastActiveDate: '2026-11-10' });
  expect(state.snapshots).toEqual([
    { date: '2026-11-09', mastery: 0, reviewed: 1 },
    { date: '2026-11-10', mastery: 0, reviewed: 1 },
  ]);
  expect(state.progress['hw-cpu-01']).toEqual(previous.progress['hw-cpu-01']);
  expect(state.session).toEqual({ date: '2026-11-10', reviewed: ['hw-cpu-02'], wrongs: {}, completed: true });
  expect(applyFinish(state, 100, midnight + 1000)).toEqual(state);
});
