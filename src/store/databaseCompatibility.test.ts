import { get, set } from 'idb-keyval';
import { createAppState, useStore } from './useStore';
import { newProgress } from '../lib/srs';
import { chapterState } from '../lib/queue';
import { database } from '../content/tracks/database';

vi.mock('idb-keyval', () => ({ get: vi.fn(async () => null), set: vi.fn(async () => {}), del: vi.fn(async () => {}) }));

afterEach(() => vi.unstubAllGlobals());

it('从既有 IndexedDB persist 外壳加载，不变更版本或清空四线状态', async () => {
  vi.stubGlobal('indexedDB', {});
  const old = createAppState(Date.now());
  old.progress = { 'hw-cpu-01': { ...newProgress('hw-cpu-01', Date.now()), box: 4, lapses: 2 } };
  old.xp = 77;
  old.settings.sound = false;
  old.session.reviewed = ['hw-cpu-01'];
  // 应用数据版本为 1；既有 Zustand 外壳未配置 version，其默认值为 0。
  vi.mocked(get).mockResolvedValue(JSON.stringify({ state: old, version: 0 }));
  await useStore.persist.rehydrate();
  expect(get).toHaveBeenCalledWith('memory-chip');
  for (const key of Object.keys(old) as (keyof typeof old)[]) expect(useStore.getState()[key]).toEqual(old[key]);
  expect(useStore.getState().version).toBe(1);
  expect(useStore.persist.getOptions().version ?? 0).toBe(0);
  expect(chapterState(database, 'db-table', useStore.getState().progress)).toBe('active');
  useStore.getState().answer('db-table-01', true);
  expect(useStore.getState().progress['hw-cpu-01']).toEqual(old.progress['hw-cpu-01']);
  expect(useStore.getState().xp).toBe(77);
  expect(set).toHaveBeenCalled();
  const saved = JSON.parse(vi.mocked(set).mock.calls.at(-1)![1] as string);
  expect(saved.version).toBe(0);
  expect(saved.state.version).toBe(1);
  expect(saved.state.progress['hw-cpu-01']).toEqual(old.progress['hw-cpu-01']);
  expect(saved.state.progress['db-table-01']).toBeDefined();
});
