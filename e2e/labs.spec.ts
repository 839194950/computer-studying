import { test, expect, type Page } from '@playwright/test';
import { TRACKS } from '../src/content';

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => { throw error; });
});

test('binary lab supports keyboard, visible bit state, presets and fresh re-entry', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /动手实验室/ }).click();
  await page.getByRole('link', { name: '打开进制实验台' }).click();
  const highBit = page.getByRole('button', { name: '切换 b7', exact: true });
  await expect(highBit).toHaveAttribute('aria-pressed', 'false');
  await highBit.focus();
  const inactiveColor = await highBit.evaluate((button) => getComputedStyle(button).backgroundColor);
  await page.keyboard.press('Space');
  await expect(highBit).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('status')).toContainText('位串：10000000');
  await expect(page.getByRole('status')).toContainText('二补码：-128');
  await expect(highBit).not.toHaveCSS('background-color', inactiveColor);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('位串：00000000');
  await page.getByRole('button', { name: '预设 255', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('二补码：-1');
  await page.getByRole('button', { name: '重置', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('无符号：0');
  await page.getByRole('button', { name: '预设 127', exact: true }).click();
  await page.getByRole('link', { name: '返回实验室', exact: true }).click();
  await page.getByRole('link', { name: '打开进制实验台' }).click();
  await expect(page.getByRole('status')).toContainText('位串：00000000');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: '进制实验台' })).toBeVisible();
});

test('index query freezes the completed lookup while the scan finishes', async ({ page }) => {
  await page.goto('/labs/index');
  const scan = page.getByRole('region', { name: '顺序扫描', exact: true });
  const binary = page.getByRole('region', { name: '有序索引二分查找', exact: true });
  const next = page.getByRole('button', { name: '下一步', exact: true });
  await next.click();
  await expect(scan.getByRole('status')).toContainText('当前位置：1（键 23）');
  await expect(binary.getByRole('status')).toContainText('当前位置：5（键 31）');
  await next.click();
  await next.click();
  await expect(binary.getByRole('status')).toContainText('找到键 47 · 记录 5');
  await expect(binary.getByRole('status')).toContainText('比较次数：3');
  await expect(next).toBeEnabled();
  await next.click();
  await next.click();
  await expect(scan.getByRole('status')).toContainText('找到键 47 · 记录 5');
  await expect(scan.getByRole('status')).toContainText('比较次数：5');
  await expect(binary.getByRole('status')).toContainText('比较次数：3');
  await expect(next).toBeDisabled();
  await expect(scan.locator('[aria-current="step"]')).toContainText('键 47');
  await expect(binary.locator('[aria-current="step"]')).toContainText('键 47');
  await page.getByRole('button', { name: '重置查询' }).click();
  await expect(scan.getByRole('status')).toContainText('尚未开始');
  await expect(binary.locator('[aria-current="step"]')).toHaveCount(0);
});

test('missing targets and invalid input clear stale results and recover', async ({ page }) => {
  await page.goto('/labs/index');
  const target = page.getByLabel('目标整数键');
  const scan = page.getByRole('region', { name: '顺序扫描', exact: true });
  const binary = page.getByRole('region', { name: '有序索引二分查找', exact: true });
  const next = page.getByRole('button', { name: '下一步', exact: true });
  await target.fill('42');
  for (let step = 0; step < 9; step += 1) await next.click();
  await expect(scan.getByRole('status')).toContainText('比较次数：9');
  await expect(scan.getByRole('status')).toContainText('不存在');
  await expect(binary.getByRole('status')).toContainText('比较次数：3');
  await expect(binary.getByRole('status')).toContainText('不存在');
  await expect(next).toBeDisabled();
  for (const invalid of ['', '1.5', 'abc', '9007199254740992']) {
    await target.fill(invalid);
    await expect(target).toHaveAttribute('aria-invalid', 'true');
    await expect(next).toBeDisabled();
    await expect(scan.getByRole('status')).toContainText('等待有效目标');
    await expect(binary.getByRole('status')).toContainText('比较次数：0');
    await expect(page.locator('[aria-current="step"]')).toHaveCount(0);
  }
  await target.fill('23');
  await expect(target).toHaveAttribute('aria-invalid', 'false');
  await next.click();
  await expect(scan.getByRole('status')).toContainText('找到键 23');
  await expect(binary.getByRole('status')).toContainText('查找中');
  await page.getByRole('link', { name: '返回实验室', exact: true }).click();
  await page.getByRole('link', { name: '打开索引查询演示' }).click();
  await expect(target).toHaveValue('47');
  await expect(scan.getByRole('status')).toContainText('尚未开始');
});

for (const [track, lab, name, back] of [
  ['hardware', 'binary', '进制实验台', '返回硬件与原理章节'],
  ['database', 'index', '索引查询演示', '返回数据库章节'],
]) {
  test(lab + ' is accessible without unlocking or changing chapter progress', async ({ page }) => {
    await page.goto('/map/' + track);
    await expect(page.getByLabel('未解锁')).toHaveCount(4);
    await page.getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL('/labs/' + lab);
    await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
    await page.getByRole('link', { name: back, exact: true }).click();
    await expect(page).toHaveURL('/map/' + track);
    await expect(page.getByLabel('未解锁')).toHaveCount(4);
  });
}

async function exportSave(page: Page) {
  await page.goto('/settings');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出数据', exact: true }).click();
  const stream = await (await downloading).createReadStream();
  const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

test('experiments preserve an existing learning save across reloads', async ({ page }) => {
  const card = TRACKS[0].cards[0];
  await page.goto('/study?chapter=' + card.chapter);
  await expect(page.getByRole('heading', { name: card.title, exact: true })).toBeVisible();
  for (let step = 0; step < Math.max(1, card.steps?.length ?? 0); step += 1) await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /^[ABCD][.]/ }).nth(card.answerIndex).click();
  await page.getByRole('button', { name: /下一张|完成/ }).click();
  const before = await exportSave(page);
  expect(before.progress[card.id]).toBeDefined();
  expect(before.xp).toBeGreaterThan(0);
  await page.goto('/labs/binary');
  await page.getByRole('button', { name: '预设 255', exact: true }).click();
  await page.getByRole('link', { name: '返回实验室', exact: true }).click();
  await page.getByRole('link', { name: '打开索引查询演示' }).click();
  for (let step = 0; step < 5; step += 1) await page.getByRole('button', { name: '下一步', exact: true }).click();
  await page.reload();
  expect(await exportSave(page)).toEqual(before);
});
