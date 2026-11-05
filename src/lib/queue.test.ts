import { buildQueue, buildCardQueue, chapterState, unlockedChapters } from './queue';
import type { Card, Track } from '../content/types';
import type { CardProgress } from './srs';

const now = new Date(2026, 2, 15, 10).getTime();
const mk = (id: string, chapter: string): Card => ({
  id,
  track: 'language',
  chapter,
  title: id,
  illustration: 'spark',
  explain: 'e',
  steps: [{ caption: 's', focus: [] }],
  question: 'q',
  options: ['a', 'b', 'c', 'd'],
  answerIndex: 0,
  explanation: 'x',
});
const track: Track = {
  id: 'language',
  title: '编程语言',
  chapters: [
    { id: 'c1', title: '一', blurb: '' },
    { id: 'c2', title: '二', blurb: '' },
  ],
  cards: [mk('a1', 'c1'), mk('a2', 'c1'), mk('b1', 'c2')],
};
const mastered = (cardId: string): CardProgress => ({
  cardId,
  box: 5,
  dueAt: now + 9e9,
  lastReviewedAt: now,
  lapses: 0,
});

it('新用户只有第一章开着', () => {
  expect(unlockedChapters(track, {})).toEqual(['c1']);
  expect(chapterState(track, 'c2', {})).toBe('locked');
  expect(chapterState(track, 'c1', {})).toBe('active');
});

it('前一章全部记牢后，下一章解锁', () => {
  const progress = { a1: mastered('a1'), a2: mastered('a2') };
  expect(chapterState(track, 'c1', progress)).toBe('done');
  expect(unlockedChapters(track, progress)).toEqual(['c1', 'c2']);
});

it('到期卡排在新卡前面，新卡受每日上限约束', () => {
  const progress: Record<string, CardProgress> = {
    a1: { cardId: 'a1', box: 2, dueAt: now - 1, lastReviewedAt: now, lapses: 0 },
  };
  const q = buildQueue([track], progress, { newLimit: 1, now });
  expect(q[0]).toEqual({ cardId: 'a1', isNew: false });
  expect(q.filter((i) => i.isNew)).toHaveLength(1);
  expect(q[1].cardId).toBe('a2');
});

it('未解锁章节的卡永远不会进队列', () => {
  const q = buildQueue([track], {}, { newLimit: 99, now });
  expect(q.map((i) => i.cardId)).not.toContain('b1');
  expect(q.map((i) => i.cardId)).toEqual(['a1', 'a2']);
});

it('没有可学的卡时返回空队列而不是崩', () => {
  const progress: Record<string, CardProgress> = {
    a1: mastered('a1'),
    a2: mastered('a2'),
    b1: mastered('b1'),
  };
  expect(buildQueue([track], progress, { newLimit: 10, now })).toEqual([]);
});

it('指定章节时只返回该章节的卡', () => {
  const progress = { a1: mastered('a1'), a2: mastered('a2') };
  expect(buildQueue([track], progress, { newLimit: 10, now, chapterId: 'c2' }).map((i) => i.cardId)).toEqual(['b1']);
  expect(buildQueue([track], progress, { newLimit: 10, now, chapterId: 'c1' })).toEqual([]);
});

it('指定章节时，该章的到期卡仍然排在前面', () => {
  const progress: Record<string, CardProgress> = {
    a1: mastered('a1'),
    a2: { cardId: 'a2', box: 2, dueAt: now - 1, lastReviewedAt: now, lapses: 0 },
  };
  const q = buildQueue([track], progress, { newLimit: 10, now, chapterId: 'c1' });
  expect(q).toEqual([{ cardId: 'a2', isNew: false }]);
});

it('includeAll 把整章都排进队列，到期的排前面，且不受每日新卡上限约束', () => {
  const progress: Record<string, CardProgress> = {
    a1: mastered('a1'),
    a2: { cardId: 'a2', box: 2, dueAt: now - 1, lastReviewedAt: now, lapses: 0 },
  };
  const q = buildQueue([track], progress, {
    newLimit: 0,
    now,
    chapterId: 'c1',
    includeAll: true,
  });
  expect(q.map((i) => i.cardId)).toEqual(['a2', 'a1']);
});

it('buildCardQueue 按给定顺序原样返回', () => {
  expect(buildCardQueue(['b1', 'a1'])).toEqual([
    { cardId: 'b1', isNew: false },
    { cardId: 'a1', isNew: false },
  ]);
});
