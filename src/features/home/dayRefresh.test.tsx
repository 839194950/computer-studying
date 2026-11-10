import { act, cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ALL_CARDS } from '../../content';
import { createAppState, useStore } from '../../store/useStore';
import { waitForSave } from '../../store/persistence';
import { HomePage } from './HomePage';
import { StatChips } from '../../components/StatChips';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 9, 23, 59, 59));
  const state = createAppState(Date.now());
  state.settings = { ...state.settings, reducedMotion: true, sound: false };
  state.progress = Object.fromEntries(ALL_CARDS.map((card) => [card.id, {
    cardId: card.id, box: 4, dueAt: new Date(2027, 0, 1).getTime(), lastReviewedAt: Date.now() - 1000, lapses: 0,
  }]));
  state.progress['hw-cpu-01'].dueAt = new Date(2026, 10, 10).getTime();
  state.session.reviewed = ['hw-cpu-01'];
  state.daily = { '2026-11-09': { xp: 30, correct: 3, bestCombo: 3 } };
  state.xp = 30;
  state.streak = { current: 3, longest: 5, lastActiveDate: '2026-11-08' };
  useStore.setState(state);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it('停留首页跨零点更新队列、每日统计与徽章，不写存档', async () => {
  await waitForSave();
  const before = useStore.getState().exportJson();
  const diskBefore = localStorage.getItem('memory-chip');
  render(<MemoryRouter><HomePage /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: '今天的队列已经清空' })).toBeInTheDocument();
  expect(screen.getByText('3 天')).toBeInTheDocument();
  act(() => { vi.advanceTimersByTime(1000); });
  expect(screen.getByRole('link', { name: '开始今天的复习 · 1 张' })).toBeInTheDocument();
  expect(screen.getByText('已复习 0 张 · 共 100 张知识卡')).toBeInTheDocument();
  expect(screen.getByRole('progressbar', { name: '每日经验目标' })).toHaveAttribute('aria-valuenow', '0');
  expect(screen.getByText('0 天')).toBeInTheDocument();
  expect(useStore.getState().exportJson()).toBe(before);
  expect(localStorage.getItem('memory-chip')).toBe(diskBefore);
});

it.each(['focus', 'visibilitychange'])('错过零点计时器后通过%s恢复最新日期', (event) => {
  render(<MemoryRouter><HomePage /></MemoryRouter>);
  act(() => {
    vi.setSystemTime(new Date(2026, 10, 10, 9));
    if (event === 'visibilitychange') {
      vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
      document.dispatchEvent(new Event(event));
    } else window.dispatchEvent(new Event(event));
  });
  expect(screen.getByRole('link', { name: '开始今天的复习 · 1 张' })).toBeInTheDocument();
  expect(screen.getByText('0 天')).toBeInTheDocument();
});

it('独立桌面徽章跨日校正断签，不依赖首页重新挂载', () => {
  render(<StatChips />);
  expect(screen.getByText('3 天')).toBeInTheDocument();
  act(() => { vi.advanceTimersByTime(1000); });
  expect(screen.getByText('0 天')).toBeInTheDocument();
});
