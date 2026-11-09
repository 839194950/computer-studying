import { attemptSave, getSaveState } from './persistence';

const { idbSet } = vi.hoisted(() => ({ idbSet: vi.fn() }));

vi.mock('idb-keyval', () => ({
  get: vi.fn(async () => null),
  set: (...args: unknown[]) => idbSet(...args),
  del: vi.fn(async () => {}),
}));

beforeEach(async () => {
  await attemptSave('memory-chip', '{}', async () => {});
  idbSet.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

it('IndexedDB 写失败会被记成未保存，而不是静默丢掉', async () => {
  vi.stubGlobal('indexedDB', {});
  const { persistToDisk } = await import('./useStore');
  idbSet.mockRejectedValueOnce(new Error('QuotaExceededError'));

  await attemptSave('memory-chip', '{"a":1}', persistToDisk);

  expect(idbSet).toHaveBeenCalled();
  expect(getSaveState().ok).toBe(false);
});

it('浏览器不提供 IndexedDB 时退回 localStorage', async () => {
  const { persistToDisk } = await import('./useStore');

  await attemptSave('memory-chip-fallback', '{"a":2}', persistToDisk);

  expect(localStorage.getItem('memory-chip-fallback')).toBe('{"a":2}');
  expect(getSaveState().ok).toBe(true);
});

it('导入等待 IndexedDB 写入完成才报告成功，随后恢复完整存档', async () => {
  vi.stubGlobal('indexedDB', {});
  const { createAppState, useStore } = await import('./useStore');
  const save = createAppState(Date.now());
  save.xp = 125;
  let finishWrite!: () => void;
  idbSet.mockReturnValueOnce(new Promise<void>((resolve) => { finishWrite = resolve; }));
  const completed = vi.fn();
  const importing = useStore.getState().importJson(JSON.stringify(save)).then(completed);
  await Promise.resolve();
  await Promise.resolve();
  expect(completed).not.toHaveBeenCalled();
  expect(JSON.parse(idbSet.mock.calls[0][1]).state.xp).toBe(125);
  finishWrite();
  await importing;
  expect(completed).toHaveBeenCalledWith({ ok: true });
});

it('导入写盘失败不报告成功，内存数据仍可导出且可重试保存', async () => {
  vi.stubGlobal('indexedDB', {});
  const { createAppState, useStore } = await import('./useStore');
  const { retrySave } = await import('./persistence');
  const save = createAppState(Date.now());
  save.xp = 125;
  idbSet.mockRejectedValueOnce(new Error('QuotaExceededError'));
  const result = await useStore.getState().importJson(JSON.stringify(save));
  expect(result.ok).toBe(false);
  expect(getSaveState().ok).toBe(false);
  expect(JSON.parse(useStore.getState().exportJson())).toEqual(save);
  await retrySave();
  expect(getSaveState().ok).toBe(true);
  expect(idbSet.mock.calls[1]).toEqual(idbSet.mock.calls[0]);
});
