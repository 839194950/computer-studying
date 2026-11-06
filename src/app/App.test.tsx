import { render, screen } from '@testing-library/react';
import { App } from './App';
import { useStore } from '../store/useStore';
import { attemptSave } from '../store/persistence';
import { TRACKS } from '../content';

afterEach(() => window.history.replaceState({}, '', '/'));

it('主线子路由直达时，桌面和移动导航都高亮地图', () => {
  window.history.replaceState({}, '', `/map/${TRACKS[0].id}`);
  render(<App />);
  expect(screen.getByRole('heading', { name: `${TRACKS[0].title} · 章节路径` })).toBeInTheDocument();
  const links = screen.getAllByRole('link', { name: '地图' });
  expect(links).toHaveLength(2);
  links.forEach((link) => expect(link).toHaveAttribute('aria-current', 'page'));
});

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
