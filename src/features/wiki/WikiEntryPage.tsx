import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Screen } from '../../components/Screen';
import { Icon } from '../../components/Icon';
import { ButtonLink } from '../../components/ButtonLink';
import { TRACK_THEME } from '../../components/trackTheme';
import { getIllustration } from '../../illustrations/registry';
import { ALL_CARDS, findChapter, getCard, getDetail } from '../../content';
import { useStore } from '../../store/useStore';
import { cardStatus } from '../../lib/stats';
import { chapterState } from '../../lib/queue';
import { formatMonthDay } from '../../lib/time';
import { STATUS_STYLE } from '../stats/statusStyle';

const LETTERS = ['A', 'B', 'C', 'D'];

/**
 * 百科条目：图解 + 分步要点 + 详细讲解 + 小测。
 * 小测只用来自查，不写入复习进度，复习排期仍由学习页负责。
 */
export function WikiEntryPage() {
  const { cardId = '' } = useParams();
  const card = getCard(cardId);
  const progress = useStore((s) => s.progress);
  const [focus, setFocus] = useState<string[]>([]);
  const [picked, setPicked] = useState<number | null>(null);

  if (!card) return <Navigate to="/wiki" replace />;

  const theme = TRACK_THEME[card.track];
  const scope = findChapter(card.chapter)!;
  const Illustration = getIllustration(card.illustration);
  const detail = getDetail(card.id);
  const p = progress[card.id];
  const status = cardStatus(p, Date.now());
  const siblings = ALL_CARDS.filter((c) => c.chapter === card.chapter);
  const pos = siblings.findIndex((c) => c.id === card.id);
  const prev = siblings[pos - 1];
  const next = siblings[pos + 1];
  const canStudy = chapterState(scope.track, scope.chapter.id, progress) !== 'locked';

  return (
    <Screen key={card.id}>
      <div className="mx-auto max-w-[760px]">
        <Link
          to="/wiki"
          className="mb-4 inline-flex items-center gap-1 rounded-xl px-1.5 py-1 text-sm font-extrabold text-muted hover:bg-white hover:text-ink"
        >
          <Icon name="arrow-left" size={18} />
          百科
        </Link>

        <header className={`relative overflow-hidden rounded-[26px] p-5 text-white shadow-float md:p-6 ${theme.banner}`}>
          <div aria-hidden className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-2 text-xs font-extrabold text-white/85">
            <Icon name={theme.icon} size={15} />
            {scope.track.title} · {scope.chapter.title}
          </div>
          <h1 className="relative mt-2 text-[26px] font-black leading-tight">{card.title}</h1>
          <p className="relative mt-2 text-[15px] font-bold leading-relaxed text-white/90">{card.explain}</p>
          <div className="relative mt-4 flex flex-wrap items-center gap-2 text-xs font-extrabold">
            <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1">
              <i className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLE[status].bg}`} />
              {STATUS_STYLE[status].label}
            </span>
            {p && <span className="rounded-full bg-white/20 px-2.5 py-1">下次复习 {formatMonthDay(p.dueAt)}</span>}
          </div>
        </header>

        <section className="mt-4 overflow-hidden rounded-[22px] border-2 border-line bg-white shadow-lip">
          <div className="flex justify-center px-3 py-5">
            <Illustration className="h-auto w-full max-w-[620px]" focus={focus} />
          </div>
          <ol className="m-0 list-none border-t-2 border-line p-0">
            {card.steps.map((step, i) => {
              const active = focus.length > 0 && step.focus.join() === focus.join();
              return (
                <li key={i} className="border-b-2 border-line last:border-b-0">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFocus(active ? [] : step.focus)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                      active ? theme.soft : 'hover:bg-paper'
                    }`}
                  >
                    <span
                      className={`tabular mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                        active ? theme.solid : 'bg-[#EEEBF7] text-muted'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[14px] font-bold leading-relaxed text-ink">{step.caption}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="border-t-2 border-line bg-paper px-4 py-2 text-[11px] font-bold text-muted">点一条要点，图上对应的部分会亮起来。</p>
        </section>

        {detail.length > 0 && (
          <section className="mt-4 rounded-[22px] border-2 border-line bg-white p-5 shadow-lip">
            <h2 className="flex items-center gap-2 text-base font-black text-ink">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-soft text-sky-dark">
                <Icon name="book" size={16} />
              </span>
              详细讲解
            </h2>
            <div className="mt-3 space-y-4">
              {detail.map((section) => (
                <div key={section.heading}>
                  <h3 className={`text-[15px] font-black ${theme.text}`}>{section.heading}</h3>
                  <p className="mt-1 text-[15px] leading-[1.9] text-ink/80">{section.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-4 rounded-[22px] border-2 border-line bg-white p-5 shadow-lip">
          <h2 className="flex items-center gap-2 text-base font-black text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sun-soft text-[#B07F00]">
              <Icon name="target" size={16} />
            </span>
            小测一下
            <span className="text-xs font-semibold text-muted">不计入复习进度</span>
          </h2>
          <p className="mt-3 text-[15px] font-black text-ink">{card.question}</p>
          <div className="mt-3 space-y-2">
            {card.options.map((option, i) => {
              const answered = picked !== null;
              const right = i === card.answerIndex;
              const tone = !answered
                ? 'border-line bg-white hover:bg-paper'
                : right
                  ? 'border-mint bg-mint-soft text-[#137A47]'
                  : i === picked
                    ? 'border-bad bg-bad-soft text-[#B3243F]'
                    : 'border-line bg-white text-ink/45';
              return (
                <button
                  key={i}
                  type="button"
                  disabled={answered}
                  onClick={() => setPicked(i)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-bold transition-colors ${tone}`}
                >
                  <span className="text-xs font-black text-muted">{LETTERS[i]}</span>
                  {option}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-xl bg-paper p-3 text-sm font-semibold leading-relaxed text-ink/80"
            >
              {picked === card.answerIndex ? '答对了。' : '不对。'}
              {card.explanation}
              <button type="button" onClick={() => setPicked(null)} className="ml-2 font-black text-brand">
                重做
              </button>
            </motion.p>
          )}
        </section>

        {canStudy && (
          <ButtonLink to={`/study?chapter=${card.chapter}`} size="lg" full className="mt-5">
            <Icon name="play" size={18} />
            去学「{scope.chapter.title}」这一章
          </ButtonLink>
        )}

        <nav aria-label="同章条目" className="mt-4 grid grid-cols-2 gap-3">
          {prev ? (
            <Link to={`/wiki/${prev.id}`} className="rounded-2xl border-2 border-line bg-white p-3 shadow-lip transition-transform hover:-translate-y-0.5">
              <span className="text-[11px] font-extrabold text-muted">← 上一条</span>
              <span className="mt-0.5 block truncate text-sm font-black text-ink">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/wiki/${next.id}`} className="rounded-2xl border-2 border-line bg-white p-3 text-right shadow-lip transition-transform hover:-translate-y-0.5">
              <span className="text-[11px] font-extrabold text-muted">下一条 →</span>
              <span className="mt-0.5 block truncate text-sm font-black text-ink">{next.title}</span>
            </Link>
          )}
        </nav>
      </div>
    </Screen>
  );
}
