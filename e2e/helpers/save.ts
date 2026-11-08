import { expect, type Page } from '@playwright/test';
import type { AppState } from '../../src/store/useStore';

export async function exportSave(page: Page): Promise<AppState> {
  await page.goto('/settings');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出数据', exact: true }).click();
  const stream = await (await downloading).createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as AppState;
}

export async function importSave(page: Page, save: AppState): Promise<void> {
  await page.goto('/settings');
  await page.getByLabel('导入数据', { exact: true }).setInputFiles({
    name: 'isolated-save.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(save)),
  });
  await expect(page.getByRole('button', { name: '确认导入', exact: true })).toBeVisible();
  const backup = page.waitForEvent('download');
  await page.getByRole('button', { name: '确认导入', exact: true }).click();
  await backup;
  await expect(page.getByText(/导入成功：/)).toBeVisible();
  expect(await exportSave(page)).toEqual(save);
}
