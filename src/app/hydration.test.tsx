import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { createAppState, useStore } from '../store/useStore';

const { read, write } = vi.hoisted(() => ({ read: vi.fn(), write: vi.fn(async () => {}) }));

vi.mock('idb-keyval', () => ({ get: read, set: write, del: vi.fn() }));

beforeEach(async () => {
  localStorage.clear();
  await useStore.persist.rehydrate();
  write.mockClear();
  window.history.replaceState({}, '', '/settings');
});

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState({}, '', '/');
});

it('恢复存档前不暴露操作入口，恢复后首次导出即包含完整进度', async () => {
  vi.stubGlobal('indexedDB', {});
  const saved = createAppState(Date.now());
  saved.xp = 125;
  saved.progress = { 'hw-cpu-01': {
    cardId: 'hw-cpu-01', box: 4, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 2,
  } };
  let resolveRead!: (value: string) => void;
  read.mockReturnValueOnce(new Promise<string>((resolve) => { resolveRead = resolve; }));
  const restoring = useStore.persist.rehydrate();

  render(<App />);
  expect(screen.getByRole('status')).toHaveTextContent('正在读取学习存档');
  expect(screen.queryByRole('button', { name: '导出数据' })).toBeNull();
  expect(screen.queryByLabelText('导入数据')).toBeNull();
  expect(write).not.toHaveBeenCalled();

  await act(async () => {
    resolveRead(JSON.stringify({ state: saved, version: 0 }));
    await restoring;
  });
  expect(screen.getByRole('button', { name: '导出数据' })).toBeInTheDocument();
  expect(JSON.parse(useStore.getState().exportJson())).toEqual(saved);
  expect(write).not.toHaveBeenCalled();
});

it('读取失败时不把默认空状态当作存档，并允许重试恢复', async () => {
  vi.stubGlobal('indexedDB', {});
  read.mockRejectedValueOnce(new Error('read failed'));
  await useStore.persist.rehydrate();
  const user = userEvent.setup();
  render(<App />);
  expect(screen.getByRole('alert')).toHaveTextContent('学习存档读取失败');
  expect(screen.queryByRole('button', { name: '导出数据' })).toBeNull();
  const saved = createAppState(Date.now());
  saved.xp = 77;
  read.mockResolvedValueOnce(JSON.stringify({ state: saved, version: 0 }));
  await user.click(screen.getByRole('button', { name: '重试读取' }));
  expect(await screen.findByRole('button', { name: '导出数据' })).toBeInTheDocument();
  expect(JSON.parse(useStore.getState().exportJson())).toEqual(saved);
  expect(write).not.toHaveBeenCalled();
});

it('没有 IndexedDB 时仍等待 localStorage 存档恢复', async () => {
  const saved = createAppState(Date.now());
  saved.xp = 88;
  localStorage.setItem('memory-chip', JSON.stringify({ state: saved, version: 0 }));
  await useStore.persist.rehydrate();
  render(<App />);
  expect(screen.getByRole('button', { name: '导出数据' })).toBeInTheDocument();
  expect(JSON.parse(useStore.getState().exportJson())).toEqual(saved);
});
