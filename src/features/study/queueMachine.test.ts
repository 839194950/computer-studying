import { answerRunner, startRunner } from './queueMachine';
import type { QueueItem } from '../../lib/queue';

const items: QueueItem[] = [
  { cardId: 'a', isNew: true },
  { cardId: 'b', isNew: true },
  { cardId: 'c', isNew: true },
];

it('答对前进一张', () => {
  const r = answerRunner(startRunner(items), 'a', true);
  expect(r.index).toBe(1);
  expect(r.done).toBe(false);
});

it('答错把卡片移到队尾', () => {
  const r = answerRunner(startRunner(items), 'a', false);
  expect(r.items.map((i) => i.cardId)).toEqual(['b', 'c', 'a']);
  expect(r.index).toBe(0);
});

it('同一张卡连错两次就放弃它，并正常收尾', () => {
  let r = answerRunner(startRunner([{ cardId: 'a', isNew: true }]), 'a', false);
  expect(r.done).toBe(false);
  r = answerRunner(r, 'a', false);
  expect(r.done).toBe(true);
  expect(r.items).toHaveLength(0);
});

it('空队列一开始就结束', () => {
  expect(startRunner([]).done).toBe(true);
});

it('答对最后一张即结束', () => {
  const r = answerRunner(startRunner([{ cardId: 'x', isNew: false }]), 'x', true);
  expect(r.done).toBe(true);
});
