import { test, expect, type Page } from '@playwright/test';
import { ALL_CARDS, getCard } from '../src/content';
import type { AppState } from '../src/store/useStore';
import { exportSave, importSave } from './helpers/save';

const now = new Date('2026-11-09T12:00:00+08:00').getTime();
const tomorrow = new Date('2026-11-10T00:00:00+08:00').getTime();
const later = new Date('2026-12-01T00:00:00+08:00').getTime();
const firstCard = getCard('hw-cpu-01')!;
const studyPath = '/study?chapter=hw-cpu';

test.use({ timezoneId: 'Asia/Shanghai', serviceWorkers: 'block' });

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date(now));
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
      request.onerror = () => { database.close(); reject(request.error); };
      transaction.oncomplete = () => {
        database.close();
        try { resolve(JSON.parse(request.result).state); } catch (error) { reject(error); }
      };
      transaction.onabort = () => { database.close(); reject(transaction.error); };
    };
  }));
}

async function seed(page: Page, singleNew = false) {
  const save = await exportSave(page);
  save.settings = { ...save.settings, sound: false, reducedMotion: true };
  if (singleNew) {
    save.progress = Object.fromEntries(['hw-cpu-02', 'hw-cpu-03', 'hw-cpu-04'].map((cardId) => [cardId, {
      cardId, box: 1, dueAt: later, lastReviewedAt: now - 1000, lapses: 0,
    }]));
  }
  await importSave(page, save);
  return save;
}

async function explain(page: Page, card = firstCard) {
  await expect(page.getByRole('heading', { name: card.title, exact: true })).toBeVisible();
  for (const step of card.steps) {
    await expect(page.getByText(step.caption, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: /看下一步|懂了，考考我/ }).click();
  }
  await expect(page.getByRole('heading', { name: card.question, exact: true })).toBeVisible();
}

async function assertFirstStep(page: Page) {
  await expect(page.getByRole('heading', { name: firstCard.title, exact: true })).toBeVisible();
  await expect(page.getByText(firstCard.steps[0].caption, { exact: true })).toBeVisible();
}

for (const phase of ['explain', 'question'] as const) {
  test(`${phase}: leaving, back-forward and reload do not save unanswered work`, async ({ page }) => {
    const save = await seed(page);
    await page.goto(studyPath);
    if (phase === 'question') await explain(page);
    else {
      await assertFirstStep(page);
      await page.getByRole('button', { name: '看下一步', exact: true }).click();
      await expect(page.getByText(firstCard.steps[1].caption, { exact: true })).toBeVisible();
    }
    expect(await readDisk(page)).toEqual(save);
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL('/map/hardware');
    await expect(page.getByRole('heading', { name: '硬件与原理 · 章节路径', exact: true })).toBeVisible();
    await page.goBack();
    await assertFirstStep(page);
    await page.goForward();
    await expect(page).toHaveURL('/map/hardware');
    await expect(page.getByRole('heading', { name: '硬件与原理 · 章节路径', exact: true })).toBeVisible();
    await page.locator('a[href="/"]:visible').first().click();
    await page.getByRole('link', { name: /开始今天的复习/ }).click();
    await assertFirstStep(page);
    await page.reload();
    await assertFirstStep(page);
    expect(await readDisk(page)).toEqual(save);
    expect(await exportSave(page)).toEqual(save);
  });
}

test('correct feedback persists exactly once before completion, with no bonus on reload', async ({ page }, testInfo) => {
  const save = await seed(page, true);
  await page.goto(studyPath);
  await explain(page);
  await page.getByRole('button', { name: /^[ABCD]\./ }).nth(firstCard.answerIndex).click();
  await expect(page.getByRole('button', { name: '完成', exact: true })).toBeVisible();
  const expected: AppState = {
    ...save,
    progress: { ...save.progress, 'hw-cpu-01': { cardId: 'hw-cpu-01', box: 1, dueAt: tomorrow, lastReviewedAt: now, lapses: 0 } },
    session: { date: '2026-11-09', reviewed: ['hw-cpu-01'], wrongs: {}, completed: false },
    xp: 10,
    daily: { '2026-11-09': { xp: 10, correct: 1, bestCombo: 1 } },
  };
  await expect.poll(() => readDisk(page)).toEqual(expected);
  await page.screenshot({ path: testInfo.outputPath('saved-feedback.png'), animations: 'disabled' });
  await page.getByRole('link', { name: '计算机组成', exact: true }).click();
  await expect(page.getByRole('heading', { name: '硬件与原理 · 章节路径', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: '这一章今天没有安排', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: '这一章今天没有安排', exact: true })).toBeVisible();
  expect(await readDisk(page)).toEqual(expected);
  expect(await exportSave(page)).toEqual(expected);
});

