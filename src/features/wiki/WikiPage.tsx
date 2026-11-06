import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Screen } from '../../components/Screen';
import { Icon } from '../../components/Icon';
import { TRACK_THEME } from '../../components/trackTheme';
import { STATUS_STYLE } from '../stats/statusStyle';
import { ALL_CARDS, TRACKS, type TrackId } from '../../content';
import { useStore } from '../../store/useStore';
import { cardStatus } from '../../lib/stats';
import { searchCards } from './search';

type Filter = TrackId | 'all';

/**
 * 计算机百科：80 个条目随时可查，不受解锁和复习时间限制。
 * 搜索词和筛选写进 URL，从条目返回时还停在原来的位置。
 */
export function WikiPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const filter = (params.get('track') as Filter | null) ?? 'all';
  const progress = useStore((s) => s.progress);
  const now = Date.now();

  const update = (next: { q?: string; track?: Filter }) => {
    const p = new URLSearchParams(params);
    if (next.q !== undefined) (next.q ? p.set('q', next.q) : p.delete('q'));
    if (next.track !== undefined) (next.track === 'all' ? p.delete('track') : p.set('track', next.track));
    setParams(p, { replace: true });
  };

  const results = useMemo(() => {
    const pool = filter === 'all' ? ALL_CARDS : ALL_CARDS.filter((c) => c.track === filter);
    return searchCards(pool, query);
  }, [filter, query]);

  const searching = query.trim().length > 0;
  const tracks = TRACKS.filter((t) => filter === 'all' || t.id === filter);
  const learned = ALL_CARDS.filter((c) => progress[c.id]).length;

  return (
    <Screen
      title="计算机百科"
      subtitle={`${ALL_CARDS.length} 个条目随时翻阅，你已经学过 ${learned} 个。`}
    >
      <div className="sticky top-0 z-20 -mx-4 bg-paper/90 px-4 pb-3 pt-1 backdrop-blur-md md:top-[62px]">
        <label className="flex items-center gap-2 rounded-2xl border-2 border-line bg-white px-4 py-3 shadow-lip focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/15">
          <Icon name="search" size={20} className="shrink-0 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              update({ q: e.target.value });
            }}
            placeholder="搜索：缓存、指针、TLS、进程…"
            aria-label="搜索百科"
            className="min-w-0 flex-1 bg-transparent text-[15px] font-bold text-ink outline-none placeholder:font-semibold placeholder:text-muted/70"
          />
          {query && (
            <button
              type="button"
              aria-label="清空搜索"
              onClick={() => {
                setQuery('');
                update({ q: '' });
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEEBF7] text-muted hover:text-ink"
            >
              <Icon name="close" size={14} strokeWidth={3} />
            </button>
          )}
        </label>

        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto" role="group" aria-label="按主线筛选">
          {(['all', ...TRACKS.map((t) => t.id)] as Filter[]).map((id) => {
            const active = filter === id;
            const theme = id === 'all' ? null : TRACK_THEME[id];
            const label = id === 'all' ? '全部' : TRACKS.find((t) => t.id === id)!.title;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => update({ track: id })}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-extrabold transition-colors ${
                  active
                    ? theme
                      ? `border-transparent ${theme.solid}`
                      : 'border-transparent bg-ink text-white'
                    : 'border-line bg-white text-muted hover:text-ink'
                }`}
              >
                {theme && <Icon name={theme.icon} size={15} />}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {searching ? (
        <section className="mt-3">
          <p className="mb-3 text-sm font-bold text-muted">找到 {results.length} 个条目</p>
          {results.length === 0 ? (
            <div className="rounded-blob border-2 border-dashed border-line px-4 py-10 text-center">
              <p className="text-base font-black text-ink">没找到相关条目</p>
              <p className="mt-1 text-sm font-semibold text-muted">换个关键词试试，比如「内存」「加密」「线程」。</p>
            </div>
          ) : (
            <EntryGrid cards={results} progress={progress} now={now} />
          )}
        </section>
      ) : (
        tracks.map((track) => {
          const theme = TRACK_THEME[track.id];
          return (
            <section key={track.id} className="mt-5">
              <div className="mb-3 flex items-center gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${theme.solid}`}>
                  <Icon name={theme.icon} size={17} />
                </span>
                <h2 className="text-lg font-black text-ink">{track.title}</h2>
                <span className="text-xs font-bold text-muted">{track.cards.length} 条</span>
              </div>
              {track.chapters.map((chapter) => {
                const cards = track.cards.filter((c) => c.chapter === chapter.id);
                if (cards.length === 0) return null;
                return (
                  <div key={chapter.id} className="mb-4">
                    <h3 className="mb-2 text-sm font-black text-ink/70">
                      {chapter.title}
                      <span className="ml-2 text-xs font-semibold text-muted">{chapter.blurb}</span>
                    </h3>
                    <EntryGrid cards={cards} progress={progress} now={now} />
                  </div>
                );
              })}
            </section>
          );
        })
      )}
    </Screen>
  );
}

function EntryGrid({
  cards,
  progress,
  now,
}: {
  cards: typeof ALL_CARDS;
  progress: ReturnType<typeof useStore.getState>['progress'];
  now: number;
}) {
  return (
    <ul className="m-0 grid list-none gap-2.5 p-0 sm:grid-cols-2">
      <AnimatePresence initial={false}>
        {cards.map((card) => {
          const theme = TRACK_THEME[card.track];
          const status = cardStatus(progress[card.id], now);
          return (
            <motion.li
              key={card.id}
              layout="position"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={`/wiki/${card.id}`}
                className="group flex h-full items-start gap-3 rounded-2xl border-2 border-line bg-white p-3.5 shadow-lip transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none"
              >
                <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.soft} ${theme.text}`}>
                  <Icon name={theme.icon} size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[15px] font-black text-ink">{card.title}</span>
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs font-semibold leading-relaxed text-muted">{card.explain}</span>
                </span>
                <i
                  role="img"
                  aria-label={STATUS_STYLE[status].label}
                  title={STATUS_STYLE[status].label}
                  className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_STYLE[status].bg}`}
                />
              </Link>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
