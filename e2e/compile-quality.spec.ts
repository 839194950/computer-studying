import { test, expect } from '@playwright/test';
import { getCard, getDetail } from '../src/content';
import { exportSave, importSave } from './helpers/save';

for (const unlocked of [false, true]) {
  test('compile: ' + (unlocked ? 'unlocked' : 'locked') + ' wiki interactions preserve the complete save', async ({ page }, testInfo) => {
    page.on('pageerror', (error) => { throw error; });
    page.on('console', (message) => {
      if (message.type() === 'error') throw new Error(message.text());
    });
    const save = await exportSave(page);
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
    if (unlocked) {
      for (const suffix of ['01', '02', '03', '04']) {
        const cardId = 'hw-binary-' + suffix;
        save.progress[cardId] = { cardId, box: 4, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 0 };
      }
    }
    await importSave(page, save);
    const before = await exportSave(page);
    await page.goto('/wiki/hw-compile-01');
    for (const [index, suffix] of ['01', '02', '03', '04'].entries()) {
      const cardId = 'hw-compile-' + suffix;
      const card = getCard(cardId)!;
      await expect(page).toHaveURL('/wiki/' + cardId);
      await expect(page).toHaveTitle(/记忆芯/);
      await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
      await expect(page.locator('main')).toHaveCSS('opacity', '1');
      await expect(page.locator('vite-error-overlay')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const diagram = page.getByRole('img', { name: /C.*编译/ });
      await expect(diagram).toBeVisible();
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
      }
      await details.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.screenshot({ path: testInfo.outputPath(cardId + '-details.png'), animations: 'disabled' });
      const quiz = page.locator('section').filter({ has: page.getByRole('heading', { name: /小测一下/ }) });
      for (let option = 0; option < 4; option++) {
        await expect(quiz.getByRole('button')).toHaveCount(4);
        await quiz.getByRole('button').nth(option).click();
        await expect(quiz.getByText(option === 1 ? /^答对了。/ : /^不对。/)).toBeVisible();
        await quiz.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await page.screenshot({ path: testInfo.outputPath(cardId + '-option-' + option + '.png'), animations: 'disabled' });
        await quiz.getByRole('button', { name: '重做', exact: true }).click();
        await expect(quiz.getByRole('button').first()).toBeEnabled();
      }
      await page.reload();
      await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: '阅读本章导读与贯穿案例', exact: true })).toHaveCount(0);
      const learn = page.getByRole('link', { name: '去学「编译与解释」这一章', exact: true });
      if (unlocked) {
        await expect(learn).toHaveAttribute('href', '/study?chapter=hw-compile');
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
    await page.goto('/map/hardware');
    await expect(page.getByText('先记牢《编译与解释》全部卡片（已记牢 0/4）', { exact: true })).toBeVisible();
    expect(await exportSave(page)).toEqual(before);
    await page.reload();
    expect(await exportSave(page)).toEqual(before);
  });
}
