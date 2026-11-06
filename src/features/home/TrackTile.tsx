import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../../components/Icon';
import { TRACK_THEME } from '../../components/trackTheme';
import type { Track } from '../../content';

interface TrackTileProps {
  track: Track;
  learned: number;
  /** 当前正在学的那一章；整条线通关时为空 */
  nextChapter?: string;
}

/** 首页的主线入口：彩色图标块 + 进度条 + 「继续：某章」。 */
export function TrackTile({ track, learned, nextChapter }: TrackTileProps) {
  const theme = TRACK_THEME[track.id];
  const total = track.cards.length;
  const percent = total === 0 ? 0 : Math.round((learned / total) * 100);

  return (
    <Link
      to="/map"
      className="group block rounded-blob focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
    >
      <div className="flex items-center gap-4 rounded-blob border-2 border-line bg-white p-4 shadow-lip transition-transform duration-150 group-hover:-translate-y-0.5 group-active:translate-y-[3px] group-active:shadow-none">
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${theme.solid} ${theme.lip} transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105`}
        >
          <Icon name={theme.icon} size={28} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-base font-black text-ink">{track.title}</span>
            <span className="tabular text-xs font-extrabold text-muted">
              {learned}/{total}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs font-semibold text-muted">
            {nextChapter ? `继续：${nextChapter}` : '整条线都记牢了'}
          </p>
          <div className={`mt-2 h-2.5 overflow-hidden rounded-full ${theme.soft}`}>
            <motion.div
              className={`h-full rounded-full ${theme.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
