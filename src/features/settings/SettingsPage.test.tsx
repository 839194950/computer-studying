import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SettingsPage } from './SettingsPage';
import { useStore } from '../../store/useStore';

it('导入合法文件也要先确认，确认后才覆盖', async () => {
  const user = userEvent.setup();
  useStore.setState({ progress: {} });

  const payload = JSON.stringify({
    version: 1,
    progress: {
      c1: { cardId: 'c1', box: 2, dueAt: Date.now() + 1e8, lastReviewedAt: Date.now(), lapses: 0 },
    },
    settings: { newCardsPerDay: 10, reducedMotion: false },
    streak: { current: 0, longest: 0, lastActiveDate: null },
  });

  render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>,
  );

  await user.upload(screen.getByLabelText('导入数据'), new File([payload], 'ok.json', { type: 'application/json' }));

  expect(await screen.findByText(/将导入 1 张卡/)).toBeInTheDocument();
  expect(useStore.getState().progress).toEqual({});

  await user.click(screen.getByRole('button', { name: '确认导入' }));
  expect(useStore.getState().progress['c1']).toBeDefined();
});

it('导入坏文件时报错，且本地进度不变', async () => {
  const user = userEvent.setup();
  const before = useStore.getState().progress;
  const bad = new File(['not json at all'], 'bad.json', { type: 'application/json' });

  render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>,
  );

  await user.upload(screen.getByLabelText('导入数据'), bad);

  expect(await screen.findByText(/导入失败/)).toBeInTheDocument();
  expect(useStore.getState().progress).toEqual(before);
});