test('wrong feedback survives reload and same-day wrong count is retained across re-entry', async ({ page }) => {
  const save = await seed(page, true);
  await page.goto(studyPath);
  await explain(page);
  await page.getByRole('button', { name: /^[ABCD]\./ }).nth((firstCard.answerIndex + 1) % 4).click();
  const firstWrong: AppState = {
    ...save,
    progress: { ...save.progress, 'hw-cpu-01': { cardId: 'hw-cpu-01', box: 1, dueAt: now, lastReviewedAt: now, lapses: 1 } },
    session: { date: '2026-11-09', reviewed: ['hw-cpu-01'], wrongs: { 'hw-cpu-01': 1 }, completed: false },
    daily: { '2026-11-09': { xp: 0, correct: 0, bestCombo: 0 } },
  };
  await expect.poll(() => readDisk(page)).toEqual(firstWrong);
  await page.reload();
  await assertFirstStep(page);
  expect(await readDisk(page)).toEqual(firstWrong);
  await explain(page);
  await page.getByRole('button', { name: /^[ABCD]\./ }).nth((firstCard.answerIndex + 1) % 4).click();
  const secondWrong: AppState = {
    ...firstWrong,
    progress: { ...firstWrong.progress, 'hw-cpu-01': { ...firstWrong.progress['hw-cpu-01'], dueAt: tomorrow, lapses: 2 } },
    session: { ...firstWrong.session, wrongs: { 'hw-cpu-01': 2 } },
  };
  await expect.poll(() => readDisk(page)).toEqual(secondWrong);
  await page.reload();
  await expect(page.getByRole('heading', { name: '这一章今天没有安排', exact: true })).toBeVisible();
  expect(await exportSave(page)).toEqual(secondWrong);
});

test('re-entering home after midnight rebuilds due queue without rewriting yesterday save', async ({ page }, testInfo) => {
  const save = await seed(page);
  save.progress = Object.fromEntries(ALL_CARDS.map((card) => [card.id, {
    cardId: card.id, box: 4, dueAt: later, lastReviewedAt: now - 1000, lapses: 0,
  }]));
  save.progress['hw-cpu-01'].dueAt = tomorrow;
  save.session = { date: '2026-11-09', reviewed: ['hw-cpu-01'], wrongs: {}, completed: true };
  save.streak = { current: 1, longest: 1, lastActiveDate: '2026-11-09' };
  save.xp = 30;
  save.daily = { '2026-11-09': { xp: 30, correct: 3, bestCombo: 3 } };
  await importSave(page, save);
  await page.goto('/');
  await expect(page.getByText('已复习 1 张 · 共 100 张知识卡', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '今天的队列已经清空', exact: true })).toBeVisible();
  await page.clock.setFixedTime(new Date(tomorrow));
  await page.locator('a[href="/map"]:visible').first().click();
  await expect(page.getByRole('heading', { name: '章节地图', exact: true })).toBeVisible();
  await page.locator('a[href="/"]:visible').first().click();
  await expect(page.getByText('已复习 0 张 · 共 100 张知识卡', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '开始今天的复习 · 1 张', exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('new-day-home.png'), animations: 'disabled' });
  expect(await readDisk(page)).toEqual(save);
  await page.reload();
  await expect(page.getByRole('link', { name: '开始今天的复习 · 1 张', exact: true })).toBeVisible();
  await page.getByRole('link', { name: '开始今天的复习 · 1 张', exact: true }).click();
  await assertFirstStep(page);
  expect(await exportSave(page)).toEqual(save);
});

test('an open question answered after midnight is saved to the new day exactly once', async ({ page }) => {
  const save = await seed(page, true);
  await page.goto(studyPath);
  await explain(page);
  await page.clock.setFixedTime(new Date(tomorrow));
  await page.getByRole('button', { name: /^[ABCD]\./ }).nth(firstCard.answerIndex).click();
  const expected: AppState = {
    ...save,
    progress: { ...save.progress, 'hw-cpu-01': { cardId: 'hw-cpu-01', box: 1, dueAt: new Date('2026-11-11T00:00:00+08:00').getTime(), lastReviewedAt: tomorrow, lapses: 0 } },
    session: { date: '2026-11-10', reviewed: ['hw-cpu-01'], wrongs: {}, completed: false },
    xp: 10,
    daily: { '2026-11-10': { xp: 10, correct: 1, bestCombo: 1 } },
  };
  await expect.poll(() => readDisk(page)).toEqual(expected);
  await page.reload();
  await expect(page.getByRole('heading', { name: '这一章今天没有安排', exact: true })).toBeVisible();
  expect(await exportSave(page)).toEqual(expected);
});
