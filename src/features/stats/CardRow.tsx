import type { CardStatus } from '../../lib/stats';
import { formatMonthDay } from '../../lib/time';
import { STATUS_STYLE } from './statusStyle';

interface CardRowProps {
  title: string;
  status: CardStatus;
  /** 没有进度时为 undefined，显示「还没开始」。 */
  dueAt?: number;
}

/** 图谱页下钻的一行：状态色点 + 卡片标题 + 下次复习日期。 */
export function CardRow({ title, status, dueAt }: CardRowProps) {
  const style = STATUS_STYLE[status];
  return (
    <li className="flex items-center gap-2 border-b border-ink/10 py-2 last:border-b-0">
      <i
        role="img"
        aria-label={style.label}
        title={style.label}
        className={`h-3 w-3 shrink-0 rounded-[3px] border-2 border-ink ${style.bg}`}
      />
      <span className="min-w-0 flex-1 text-xs font-bold text-ink">{title}</span>
      <span className="shrink-0 font-mono text-[11px] text-muted">
        {dueAt === undefined ? '还没开始' : formatMonthDay(dueAt)}
      </span>
    </li>
  );
}
