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
