import { test, expect, type Page, type TestInfo } from '@playwright/test';
import { getCard } from '../src/content';
import { exportSave, importSave } from './helpers/save';

const cardIds = ['sec-tls-01', 'sec-tls-02', 'sec-tls-03', 'sec-tls-04'];
const answerIndices = [1, 1, 1, 1];

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'desktop') await page.setViewportSize({ width: 1440, height: 1000 });
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => {
    if (message.type() === 'error') throw new Error(message.text());
  });
});

async function checkPage(page: Page) {
  await expect(page).toHaveTitle(/记忆芯/);
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);
  await expect(page.locator('main')).toHaveCSS('opacity', '1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

async function captureGuide(page: Page, testInfo: TestInfo) {
  await checkPage(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath('tls-top.png'), animations: 'disabled' });
  await page.screenshot({ path: testInfo.outputPath('tls-full.png'), fullPage: true, animations: 'disabled' });
  const concept = page.getByRole('region', { name: '传输与证书概念图' });
  await expect(concept.getByRole('img')).toHaveAccessibleName(/TLS.*握手/);
  await concept.scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('tls-concept.png'), animations: 'disabled' });
  const start = page.getByRole('link', { name: '开始本章学习', exact: true });
  await start.scrollIntoViewIfNeeded();
  await expect(start).toBeInViewport();
  expect(await start.evaluate((link) => {
    const bounds = link.getBoundingClientRect();
    return link.contains(document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2));
  })).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('tls-bottom.png'), animations: 'disabled' });
}

test('tls: unlocked guide visits all four cards without changing the complete save', async ({ page }, testInfo) => {
  const save = await exportSave(page);
  save.progress = Object.fromEntries(
    ['sec-xss-01', 'sec-web-02', 'sec-web-03', 'sec-web-04'].map((cardId) => {
      return [cardId, { cardId, box: 4 as const, dueAt: 1900000000000,
        lastReviewedAt: 1794000000000, lapses: 0 }];
    }),
  );
  save.xp = 125;
  save.settings = { ...save.settings, newCardsPerDay: 6, reducedMotion: true, sound: false };
  save.streak = { current: 2, longest: 3, lastActiveDate: save.session.date };
  save.daily = { [save.session.date]: { xp: 25, correct: 2, bestCombo: 2 } };
  await importSave(page, save);
  const before = await exportSave(page);
  expect(Object.keys(before.progress)).toHaveLength(4);
  for (const cardId of cardIds) expect(before.progress[cardId]).toBeUndefined();
  await page.goto('/map/security');
  const entry = page.getByRole('region', { name: '传输与证书导读入口' });
  await expect(page.getByRole('list', { name: '网络安全章节路径' }).getByRole('link', { name: /传输与证书/ }))
    .toHaveAttribute('href', '/study?chapter=sec-tls');
  await entry.getByRole('link', { name: '打开章节导读', exact: true }).click();
  await expect(page).toHaveURL('/map/security/sec-tls');
  await expect(page.getByRole('heading', { level: 1, name: '传输与证书 · 章节导读' })).toBeVisible();
  await expect(page.getByRole('link', { name: /^查看知识卡：/ })).toHaveCount(4);
  await expect(page.getByRole('link', { name: '开始本章学习', exact: true }))
    .toHaveAttribute('href', '/study?chapter=sec-tls');
  await expect(page.locator('main a[href^="/labs/"]')).toHaveCount(0);
  await page.reload();
  await captureGuide(page, testInfo);
  for (const [index, cardId] of cardIds.entries()) {
    const card = getCard(cardId)!;
    await page.getByRole('link', { name: '查看知识卡：' + card.title, exact: true }).click();
    await expect(page).toHaveURL('/wiki/' + cardId);
    await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
    const diagram = page.locator('main svg[role="img"]');
    await expect(diagram).toHaveAccessibleName(/TLS.*握手/);
    for (const step of card.steps) {
      const toggle = page.getByRole('button').filter({ hasText: step.caption });
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      await expect(diagram.locator('.dg-on')).toHaveCount(step.focus.length);
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
      await expect(diagram.locator('.dg-dim')).toHaveCount(0);
    }
    await checkPage(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath(cardId + '-wiki.png'), animations: 'disabled' });
    const details = page.locator('section').filter({ has: page.getByRole('heading', { name: '详细讲解', exact: true }) });
    await details.evaluate((section) => section.scrollIntoView({ block: 'center' }));
    await details.screenshot({ path: testInfo.outputPath(cardId + '-details.png'), animations: 'disabled' });
    const quiz = page.locator('section').filter({ has: page.getByRole('heading', { name: /小测一下/ }) });
    await quiz.screenshot({ path: testInfo.outputPath(cardId + '-quiz.png'), animations: 'disabled' });
    await quiz.getByRole('button').nth(answerIndices[index]).click();
    await expect(page.getByText(/^答对了。/)).toBeVisible();
    await quiz.screenshot({ path: testInfo.outputPath(cardId + '-feedback.png'), animations: 'disabled' });
    await page.getByRole('button', { name: '重做', exact: true }).click();
    await expect(quiz.getByRole('button').first()).toBeEnabled();
    await page.getByRole('link', { name: '阅读本章导读与贯穿案例', exact: true }).click();
    await expect(page).toHaveURL('/map/security/sec-tls');
    await expect(page.getByRole('heading', { level: 1, name: '传输与证书 · 章节导读' })).toBeVisible();
  }
  await page.getByRole('link', { name: '返回章节路径', exact: true }).click();
  await expect(page).toHaveURL('/map/security');
  await expect(page.getByRole('list', { name: '网络安全章节路径' })).toBeVisible();
  expect(await exportSave(page)).toEqual(before);
  await page.reload();
  expect(await exportSave(page)).toEqual(before);
});

test('tls: new save stays locked after all four wiki quizzes and reload', async ({ page }, testInfo) => {
  const before = await exportSave(page);
  expect(before.progress).toEqual({});
  await page.goto('/map/security');
  await expect(page.getByRole('region', { name: '传输与证书导读入口' })).toHaveCount(0);
  await expect(page.locator('a[href="/map/security/sec-tls"]')).toHaveCount(0);
  await page.goto('/map/security/sec-tls');
  await expect(page.getByRole('heading', { name: '章节尚未解锁' })).toBeVisible();
  await expect(page.getByRole('link', { name: '开始本章学习', exact: true })).toHaveCount(0);
  for (const [index, cardId] of cardIds.entries()) {
    const card = getCard(cardId)!;
    await page.goto('/wiki/' + cardId);
    await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /去学|阅读本章导读与贯穿案例/ })).toHaveCount(0);
    await page.getByRole('button', { name: /^[ABCD]/ }).nth(answerIndices[index]).click();
    await expect(page.getByText(/^答对了。/)).toBeVisible();
    await page.getByRole('button', { name: '重做', exact: true }).click();
    await page.reload();
    await expect(page.getByRole('link', { name: /去学|阅读本章导读与贯穿案例/ })).toHaveCount(0);
  }
  await page.goto('/map/security/sec-tls');
  await page.reload();
  await expect(page.getByRole('heading', { name: '章节尚未解锁' })).toBeVisible();
  await expect(page.getByRole('link', { name: '开始本章学习', exact: true })).toHaveCount(0);
  await checkPage(page);
  await page.screenshot({ path: testInfo.outputPath('tls-locked.png'), animations: 'disabled' });
  expect(await exportSave(page)).toEqual(before);
  await page.reload();
  expect(await exportSave(page)).toEqual(before);
});
