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
