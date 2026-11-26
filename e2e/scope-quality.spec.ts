import { test, expect } from '@playwright/test';
import { getCard, getDetail } from '../src/content';
import { exportSave, importSave } from './helpers/save';

for (const unlocked of [false, true]) {
  test('scope: ' + (unlocked ? 'unlocked' : 'locked') + ' wiki interactions preserve the complete save', async ({ page }, testInfo) => {
    page.on('pageerror', (error) => { throw error; });
    page.on('console', (message) => {
      if (message.type() === 'error') throw new Error(message.text());
    });
    const save = await exportSave(page);
    if (unlocked) {
      save.xp = 125;
      save.settings = { ...save.settings, newCardsPerDay: 6, dailyGoal: 30, reducedMotion: true, sound: false };
      save.progress = {
        'hw-cpu-02': { cardId: 'hw-cpu-02', box: 3, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 2 },
        'db-table-01': { cardId: 'db-table-01', box: 4, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 1 },
      };
      save.streak = { current: 2, longest: 3, lastActiveDate: save.session.date };
      save.daily = { [save.session.date]: { xp: 25, correct: 2, bestCombo: 2 } };
      save.session.reviewed = ['hw-cpu-02'];
      save.session.wrongs = { 'hw-cpu-02': 1 };
      save.snapshots = [{ date: save.session.date, mastery: 1, reviewed: 1 }];
    }
    if (unlocked) {
      for (const suffix of ['01', '02', '03', '04']) {
        const cardId = 'lang-var-' + suffix;
        save.progress[cardId] = { cardId, box: 4, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 0 };
      }
    }
    await importSave(page, save);
    const before = await exportSave(page);
    await page.goto('/wiki/lang-scope-01');
    for (const [index, suffix] of ['01', '02', '03', '04'].entries()) {
      const cardId = 'lang-scope-' + suffix;
      const card = getCard(cardId)!;
      await expect(page).toHaveURL('/wiki/' + cardId);
      await expect(page).toHaveTitle(/记忆芯/);
      await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
      await expect(page.locator('main')).toHaveCSS('opacity', '1');
      await expect(page.locator('vite-error-overlay')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const diagram = page.getByRole('img', { name: /函数与作用域/ });
      await expect(diagram).toBeVisible();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: testInfo.outputPath(cardId + '-top.png'), animations: 'disabled' });
      for (const step of card.steps) {
        const toggle = page.getByRole('button').filter({ hasText: step.caption });
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-pressed', 'true');
        await expect(diagram.locator('.dg-on')).toHaveCount(step.focus.length);
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-pressed', 'false');
        await expect(diagram.locator('.dg-dim')).toHaveCount(0);
      }
      const details = page.locator('section').filter({ has: page.getByRole('heading', { name: '详细讲解', exact: true }) });
      await expect(details.getByRole('heading', { level: 3 })).toHaveCount(2);
      for (const section of getDetail(cardId)) {
        await expect(details.getByRole('heading', { name: section.heading, exact: true })).toBeVisible();
        await expect(details.getByText(section.body, { exact: true })).toBeVisible();
        await details.getByRole('heading', { name: section.heading, exact: true }).evaluate((element) => element.parentElement!.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await page.screenshot({ path: testInfo.outputPath(cardId + '-detail-' + section.heading + '.png'), animations: 'disabled' });
      }
      const quiz = page.locator('section').filter({ has: page.getByRole('heading', { name: /小测一下/ }) });
      for (let option = 0; option < 4; option++) {
        await expect(quiz.getByRole('button')).toHaveCount(4);
        await quiz.getByRole('button').nth(option).click();
        await expect(quiz.getByText(option === [0, 1, 1, 1][index] ? /^答对了。/ : /^不对。/)).toBeVisible();
        await expect(quiz.getByText(card.explanation, { exact: false })).toBeVisible();
        if (option === [0, 1, 1, 1][index]) {
          await quiz.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
          await page.screenshot({ path: testInfo.outputPath(cardId + '-correct.png'), animations: 'disabled' });
        }
        await quiz.getByRole('button', { name: '重做', exact: true }).click();
        await expect(quiz.getByRole('button').first()).toBeEnabled();
      }
      await page.reload();
      await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: '阅读本章导读与贯穿案例', exact: true })).toHaveCount(0);
      const learn = page.getByRole('link', { name: '去学「函数与作用域」这一章', exact: true });
      if (unlocked) {
        await expect(learn).toHaveAttribute('href', '/study?chapter=lang-scope');
        await learn.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
        expect(await learn.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          return element.contains(document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2));
        })).toBe(true);
        await page.screenshot({ path: testInfo.outputPath(cardId + '-entry.png'), animations: 'disabled' });
      } else {
        await expect(learn).toHaveCount(0);
      }
      if (index < 3) await page.getByRole('navigation', { name: '同章条目' }).getByRole('link', { name: /下一条/ }).click();
    }
    await page.goto('/map/language');
    await expect(page.getByLabel('未解锁')).toHaveCount(unlocked ? 3 : 4);
    expect(await exportSave(page)).toEqual(before);
    await page.reload();
    expect(await exportSave(page)).toEqual(before);
  });
}

