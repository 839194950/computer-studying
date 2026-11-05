import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { StudyPage } from './StudyPage';
import { useStore } from '../../store/useStore';
import { dayKey } from '../../lib/time';

beforeEach(() => {
  useStore.setState({
    progress: {},
    snapshots: [],
    streak: { current: 0, longest: 0, lastActiveDate: null },
    session: { date: dayKey(Date.now()), reviewed: [], wrongs: {}, completed: false },
    settings: { newCardsPerDay: 10, reducedMotion: false },
  });
});

/** 把讲解面的所有步骤走完，停在「懂了，考考我」之前。 */
async function walkExplain(user: ReturnType<typeof userEvent.setup>) {
  for (let guard = 0; guard < 12; guard += 1) {
    const next = screen.queryByRole('button', { name: '看下一步' });
    if (!next) return;
    await user.click(next);
  }
  throw new Error('讲解步骤似乎没有终点');
}

it('讲解面要一步步走完，才出现答题选项', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );

  expect(screen.queryAllByRole('button', { name: /^[ABCD]\./ })).toHaveLength(0);
  expect(screen.getByRole('button', { name: '看下一步' })).toBeInTheDocument();

  await walkExplain(user);

  expect(screen.getByRole('button', { name: /懂了/ })).toBeInTheDocument();
  expect(screen.queryAllByRole('button', { name: /^[ABCD]\./ })).toHaveLength(0);

  await user.click(screen.getByRole('button', { name: /懂了/ }));
  expect(screen.getAllByRole('button', { name: /^[ABCD]\./ })).toHaveLength(4);
});

it('作答后出现解释与下一张按钮', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );

  await walkExplain(user);
  await user.click(screen.getByRole('button', { name: /懂了/ }));

  const options = screen.getAllByRole('button', { name: /^[ABCD]\./ });
  await user.click(options[0]);

  expect(screen.getByRole('button', { name: /下一张|完成/ })).toBeInTheDocument();
});

it('队列为空时直接给出结算而不是白屏', async () => {
  useStore.setState({
    progress: Object.fromEntries(
      Array.from({ length: 200 }).map((_, i) => [
        `nope-${i}`,
        { cardId: `nope-${i}`, box: 5 as const, dueAt: Date.now() + 9e9, lastReviewedAt: null, lapses: 0 },
      ]),
    ),
    settings: { newCardsPerDay: 0, reducedMotion: false },
  });

  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );
  expect(screen.getByText(/今天没有要复习的卡/)).toBeInTheDocument();
});

it('带 chapter 参数时只学这一章，不串到别的章节', () => {
  const now = Date.now();
  // 先把第一章全部记牢，解锁第二章
  useStore.setState({
    progress: Object.fromEntries(
      ['hw-cpu-01', 'hw-cpu-02', 'hw-cpu-03', 'hw-cpu-04'].map((id) => [
        id,
        { cardId: id, box: 5 as const, dueAt: now + 9e9, lastReviewedAt: now, lapses: 0 },
      ]),
    ),
  });

  render(
    <MemoryRouter initialEntries={['/study?chapter=hw-binary']}>
      <StudyPage />
    </MemoryRouter>,
  );

  expect(screen.getByText('一个字节有多大')).toBeInTheDocument();
  expect(screen.queryByText('CPU 到底在重复什么')).toBeNull();
  expect(screen.getByRole('link', { name: /二进制与编码/ })).toBeInTheDocument();
});

it('未解锁的章节直接进会给出空态而不是白屏', () => {
  render(
    <MemoryRouter initialEntries={['/study?chapter=hw-network']}>
      <StudyPage />
    </MemoryRouter>,
  );
  expect(screen.getByText(/这一章今天没有安排/)).toBeInTheDocument();
});

const hwCpuMastered = () =>
  Object.fromEntries(
    ['hw-cpu-01', 'hw-cpu-02', 'hw-cpu-03', 'hw-cpu-04'].map((id) => [
      id,
      {
        cardId: id,
        box: 5 as const,
        dueAt: Date.now() + 9e9,
        lastReviewedAt: Date.now(),
        lapses: 0,
      },
    ]),
  );

it('错题本模式只出现答错过且没记牢的卡', () => {
  useStore.setState({
    progress: {
      'hw-cpu-01': { cardId: 'hw-cpu-01', box: 1, dueAt: Date.now() + 9e9, lastReviewedAt: Date.now(), lapses: 3 },
      // 记牢了，不算薄弱
      'hw-cpu-02': { cardId: 'hw-cpu-02', box: 5, dueAt: Date.now() + 9e9, lastReviewedAt: Date.now(), lapses: 5 },
      // 没错过，不算薄弱
      'hw-cpu-03': { cardId: 'hw-cpu-03', box: 3, dueAt: Date.now() + 9e9, lastReviewedAt: Date.now(), lapses: 0 },
    },
  });

  render(
    <MemoryRouter initialEntries={['/study?mode=weak']}>
      <StudyPage />
    </MemoryRouter>,
  );

  expect(screen.getByText('CPU 到底在重复什么')).toBeInTheDocument();
  expect(screen.queryByText('缓存是桌边那摞常用书')).toBeNull();
  expect(screen.queryByText('内存是张会擦掉的草稿纸')).toBeNull();
});

it('通关的章节给出再练一遍的入口', () => {
  useStore.setState({ progress: hwCpuMastered() });

  render(
    <MemoryRouter initialEntries={['/study?chapter=hw-cpu']}>
      <StudyPage />
    </MemoryRouter>,
  );

  expect(screen.getByText(/这一章今天没有安排/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '再练一遍' })).toHaveAttribute(
    'href',
    '/study?chapter=hw-cpu&free=1',
  );
});

it('自由复习会把整章的卡都列出来', () => {
  useStore.setState({ progress: hwCpuMastered() });

  render(
    <MemoryRouter initialEntries={['/study?chapter=hw-cpu&free=1']}>
      <StudyPage />
    </MemoryRouter>,
  );

  expect(screen.getByText('CPU 到底在重复什么')).toBeInTheDocument();
  expect(screen.getByText('1/4')).toBeInTheDocument();
});

it('答错时详细讲解自动展开，答对时保持收起', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );

  await walkExplain(user);
  await user.click(screen.getByRole('button', { name: /懂了/ }));

  const options = screen.getAllByRole('button', { name: /^[ABCD]\./ });
  await user.click(options[0]); // 第一张卡答案是 B，选 A 必然错
  expect(screen.getByText('详细讲解').closest('details')).toHaveAttribute('open');
});

it('键盘可以选答案并进入反馈', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );

  await walkExplain(user);
  await user.click(screen.getByRole('button', { name: /懂了/ }));

  await user.keyboard('1');
  expect(screen.getByRole('button', { name: /下一张|完成/ })).toBeInTheDocument();
});

it('Enter 可以推进讲解步骤', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );

  expect(screen.getByText('1/3')).toBeInTheDocument();
  await user.keyboard('{Enter}');
  expect(screen.getByText('2/3')).toBeInTheDocument();
});
