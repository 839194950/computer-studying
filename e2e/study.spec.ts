import { test, expect, type Page } from '@playwright/test';
import { TRACKS, type Card } from '../src/content';

// Each test receives a fresh browser context: no real profile or saved user data.
test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => { throw error; });
});

async function finishRound(page: Page, cards: Card[]) {
  for (const card of cards) {
    await expect(page.getByRole('heading', { name: card.title, exact: true })).toBeVisible();
    for (let step = 0; step < Math.max(1, card.steps?.length ?? 0); step += 1) {
      await page.keyboard.press('Enter');
    }
    await expect(page.getByRole('heading', { name: card.question, exact: true })).toBeVisible();
    await page.getByRole('button', { name: /^[ABCD]\./ }).nth(card.answerIndex).click();
    await page.getByRole('button', { name: /下一张|完成/ }).click();
  }
  await expect(page.getByRole('heading', { name: '这一轮清空了！' })).toBeVisible();
}

for (const track of TRACKS) {
  test(`${track.title}: enter, finish, return and persist`, async ({ page }) => {
    const chapter = track.chapters[0];
    const cards = track.cards.filter((card) => card.chapter === chapter.id);
    await page.goto('/map');
    await page.getByRole('link', { name: new RegExp(track.title) }).click();
    await expect(page).toHaveURL(`/map/${track.id}`);
    await page.getByRole('link', { name: new RegExp(chapter.title) }).click();
    await finishRound(page, cards);
    await page.getByRole('link', { name: '回章节地图', exact: true }).click();
    await expect(page).toHaveURL(`/map/${track.id}`);
    // Completing one round must not unlock the next chapter.
    await expect(page.getByLabel('未解锁')).toHaveCount(4);
    await page.reload();
    await expect(page.getByRole('list', { name: `${track.title}章节路径` })).toBeVisible();
    await page.goto(`/study?chapter=${chapter.id}`);
    // All cards were answered and are not due: persistence survives a reload.
    await expect(page.getByText('这一章今天没有安排', { exact: true })).toBeVisible();
  });

  test(`${track.title}: direct entry, top return and Escape`, async ({ page }) => {
    const chapter = track.chapters[0];
    await page.goto(`/study?chapter=${chapter.id}`);
    await page.getByRole('link', { name: chapter.title, exact: true }).click();
    await expect(page).toHaveURL(`/map/${track.id}`);
    await page.goto(`/study?chapter=${chapter.id}&free=1`);
    await expect(page.getByRole('link', { name: chapter.title, exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(`/map/${track.id}`);
  });
}

test('replay resets a completed session even at the same URL', async ({ page }) => {
  const track = TRACKS[0];
  const chapter = track.chapters[0];
  const cards = track.cards.filter((card) => card.chapter === chapter.id);
  await page.goto(`/study?chapter=${chapter.id}`);
  for (let round = 0; round < 2; round += 1) {
    await finishRound(page, cards);
    await page.getByRole('link', { name: '再练一遍', exact: true }).click();
    await expect(page).toHaveURL(`/study?chapter=${chapter.id}&free=1`);
    await expect(page.getByRole('heading', { name: cards[0].title, exact: true })).toBeVisible();
    await expect(page.getByText('1/4', { exact: true })).toBeVisible();
  }
});
