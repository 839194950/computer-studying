import { test, expect, type Page, type TestInfo } from '@playwright/test';
import { getCard } from '../src/content';
import { exportSave, importSave } from './helpers/save';

const chapters = [
  { id: 'db-table', title: '数据与表', preceding: [] },
  { id: 'db-query', title: '查询基础', preceding: ['db-table'] },
  { id: 'db-index', title: '索引', preceding: ['db-table', 'db-query'] },
  { id: 'db-transaction', title: '事务', preceding: ['db-table', 'db-query', 'db-index'] },
  { id: 'db-model', title: '建模与安全', preceding: ['db-table', 'db-query', 'db-index', 'db-transaction'] },
];

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'desktop') await page.setViewportSize({ width: 1440, height: 1000 });
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => {
    if (message.type() === 'error') throw new Error(message.text());
  });
});

async function captureGuide(page: Page, testInfo: TestInfo, chapter: typeof chapters[number]) {
  await expect(page).toHaveTitle(/记忆芯/);
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);
  await expect(page.locator('main')).toHaveCSS('opacity', '1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath(chapter.id + '-top.png'), animations: 'disabled' });
  await page.screenshot({ path: testInfo.outputPath(chapter.id + '-full.png'), fullPage: true, animations: 'disabled' });
  const concept = page.getByRole('region', { name: chapter.title + '概念图' });
  await expect(concept.getByRole('img')).toHaveAccessibleName(/.+/);
  await concept.scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath(chapter.id + '-concept.png'), animations: 'disabled' });
  const lastLink = page.locator('main').getByRole('link').last();
  await lastLink.scrollIntoViewIfNeeded();
  await expect(lastLink).toBeInViewport();
  expect(await lastLink.evaluate((link) => {
    const bounds = link.getBoundingClientRect();
    return link.contains(document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2));
  })).toBe(true);
  await page.screenshot({ path: testInfo.outputPath(chapter.id + '-bottom.png'), animations: 'disabled' });
}

for (const chapter of chapters) {
  test(chapter.id + ': prerequisite-only save supports guide wiki round trip without writes', async ({ page }, testInfo) => {
    const save = await exportSave(page);
    save.progress = Object.fromEntries(chapter.preceding.flatMap((chapterId) =>
      ['01', '02', '03', '04'].map((suffix) => {
        const cardId = chapterId + '-' + suffix;
        return [cardId, { cardId, box: 4 as const, dueAt: 1900000000000,
          lastReviewedAt: 1794000000000, lapses: 0 }];
      }),
    ));
    if (chapter.preceding.length) await importSave(page, save);
    const before = await exportSave(page);
    expect(Object.keys(before.progress)).toHaveLength(chapter.preceding.length * 4);
    await page.goto('/map/database');
    await page.getByRole('link', { name: '章节导读', exact: true })
      .and(page.locator('a[href="/map/database/' + chapter.id + '"]')).click();
    await expect(page).toHaveURL('/map/database/' + chapter.id);
    await expect(page.getByRole('heading', { level: 1, name: chapter.title + ' · 章节导读' })).toBeVisible();
    await expect(page.getByRole('link', { name: /^查看知识卡：/ })).toHaveCount(4);
    await expect(page.getByRole('link', { name: '开始本章学习', exact: true })).toHaveAttribute('href', '/study?chapter=' + chapter.id);
    await page.reload();
    await captureGuide(page, testInfo, chapter);
    for (const suffix of ['01', '02', '03', '04']) {
      const card = getCard(chapter.id + '-' + suffix)!;
      await page.getByRole('link', { name: '查看知识卡：' + card.title, exact: true }).click();
      await expect(page).toHaveURL('/wiki/' + card.id);
      await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
      await page.reload();
      await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
      const diagram = page.locator('main svg[role="img"]');
      await expect(diagram).toHaveAccessibleName(/.+/);
      for (const step of card.steps) {
        const toggle = page.getByRole('button').filter({ hasText: step.caption });
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-pressed', 'true');
        await expect(diagram.locator('.dg-on')).toHaveCount(step.focus.length);
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-pressed', 'false');
        await expect(diagram.locator('.dg-dim')).toHaveCount(0);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator('main')).toHaveCSS('opacity', '1');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(card.id + '-wiki.png'), animations: 'disabled' });
      await page.getByRole('button', { name: /^[ABCD]/ }).filter({ hasText: card.options[card.answerIndex] }).click();
      await expect(page.getByText(/^答对了。/)).toBeVisible();
      await page.getByRole('button', { name: '重做', exact: true }).click();
      await page.getByRole('link', { name: '阅读本章导读与贯穿案例', exact: true }).click();
      await expect(page).toHaveURL('/map/database/' + chapter.id);
      await expect(page.getByRole('heading', { level: 1, name: chapter.title + ' · 章节导读' })).toBeVisible();
    }
    await page.getByRole('link', { name: '返回章节路径', exact: true }).click();
    await expect(page).toHaveURL('/map/database');
    await expect(page.getByRole('list', { name: '数据库章节路径' })).toBeVisible();
    expect(await exportSave(page)).toEqual(before);
  });
}

for (const chapter of chapters.slice(1)) {
  test(chapter.id + ': new save stays locked after reading wiki and refreshing', async ({ page }) => {
    const before = await exportSave(page);
    expect(before.progress).toEqual({});
    await page.goto('/map/database/' + chapter.id);
    await expect(page.getByRole('heading', { name: '章节尚未解锁' })).toBeVisible();
    await expect(page.getByRole('link', { name: '开始本章学习', exact: true })).toHaveCount(0);
    const card = getCard(chapter.id + '-01')!;
    await page.goto('/wiki/' + card.id);
    await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /去学|阅读本章导读与贯穿案例/ })).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /去学|阅读本章导读与贯穿案例/ })).toHaveCount(0);
    await page.goto('/map/database/' + chapter.id);
    await page.reload();
    await expect(page.getByRole('heading', { name: '章节尚未解锁' })).toBeVisible();
    await expect(page.getByRole('link', { name: '开始本章学习', exact: true })).toHaveCount(0);
    expect(await exportSave(page)).toEqual(before);
  });
}
