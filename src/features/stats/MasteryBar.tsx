import type { CardStatus } from '../../lib/stats';

const ORDER: CardStatus[] = ['mastered', 'learning', 'forgotten', 'new'];

const STYLE: Record<CardStatus, { bg: string; label: string }> = {
  mastered: { bg: 'bg-mint', label: '记牢了' },
  learning: { bg: 'bg-sun', label: '刚学会' },
  forgotten: { bg: 'bg-pink', label: '快忘了' },
  new: { bg: 'bg-brand/30', label: '没学过' },
};

interface MasteryBarProps {
  cards: { id: string; status: CardStatus }[];
}

/** 一格一张卡，颜色就是它在你脑子里的状态。 */
export function MasteryBar({ cards }: MasteryBarProps) {
  if (cards.length === 0) {
    return (
      <div className="rounded-sticker border-[3px] border-ink bg-paper px-3 py-4 text-center text-xs font-bold text-muted">
        还没有知识卡
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5 rounded-sticker border-[3px] border-ink bg-white p-3">
      {ORDER.flatMap((status) =>
        cards
          .filter((c) => c.status === status)
          .map((c) => (
            <span
              key={c.id}
              aria-label={STYLE[status].label}
              title={STYLE[status].label}
              className={`h-6 w-6 rounded-md border-2 border-ink ${STYLE[status].bg}`}
            />
          )),
      )}
    </div>
  );
}
