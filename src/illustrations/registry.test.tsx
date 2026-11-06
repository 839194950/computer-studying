import { render } from '@testing-library/react';
import { MotionConfig } from 'framer-motion';
import { ILLUSTRATION_KEYS, getDiagramParts, getIllustration, hasIllustration } from './registry';
import { Mascot } from './Mascot';

it('未知插画 key 回落到 Spark', () => {
  const C = getIllustration('does-not-exist');
  const { container } = render(<C />);
  expect(container.querySelector('svg')).toBeTruthy();
});

it('每种已知 key 都能渲染，且声明的图元不为空', () => {
  expect(ILLUSTRATION_KEYS.length).toBeGreaterThanOrEqual(20);
  ILLUSTRATION_KEYS.forEach((key) => {
    const C = getIllustration(key);
    const { container } = render(<C />);
    expect(container.querySelector('svg')).toBeTruthy();
    if (key !== 'spark') {
      expect(getDiagramParts(key).length).toBeGreaterThanOrEqual(4);
    }
  });
});

it('传入 focus 时图仍能渲染', () => {
  ILLUSTRATION_KEYS.forEach((key) => {
    const parts = getDiagramParts(key);
    const C = getIllustration(key);
    const { container } = render(<C focus={parts.slice(0, 1)} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

it('hasIllustration 能区分已注册与未注册', () => {
  expect(hasIllustration('cpu')).toBe(true);
  expect(hasIllustration('poop')).toBe(false);
});

it('小芯保持尺寸、类名及装饰语义', () => {
  const { container } = render(<Mascot size={30} className="shrink-0" still />);
  const svg = container.querySelector('svg')!;
  expect(svg.getAttribute('width')).toBe('30');
  expect(svg.getAttribute('height')).toBe('32.5');
  expect(svg.getAttribute('viewBox')).toBe('0 0 120 130');
  expect(svg.getAttribute('class')).toBe('shrink-0');
  expect(svg.getAttribute('aria-hidden')).toBe('true');
  expect(svg.getAttribute('focusable')).toBe('false');
});

it('多个小芯的渐变和滤镜 ID 唯一且引用属于当前实例', () => {
  const { container } = render(<><Mascot /><Mascot mood="happy" /><Mascot mood="sleep" /></>);
  const ids = Array.from(container.querySelectorAll('[id]'), (node) => node.id);
  expect(new Set(ids).size).toBe(ids.length);
  container.querySelectorAll('svg').forEach((svg) => {
    const localIds = new Set(Array.from(svg.querySelectorAll('[id]'), (node) => node.id));
    svg.querySelectorAll('[fill], [filter]').forEach((node) => {
      ['fill', 'filter'].forEach((attr) => {
        const value = node.getAttribute(attr);
        if (value?.startsWith('url(#')) expect(localIds.has(value.slice(5, -1))).toBe(true);
      });
    });
  });
});

it('降低动效下仍能切换四种静态表情', () => {
  const { container, rerender } = render(<MotionConfig reducedMotion="always"><Mascot /></MotionConfig>);
  const expressions = new Set<string>();
  (['idle', 'happy', 'confused', 'sleep'] as const).forEach((mood) => {
    rerender(<MotionConfig reducedMotion="always"><Mascot mood={mood} /></MotionConfig>);
    const eye = container.querySelector('path[filter]')!;
    expressions.add(eye.getAttribute('d')!);
    expect(container.querySelector('svg')!.style.transform).toMatch(/^(none)?$/);
    expect((eye.parentElement as unknown as SVGElement).style.transform).toMatch(/^(none)?$/);
  });
  expect(expressions.size).toBe(4);
});

it('小芯的四种状态都能渲染', () => {
  (['idle', 'happy', 'confused', 'sleep'] as const).forEach((mood) => {
    const { container } = render(<Mascot mood={mood} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
