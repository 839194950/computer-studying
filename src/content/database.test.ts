import { database } from './tracks/database';
import { ALL_CARDS, getCard, getDetail, TRACKS } from './index';
import { TRACK_THEME } from '../components/trackTheme';
import { getDiagramParts, hasIllustration } from '../illustrations/registry';
import { buildQueue, chapterState, unlockedChapters } from '../lib/queue';
import { newProgress, type CardProgress } from '../lib/srs';
import { applyAnswer, createAppState, exportState, parseState } from '../store/useStore';

it('数据库主线注册五章二十卡，主题使用独立图标', () => {
  expect(TRACKS.at(-1)).toBe(database);
  expect(database.chapters).toHaveLength(5);
  expect(database.cards).toHaveLength(20);
  expect(TRACK_THEME.database.icon).toBe('database');
  expect(new Set(database.cards.map((c) => c.illustration)).size).toBe(5);
});

it.each(database.chapters)('$title 有真实导读、完整本章关联和一致的概念图', (chapter) => {
  const cards = database.cards.filter((c) => c.chapter === chapter.id);
  const guide = chapter.guide!;
  expect(cards).toHaveLength(4);
  expect(guide.intro.length).toBeGreaterThan(40);
  expect(guide.objectives).toHaveLength(3);
  expect(guide.prerequisites.length).toBeGreaterThan(0);
  expect(guide.scenario.steps).toHaveLength(4);
  expect(hasIllustration(guide.illustration!)).toBe(true);
  expect(guide.scenario.steps.flatMap((s) => s.relatedCardIds)).toEqual(cards.map((c) => c.id));
  guide.scenario.steps.forEach((s) => expect(s.body.length).toBeGreaterThanOrEqual(40));
  const used = new Set(cards.flatMap((c) => c.steps.flatMap((s) => s.focus)));
  expect([...used].sort()).toEqual([...getDiagramParts(guide.illustration!)].sort());
  cards.forEach((c) => {
    expect(c.illustration).toBe(guide.illustration);
    expect(c.explain.length).toBeLessThanOrEqual(40);
    expect(c.steps.every((s) => s.focus.length > 0)).toBe(true);
    const details = getDetail(c.id);
    expect(details).toHaveLength(2);
    expect(details.some((s) => s.heading.startsWith('误区：'))).toBe(true);
    details.forEach((s) => {
      expect(s.body.length).toBeGreaterThanOrEqual(60);
      expect(s.body.length).toBeLessThanOrEqual(160);
      s.relatedCardIds?.forEach((id) => {
        expect(getCard(id)).toBeDefined();
        expect(id).not.toBe(c.id);
      });
    });
  });
});

it('关键误区的正确答案不把 NULL、索引和事务绝对化', () => {
  const answer = (id: string) => { const card = getCard(id)!; return card.options[card.answerIndex]; };
  expect(answer('db-table-04')).toBe('WHERE stock IS NULL');
  expect(answer('db-query-03')).toBe('2，只跳过 NULL');
  expect(answer('db-index-03')).toBe('扫描可能更省成本');
  expect(answer('db-transaction-03')).toBe('不能，需要新的补偿操作');
  expect(answer('db-model-03')).toBe('用参数化查询绑定输入值');
});

it('新用户和仅有旧四线进度的用户都可学习数据库第一章', () => {
  const now = Date.now();
  const oldProgress: Record<string, CardProgress> = Object.fromEntries(ALL_CARDS.filter((c) => c.track !== 'database').map((c) => [c.id, { ...newProgress(c.id, now), box: 4 }]));
  for (const progress of [{}, oldProgress]) {
    expect(chapterState(database, 'db-table', progress)).toBe('active');
    expect(chapterState(database, 'db-query', progress)).toBe('locked');
    expect(unlockedChapters(database, progress)).toEqual(['db-table']);
    expect(buildQueue(TRACKS, progress, { now, newLimit: 10, chapterId: 'db-table' }).map((q) => q.cardId)).toEqual(database.cards.slice(0, 4).map((c) => c.id));
    expect(buildQueue(TRACKS, progress, { now, newLimit: 10, chapterId: 'db-query' })).toEqual([]);
  }
});

it('数据库仍要求前章四卡全部达到 box 4 才解锁下一章', () => {
  const progress: Record<string, CardProgress> = {};
  for (const card of database.cards.slice(0, 4)) {
    expect(chapterState(database, 'db-query', progress)).toBe('locked');
    progress[card.id] = { ...newProgress(card.id, Date.now()), box: 4 };
  }
  expect(chapterState(database, 'db-table', progress)).toBe('done');
  expect(chapterState(database, 'db-query', progress)).toBe('active');
  expect(chapterState(database, 'db-index', progress)).toBe('locked');
});

it('版本一旧存档往返不丢进度、设置、奖励和历史，新增答题不改旧记录', () => {
  const now = Date.now();
  const old = createAppState(now);
  old.progress = Object.fromEntries(ALL_CARDS.filter((c) => c.track !== 'database').map((c) => [c.id, { ...newProgress(c.id, now), box: 4 as const, lapses: 2 }]));
  old.settings = { newCardsPerDay: 6, reducedMotion: true, sound: false, dailyGoal: 50 };
  old.xp = 1234;
  old.daily = { [old.session.date]: { xp: 32, correct: 3, bestCombo: 2 } };
  old.snapshots = [{ date: old.session.date, mastery: 100, reviewed: 80 }];
  old.streak = { current: 3, longest: 6, lastActiveDate: old.session.date };
  old.session.reviewed = ['hw-cpu-01'];
  const parsed = parseState(exportState(old));
  expect(parsed.ok).toBe(true);
  if (!parsed.ok) throw new Error(parsed.error);
  expect(parsed.state).toEqual(old);
  const next = applyAnswer(parsed.state, 'db-table-01', true, now);
  expect(next.version).toBe(1);
  expect(Object.keys(next.progress)).toHaveLength(81);
  Object.entries(old.progress).forEach(([id, value]) => expect(next.progress[id]).toEqual(value));
  expect(next.settings).toEqual(old.settings);
  expect(next.xp).toBe(old.xp);
  expect(next.daily).toEqual(old.daily);
  expect(next.snapshots).toEqual(old.snapshots);
  expect(next.streak).toEqual(old.streak);
});
