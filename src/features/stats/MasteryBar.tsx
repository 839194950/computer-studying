import type { CardStatus } from '../../lib/stats';
import { STATUS_ORDER, STATUS_STYLE } from './statusStyle';

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
      {STATUS_ORDER.flatMap((status) =>
        cards
          .filter((c) => c.status === status)
          .map((c) => (
            <span
              key={c.id}
              aria-label={STATUS_STYLE[status].label}
              title={STATUS_STYLE[status].label}
              className={`h-6 w-6 rounded-md border-2 border-ink ${STATUS_STYLE[status].bg}`}
            />
          )),
      )}
    </div>
  );
}
