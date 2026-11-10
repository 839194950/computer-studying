import { test, expect, type Page } from '@playwright/test';
import { getCard } from '../src/content';
import { exportSave, importSave } from './helpers/save';

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => {
    if (message.type() === 'error') throw new Error(message.text());
  });
});

async function seedProgress(page: Page, ids: string[], box: 1 | 2 | 3 | 4 | 5, overrides: Partial<{ dueAt: number; lapses: number }> = {}) {
  const save = await exportSave(page);
  save.progress = Object.fromEntries(ids.map((cardId) => [cardId, {
    cardId,
    box,
    dueAt: overrides.dueAt ?? 1900000000000,
    lastReviewedAt: 1794000000000,
    lapses: overrides.lapses ?? 0,
  }]));
  save.settings = { ...save.settings, newCardsPerDay: 2, reducedMotion: true, sound: false };
  await importSave(page, save);
  return save;
}

async function answerCard(page: Page, cardId: string, correct: boolean) {
  const card = getCard(cardId)!;
  await expect(page.getByRole('heading', { name: card.title, exact: true })).toBeVisible();
  for (const step of card.steps) {
    await expect(page.getByText(step.caption, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: /看下一步|懂了，考考我/ }).click();
  }
  await expect(page.getByRole('heading', { name: card.question, exact: true })).toBeVisible();
  await page.getByRole('button', { name: /^[ABCD]\./ }).nth(correct ? card.answerIndex : (card.answerIndex + 1) % 4).click();
  await page.getByRole('button', { name: /下一张|完成/ }).click();
}

