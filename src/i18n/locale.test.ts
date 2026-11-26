import { ALL_CARDS, TRACKS } from '../content';
import { DETAILS } from '../content/details';
import { localizedContent } from '../content/localized';
import { searchCards } from '../features/wiki/search';
import { LANGUAGE_KEY, getLocale, setLocale, t } from './locale';
import english from './en';

afterEach(async () => { await setLocale('zh'); localStorage.removeItem(LANGUAGE_KEY); });

it('translates every teaching string while preserving identifiers, answers and diagram focus', async () => {
  await setLocale('en');
  const en = localizedContent('en');
  const missing: string[] = [];
  function check(value: unknown): void {
    if (typeof value === 'string' && /[\u3400-\u9fff]/.test(value) && !(value in english)) missing.push(value);
    else if (Array.isArray(value)) value.forEach(check);
    else if (value && typeof value === 'object') Object.values(value).forEach(check);
  }
  check(TRACKS);
  check(DETAILS);
  expect(missing).toEqual([]);
  expect(en.ALL_CARDS).toHaveLength(100);
  expect(en.TRACKS.flatMap((track) => track.chapters)).toHaveLength(25);
  expect(en.TRACKS.flatMap((track) => track.chapters).filter((chapter) => chapter.guide)).toHaveLength(9);
  for (const original of ALL_CARDS) {
    const translated = en.getCard(original.id)!;
    expect(translated).toMatchObject({ id: original.id, track: original.track, chapter: original.chapter,
      illustration: original.illustration, answerIndex: original.answerIndex });
    expect(translated.options).toHaveLength(original.options.length);
    expect(translated.steps.map((step) => step.focus)).toEqual(original.steps.map((step) => step.focus));
    expect(translated.title).not.toBe(original.title);
    expect(en.getDetail(original.id)).toHaveLength(2);
    expect(translated.options[original.answerIndex]).toBe(t(original.options[original.answerIndex]));
  }
  expect(localizedContent('zh').TRACKS).toBe(TRACKS);
});

it('keeps English and Chinese searches separate, including in-depth content', async () => {
  const zh = localizedContent('zh');
  expect(searchCards(zh.ALL_CARDS, '写时复制').length).toBeGreaterThan(0);
  await setLocale('en');
  const en = localizedContent('en');
  expect(searchCards(en.ALL_CARDS, 'copy-on-write', en.getDetail).length).toBeGreaterThan(0);
  expect(searchCards(en.ALL_CARDS, 'temporal dead zone', en.getDetail).map((card) => card.id)).toContain('lang-scope-01');
  expect(searchCards(zh.ALL_CARDS, '写时复制', zh.getDetail).length).toBeGreaterThan(0);
});

it('persists language independently and can reorder whole-sentence placeholders', async () => {
  localStorage.setItem('memory-chip', 'unchanged-learning-save');
  await setLocale('en');
  expect(getLocale()).toBe('en');
  expect(localStorage.getItem(LANGUAGE_KEY)).toBe('en');
  expect(localStorage.getItem('memory-chip')).toBe('unchanged-learning-save');
  expect(t('完成 {0} 张 · 连续打卡 {1} 天', [4, 2])).toBe('Completed 4 cards · 2-day streak');
  await setLocale('zh');
  expect(t('完成 {0} 张 · 连续打卡 {1} 天', [4, 2])).toBe('完成 4 张 · 连续打卡 2 天');
  localStorage.removeItem('memory-chip');
});
