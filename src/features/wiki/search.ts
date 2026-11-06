import type { Card } from '../../content';
import { getDetail } from '../../content';

/** 把一张卡能被搜到的文字拼起来，小写化，搜索时做子串匹配。 */
function haystack(card: Card): string {
  return [
    card.title,
    card.explain,
    card.question,
    card.explanation,
    ...card.options,
    ...card.steps.map((s) => s.caption),
    ...getDetail(card.id).flatMap((d) => [d.heading, d.body]),
  ]
    .join('\n')
    .toLowerCase();
}

const INDEX = new Map<string, string>();

/** 按空格切成多个词，每个词都要命中。标题命中的排在前面。 */
export function searchCards(cards: Card[], query: string): Card[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return cards;
  const hits = cards.filter((card) => {
    let text = INDEX.get(card.id);
    if (text === undefined) {
      text = haystack(card);
      INDEX.set(card.id, text);
    }
    return terms.every((t) => text!.includes(t));
  });
  const inTitle = (c: Card) => terms.some((t) => c.title.toLowerCase().includes(t));
  return [...hits.filter(inTitle), ...hits.filter((c) => !inTitle(c))];
}