async function checkPage(page: Page) {
  await expect(page).toHaveTitle(/记忆芯/);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test('chapter queue follows the visible direct-previous-chapter unlock rule', async ({ page }, testInfo) => {
  const save = await seedProgress(page, ['os-memory-01', 'os-memory-02', 'os-memory-03', 'os-memory-04'], 4);
  await page.goto('/map/os');
  await page.getByRole('link', { name: /文件系统/ }).click();
  await expect(page).toHaveURL('/study?chapter=os-fs');
  await expect(page.getByRole('heading', { name: getCard('os-fs-01')!.title, exact: true })).toBeVisible();
  expect(await exportSave(page)).toEqual(save);
  await page.goto('/study?chapter=os-fs');
  await page.reload();
  await expect(page.getByRole('heading', { name: getCard('os-fs-01')!.title, exact: true })).toBeVisible();
  await checkPage(page);
  await page.screenshot({ path: testInfo.outputPath('unlocked-chapter.png'), animations: 'disabled' });
  await answerCard(page, 'os-fs-01', true);
  await answerCard(page, 'os-fs-02', true);
  await expect(page.getByRole('heading', { name: '这一轮清空了！' })).toBeVisible();
  const after = await exportSave(page);
  expect(Object.keys(after.progress).sort()).toEqual([...Object.keys(save.progress), 'os-fs-01', 'os-fs-02'].sort());
  for (const cardId of Object.keys(save.progress)) expect(after.progress[cardId]).toEqual(save.progress[cardId]);
  expect(after.progress['os-fs-01'].box).toBe(1);
  expect(after.progress['os-fs-02'].box).toBe(1);
  expect(after.xp).toBe(save.xp + 35);
  await page.reload();
  expect(await exportSave(page)).toEqual(after);
});

test('daily queue keeps due cards first and respects the new-card limit', async ({ page }, testInfo) => {
  const save = await seedProgress(page, ['hw-cpu-01'], 2, { dueAt: 1 });
  await page.goto('/study');
  await expect(page.getByRole('heading', { name: getCard('hw-cpu-01')!.title, exact: true })).toBeVisible();
  expect(await exportSave(page)).toEqual(save);
  await page.goto('/study');
  await answerCard(page, 'hw-cpu-01', true);
  await answerCard(page, 'lang-var-01', true);
  await answerCard(page, 'lang-var-02', true);
  await expect(page.getByRole('heading', { name: '这一轮清空了！' })).toBeVisible();
  await checkPage(page);
  await page.screenshot({ path: testInfo.outputPath('daily-completed.png'), animations: 'disabled' });
  const after = await exportSave(page);
  expect(Object.keys(after.progress).sort()).toEqual(['hw-cpu-01', 'lang-var-01', 'lang-var-02']);
  expect(after.progress['hw-cpu-01'].box).toBe(3);
  expect(after.progress['lang-var-01'].box).toBe(1);
  expect(after.progress['lang-var-02'].box).toBe(1);
  expect(after.session.reviewed).toEqual(['hw-cpu-01', 'lang-var-01', 'lang-var-02']);
  expect(after.xp).toBe(save.xp + 50);
  expect(after.settings).toEqual(save.settings);
  await page.reload();
  expect(await exportSave(page)).toEqual(after);
});

test('weak queue requeues a wrong card and stops after its second wrong answer', async ({ page }, testInfo) => {
  const save = await seedProgress(page, ['sec-auth-03', 'os-perm-01'], 2, { lapses: 1 });
  save.progress['sec-auth-03'].lapses = 3;
  save.progress['hw-cpu-01'] = { cardId: 'hw-cpu-01', box: 4, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 8 };
  save.progress['hw-cpu-02'] = { cardId: 'hw-cpu-02', box: 2, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 0 };
  await importSave(page, save);
  await page.goto('/study?mode=weak');
  await expect(page.getByRole('heading', { name: getCard('sec-auth-03')!.title, exact: true })).toBeVisible();
  await answerCard(page, 'sec-auth-03', false);
  await answerCard(page, 'os-perm-01', true);
  await answerCard(page, 'sec-auth-03', false);
  await expect(page.getByRole('heading', { name: '这一轮清空了！' })).toBeVisible();
  await checkPage(page);
  await page.screenshot({ path: testInfo.outputPath('weak-completed.png'), animations: 'disabled' });
  const after = await exportSave(page);
  expect(Object.keys(after.progress).sort()).toEqual(Object.keys(save.progress).sort());
  expect(after.progress['hw-cpu-01']).toEqual(save.progress['hw-cpu-01']);
  expect(after.progress['hw-cpu-02']).toEqual(save.progress['hw-cpu-02']);
  expect(after.progress['os-perm-01'].box).toBe(3);
  expect(after.progress['sec-auth-03'].box).toBe(1);
  expect(after.progress['sec-auth-03'].lapses).toBe(5);
  expect(after.session.wrongs).toEqual({ 'sec-auth-03': 2 });
  expect(after.session.reviewed).toEqual(['sec-auth-03', 'os-perm-01']);
  expect(after.progress['sec-auth-03'].dueAt).toBeGreaterThan(after.progress['sec-auth-03'].lastReviewedAt!);
  expect(after.xp).toBe(save.xp + 25);
  expect(after.settings).toEqual(save.settings);
  await page.reload();
  expect(await exportSave(page)).toEqual(after);
});

test('invalid chapter stays isolated from the daily queue', async ({ page }, testInfo) => {
  const before = await seedProgress(page, ['hw-cpu-01'], 2, { dueAt: 1 });
  for (const path of ['/study?chapter=not-a-real-chapter', '/study?chapter=unknown&free=1', '/study?chapter=']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: '未找到这个章节', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: '再练一遍' })).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole('heading', { name: '未找到这个章节', exact: true })).toBeVisible();
    await checkPage(page);
    await page.screenshot({ path: testInfo.outputPath(`invalid-${encodeURIComponent(path)}.png`), animations: 'disabled' });
    await page.getByRole('link', { name: '回学习台', exact: true }).click();
    await expect(page).toHaveURL('/');
    expect(await exportSave(page)).toEqual(before);
  }
});
