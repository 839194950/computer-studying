import { render } from '@testing-library/react';
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

it('小芯的四种状态都能渲染', () => {
  (['idle', 'happy', 'confused', 'sleep'] as const).forEach((mood) => {
    const { container } = render(<Mascot mood={mood} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
