import { TRACKS, ALL_CARDS, getDetail } from './index';
import { DETAILS } from './details';
import { getDiagramParts, hasIllustration } from '../illustrations/registry';

it('九章填充完整导读，案例与详情关联均指向真实卡片', () => {
  const chapters = TRACKS.flatMap((t) => t.chapters);
  expect(chapters.filter((c) => c.guide).map((c) => c.id)).toEqual(['hw-cpu', 'hw-binary', 'hw-network', 'sec-tls', 'db-table', 'db-query', 'db-index', 'db-transaction', 'db-model']);
  const guide = chapters.find((c) => c.id === 'hw-cpu')!.guide!;
  expect(guide.intro.trim()).not.toBe('');
  expect(guide.objectives.length).toBeGreaterThan(0);
  expect(guide.prerequisites.length).toBeGreaterThan(0);
  expect(guide.scenario.steps).toHaveLength(4);
  const ids = new Set(ALL_CARDS.map((c) => c.id));
  [...guide.scenario.steps, ...Object.values(DETAILS).flat()].forEach((s) => {
    s.relatedCardIds?.forEach((id) => expect(ids.has(id)).toBe(true));
    if (s.relatedCardIds) expect(new Set(s.relatedCardIds).size).toBe(s.relatedCardIds.length);
  });
  ALL_CARDS.filter((c) => c.chapter === 'hw-cpu').forEach((c) => {
    expect(getDetail(c.id).some((s) => s.heading.startsWith('误区：') && s.relatedCardIds?.length)).toBe(true);
    getDetail(c.id).forEach((s) => expect(s.relatedCardIds ?? []).not.toContain(c.id));
  });
});

it('二进制导读复用概念图，四步依次关联四卡且内容完整', () => {
  const guide = TRACKS.find((track) => track.id === 'hardware')!
    .chapters.find((chapter) => chapter.id === 'hw-binary')!.guide;
  expect(guide).toBeDefined();
  expect(guide!.illustration).toBe('binary');
  expect(guide!.objectives).toHaveLength(3);
  expect(guide!.prerequisites.length).toBeGreaterThan(0);
  expect(guide!.scenario.steps).toHaveLength(4);
  expect(guide!.scenario.steps.flatMap((step) => step.relatedCardIds ?? []))
    .toEqual(['hw-binary-01', 'hw-binary-02', 'hw-binary-03', 'hw-binary-04']);
  guide!.scenario.steps.forEach((step) => {
    expect(step.body.length).toBeGreaterThanOrEqual(60);
    expect(step.body.length).toBeLessThanOrEqual(160);
  });
});

it('网络导读复用概念图，案例关联覆盖本章四卡', () => {
  const guide = TRACKS.find((track) => track.id === 'hardware')!
    .chapters.find((chapter) => chapter.id === 'hw-network')!.guide;
  expect(guide).toBeDefined();
  expect(guide!.illustration).toBe('network');
  expect(guide!.intro.trim()).not.toBe('');
  expect(guide!.objectives).toHaveLength(3);
  expect(guide!.prerequisites.length).toBeGreaterThan(0);
  [...guide!.objectives, ...guide!.prerequisites].forEach((text) => expect(text.trim()).not.toBe(''));
  expect(guide!.scenario.title.trim()).not.toBe('');
  expect(guide!.scenario.steps).toHaveLength(4);
  expect(guide!.scenario.steps.flatMap((step) => step.relatedCardIds ?? []))
    .toEqual(['hw-network-04', 'hw-network-02', 'hw-network-01', 'hw-network-03']);
  guide!.scenario.steps.forEach((step) => {
    expect(step.heading.trim()).not.toBe('');
    expect(step.body.length).toBeGreaterThanOrEqual(60);
    expect(step.body.length).toBeLessThanOrEqual(160);
    step.relatedCardIds!.forEach((id) => {
      expect(ALL_CARDS.find((card) => card.id === id)?.chapter).toBe('hw-network');
    });
  });
});

it('TLS导读复用原图，四步关联覆盖本章全部知识卡', () => {
  const guide = TRACKS.find((track) => track.id === 'security')!
    .chapters.find((chapter) => chapter.id === 'sec-tls')!.guide;
  expect(guide).toBeDefined();
  expect(guide!.illustration).toBe('tls');
  expect(guide!.intro.trim()).not.toBe('');
  expect(guide!.objectives).toHaveLength(3);
  expect(guide!.prerequisites.length).toBeGreaterThan(0);
  [...guide!.objectives, ...guide!.prerequisites].forEach((text) => expect(text.trim()).not.toBe(''));
  expect(guide!.scenario.steps).toHaveLength(4);
  expect(guide!.scenario.steps.flatMap((step) => step.relatedCardIds ?? []))
    .toEqual(['sec-tls-01', 'sec-tls-02', 'sec-tls-03', 'sec-tls-04']);
  guide!.scenario.steps.forEach((step) => {
    expect(step.heading.trim()).not.toBe('');
    expect(step.body.length).toBeGreaterThanOrEqual(60);
    expect(step.body.length).toBeLessThanOrEqual(160);
    step.relatedCardIds!.forEach((id) => expect(ALL_CARDS.find((card) => card.id === id)?.chapter).toBe('sec-tls'));
  });
});

it('五条主线，每条五章', () => {
  expect(TRACKS.map((t) => t.id)).toEqual(['hardware', 'language', 'os', 'security', 'database']);
  TRACKS.forEach((t) => expect(t.chapters).toHaveLength(5));
});

it('一共 100 张卡，每条主线 20 张，每章 4 张', () => {
  expect(ALL_CARDS).toHaveLength(100);
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

it('每张卡都有详细讲解，且小节完整', () => {
  ALL_CARDS.forEach((c) => {
    const detail = getDetail(c.id);
    expect(detail.length).toBeGreaterThanOrEqual(2);
    detail.forEach((s) => {
      expect(s.heading.trim().length).toBeGreaterThan(0);
      expect(s.heading.length).toBeLessThanOrEqual(16);
      expect(s.body.length).toBeGreaterThanOrEqual(40);
      expect(s.body.length).toBeLessThanOrEqual(180);
    });
    expect(new Set(detail.map((s) => s.heading)).size).toBe(detail.length);
  });
});

it('详细讲解表里没有指向不存在卡片的条目', () => {
  const ids = new Set(ALL_CARDS.map((c) => c.id));
  Object.keys(DETAILS).forEach((id) => {
    expect(ids.has(id)).toBe(true);
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

it('五条主线都有卡片', () => {
  TRACKS.forEach((t) => {
    expect(ALL_CARDS.filter((c) => c.track === t.id).length).toBeGreaterThan(0);
  });
});
