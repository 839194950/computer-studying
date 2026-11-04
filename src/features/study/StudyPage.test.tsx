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
  });
});

it('从讲解面走到问题面，作答后出现下一张', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <StudyPage />
    </MemoryRouter>,
  );

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
