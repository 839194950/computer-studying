import { Link } from 'react-router-dom';
import type { ChapterState } from '../../lib/queue';

const LABEL: Record<ChapterState, string> = {
  active: '学习中',
  done: '已通关',
  locked: '未解锁',
};

interface ChapterNodeProps {
  chapterId: string;
  index: number;
  title: string;
  blurb: string;
  state: ChapterState;
  learned: number;
  total: number;
  last?: boolean;
}

export function ChapterNode({
  chapterId,
  index,
  title,
  blurb,
  state,
  learned,
  total,
  last,
}: ChapterNodeProps) {
  const interactive = state !== 'locked';

  const body = (
    <div
      className={[
        'flex w-full items-center gap-3 rounded-sticker border-[3px] border-ink px-3 py-3 transition-[transform,box-shadow,background-color] duration-150',
        state === 'done'
          ? 'bg-mint text-ink shadow-pop-sm'
          : state === 'active'
            ? 'bg-white text-ink shadow-pop'
            : 'bg-white/60 text-muted',
        interactive
          ? [
              'group-hover:-translate-y-[4px] group-hover:shadow-pop-lg',
              // 已通关的绿色卡面保留，只给学习中那档加浅紫底色
              state === 'active' ? 'group-hover:bg-brand/[0.06]' : '',
              'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
            ].join(' ')
          : 'cursor-not-allowed',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-ink text-sm font-black transition-colors duration-150',
          state === 'done' ? 'bg-white text-ink' : state === 'active' ? 'bg-sun text-ink' : 'bg-paper text-muted',
          interactive ? 'group-hover:border-ink group-hover:bg-brand group-hover:text-white' : '',
        ].join(' ')}
      >
        {state === 'done' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12 l5 5 l9 -11" stroke="#241A3D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          index + 1
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-black">{title}</span>
        <span className="mt-0.5 block truncate text-[11px] font-bold opacity-70">{blurb}</span>
      </span>
      <span className="shrink-0 font-mono text-[10px] font-bold opacity-70 transition-opacity group-hover:opacity-100">
        {learned}/{total}
      </span>
    </div>
  );

  return (
    <li aria-label={LABEL[state]} className="relative pl-0">
      {interactive ? (
        <Link
          to={`/study?chapter=${chapterId}`}
          aria-label={`${title}（${LABEL[state]}，${learned}/${total}）`}
          className="group block rounded-sticker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          {body}
        </Link>
      ) : (
        body
      )}
      {!last && <div className="mx-auto h-4 w-1 rounded-full bg-ink/15" aria-hidden="true" />}
    </li>
  );
}
