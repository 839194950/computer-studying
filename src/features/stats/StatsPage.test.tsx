import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StatsPage } from './StatsPage';
import { useStore } from '../../store/useStore';

beforeEach(() => {
  useStore.setState({ progress: {}, snapshots: [] });
});

it('图例齐全，没有历史数据时给占位文案', () => {
  const { container } = render(
    <MemoryRouter>
      <StatsPage />
    </MemoryRouter>,
  );
  expect(screen.getByText('记牢了', { selector: 'span' })).toBeInTheDocument();
  expect(screen.getByText('快忘了')).toBeInTheDocument();
  expect(screen.getByText(/还没有历史数据/)).toBeInTheDocument();
  expect(container.textContent).not.toContain('NaN');
});
