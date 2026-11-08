import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SettingsPage } from './SettingsPage';
import { createAppState, useStore } from '../../store/useStore';

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

function seedExistingSave() {
  const state = createAppState(1794000000000);
  state.progress = { 'hw-cpu-01': {
    cardId: 'hw-cpu-01', box: 3, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 2,
  } };
  state.xp = 125;
  state.settings = { ...state.settings, newCardsPerDay: 6, sound: false };
  useStore.setState(state);
  return state;
}

it.each([
  ['version', '数据版本不匹配，无法导入'],
  ['progress', '进度数据里有损坏的卡片记录'],
])('导入错误%s明确报错且完整存档不变', async (kind, error) => {
  const user = userEvent.setup();
  const original = seedExistingSave();
  const before = useStore.getState().exportJson();
  const invalid = kind === 'version' ? { ...original, version: 2 } : {
    ...original, progress: { 'hw-cpu-01': { ...original.progress['hw-cpu-01'], box: 0 } },
  };
  render(<MemoryRouter><SettingsPage /></MemoryRouter>);
  await user.upload(screen.getByLabelText('导入数据'), new File([JSON.stringify(invalid)], 'bad.json', { type: 'application/json' }));
  expect(await screen.findByText('导入失败：' + error)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '确认导入' })).toBeNull();
  expect(useStore.getState().exportJson()).toBe(before);
});

it('有效存档取消导入后保留原有进度、经验与设置', async () => {
  const user = userEvent.setup();
  const original = seedExistingSave();
  const before = useStore.getState().exportJson();
  const incoming = { ...original, progress: {}, xp: 0 };
  render(<MemoryRouter><SettingsPage /></MemoryRouter>);
  await user.upload(screen.getByLabelText('导入数据'), new File([JSON.stringify(incoming)], 'valid.json', { type: 'application/json' }));
  expect(await screen.findByText(/将导入 0 张卡的进度，覆盖本地 1 张/)).toBeInTheDocument();
  expect(useStore.getState().exportJson()).toBe(before);
  await user.click(screen.getByRole('button', { name: /^取消$/ }));
  expect(screen.queryByRole('button', { name: '确认导入' })).toBeNull();
  expect(screen.queryByText(/导入成功：/)).toBeNull();
  expect(useStore.getState().exportJson()).toBe(before);
});
