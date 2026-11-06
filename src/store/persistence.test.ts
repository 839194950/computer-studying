import { attemptSave, getSaveState, registerWriter, retrySave, subscribe } from './persistence';

const failing = async () => {
  throw new Error('QuotaExceededError');
};

beforeEach(async () => {
  // 复位成「已保存」，并清掉上一次留下的失败快照。
  await attemptSave('memory-chip', '{}', async () => {});
});

it('写盘成功时保持已保存状态', async () => {
  expect(getSaveState().ok).toBe(true);
});

it('写盘失败时标记为未保存，并通知订阅者', async () => {
  let notified = 0;
  const unsubscribe = subscribe(() => {
    notified += 1;
  });

  await attemptSave('memory-chip', '{"a":1}', failing);

  unsubscribe();
  expect(getSaveState().ok).toBe(false);
  expect(notified).toBe(1);
});

it('重试会把失败的那份数据原样再写一次，成功后恢复已保存', async () => {
  await attemptSave('memory-chip', '{"a":1}', failing);

  const written: [string, string][] = [];
  registerWriter(async (name, value) => {
    written.push([name, value]);
  });

  await retrySave();

  expect(written).toEqual([['memory-chip', '{"a":1}']]);
  expect(getSaveState().ok).toBe(true);
});

it('没有失败记录时，重试不会碰磁盘', async () => {
  let calls = 0;
  registerWriter(async () => {
    calls += 1;
  });

  await retrySave();

  expect(calls).toBe(0);
});

it('写入成功会清掉之前的失败快照，重试不再重放旧数据', async () => {
  await attemptSave('memory-chip', 'old', failing);
  await attemptSave('memory-chip', 'new', async () => {});

  const written: [string, string][] = [];
  registerWriter(async (name, value) => {
    written.push([name, value]);
  });

  await retrySave();

  expect(written).toEqual([]);
  expect(getSaveState().ok).toBe(true);
});
