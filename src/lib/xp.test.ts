import { expect, it } from 'vitest';
import { dailyQuests, levelInfo, pruneDaily, xpForAnswer, xpToReach } from './xp';
import { applyGain, createAppState, parseState, exportState } from '../store/useStore';
import { searchCards } from '../features/wiki/search';
import { ALL_CARDS } from '../content';
import { dayKey } from './time';

const NOW = new Date(2026, 10, 6, 12).getTime();

it('答错不给经验，连对 3 题起每题多 5 分', () => {
  expect(xpForAnswer(false, 10)).toBe(0);
  expect(xpForAnswer(true, 1)).toBe(10);
  expect(xpForAnswer(true, 3)).toBe(15);
});

it('等级门槛 0/100/300/600，并能算出本级进度', () => {
  expect([1, 2, 3, 4].map(xpToReach)).toEqual([0, 100, 300, 600]);
  expect(levelInfo(0)).toMatchObject({ level: 1, into: 0, span: 100 });
  expect(levelInfo(350)).toMatchObject({ level: 3, into: 50, span: 300 });
  expect(levelInfo(Number.NaN).level).toBe(1);
});

it('每日任务的进度封顶在目标值', () => {
  const q = dailyQuests({ xp: 80, correct: 3, bestCombo: 9 }, 30);
  expect(q.map((x) => [x.value, x.target])).toEqual([[30, 30], [3, 8], [5, 5]]);
});

it('applyGain 累加总经验和当天战绩，连对取最大值', () => {
  let s = createAppState(NOW);
  s = applyGain(s, { xp: 10, correct: true, combo: 4 }, NOW);
  s = applyGain(s, { xp: 15, correct: true, combo: 2 }, NOW);
  s = applyGain(s, { xp: 0, correct: false }, NOW);
  expect(s.xp).toBe(25);
  expect(s.daily[dayKey(NOW)]).toEqual({ xp: 25, correct: 2, bestCombo: 4 });
});

it('只保留最近 60 天的每日战绩', () => {
  const old = dayKey(NOW - 90 * 86_400_000);
  const kept = pruneDaily({ [old]: { xp: 1, correct: 0, bestCombo: 0 }, [dayKey(NOW)]: { xp: 2, correct: 0, bestCombo: 0 } }, NOW);
  expect(Object.keys(kept)).toEqual([dayKey(NOW)]);
});

it('旧版存档没有 xp/daily 字段也能导入，且导出后再导入不丢经验', () => {
  const legacy = { ...createAppState(NOW) } as Record<string, unknown>;
  delete legacy.xp;
  delete legacy.daily;
  const r = parseState(JSON.stringify(legacy));
  expect(r.ok && r.state.xp).toBe(0);
  const withXp = applyGain(createAppState(NOW), { xp: 40 }, NOW);
  const back = parseState(exportState(withXp));
  expect(back.ok && back.state.xp).toBe(40);
});

it('百科搜索：空查询返回全部，多个词都要命中，标题命中排前', () => {
  expect(searchCards(ALL_CARDS, '  ')).toHaveLength(ALL_CARDS.length);
  const hits = searchCards(ALL_CARDS, 'CPU');
  expect(hits.length).toBeGreaterThan(0);
  expect(hits[0].title.toLowerCase()).toContain('cpu');
  expect(searchCards(ALL_CARDS, 'zzzz不存在的词')).toHaveLength(0);
});
