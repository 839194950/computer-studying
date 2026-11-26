import { test, expect, type Page } from '@playwright/test';
import { findChapter, getChapterCards, getDetail } from '../../src/content';
import type { AppState } from '../../src/store/useStore';
import { exportSave, importSave } from './save';

/** Shared coverage for the remaining chapters, including first-chapter and prerequisite-only saves. */
export function chapterQuality(chapterId: string, diagramName: RegExp, answers: number[]) {
  const { track, chapter } = findChapter(chapterId)!;
  const cards = getChapterCards(track.id, chapterId);
  const chapterIndex = track.chapters.findIndex(c => c.id === chapterId);
  const previous = track.chapters[chapterIndex - 1];
  const prerequisites = previous ? getChapterCards(track.id, previous.id) : [];
  const lockCount = (unlocked: boolean) => unlocked && previous ? (chapterIndex === 1 ? 3 : 2) : 4;

  function observe(page: Page) {
    page.on('pageerror', error => { throw error; });
    page.on('console', message => {
      if (message.type() === 'error') throw Error(message.text());
    });
  }

  function unlock(save: AppState) {
    for (const card of prerequisites) {
      save.progress[card.id] = { cardId: card.id, box: 4, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 0 };
    }
  }

  for (const existing of [false, true]) {
    test(chapterId + ': ' + (previous ? (existing ? 'unlocked' : 'locked') : (existing ? 'existing' : 'new')) + ' wiki interactions preserve the complete save', async ({ page }, testInfo) => {
      observe(page);
      const save = await exportSave(page);
      if (existing) {
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
        unlock(save);
      }
      await importSave(page, save);
      const before = await exportSave(page);
      await page.goto('/wiki/' + cards[0].id);
      for (const [index, card] of cards.entries()) {
        await expect(page).toHaveURL('/wiki/' + card.id);
        await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
        await expect(page.locator('main')).toHaveCSS('opacity', '1');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const diagram = page.getByRole('img', { name: diagramName });
        await expect(diagram).toBeVisible();
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: testInfo.outputPath(card.id + '-top.png'), animations: 'disabled' });
        for (const step of card.steps) {
          const toggle = page.getByRole('button').filter({ hasText: step.caption });
          await toggle.click();
          await expect(toggle).toHaveAttribute('aria-pressed', step.focus.length ? 'true' : 'false');
          if (step.focus.length) expect(await diagram.locator('.dg-on').count()).toBeGreaterThan(0);
          else await expect(diagram.locator('.dg-on, .dg-dim')).toHaveCount(0);
          if (step.focus.length) await toggle.click();
          await expect(toggle).toHaveAttribute('aria-pressed', 'false');
          await expect(diagram.locator('.dg-on, .dg-dim')).toHaveCount(0);
        }
        const details = page.locator('section').filter({ has: page.getByRole('heading', { name: '详细讲解', exact: true }) });
        await expect(details.getByRole('heading', { level: 3 })).toHaveCount(2);
        for (const [detailIndex, section] of getDetail(card.id).entries()) {
          await expect(details.getByText(section.body, { exact: true })).toBeVisible();
          await details.getByRole('heading', { name: section.heading, exact: true }).evaluate(element => element.parentElement!.scrollIntoView({ block: 'center', behavior: 'instant' }));
          await page.screenshot({ path: testInfo.outputPath(card.id + '-detail-' + detailIndex + '.png'), animations: 'disabled' });
        }
        const quiz = page.locator('section').filter({ has: page.getByRole('heading', { name: /小测一下/ }) });
        for (let option = 0; option < 4; option++) {
          await expect(quiz.getByRole('button')).toHaveCount(4);
          await quiz.getByRole('button').nth(option).click();
          await expect(quiz.getByText(option === answers[index] ? /^答对了。/ : /^不对。/)).toBeVisible();
          await expect(quiz.getByText(card.explanation, { exact: false })).toBeVisible();
          if (option === answers[index]) {
            await quiz.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
            await page.screenshot({ path: testInfo.outputPath(card.id + '-correct.png'), animations: 'disabled' });
          }
          await quiz.getByRole('button', { name: '重做', exact: true }).click();
        }
        await page.reload();
        await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: '阅读本章导读与贯穿案例', exact: true })).toHaveCount(0);
        const learn = page.getByRole('link', { name: '去学「' + chapter.title + '」这一章', exact: true });
        if (existing || !previous) {
          await expect(learn).toHaveAttribute('href', '/study?chapter=' + chapterId);
          await learn.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
          expect(await learn.evaluate(element => {
            const b = element.getBoundingClientRect();
            return element.contains(document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2));
          })).toBe(true);
          await page.screenshot({ path: testInfo.outputPath(card.id + '-entry.png'), animations: 'disabled' });
        } else await expect(learn).toHaveCount(0);
        if (index < 3) await page.getByRole('navigation', { name: '同章条目' }).getByRole('link', { name: /下一条/ }).click();
      }
      await page.goto('/map/' + track.id);
      await expect(page.getByLabel('未解锁')).toHaveCount(lockCount(existing));
      expect(await exportSave(page)).toEqual(before);
      await page.reload();
      expect(await exportSave(page)).toEqual(before);
    });
  }

  test(chapterId + ': learning persists four cards without changing prerequisites', async ({ page }) => {
    observe(page);
    const save = await exportSave(page);
    unlock(save);
    save.settings = { ...save.settings, reducedMotion: true, sound: false };
    await importSave(page, save);
    await page.goto('/wiki/' + cards[0].id);
    await page.getByRole('link', { name: '去学「' + chapter.title + '」这一章', exact: true }).click();
    await expect(page).toHaveURL('/study?chapter=' + chapterId);
    for (const [index, card] of cards.entries()) {
      await expect(page.getByRole('heading', { name: card.title, exact: true })).toBeVisible();
      await expect(page.getByRole('img', { name: diagramName })).toBeVisible();
      await page.locator('summary').click();
      for (const section of getDetail(card.id)) await expect(page.getByText(section.body, { exact: true })).toBeVisible();
      await page.locator('summary').click();
      for (const step of card.steps) {
        await expect(page.getByText(step.caption, { exact: true })).toBeVisible();
        await page.keyboard.press('Enter');
      }
      await expect(page.getByRole('heading', { name: card.question, exact: true })).toBeVisible();
      await page.getByRole('button', { name: /^[ABCD]\./ }).nth(answers[index]).click();
      await expect(page.getByText(card.explanation, { exact: true })).toBeVisible();
      await page.getByRole('button', { name: /^(下一张|完成)$/ }).click();
    }
    await expect(page.getByRole('heading', { name: '这一轮清空了！' })).toBeVisible();
    const after = await exportSave(page);
    expect(Object.keys(after.progress).sort()).toEqual([...prerequisites, ...cards].map(c => c.id).sort());
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
    await page.goto('/map/' + track.id);
    await expect(page.getByLabel('未解锁')).toHaveCount(lockCount(true));
  });
}
