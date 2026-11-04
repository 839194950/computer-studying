import { render } from '@testing-library/react';
import { getIllustration } from './registry';
import { Mascot } from './Mascot';

it('未知插画 key 回落到 Spark', () => {
  const C = getIllustration('does-not-exist');
  const { container } = render(<C />);
  expect(container.querySelector('svg')).toBeTruthy();
});

it('每种已知 key 都能渲染', () => {
  ['spark', 'pointer', 'binary', 'process', 'hash'].forEach((key) => {
    const C = getIllustration(key);
    const { container } = render(<C />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

it('小芯的四种状态都能渲染', () => {
  (['idle', 'happy', 'confused', 'sleep'] as const).forEach((mood) => {
    const { container } = render(<Mascot mood={mood} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
