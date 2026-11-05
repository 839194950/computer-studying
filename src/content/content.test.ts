import { TRACKS, ALL_CARDS } from './index';
import { getDiagramParts, hasIllustration } from '../illustrations/registry';

it('四条主线，每条五章', () => {
  expect(TRACKS.map((t) => t.id)).toEqual(['hardware', 'language', 'os', 'security']);
  TRACKS.forEach((t) => expect(t.chapters).toHaveLength(5));
});

it('一共 80 张卡，每条主线 20 张，每章 4 张', () => {
  expect(ALL_CARDS).toHaveLength(80);
  TRACKS.forEach((t) => {
    expect(t.cards).toHaveLength(20);
    t.chapters.forEach((ch) => {
      expect(t.cards.filter((c) => c.chapter === ch.id)).toHaveLength(4);
    });
  });
});

it('每张卡结构完整', () => {
  const ids = new Set<string>();
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

it('每张卡都有至少两步图解，旁白不超长', () => {
  ALL_CARDS.forEach((c) => {
    expect(c.steps.length).toBeGreaterThanOrEqual(2);
    c.steps.forEach((s) => {
      expect(s.caption.trim().length).toBeGreaterThan(0);
      expect(s.caption.length).toBeLessThanOrEqual(44);
      expect(Array.isArray(s.focus)).toBe(true);
    });
  });
});

it('每张卡都属于自己主线的某一章', () => {
  ALL_CARDS.forEach((c) => {
    const track = TRACKS.find((t) => t.id === c.track);
    expect(track).toBeDefined();
    expect(track!.chapters.some((ch) => ch.id === c.chapter)).toBe(true);
  });
});

it('每张卡引用的插画都真实注册过', () => {
  ALL_CARDS.forEach((c) => {
    expect(hasIllustration(c.illustration)).toBe(true);
  });
});

it('分步图解高亮的图元都真实存在', () => {
  ALL_CARDS.forEach((c) => {
    const parts = getDiagramParts(c.illustration);
    c.steps.forEach((s) => {
      s.focus.forEach((f) => {
        expect(parts).toContain(f);
      });
    });
  });
});

it('四条主线都有卡片', () => {
  TRACKS.forEach((t) => {
    expect(ALL_CARDS.filter((c) => c.track === t.id).length).toBeGreaterThan(0);
  });
});
