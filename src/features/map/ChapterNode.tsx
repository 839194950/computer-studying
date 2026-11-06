import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../../components/Icon';
import type { TrackTheme } from '../../components/trackTheme';
import type { ChapterState } from '../../lib/queue';

const LABEL: Record<ChapterState, string> = {
  active: '学习中',
  done: '已通关',
  locked: '未解锁',
};

/** 蛇形路径的水平偏移（像素），5 个一循环 */
const OFFSETS = [0, 56, 0, -56, 0];

interface ChapterNodeProps {
  chapterId: string;
  index: number;
  title: string;
  blurb: string;
  state: ChapterState;
  learned: number;
  total: number;
  last?: boolean;
  theme: TrackTheme;
}

/** 地图上的一个章节：圆形 3D 按钮 + 进度弧 + 标题。正在学的那一个带脉冲光圈和「开始」气泡。 */
export function ChapterNode({ chapterId, index, title, blurb, state, learned, total, theme }: ChapterNodeProps) {
  const interactive = state !== 'locked';
  const offset = OFFSETS[index % OFFSETS.length];
  const ratio = total > 0 ? learned / total : 0;
  const R = 41;
  const C = 2 * Math.PI * R;

  const disc = (
    <span className="relative flex h-[92px] w-[92px] items-center justify-center">
      {/* 本章进度弧 */}
      <svg className="absolute inset-0" viewBox="0 0 92 92" aria-hidden="true">
        <circle cx="46" cy="46" r={R} fill="none" stroke="#ECE9F5" strokeWidth="6" />
        {ratio > 0 && (
          <circle
            cx="46"
            cy="46"
            r={R}
            fill="none"
            stroke={state === 'done' ? '#FFC530' : theme.hex}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${C * ratio} ${C}`}
            transform="rotate(-90 46 46)"
          />
        )}
      </svg>
      {state === 'active' && (
        <span aria-hidden className="absolute inset-[10px] animate-pulse-ring rounded-full" style={{ background: theme.hex }} />
      )}
      <span
        className={[
          'relative flex h-[68px] w-[68px] items-center justify-center rounded-full transition-transform duration-100',
          state === 'done'
            ? 'bg-sun text-white shadow-[0_6px_0_#E0A300]'
            : state === 'active'
              ? `${theme.solid} ${theme.lip}`
              : 'bg-[#E5E2EE] text-[#B3AEC6] shadow-[0_6px_0_#CFCBDC]',
          interactive ? 'group-hover:-translate-y-0.5 group-active:translate-y-[6px] group-active:shadow-none' : '',
        ].join(' ')}
      >
        <span aria-hidden className="absolute left-3 right-3 top-2 h-3 rounded-full bg-white/25" />
        {state === 'done' ? (
          <Icon name="check" size={32} strokeWidth={3.4} className="relative" />
        ) : state === 'locked' ? (
          <Icon name="lock" size={26} strokeWidth={2.6} className="relative" />
        ) : (
          <Icon name="star" size={30} className="relative" />
        )}
      </span>
      {state === 'active' && (
        <motion.span
          aria-hidden
          className="absolute -top-8 left-1/2 whitespace-nowrap rounded-xl border-2 border-line bg-white px-3 py-1 text-xs font-black text-ink shadow-lip"
          initial={{ x: '-50%' }}
          animate={{ x: '-50%', y: [0, -4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {learned > 0 ? '继续' : '开始'}
          <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-line bg-white" />
        </motion.span>
      )}
    </span>
  );

  const caption = (
    <span className="mt-1.5 block max-w-[200px] text-center">
      <span className={`block text-sm font-black ${interactive ? 'text-ink' : 'text-muted'}`}>{title}</span>
      <span className="mt-0.5 block text-[11px] font-semibold text-muted">{blurb}</span>
      <span className="tabular mt-0.5 block text-[11px] font-extrabold text-muted/80">
        {learned}/{total}
      </span>
    </span>
  );

  return (
    <motion.li
      aria-label={LABEL[state]}
      className="flex justify-center py-2"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.1 + index * 0.06 }}
    >
      <div style={{ transform: `translateX(${offset}px)` }}>
        {interactive ? (
          <Link
            to={`/study?chapter=${chapterId}`}
            aria-label={`${title}（${LABEL[state]}，${learned}/${total}）`}
            className="group flex flex-col items-center rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
          >
            {disc}
            {caption}
          </Link>
        ) : (
          <div className="flex cursor-not-allowed flex-col items-center">
            {disc}
            {caption}
          </div>
        )}
      </div>
    </motion.li>
  );
}
