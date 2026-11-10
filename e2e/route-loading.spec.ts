import { test, expect } from '@playwright/test';
import { exportSave, importSave } from './helpers/save';

test.use({ serviceWorkers: 'block' });

test('home defers the map module and keeps navigation visible while it loads', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  let requested = false;
  let release!: () => void;
  const released = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/*MapPage*', async (route) => {
    requested = true;
    await released;
    await route.continue();
  });
  try {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /开始今天的复习/ })).toBeVisible();
    expect(requested).toBe(false);
    await page.locator('a[href="/map"]:visible').first().click();
    await expect(page.getByRole('status')).toHaveText('正在加载页面…');
    expect(requested).toBe(true);
    await expect(page.locator('a[href="/settings"]:visible').first()).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('route-loading.png') });
    release();
    await expect(page.getByRole('heading', { name: '章节地图', exact: true })).toBeVisible();
    await expect(page.getByRole('status')).toHaveCount(0);
    expect(errors).toEqual([]);
  } finally {
    release();
  }
});

test('a failed chunk can return home and recover by explicit reload without changing saves', async ({ page }, testInfo) => {
  const save = await exportSave(page);
  save.xp = 125;
  save.progress = { 'hw-cpu-01': {
    cardId: 'hw-cpu-01', box: 4, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 2,
  } };
  await importSave(page, save);
  await page.goto('/');
  let failedRequests = 0;
  await page.route('**/*MapPage*', async (route) => {
    failedRequests++;
    await route.abort('failed');
  });
  await page.locator('a[href="/map"]:visible').first().click();
  await expect(page.getByRole('alert')).toContainText('页面加载失败');
  await expect(page).toHaveURL('/map');
  await page.screenshot({ path: testInfo.outputPath('route-error.png') });
  await page.getByRole('link', { name: '返回首页', exact: true }).click();
  await expect(page.getByRole('link', { name: /开始今天的复习/ })).toBeVisible();
  await page.locator('a[href="/map"]:visible').first().click();
  await expect(page.getByRole('alert')).toContainText('页面加载失败');
  expect(failedRequests).toBe(1);
  await page.unroute('**/*MapPage*');
  await page.getByRole('button', { name: '刷新页面', exact: true }).click();
  await expect(page.getByRole('heading', { name: '章节地图', exact: true })).toBeVisible();
  expect(await exportSave(page)).toEqual(save);
});

test('lazy deep links preserve paths and back-forward navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const save = await exportSave(page);
  await page.goto('/labs/binary');
  await expect(page.getByRole('heading', { name: '进制实验台', exact: true })).toBeVisible();
  await page.locator('a[href="/map"]:visible').first().click();
  await expect(page.getByRole('heading', { name: '章节地图', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL('/labs/binary');
  await expect(page.getByRole('heading', { name: '进制实验台', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { name: '章节地图', exact: true })).toBeVisible();
  expect(await exportSave(page)).toEqual(save);
  expect(errors).toEqual([]);
});
