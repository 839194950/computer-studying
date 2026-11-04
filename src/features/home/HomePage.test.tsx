import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import { useStore } from '../../store/useStore';
import { ALL_CARDS } from '../../content';
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

it('新用户看到开始按钮，进度环不出现 NaN', () => {
  const { container } = render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
  expect(screen.getByText('记忆芯')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /开始今天的复习/ })).toBeInTheDocument();
  expect(container.textContent).not.toContain('NaN');
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
