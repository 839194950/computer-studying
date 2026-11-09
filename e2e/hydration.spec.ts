import { test, expect } from '@playwright/test';
import { exportSave } from './helpers/save';

test('import success waits for storage completion before an immediate reload', async ({ page }) => {
  const saved = await exportSave(page);
  saved.xp = 125;
  saved.progress = { 'hw-cpu-01': {
    cardId: 'hw-cpu-01', box: 4, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 2,
  } };
  await page.evaluate(() => {
    const originalTransaction = IDBDatabase.prototype.transaction;
    const complete = Object.getOwnPropertyDescriptor(IDBTransaction.prototype, 'oncomplete')!;
    IDBDatabase.prototype.transaction = function (...args) {
      const transaction = originalTransaction.apply(this, args);
      if (args[1] === 'readwrite') {
        Object.defineProperty(transaction, 'oncomplete', {
          set(callback) {
            complete.set!.call(transaction, (event: Event) => {
              document.documentElement.dataset.storageWrite = 'pending';
              window.addEventListener('release-storage-write', () => callback.call(transaction, event), { once: true });
            });
          },
        });
      }
      return transaction;
    };
  });
  await page.getByLabel('导入数据', { exact: true }).setInputFiles({
    name: 'save.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(saved)),
  });
  const backup = page.waitForEvent('download');
  await page.getByRole('button', { name: '确认导入', exact: true }).click();
  await backup;
  await expect(page.locator('html')).toHaveAttribute('data-storage-write', 'pending');
  await expect(page.getByText(/导入成功：/)).toHaveCount(0);
  await expect(page.getByRole('button', { name: '正在保存…', exact: true })).toBeDisabled();
  await page.evaluate(() => window.dispatchEvent(new Event('release-storage-write')));
  await expect(page.getByText(/导入成功：/)).toBeVisible();
  expect(await exportSave(page)).toEqual(saved);
});

test('delayed storage restoration blocks actions and preserves the first export', async ({ page }) => {
  const saved = await exportSave(page);
  saved.xp = 125;
  saved.progress = { 'hw-cpu-01': {
    cardId: 'hw-cpu-01', box: 4, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 2,
  } };
  await page.evaluate(async (state) => {
    await new Promise<void>((resolve, reject) => {
      const opening = indexedDB.open('keyval-store');
      opening.onerror = () => reject(opening.error);
      opening.onsuccess = () => {
        const database = opening.result;
        const transaction = database.transaction('keyval', 'readwrite');
        transaction.objectStore('keyval').put(JSON.stringify({ state, version: 0 }), 'memory-chip');
        transaction.oncomplete = () => { database.close(); resolve(); };
        transaction.onabort = () => { database.close(); reject(transaction.error); };
      };
    });
  }, saved);
  await page.addInitScript(() => {
    const originalGet = IDBObjectStore.prototype.get;
    const success = Object.getOwnPropertyDescriptor(IDBRequest.prototype, 'onsuccess')!;
    IDBObjectStore.prototype.get = function (key) {
      const request = originalGet.call(this, key);
      if (key === 'memory-chip') {
        Object.defineProperty(request, 'onsuccess', {
          set(callback) {
            success.set!.call(request, (event: Event) => {
              document.documentElement.dataset.storageRead = 'pending';
              window.addEventListener('release-storage-read', () => callback.call(request, event), { once: true });
            });
          },
        });
      }
      return request;
    };
  });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-storage-read', 'pending');
  await expect(page.getByRole('status')).toHaveText('正在读取学习存档…');
  await expect(page.getByRole('button', { name: '导出数据', exact: true })).toHaveCount(0);
  await expect(page.getByLabel('导入数据', { exact: true })).toHaveCount(0);
  await page.evaluate(() => window.dispatchEvent(new Event('release-storage-read')));
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出数据', exact: true }).click();
  const stream = await (await downloading).createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  expect(JSON.parse(Buffer.concat(chunks).toString('utf8'))).toEqual(saved);
});
