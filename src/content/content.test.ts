import { TRACKS, ALL_CARDS } from './index';

it('四条主线，每条五章', () => {
  expect(TRACKS.map((t) => t.id)).toEqual(['hardware', 'language', 'os', 'security']);
  TRACKS.forEach((t) => expect(t.chapters).toHaveLength(5));
});

it('每张卡结构完整', () => {
  const ids = new Set<string>();
  expect(ALL_CARDS.length).toBeGreaterThan(0);
  ALL_CARDS.forEach((c) => {
    expect(ids.has(c.id)).toBe(false);
    ids.add(c.id);
    expect(c.options).toHaveLength(4);
    expect(c.answerIndex).toBeGreaterThanOrEqual(0);
    expect(c.answerIndex).toBeLessThan(4);
    expect(c.explain.length).toBeLessThanOrEqual(40);
    expect(c.question.length).toBeGreaterThan(0);
    expect(new Set(c.options).size).toBe(4);
  });
});

it('每张卡都属于自己主线的某一章', () => {
  ALL_CARDS.forEach((c) => {
    const track = TRACKS.find((t) => t.id === c.track);
    expect(track).toBeDefined();
    expect(track!.chapters.some((ch) => ch.id === c.chapter)).toBe(true);
  });
});

it('四条主线都有卡片', () => {
  TRACKS.forEach((t) => {
    expect(ALL_CARDS.filter((c) => c.track === t.id).length).toBeGreaterThan(0);
  });
});
