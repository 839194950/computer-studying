import { test, expect, type Page } from '@playwright/test';
import { exportSave, importSave } from './helpers/save';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'desktop') await page.setViewportSize({ width: 1440, height: 1000 });
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => {
    if (message.type() === 'error') throw new Error(message.text());
  });
});

async function seedExistingSave(page: Page) {
  const save = await exportSave(page);
  save.progress = { 'hw-cpu-01': {
    cardId: 'hw-cpu-01', box: 3, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 2,
  } };
  save.xp = 125;
  save.settings = { ...save.settings, newCardsPerDay: 6, reducedMotion: true, sound: false };
  save.streak = { current: 2, longest: 3, lastActiveDate: save.session.date };
  save.daily = { [save.session.date]: { xp: 25, correct: 2, bestCombo: 2 } };
  save.snapshots = [{ date: save.session.date, mastery: 1, reviewed: 1 }];
  await importSave(page, save);
  return save;
}

for (const scenario of [
  { name: 'invalid-json', error: '文件不是合法的 JSON' },
  { name: 'wrong-version', error: '数据版本不匹配，无法导入' },
  { name: 'broken-progress', error: '进度数据里有损坏的卡片记录' },
]) {
  test(scenario.name + ': rejection preserves complete save before and after refresh', async ({ page }, testInfo) => {
    const before = await seedExistingSave(page);
    const invalid = scenario.name === 'wrong-version' ? { ...before, version: 2 } : {
      ...before, progress: { 'hw-cpu-01': { ...before.progress['hw-cpu-01'], box: 0 } },
    };
    const raw = scenario.name === 'invalid-json' ? '{' : JSON.stringify(invalid);
    await page.getByLabel('导入数据', { exact: true }).setInputFiles({
      name: scenario.name + '.json', mimeType: 'application/json', buffer: Buffer.from(raw),
    });
    const error = page.getByText('导入失败：' + scenario.error, { exact: true });
    await expect(error).toBeVisible();
    await expect(page).toHaveURL('/settings');
    await expect(page.getByRole('heading', { level: 1, name: '我的' })).toBeVisible();
    await expect(page.getByRole('button', { name: '确认导入', exact: true })).toHaveCount(0);
    await expect(page.getByText(/导入成功：/)).toHaveCount(0);
    await expect(page.locator('vite-error-overlay')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await error.scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(scenario.name + '.png'), animations: 'disabled' });
    expect(await exportSave(page)).toEqual(before);
    await page.reload();
    expect(await exportSave(page)).toEqual(before);
  });
}

test('cancel valid import preserves progress rewards settings and history after refresh', async ({ page }, testInfo) => {
  const before = await seedExistingSave(page);
  const incoming = { ...before, progress: {}, xp: 0, daily: {}, snapshots: [] };
  await page.getByLabel('导入数据', { exact: true }).setInputFiles({
    name: 'valid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(incoming)),
  });
  await expect(page.getByText(/将导入 0 张卡的进度，覆盖本地 1 张/)).toBeVisible();
  await expect(page.getByRole('button', { name: '确认导入', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '取消', exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('cancel-preview.png'), animations: 'disabled' });
  await page.getByRole('button', { name: '取消', exact: true }).click();
  await expect(page.getByRole('button', { name: '确认导入', exact: true })).toHaveCount(0);
  await expect(page.getByText(/将导入 0 张卡的进度/)).toHaveCount(0);
  await expect(page.getByText(/导入成功：/)).toHaveCount(0);
  expect(await exportSave(page)).toEqual(before);
  await page.reload();
  expect(await exportSave(page)).toEqual(before);
});
