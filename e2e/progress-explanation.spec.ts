import { test, expect, type Page } from '@playwright/test';
import { TRACKS } from '../src/content';
import type { AppState } from '../src/store/useStore';
import { exportSave, importSave } from './helpers/save';

test.use({ timezoneId: 'Asia/Shanghai', serviceWorkers: 'block' });

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => {
    if (message.type() === 'error') throw new Error(message.text());
  });
});

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

async function screenshot(page: Page, path: string) {
  await expect(page.getByRole('main')).toHaveCSS('opacity', '1');
  const chapters = page.getByRole('listitem').filter({ has: page.locator('svg circle') });
  if (await chapters.count()) await expect(chapters.last()).toHaveCSS('opacity', '1');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path, fullPage: true });
}

for (const { studied, mastered, action } of [
  { studied: 0, mastered: 0, action: '开始' },
  { studied: 2, mastered: 0, action: '继续学习' },
  { studied: 4, mastered: 0, action: '继续复习' },
  { studied: 4, mastered: 4, action: null },
]) {
  test(`progress ${studied} studied / ${mastered} mastered stays read-only across routes and reload`, async ({ page }, testInfo) => {
    const save = await exportSave(page);
    save.settings = { ...save.settings, sound: false, reducedMotion: true };
    const cards = TRACKS[0].cards.filter((card) => card.chapter === 'hw-cpu');
    const now = Date.now();
    save.progress = Object.fromEntries(cards.slice(0, studied).map((card) => [card.id, {
      cardId: card.id, box: mastered === 4 ? 4 : 1,
      dueAt: now + 86400000,
      lastReviewedAt: now - 1000, lapses: 0,
    }]));
    await importSave(page, save);
    expect(await readDisk(page)).toEqual(save);
    for (const route of ['/', '/map', '/map/hardware']) {
      await page.goto(route);
      const surface = route === '/map/hardware' ? page.getByRole('main') : page.getByRole('link', { name: /硬件与原理/ });
      await expect(surface.getByText(`已学过 ${studied}/20 · 已记牢 ${mastered}/20`, { exact: true })).toBeVisible();
      if (route === '/') {
        await expect(page.getByRole('progressbar', { name: '硬件与原理记牢进度' })).toHaveAttribute('aria-valuenow', String(mastered));
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect(await readDisk(page)).toEqual(save);
    }
    const chapter = page.getByRole('link', { name: new RegExp(`^计算机组成（.*已学过 ${studied}/4，已记牢 ${mastered}/4）$`) });
    await expect(chapter).toBeVisible();
    if (action) await expect(chapter.getByText(action, { exact: true })).toBeVisible();
    if (mastered < 4) {
      await expect(page.getByText(`先记牢《计算机组成》全部卡片（已记牢 ${mastered}/4）`, { exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: /^二进制与编码（/ })).toHaveCount(0);
    } else {
      await expect(page.getByRole('link', { name: /^二进制与编码（/ })).toBeVisible();
      await expect(page.getByLabel('已通关', { exact: true })).toHaveCount(1);
    }
    await screenshot(page, testInfo.outputPath('chapter-progress.png'));
    await page.reload();
    await expect(chapter).toBeVisible();
    expect(await readDisk(page)).toEqual(save);
    if (mastered < 4) {
      await page.goto('/study?chapter=hw-binary');
      await expect(page.getByText('本章尚未解锁，需先记牢前一章的全部卡片。已学过不等于已记牢。', { exact: true })).toBeVisible();
      expect(await readDisk(page)).toEqual(save);
    }
    expect(await exportSave(page)).toEqual(save);
  });
}

test('first round persists studied cards without mastery or next-chapter unlock', async ({ page }, testInfo) => {
  const save = await exportSave(page);
  save.settings = { ...save.settings, sound: false, reducedMotion: true };
  await importSave(page, save);
  await page.goto('/map/hardware');
  await page.getByRole('link', { name: /^计算机组成（/ }).click();
  const cards = TRACKS[0].cards.filter((card) => card.chapter === 'hw-cpu');
  for (const card of cards) {
    await expect(page.getByRole('heading', { name: card.title, exact: true })).toBeVisible();
    for (const step of card.steps) {
      await expect(page.getByText(step.caption, { exact: true })).toBeVisible();
      await page.getByRole('button', { name: /看下一步|懂了，考考我/ }).click();
    }
    await page.getByRole('button', { name: /^[ABCD]\./ }).nth(card.answerIndex).click();
    await page.getByRole('button', { name: /下一张|完成/ }).click();
  }
  await expect(page.getByRole('heading', { name: '这一轮清空了！' })).toBeVisible();
  await expect(page.getByText(/完成一轮不等于通关/)).toBeVisible();
  await expect(page.getByRole('link', { name: '回章节地图', exact: true }).locator('..')).toHaveCSS('opacity', '1');
  await screenshot(page, testInfo.outputPath('round-completed.png'));
  await expect.poll(async () => (await readDisk(page)).session.completed).toBe(true);
  const completed = await readDisk(page);
  expect(Object.keys(completed.progress)).toHaveLength(4);
  expect(Object.values(completed.progress).every((progress) => progress.box === 1 && progress.lastReviewedAt !== null)).toBe(true);
  await page.getByRole('link', { name: '回章节地图', exact: true }).click();
  for (const reload of [false, true]) {
    if (reload) await page.reload();
    await expect(page.getByRole('link', { name: '计算机组成（学习中，已学过 4/4，已记牢 0/4）' })).toBeVisible();
    await expect(page.getByText('继续复习', { exact: true })).toBeVisible();
    await expect(page.getByLabel('未解锁', { exact: true })).toHaveCount(4);
    expect(await readDisk(page)).toEqual(completed);
  }
  await screenshot(page, testInfo.outputPath('after-reload.png'));
  expect(await exportSave(page)).toEqual(completed);
});
