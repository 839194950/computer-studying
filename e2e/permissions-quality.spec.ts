import { test, expect, type Page } from '@playwright/test';
import { getCard, getDetail, TRACKS } from '../src/content';
import { exportSave, importSave } from './helpers/save';

const scopes = [
  { track: 'os', chapter: 'os-perm', diagram: '目录权限与用户分组示意图', ids: ['os-perm-01', 'os-perm-03'], answers: [1, 2, 1, 1] },
  { track: 'security', chapter: 'sec-auth', diagram: '认证、会话与资源授权示意图', ids: ['sec-auth-03', 'sec-auth-04'], answers: [1, 0, 1, 1] },
];

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => {
    if (message.type() === 'error') throw new Error(message.text());
  });
});

async function checkPage(page: Page) {
  await expect(page).toHaveTitle(/记忆芯/);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('main')).toHaveCSS('opacity', '1');
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const scope of scopes) {
  test(`${scope.chapter}: wiki quizzes and reload preserve the complete save and locks`, async ({ page }, testInfo) => {
    const before = await exportSave(page);
    for (const cardId of scope.ids) {
      const card = getCard(cardId)!;
      await page.goto(`/wiki/${cardId}`);
      await expect(page).toHaveURL(`/wiki/${cardId}`);
      await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
      const diagram = page.getByRole('img', { name: scope.diagram });
      await expect(diagram).toBeVisible();
      await checkPage(page);
      await page.screenshot({ path: testInfo.outputPath(`${cardId}-top.png`), animations: 'disabled' });
      for (const step of card.steps) {
        const toggle = page.getByRole('button').filter({ hasText: step.caption });
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-pressed', 'true');
        expect(await diagram.locator('.dg-on').count()).toBeGreaterThan(0);
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-pressed', 'false');
        await expect(diagram.locator('.dg-dim')).toHaveCount(0);
      }
      for (const section of getDetail(cardId)) {
        await expect(page.getByRole('heading', { name: section.heading, exact: true })).toBeVisible();
        await expect(page.getByText(section.body, { exact: true })).toBeVisible();
      }
      const details = page.locator('section').filter({ has: page.getByRole('heading', { name: '详细讲解', exact: true }) });
      await details.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.screenshot({ path: testInfo.outputPath(`${cardId}-details.png`), animations: 'disabled' });
      const quiz = page.locator('section').filter({ has: page.getByRole('heading', { name: /小测一下/ }) });
      const position = TRACKS.find((track) => track.id === scope.track)!.cards.filter((item) => item.chapter === scope.chapter).findIndex((item) => item.id === cardId);
      await quiz.getByRole('button').nth(scope.answers[position]).click();
      await expect(page.getByText(/^答对了。/)).toBeVisible();
      await quiz.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.screenshot({ path: testInfo.outputPath(`${cardId}-quiz.png`), animations: 'disabled' });
      await page.getByRole('button', { name: '重做', exact: true }).click();
      await expect(quiz.getByRole('button').first()).toBeEnabled();
      await expect(page.getByRole('link', { name: /去学「/ })).toHaveCount(0);
      await page.reload();
      await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: /去学「/ })).toHaveCount(0);
      await checkPage(page);
    }
    expect(await exportSave(page)).toEqual(before);
    await page.reload();
    expect(await exportSave(page)).toEqual(before);
  });

  test(`${scope.chapter}: unlocked learning completes and persists only its four cards`, async ({ page }, testInfo) => {
    const save = await exportSave(page);
    const track = TRACKS.find((item) => item.id === scope.track)!;
    const cards = track.cards.filter((card) => card.chapter === scope.chapter);
    const previousChapters = track.chapters.slice(0, track.chapters.findIndex((chapter) => chapter.id === scope.chapter)).map((chapter) => chapter.id);
    save.progress = Object.fromEntries(track.cards.filter((card) => previousChapters.includes(card.chapter)).map((card) => [card.id, {
      cardId: card.id, box: 4 as const, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 0,
    }]));
    save.settings = { ...save.settings, reducedMotion: true, sound: false };
    await importSave(page, save);
    await page.goto(`/wiki/${scope.ids[0]}`);
    await page.getByRole('link', { name: /去学「/ }).click();
    await expect(page).toHaveURL(`/study?chapter=${scope.chapter}`);
    for (const [position, card] of cards.entries()) {
      await expect(page.getByRole('heading', { name: card.title, exact: true })).toBeVisible();
      if (scope.ids.includes(card.id)) {
        await page.locator('summary').click();
        for (const section of getDetail(card.id)) await expect(page.getByText(section.body, { exact: true })).toBeVisible();
        await page.locator('details').evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await page.screenshot({ path: testInfo.outputPath(`${card.id}-study.png`), animations: 'disabled' });
        await page.locator('summary').click();
      }
      for (const step of card.steps) {
        await expect(page.getByText(step.caption, { exact: true })).toBeVisible();
        await page.keyboard.press('Enter');
      }
      await expect(page.getByRole('heading', { name: card.question, exact: true })).toBeVisible();
      await page.getByRole('button', { name: /^[ABCD]\./ }).nth(scope.answers[position]).click();
      await page.getByRole('button', { name: /下一张|完成/ }).click();
    }
    await expect(page.getByRole('heading', { name: '这一轮清空了！' })).toBeVisible();
    await checkPage(page);
    const after = await exportSave(page);
    expect(Object.keys(after.progress).sort()).toEqual([...Object.keys(save.progress), ...cards.map((card) => card.id)].sort());
    for (const card of cards) {
      expect(after.progress[card.id].box).toBe(1);
      expect(after.progress[card.id].lapses).toBe(0);
      expect(after.progress[card.id].lastReviewedAt).not.toBeNull();
    }
    for (const cardId of Object.keys(save.progress)) expect(after.progress[cardId]).toEqual(save.progress[cardId]);
    expect(after.settings).toEqual(save.settings);
    expect(after.xp).toBeGreaterThan(save.xp);
    await page.reload();
    expect(await exportSave(page)).toEqual(after);
  });
}
