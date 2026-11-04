import { Link } from 'react-router-dom';
import type { ChapterState } from '../../lib/queue';

const LABEL: Record<ChapterState, string> = {
  active: '学习中',
  done: '已通关',
  locked: '未解锁',
};

interface ChapterNodeProps {
  index: number;
  title: string;
  blurb: string;
  state: ChapterState;
  learned: number;
  total: number;
  last?: boolean;
}

export function ChapterNode({ index, title, blurb, state, learned, total, last }: ChapterNodeProps) {
  const body = (
    <div
      className={[
        'flex w-full items-center gap-3 rounded-sticker border-[3px] border-ink px-3 py-3 transition-transform',
        state === 'done'
          ? 'bg-mint text-ink shadow-pop-sm'
          : state === 'active'
            ? 'bg-white text-ink shadow-pop'
            : 'bg-white/60 text-muted',
        state !== 'locked' ? 'active:translate-x-[2px] active:translate-y-[2px]' : '',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-ink text-sm font-black',
          state === 'done' ? 'bg-white text-ink' : state === 'active' ? 'bg-sun text-ink' : 'bg-paper text-muted',
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
      <span className="shrink-0 font-mono text-[10px] font-bold opacity-70">
        {learned}/{total}
      </span>
    </div>
  );

  return (
    <li aria-label={LABEL[state]} className="relative pl-0">
      {state === 'locked' ? body : <Link to="/study">{body}</Link>}
      {!last && <div className="mx-auto h-4 w-1 rounded-full bg-ink/15" aria-hidden="true" />}
    </li>
  );
}