test('scope: learning through the wiki entry persists four cards without changing prerequisites', async ({ page }, testInfo) => {
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => {
    if (message.type() === 'error') throw new Error(message.text());
  });
  const save = await exportSave(page);
  for (const suffix of ['01', '02', '03', '04']) {
    const cardId = 'lang-var-' + suffix;
    save.progress[cardId] = { cardId, box: 4, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 0 };
  }
  save.settings = { ...save.settings, reducedMotion: true, sound: false };
  await importSave(page, save);
  await page.goto('/wiki/lang-scope-01');
  await page.getByRole('link', { name: '去学「函数与作用域」这一章', exact: true }).click();
  await expect(page).toHaveURL('/study?chapter=lang-scope');
  for (const [index, suffix] of ['01', '02', '03', '04'].entries()) {
    const card = getCard('lang-scope-' + suffix)!;
    await expect(page.getByRole('heading', { name: card.title, exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: /函数与作用域/ })).toBeVisible();
    await page.locator('summary').click();
    for (const section of getDetail(card.id)) await expect(page.getByText(section.body, { exact: true })).toBeVisible();
    await page.locator('summary').click();
    for (const step of card.steps) {
      await expect(page.getByText(step.caption, { exact: true })).toBeVisible();
      await page.keyboard.press('Enter');
    }
    await expect(page.getByRole('heading', { name: card.question, exact: true })).toBeVisible();
    await page.getByRole('button', { name: /^[ABCD]\./ }).nth([0, 1, 1, 1][index]).click();
    await expect(page.getByText(card.explanation, { exact: true })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(card.id + '-study-feedback.png'), animations: 'disabled' });
    await page.getByRole('button', { name: /下一张|完成/ }).click();
  }
  await expect(page.getByRole('heading', { name: '这一轮清空了！' })).toBeVisible();
  const after = await exportSave(page);
  expect(Object.keys(after.progress).sort()).toEqual([
    'lang-scope-01', 'lang-scope-02', 'lang-scope-03', 'lang-scope-04',
    'lang-var-01', 'lang-var-02', 'lang-var-03', 'lang-var-04',
  ]);
  for (const suffix of ['01', '02', '03', '04']) {
    const cardId = 'lang-scope-' + suffix;
    expect(after.progress[cardId].box).toBe(1);
    expect(after.progress[cardId].lapses).toBe(0);
    expect(after.progress[cardId].lastReviewedAt).not.toBeNull();
  }
  for (const cardId of Object.keys(save.progress)) expect(after.progress[cardId]).toEqual(save.progress[cardId]);
  expect(after.settings).toEqual(save.settings);
  expect(after.xp).toBeGreaterThan(save.xp);
  await page.reload();
  expect(await exportSave(page)).toEqual(after);
  await page.goto('/map/language');
  await expect(page.getByLabel('未解锁')).toHaveCount(3);
});
