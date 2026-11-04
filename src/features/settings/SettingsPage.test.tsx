import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SettingsPage } from './SettingsPage';
import { useStore } from '../../store/useStore';

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
