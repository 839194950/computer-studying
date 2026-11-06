import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { StatsPage } from './StatsPage';
import { writeFoldTrack } from './foldState';
import { useStore } from '../../store/useStore';
import { dayKey } from '../../lib/time';
import type { Box } from '../../lib/srs';

const now = Date.now();
const DAY = 86_400_000;

function dueLabel(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

function progressEntry(cardId: string, box: Box, dueAt: number) {
  return { cardId, box, dueAt, lastReviewedAt: now, lapses: 0 };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <StatsPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  writeFoldTrack(undefined);
  useStore.setState({
    progress: {},
    snapshots: [],
    session: { date: dayKey(now), reviewed: [], wrongs: {}, completed: false },
  });
});

afterEach(cleanup);

it('默认只展开"快忘了"最多的那条主线，其余收起', () => {
  useStore.setState({
    progress: {
      'hw-cpu-01': progressEntry('hw-cpu-01', 3, now - DAY),
      'os-process-01': progressEntry('os-process-01', 2, now + DAY),
      'os-thread-01': progressEntry('os-thread-01', 2, now + DAY),
    },
  });

  renderPage();

  expect(screen.getByText('CPU 到底在重复什么')).toBeInTheDocument();
  expect(screen.queryByText('进程是一间独立的房子')).toBeNull();
});

it('展开后该线每张卡都有一行，带状态与下次复习日期', () => {
  const due = now + DAY;
  useStore.setState({
    progress: { 'os-process-01': progressEntry('os-process-01', 2, due) },
  });

  renderPage();
  const list = screen.getByRole('list', { name: /操作系统/ });

  expect(within(list).getAllByRole('listitem')).toHaveLength(20);

  const row = within(list).getByText('进程是一间独立的房子').closest('li')!;
  expect(within(row).getByLabelText('刚学会')).toBeInTheDocument();
  expect(within(row).getByText(dueLabel(due))).toBeInTheDocument();

  const freshRow = within(list).getByText('线程是同一屋檐下的人').closest('li')!;
  expect(within(freshRow).getByText('还没开始')).toBeInTheDocument();
});

it('展开另一条线时，原来的那条自动收起；再点一次能全部收起', async () => {
  const user = userEvent.setup();
  renderPage();

  // 默认展开第一条（硬件），其余收起。
  const hardware = screen.getByRole('button', { name: /硬件与原理/ });
  const os = screen.getByRole('button', { name: /操作系统/ });
  expect(hardware).toHaveAttribute('aria-expanded', 'true');
  expect(os).toHaveAttribute('aria-expanded', 'false');

  await user.click(os);
  expect(os).toHaveAttribute('aria-expanded', 'true');
  expect(hardware).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByText('进程是一间独立的房子')).toBeInTheDocument();
  expect(screen.queryByText('CPU 到底在重复什么')).toBeNull();

  await user.click(os);
  expect(os).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByText('进程是一间独立的房子')).toBeNull();
});

it('切到别的页面再回来，展开的主线还在', async () => {
  const user = userEvent.setup();
  renderPage();

  await user.click(screen.getByRole('button', { name: /操作系统/ }));
  expect(screen.getByText('进程是一间独立的房子')).toBeInTheDocument();

  cleanup();
  renderPage();

  expect(screen.getByRole('button', { name: /操作系统/ })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  expect(screen.getByText('进程是一间独立的房子')).toBeInTheDocument();
});
