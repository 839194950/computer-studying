import { test, expect, type Page } from '@playwright/test';
import { ALL_CARDS, getCard } from '../src/content';
import type { AppState } from '../src/store/useStore';
import { exportSave, importSave } from './helpers/save';

const before = new Date('2026-11-09T23:59:50+08:00');
const midnight = new Date('2026-11-10T00:00:00+08:00').getTime();
const later = new Date('2027-02-01T00:00:00+08:00').getTime();
const card = getCard('hw-cpu-01')!;

test.use({ timezoneId: 'Asia/Shanghai', serviceWorkers: 'block' });

test.beforeEach(({ page }) => {
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => {
    if (message.type() === 'error') throw new Error(message.text());
  });
});

async function seed(page: Page) {
  const save = await exportSave(page);
  save.settings = { ...save.settings, sound: false, reducedMotion: true };
  save.progress = Object.fromEntries(ALL_CARDS.map((item) => [item.id, {
    cardId: item.id, box: 4, dueAt: later, lastReviewedAt: before.getTime() - 1000, lapses: 0,
  }]));
  save.progress[card.id].dueAt = midnight;
  save.session = { date: '2026-11-09', reviewed: ['hw-cpu-02'], wrongs: {}, completed: false };
  save.streak = { current: 3, longest: 5, lastActiveDate: '2026-11-08' };
  save.xp = 30;
  save.daily = { '2026-11-09': { xp: 30, correct: 3, bestCombo: 3 } };
  await importSave(page, save);
  return save;
}

async function readDisk(page: Page): Promise<AppState> {
  return page.evaluate(async () => new Promise<AppState>((resolve, reject) => {
    const opening = indexedDB.open('keyval-store');
    opening.onerror = () => reject(opening.error);
    opening.onsuccess = () => {
      const database = opening.result;
      const transaction = database.transaction('keyval', 'readonly');
      const request = transaction.objectStore('keyval').get('memory-chip');
      transaction.oncomplete = () => {
        database.close();
        try { resolve(JSON.parse(request.result).state); } catch (error) { reject(error); }
      };
      transaction.onabort = () => { database.close(); reject(transaction.error); };
    };
  }));
}

async function expectNewDay(page: Page) {
  await expect(page.getByRole('link', { name: '开始今天的复习 · 1 张', exact: true })).toBeVisible();
  await expect(page.getByText('已复习 0 张 · 共 100 张知识卡', { exact: true })).toBeVisible();
  await expect(page.getByRole('progressbar', { name: '每日经验目标' })).toHaveAttribute('aria-valuenow', '0');
  await expect(page.locator('[title="连续打卡"]:visible')).toHaveText('0 天');
  await expect(page).toHaveTitle(/记忆芯/);
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test('home left open updates at local midnight without writing the save', async ({ page }, testInfo) => {
  await page.clock.install({ time: before });
  await page.clock.pauseAt(before);
  const save = await seed(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '今天的队列已经清空', exact: true })).toBeVisible();
  await expect(page.locator('[title="连续打卡"]:visible')).toHaveText('3 天');
  await page.clock.runFor(11000);
  expect(await page.evaluate(() => Date.now())).toBe(midnight + 1000);
  await expectNewDay(page);
  expect(await readDisk(page)).toEqual(save);
  await page.screenshot({ path: testInfo.outputPath('midnight-updated.png'), animations: 'disabled' });
  expect(await exportSave(page)).toEqual(save);
});

for (const event of ['focus', 'visibilitychange'] as const) {
  test(`home catches up on ${event} after the midnight timer was missed`, async ({ page }) => {
    await page.clock.setFixedTime(before);
    const save = await seed(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: '今天的队列已经清空', exact: true })).toBeVisible();
    await page.clock.setFixedTime(new Date('2026-11-10T09:00:00+08:00'));
    await page.evaluate((name) => {
      if (name === 'focus') window.dispatchEvent(new Event(name));
      else document.dispatchEvent(new Event(name));
    }, event);
    await expectNewDay(page);
    expect(await readDisk(page)).toEqual(save);
  });
}

for (const phase of ['explain', 'question', 'feedback'] as const) {
  test(`midnight and foreground events do not reset an active ${phase} phase`, async ({ page }) => {
    await page.clock.install({ time: before });
    await page.clock.pauseAt(before);
    await seed(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: '今天的队列已经清空', exact: true })).toBeVisible();
    await page.goto('/study?chapter=hw-cpu&free=1');
    await expect(page.getByRole('heading', { name: card.title, exact: true })).toBeVisible();
    if (phase === 'explain') {
      await page.getByRole('button', { name: '看下一步', exact: true }).click();
      await expect(page.getByText(card.steps[1].caption, { exact: true })).toBeVisible();
    } else {
      for (const step of card.steps) {
        await expect(page.getByText(step.caption, { exact: true })).toBeVisible();
        await page.getByRole('button', { name: /看下一步|懂了，考考我/ }).click();
      }
      await expect(page.getByRole('heading', { name: card.question, exact: true })).toBeVisible();
      if (phase === 'feedback') {
        await page.getByRole('button', { name: /^[ABCD]\./ }).nth(card.answerIndex).click();
        await expect.poll(async () => (await readDisk(page)).xp).toBe(40);
        await expect(page.getByRole('button', { name: '下一张', exact: true })).toBeVisible();
      }
    }
    const saved = await readDisk(page);
    await page.clock.runFor(11000);
    await page.evaluate(() => {
      window.dispatchEvent(new Event('focus'));
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(page.getByText('1/4', { exact: true })).toBeVisible();
    if (phase === 'explain') await expect(page.getByText(card.steps[1].caption, { exact: true })).toBeVisible();
    else {
      await expect(page.getByRole('heading', { name: card.question, exact: true })).toBeVisible();
      if (phase === 'question') await expect(page.getByRole('button', { name: /^[ABCD]\./ }).first()).toBeEnabled();
      else await expect(page.getByRole('button', { name: '下一张', exact: true })).toBeVisible();
    }
    expect(await readDisk(page)).toEqual(saved);
    expect(await exportSave(page)).toEqual(saved);
  });
}
