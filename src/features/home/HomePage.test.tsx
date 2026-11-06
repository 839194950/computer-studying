import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import { useStore } from '../../store/useStore';
import { ALL_CARDS, TRACKS } from '../../content';
import { dayKey } from '../../lib/time';

const now = Date.now();
const freshSession = () => ({ date: dayKey(now), reviewed: [], wrongs: {}, completed: false });

beforeEach(() => {
  useStore.setState({
    progress: {},
    snapshots: [],
    streak: { current: 0, longest: 0, lastActiveDate: null },
    session: freshSession(),
  });
});

it('新用户看到开始链接，且链接里不再套 button，进度环不出现 NaN', () => {
  const { container } = render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
  expect(screen.getByText('记忆芯')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /开始今天的复习/ })).toBeInTheDocument();
  expect(screen.queryByRole('button')).toBeNull();
  expect(container.textContent).not.toContain('NaN');
});

it('断签后首页立刻显示 0 天，而不是旧数字', () => {
  useStore.setState({
    streak: { current: 7, longest: 9, lastActiveDate: '2026-01-01' },
  });
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
  expect(screen.getByText('0 天')).toBeInTheDocument();
});

it('全部记牢且未到期时显示"今天没事了"', () => {
  const progress = Object.fromEntries(
    ALL_CARDS.map((c) => [
      c.id,
      { cardId: c.id, box: 5 as const, dueAt: now + 9e9, lastReviewedAt: now, lapses: 0 },
    ]),
  );
  useStore.setState({ progress });

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
  expect(screen.getByText('今天没事了')).toBeInTheDocument();
  expect(screen.getByText('100')).toBeInTheDocument();
});

it('有答错未记牢的卡时出现薄弱卡入口', () => {
  useStore.setState({
    progress: {
      'hw-cpu-01': { cardId: 'hw-cpu-01', box: 1, dueAt: now + 9e9, lastReviewedAt: now, lapses: 2 },
    },
  });

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
  expect(screen.getByText('薄弱 1 张')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /薄弱/ })).toHaveAttribute('href', '/study?mode=weak');
});

it('没有薄弱卡时不显示入口', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
  expect(screen.queryByText(/薄弱/)).toBeNull();
});

it('首页同时给出复习入口和产品介绍，入口在最前面', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );

  const intro = screen.getByRole('heading', { name: '这是什么' });
  const cta = screen.getByRole('link', { name: /开始今天的复习/ });

  // 改版后主按钮放在首屏最显眼处，介绍卡紧随其后，依然常驻
  expect(cta.compareDocumentPosition(intro) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(screen.getByText('看懂一张图')).toBeInTheDocument();
  expect(screen.getByText('选一个答案')).toBeInTheDocument();
  expect(screen.getByText('到点再见一次')).toBeInTheDocument();
  expect(screen.getByText(/四条主线 · 80 张卡/)).toBeInTheDocument();
});

it('今天没有待复习时，介绍依然在', () => {
  const progress = Object.fromEntries(
    ALL_CARDS.map((c) => [
      c.id,
      { cardId: c.id, box: 5 as const, dueAt: now + 9e9, lastReviewedAt: now, lapses: 0 },
    ]),
  );
  useStore.setState({ progress });

  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: '这是什么' })).toBeInTheDocument();
  expect(screen.getByText('今天没事了')).toBeInTheDocument();
});

it('四条主线都能点进章节地图', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );

  for (const track of TRACKS) {
    expect(screen.getByRole('link', { name: new RegExp(track.title) })).toHaveAttribute('href', `/map/${track.id}`);
  }
});
