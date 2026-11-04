import { render, screen } from '@testing-library/react';
import { App } from './App';
import { useStore } from '../store/useStore';

it('renders the site name', () => {
  render(<App />);
  expect(screen.getByText('记忆芯')).toBeInTheDocument();
});

it('设置里打开降低动效时，根节点带上降级标记', () => {
  useStore.setState({ settings: { newCardsPerDay: 10, reducedMotion: true } });
  const { container } = render(<App />);
  expect(container.querySelector('[data-motion="reduced"]')).toBeTruthy();
});
