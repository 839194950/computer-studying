import { render, screen } from '@testing-library/react';
import { App } from './App';
import { useStore } from '../store/useStore';
import { attemptSave } from '../store/persistence';

it('renders the site name', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: '记忆芯' })).toBeInTheDocument();
});

it('桌面导航给出四个页面入口', () => {
  render(<App />);
  ['学习', '地图', '图谱', '我'].forEach((label) => {
    expect(screen.getAllByRole('link', { name: new RegExp(label) }).length).toBeGreaterThan(0);
  });
  expect(screen.getByRole('navigation', { name: '主导航' })).toBeInTheDocument();
});

it('设置里打开降低动效时，根节点带上降级标记', () => {
  useStore.setState({ settings: { newCardsPerDay: 10, reducedMotion: true } });
  const { container } = render(<App />);
  expect(container.querySelector('[data-motion="reduced"]')).toBeTruthy();
});

it('写盘失败时整个应用都会浮出保存警告', async () => {
  await attemptSave('memory-chip', '{}', async () => {
    throw new Error('QuotaExceededError');
  });

  render(<App />);

  expect(screen.getByRole('alert')).toHaveTextContent('进度没能保存');
});
