import { test, expect, type Page } from '@playwright/test';
import { ALL_CARDS } from '../src/content';
import { readFileSync, readdirSync } from 'node:fs';
import { exportSave, importSave } from './helpers/save';

const catalogDir = new URL('../src/i18n/en/', import.meta.url);
const english: Record<string, string> = Object.assign({}, ...readdirSync(catalogDir)
  .filter(name => name.endsWith('.json')).map(name => JSON.parse(readFileSync(new URL(name, catalogDir), 'utf8'))));
const en = (source: string) => english[source] ?? source;

async function switchTo(page: Page, language: 'en' | 'zh') {
  await page.getByRole('button', { name: language === 'en' ? 'Switch to English' : '切换到中文', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', language === 'en' ? 'en' : 'zh-CN');
}

async function exportEnglishSave(page: Page) {
  await page.goto('/settings');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export data', exact: true }).click();
  const stream = await (await downloading).createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

test('English persists, searches detailed content and preserves the complete learning save', async ({ page }) => {
  const save = await exportSave(page);
  save.xp = 125;
  save.settings = { ...save.settings, reducedMotion: true, sound: false };
  save.progress['db-table-01'] = { cardId: 'db-table-01', box: 3, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 2 };
  await importSave(page, save);
  await switchTo(page, 'en');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Learning preferences' })).toBeVisible();
  await expect(page).toHaveTitle('Memory Chip · Make computer science stick');
  await page.goto('/wiki');
  await page.getByRole('searchbox').fill('temporal dead zone');
  await expect(page.locator('a[href="/wiki/lang-scope-01"]')).toBeVisible();
  await page.getByRole('searchbox').fill('copy-on-write');
  await expect(page.locator('a[href="/wiki/os-thread-01"]')).toBeVisible();
  await page.goto('/map/hardware');
  await expect(page.getByLabel('Locked', { exact: true })).toHaveCount(4);
  await page.goto('/map/hardware/hw-cpu');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(en('计算机组成'));
  expect(await exportEnglishSave(page)).toEqual(save);
  await switchTo(page, 'zh');
  await page.reload();
  await expect(page.getByRole('heading', { name: '学习偏好' })).toBeVisible();
  expect(await exportSave(page)).toEqual(save);
});

test('switching during a lesson and feedback keeps the current step and awards XP once', async ({ page }) => {
  const save = await exportSave(page);
  save.settings = { ...save.settings, reducedMotion: true, sound: false };
  await importSave(page, save);
  await page.goto('/study?chapter=hw-cpu');
  const cards = ALL_CARDS.filter(card => card.chapter === 'hw-cpu');
  await page.getByRole('button', { name: '看下一步', exact: true }).click();
  const toggle = page.getByRole('button', { name: 'Switch to English' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByText(en(cards[0].steps[1].caption), { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /^[ABCD]\./ })).toHaveCount(0);
  for (const [index, card] of cards.entries()) {
    for (let step = index === 0 ? 1 : 0; step < card.steps.length; step++) {
      await page.getByRole('button', { name: step === card.steps.length - 1 ? en('懂了，考考我') : en('看下一步'), exact: true }).click();
    }
    await expect(page.getByRole('heading', { name: en(card.question), exact: true })).toBeVisible();
    await page.getByRole('button', { name: /^[ABCD]\./ }).nth(card.answerIndex).click();
    await expect(page.getByText(en(card.explanation), { exact: true })).toBeVisible();
    if (index === 0) {
      await switchTo(page, 'zh');
      await expect(page.getByText(card.explanation, { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: /^[ABCD]\./ }).nth(card.answerIndex)).toBeDisabled();
      await switchTo(page, 'en');
      await expect(page.getByText(en(card.explanation), { exact: true })).toBeVisible();
    }
    await page.getByRole('button', { name: index === cards.length - 1 ? en('完成') : en('下一张'), exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: en('这一轮清空了！') })).toBeVisible();
  await switchTo(page, 'zh');
  await expect(page.getByRole('heading', { name: '这一轮清空了！' })).toBeVisible();
  await switchTo(page, 'en');
  const after = await exportEnglishSave(page);
  expect(after.xp).toBe(65);
  expect(Object.keys(after.progress).sort()).toEqual(cards.map(card => card.id).sort());
  expect(after.session.reviewed).toHaveLength(4);
  expect(after.daily[after.session.date]).toMatchObject({ xp: 65, correct: 4, bestCombo: 4 });
});

test('wiki highlights and selected quiz answers survive language changes without changing progress', async ({ page }) => {
  const before = await exportSave(page);
  await page.goto('/wiki/hw-cpu-01');
  const card = ALL_CARDS.find(card => card.id === 'hw-cpu-01')!;
  await page.getByRole('button').filter({ hasText: card.steps[1].caption }).click();
  await expect(page.getByRole('button').filter({ hasText: card.steps[1].caption })).toHaveAttribute('aria-pressed', 'true');
  await page.locator('section').filter({ has: page.getByRole('heading', { name: /小测一下/ }) }).getByRole('button').nth(card.answerIndex).click();
  await switchTo(page, 'en');
  await expect(page.getByRole('button').filter({ hasText: en(card.steps[1].caption) })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText(en(card.explanation), { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again', exact: true })).toBeVisible();
  expect(await exportEnglishSave(page)).toEqual(before);
});

test('both labs retain their controls and results across language switches', async ({ page }) => {
  const before = await exportSave(page);
  await switchTo(page, 'en');
  await page.goto('/labs/binary');
  await page.getByRole('button', { name: 'Preset 255', exact: true }).click();
  await expect(page.locator('span.font-mono').filter({ hasText: /^-1$/ })).toBeVisible();
  await switchTo(page, 'zh');
  await expect(page.locator('span.font-mono').filter({ hasText: /^-1$/ })).toBeVisible();
  await switchTo(page, 'en');
  await page.getByRole('button', { name: 'Toggle b0', exact: true }).click();
  await expect(page.locator('span.font-mono').filter({ hasText: /^-2$/ })).toBeVisible();
  await page.goto('/labs/index');
  await page.getByRole('textbox').fill('42');
  for (let i = 0; i < 9; i++) await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(page.getByText('Result: Not found', { exact: true })).toHaveCount(2);
  await switchTo(page, 'zh');
  await expect(page.getByRole('textbox')).toHaveValue('42');
  await switchTo(page, 'en');
  await page.getByRole('textbox').fill('1.5');
  await expect(page.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('button', { name: 'Next step', exact: true })).toBeDisabled();
  expect(await exportEnglishSave(page)).toEqual(before);
});

test('an existing import error translates immediately when switching languages', async ({ page }) => {
  await page.goto('/settings');
  await page.getByLabel('导入数据', { exact: true }).setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{') });
  await expect(page.getByRole('status')).toContainText('文件不是合法的 JSON');
  await switchTo(page, 'en');
  await expect(page.getByRole('status')).toHaveText('Import failed: The file is not valid JSON');
  await page.getByRole('button', { name: 'Clear all progress', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Confirm clear', exact: true })).toBeVisible();
  await switchTo(page, 'zh');
  await expect(page.getByRole('button', { name: '确认清空', exact: true })).toBeVisible();
});

test('a failed English download leaves Chinese usable and offers a working retry', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /开始今天的复习/ })).toBeVisible();
  await page.route('**/*', route => route.request().resourceType() === 'script' ? route.abort() : route.continue());
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.getByRole('alert')).toContainText('英文内容加载失败');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await page.unroute('**/*');
  await switchTo(page, 'en');
  await expect(page.getByRole('link', { name: /Start today's review/ })).toBeVisible();
});
