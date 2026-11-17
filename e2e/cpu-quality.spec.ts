import { test, expect, type Page } from '@playwright/test';
import { getCard, getDetail } from '../src/content';
import { exportSave, importSave } from './helpers/save';

const cardIds = ['hw-cpu-01', 'hw-cpu-02', 'hw-cpu-03', 'hw-cpu-04'];
const answerIndices = [1, 1, 1, 0];

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'desktop') await page.setViewportSize({ width: 1440, height: 1000 });
  page.on('pageerror', (error) => { throw error; });
  page.on('console', (message) => {
    if (message.type() === 'error') throw new Error(message.text());
  });
});

async function checkPage(page: Page) {
  await expect(page).toHaveTitle(/记忆芯/);
  await expect(page.locator('main')).toHaveCSS('opacity', '1');
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test('cpu: existing guide diagrams keep readable arrow labels and an unobstructed learning entry', async ({ page }, testInfo) => {
  await page.goto('/map/hardware/hw-cpu');
  await expect(page.getByRole('heading', { level: 1, name: '计算机组成 · 章节导读' })).toBeVisible();
  await checkPage(page);
  const diagrams = page.getByRole('region', { name: '三张图看懂计算机组成' });
  await expect(diagrams.getByRole('img')).toHaveCount(3);
  const execution = diagrams.getByRole('img', { name: '程序运行：从加载到执行，再到保存' });
  for (const text of ['按需加载', '取指、读写数据', '需要保存时']) {
    await expect(execution.getByText(text, { exact: true })).toHaveCSS('stroke', 'none');
  }
  await page.screenshot({ path: testInfo.outputPath('cpu-guide-top.png'), animations: 'disabled' });
  for (let index = 0; index < 3; index++) {
    const figure = diagrams.locator('figure').nth(index);
    await figure.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await expect(figure).toBeInViewport();
    await page.screenshot({ path: testInfo.outputPath('cpu-guide-figure-' + (index + 1) + '.png'), animations: 'disabled' });
  }
  const start = page.getByRole('link', { name: '开始本章学习', exact: true });
  await expect(start).toHaveAttribute('href', '/study?chapter=hw-cpu');
  await start.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  expect(await start.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return element.contains(document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2));
  })).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('cpu-guide-bottom.png'), animations: 'disabled' });
});

test('cpu: four wiki cards, every quiz option and reload preserve the complete imported save', async ({ page }, testInfo) => {
  const save = await exportSave(page);
  save.progress = {
    'hw-cpu-02': { cardId: 'hw-cpu-02', box: 3, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 2 },
    'db-table-01': { cardId: 'db-table-01', box: 4, dueAt: 1900000000000, lastReviewedAt: 1794000000000, lapses: 1 },
  };
  save.xp = 125;
  save.settings = { ...save.settings, newCardsPerDay: 6, dailyGoal: 30, reducedMotion: true, sound: false };
  save.streak = { current: 2, longest: 3, lastActiveDate: save.session.date };
  save.daily = { [save.session.date]: { xp: 25, correct: 2, bestCombo: 2 } };
  save.session.reviewed = ['hw-cpu-02'];
  save.session.wrongs = { 'hw-cpu-02': 1 };
  save.snapshots = [{ date: save.session.date, mastery: 1, reviewed: 1 }];
  await importSave(page, save);
  const before = await exportSave(page);
  await page.goto('/map/hardware');
  await page.getByRole('region', { name: '计算机组成导读入口' }).getByRole('link', { name: '打开章节导读', exact: true }).click();
  await expect(page).toHaveURL('/map/hardware/hw-cpu');
  for (const [index, cardId] of cardIds.entries()) {
    const card = getCard(cardId)!;
    await page.getByRole('link', { name: '查看知识卡：' + card.title, exact: true }).first().click();
    await expect(page).toHaveURL('/wiki/' + cardId);
    await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
    const diagram = page.getByRole('img', { name: /计算机组成/ });
    await expect(diagram).toBeVisible();
    await checkPage(page);
    await page.screenshot({ path: testInfo.outputPath(cardId + '-top.png'), animations: 'disabled' });
    for (const step of card.steps) {
      const toggle = page.getByRole('button').filter({ hasText: step.caption });
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-pressed', step.focus.length ? 'true' : 'false');
      await expect(diagram.locator('.dg-on')).toHaveCount(step.focus.length);
      if (step.focus.length) await toggle.click();
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
      await expect(quiz.getByText(option === answerIndices[index] ? /^答对了。/ : /^不对。/)).toBeVisible();
      await quiz.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.screenshot({ path: testInfo.outputPath(cardId + '-option-' + option + '.png'), animations: 'disabled' });
      await quiz.getByRole('button', { name: '重做', exact: true }).click();
      await expect(quiz.getByRole('button').first()).toBeEnabled();
    }
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: card.title, exact: true })).toBeVisible();
    await page.getByRole('link', { name: '阅读本章导读与贯穿案例', exact: true }).click();
    await expect(page).toHaveURL('/map/hardware/hw-cpu');
  }
  await page.getByRole('link', { name: '返回章节路径', exact: true }).click();
  await expect(page).toHaveURL('/map/hardware');
  await page.goto('/map/hardware/hw-binary');
  await expect(page.getByRole('link', { name: '开始本章学习', exact: true })).toHaveCount(0);
  expect(await exportSave(page)).toEqual(before);
  await page.reload();
  expect(await exportSave(page)).toEqual(before);
});
