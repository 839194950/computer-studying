import { test, expect, type Page, type TestInfo } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'desktop') await page.setViewportSize({ width: 1440, height: 1000 });
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => {
    if (message.type() === 'error') throw new Error(message.text());
  });
});

async function exportSave(page: Page) {
  await page.goto('/settings');
  await expect(page.getByRole('button', { name: '导出数据', exact: true })).toBeVisible();
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出数据', exact: true }).click();
  const stream = await (await downloading).createReadStream();
  const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function importCpuSave(page: Page) {
  const save = await exportSave(page);
  save.progress = Object.fromEntries(['hw-cpu-01', 'hw-cpu-02', 'hw-cpu-03', 'hw-cpu-04'].map((cardId) => [cardId, {
    cardId, box: 4, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 0,
  }]));
  await page.getByLabel('导入数据', { exact: true }).setInputFiles({
    name: 'isolated-cpu-mastered.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(save)),
  });
  await expect(page.getByText(/将导入 4 张卡的进度/)).toBeVisible();
  const backup = page.waitForEvent('download');
  await page.getByRole('button', { name: '确认导入', exact: true }).click();
  await backup;
  await expect(page.getByText(/导入成功：4 张卡/)).toBeVisible();
  expect(await exportSave(page)).toEqual(save);
  return save;
}

async function captureLayout(page: Page, testInfo: TestInfo, name: string) {
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator('main')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: testInfo.outputPath(name + '-full.png'), fullPage: true, animations: 'disabled' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath(name + '-top.png'), animations: 'disabled' });
  const concept = page.getByRole('region', { name: '二进制与编码概念图' });
  if (await concept.count()) {
    await concept.scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(name + '-concept.png'), animations: 'disabled' });
  }
  const lastLink = page.locator('main').getByRole('link').last();
  await lastLink.scrollIntoViewIfNeeded();
  await expect(lastLink).toBeInViewport();
  expect(await lastLink.evaluate((link) => {
    const bounds = link.getBoundingClientRect();
    return link.contains(document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2));
  })).toBe(true);
  await page.screenshot({ path: testInfo.outputPath(name + '-bottom.png'), animations: 'disabled' });
}

test('locked guide stays locked after exploring binary lab and related wiki', async ({ page }, testInfo) => {
  const before = await exportSave(page);
  await page.goto('/map/hardware/hw-binary');
  await expect(page.getByRole('heading', { name: '章节尚未解锁' })).toBeVisible();
  await expect(page.getByRole('link', { name: '开始本章学习' })).toHaveCount(0);
  await page.goto('/labs');
  await page.getByRole('link', { name: '打开进制实验台' }).click();
  await expect(page).toHaveURL('/labs/binary');
  await page.getByRole('button', { name: '预设 255', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('二补码：-1');
  await page.getByRole('navigation', { name: '相关百科知识' }).getByRole('link', { name: '查看知识卡：负数怎么用 0 和 1 表示' }).click();
  await expect(page).toHaveURL('/wiki/hw-binary-03');
  await expect(page.getByRole('heading', { level: 1, name: '负数怎么用 0 和 1 表示' })).toBeVisible();
  await expect(page.getByRole('link', { name: /去学/ })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('link', { name: '进制实验台', exact: true })).toBeVisible();
  await page.goto('/wiki/hw-binary-04');
  await expect(page.getByRole('heading', { level: 1, name: '中文是怎么存进去的' })).toBeVisible();
  await expect(page.getByRole('link', { name: '进制实验台', exact: true })).toHaveCount(0);
  await page.goto('/map/hardware/hw-binary');
  await page.reload();
  await expect(page.getByRole('heading', { name: '章节尚未解锁' })).toBeVisible();
  await captureLayout(page, testInfo, 'locked-guide');
  expect(await exportSave(page)).toEqual(before);
});

test('imported prerequisite unlocks map to guide to lab to wiki without save changes', async ({ page }, testInfo) => {
  const before = await importCpuSave(page);
  await page.goto('/map');
  await page.getByRole('link', { name: /硬件与原理/ }).click();
  await expect(page).toHaveURL('/map/hardware');
  await expect(page.getByLabel('未解锁', { exact: true })).toHaveCount(3);
  await page.getByRole('link', { name: '章节导读', exact: true }).nth(1).click();
  await expect(page).toHaveURL('/map/hardware/hw-binary');
  await expect(page.getByRole('heading', { level: 1, name: '二进制与编码 · 章节导读' })).toBeVisible();
  await expect(page.getByRole('region', { name: '二进制与编码概念图' })).toBeVisible();
  await expect(page.getByRole('link', { name: '开始本章学习' })).toHaveAttribute('href', '/study?chapter=hw-binary');
  await page.reload();
  await captureLayout(page, testInfo, 'binary-guide');
  await page.getByRole('link', { name: '进制实验台', exact: true }).click();
  await expect(page).toHaveURL('/labs/binary');
  await page.getByRole('button', { name: '预设 128', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('二补码：-128');
  await expect(page.getByRole('navigation', { name: '相关百科知识' }).getByRole('link')).toHaveCount(3);
  await captureLayout(page, testInfo, 'binary-lab');
  await page.getByRole('link', { name: '查看知识卡：负数怎么用 0 和 1 表示' }).click();
  await expect(page).toHaveURL('/wiki/hw-binary-03');
  await expect(page.getByRole('heading', { level: 1, name: '负数怎么用 0 和 1 表示' })).toBeVisible();
  await page.reload();
  await captureLayout(page, testInfo, 'binary-wiki');
  await page.getByRole('link', { name: '进制实验台', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('位串：00000000');
  expect(await exportSave(page)).toEqual(before);
});

test('index wiki and experiment round trip preserves imported save after next and reset', async ({ page }, testInfo) => {
  const before = await importCpuSave(page);
  await page.goto('/wiki/db-index-03');
  await expect(page.getByRole('heading', { level: 1, name: '索引不是总比扫描快' })).toBeVisible();
  await page.getByRole('link', { name: '索引查询演示', exact: true }).click();
  await expect(page).toHaveURL('/labs/index');
  await expect(page.getByRole('heading', { level: 1, name: '索引查询演示' })).toBeVisible();
  await page.getByRole('button', { name: '下一步', exact: true }).click();
  const scan = page.getByRole('region', { name: '顺序扫描', exact: true });
  await expect(scan.getByRole('status')).toContainText('比较次数：1');
  await page.getByRole('button', { name: '重置查询', exact: true }).click();
  await expect(scan.getByRole('status')).toContainText('尚未开始');
  await page.getByRole('button', { name: '下一步', exact: true }).click();
  await expect(page.getByRole('navigation', { name: '相关百科知识' }).getByRole('link')).toHaveCount(4);
  await captureLayout(page, testInfo, 'index-lab');
  await page.getByRole('link', { name: '查看知识卡：条件要匹配索引结构' }).click();
  await expect(page).toHaveURL('/wiki/db-index-04');
  await expect(page.getByRole('heading', { level: 1, name: '条件要匹配索引结构' })).toBeVisible();
  await expect(page.getByRole('link', { name: /去学/ })).toHaveCount(0);
  await page.reload();
  await captureLayout(page, testInfo, 'index-wiki');
  await page.getByRole('link', { name: '索引查询演示', exact: true }).click();
  await expect(scan.getByRole('status')).toContainText('尚未开始');
  expect(await exportSave(page)).toEqual(before);
});
