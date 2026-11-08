import { ChapterLabLink } from '../labs/LabsPage';
import { Link, useParams } from 'react-router-dom';
import { Screen } from '../../components/Screen';
import { ButtonLink } from '../../components/ButtonLink';
import { StickerCard } from '../../components/StickerCard';
import { Icon } from '../../components/Icon';
import { TRACK_THEME } from '../../components/trackTheme';
import { TRACKS, getCard } from '../../content';
import { useStore } from '../../store/useStore';
import { chapterState } from '../../lib/queue';
import { ChapterGuideDiagrams } from '../../illustrations/ChapterGuideDiagrams';
import { getIllustration } from '../../illustrations/registry';

export function ChapterGuidePage() {
  const { trackId, chapterId } = useParams();
  const progress = useStore((s) => s.progress);
  const track = TRACKS.find((t) => t.id === trackId);
  const chapter = track?.chapters.find((c) => c.id === chapterId);
  const guide = chapter?.guide;
  const back = (
    <Link to={track ? `/map/${track.id}` : '/map'} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-extrabold text-brand-dark transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30">
      <Icon name="arrow-left" size={16} />返回章节路径
    </Link>
  );

  if (!track || !chapter || !guide) {
    return <Screen title="暂无章节导读"><div className="space-y-5">{back}<StickerCard tone="paper" className="flex items-start gap-4 p-5"><Icon name="book" className="shrink-0 text-brand" /><p className="leading-relaxed">请选择已有导读的章节；其他章节仍可从路径直接学习。</p></StickerCard></div></Screen>;
  }
  if (chapterState(track, chapter.id, progress) === 'locked') {
    return <Screen title="章节尚未解锁"><div className="space-y-5">{back}<StickerCard tone="brand" className="flex items-start gap-4 p-5"><Icon name="lock" className="shrink-0 text-brand" /><p className="leading-relaxed">请先将前一章的卡片全部记牢。</p></StickerCard></div></Screen>;
  }

  const GuideDiagram = guide.illustration ? getIllustration(guide.illustration) : undefined;
  const theme = TRACK_THEME[track.id];
  const chapterNumber = String(track.chapters.indexOf(chapter) + 1).padStart(2, '0');
  const cardCount = track.cards.filter((card) => card.chapter === chapter.id).length;

  return (
    <Screen>
      <div className="mx-auto max-w-[820px] space-y-6">
        {back}
        <header className={`relative isolate overflow-hidden rounded-[28px] p-5 shadow-float sm:p-8 ${theme.banner}`}>
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-white/15" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-20 h-48 w-48 rounded-full border-[24px] border-white/10" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
              <span className="rounded-full bg-white px-3 py-1.5 text-ink">{track.title} · 第 {chapterNumber} 章</span>
              <span className="rounded-full bg-white px-3 py-1.5 text-brand-dark">章节导读</span>
            </div>
            <div className="mt-5 flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-black leading-tight tracking-tight text-ink sm:text-3xl">{chapter.title} · 章节导读</h1>
                <p className="mt-2 text-sm font-bold text-ink">先建立整体认识，再逐卡学习。</p>
              </div>
              <span aria-hidden="true" className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-white/90 shadow-lip sm:flex">
                <Icon name={theme.icon} size={34} className={theme.text} />
              </span>
            </div>
            <p className="mt-5 rounded-2xl bg-white/90 p-4 text-sm font-medium leading-loose text-ink sm:text-base">{guide.intro}</p>
            <ul aria-label="本章内容概览" className="mt-4 flex flex-wrap gap-2 text-xs font-extrabold text-ink">
              <li className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2"><Icon name="book" size={15} />{cardCount} 张知识卡</li>
              <li className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2"><Icon name="target" size={15} />{guide.objectives.length} 个学习目标</li>
              <li className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2"><Icon name="map" size={15} />{guide.scenario.steps.length} 步贯穿案例</li>
            </ul>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {([
            { title: '学习目标', id: 'guide-objectives', items: guide.objectives, icon: 'target', tone: 'brand', hint: '学完这一章，你将能够' },
            { title: '前置知识', id: 'guide-prerequisites', items: guide.prerequisites, icon: 'book', tone: 'sun', hint: '带着这些认识出发' },
          ] as const).map(({ title, id, items, icon, tone, hint }) => (
            <section key={id} aria-labelledby={id}>
              <StickerCard tone={tone} className="h-full p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-dark shadow-lip"><Icon name={icon} size={22} /></span>
                  <div><h2 id={id} className="text-lg font-black text-ink">{title}</h2><p className="mt-0.5 text-xs font-bold text-muted">{hint}</p></div>
                </div>
                <ul className="mt-5 space-y-3">
                  {items.map((item) => <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink"><span className="mt-0.5 shrink-0 rounded-full bg-white p-1 text-brand-dark"><Icon name="check" size={13} /></span><span>{item}</span></li>)}
                </ul>
              </StickerCard>
            </section>
          ))}
        </div>

        <ChapterLabLink chapterId={chapter.id} />
        {chapter.id === 'hw-cpu' && <ChapterGuideDiagrams />}
        {GuideDiagram && <section aria-label={`${chapter.title}概念图`}><StickerCard className="p-4 sm:p-6"><h2 className="mb-4 text-xl font-black">本章概念图</h2><GuideDiagram className="mx-auto h-auto w-full max-w-[620px]" /></StickerCard></section>}

        <section aria-labelledby="guide-scenario">
          <div className="mb-5 flex items-start gap-3 px-1">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${theme.solid} ${theme.lip}`}><Icon name="map" size={22} /></span>
            <div className="min-w-0"><p className="mb-1 text-xs font-extrabold text-brand-dark">把知识串起来</p><h2 id="guide-scenario" className="text-xl font-black leading-snug text-ink">贯穿案例：{guide.scenario.title}</h2><p className="mt-2 text-sm leading-relaxed text-muted">顺着场景理解每一步，也可以打开知识卡深入看看。</p></div>
          </div>
          <ol aria-label="案例步骤" className="space-y-5">
            {guide.scenario.steps.map((step, index) => (
              <li key={step.heading} className="relative pl-11 sm:pl-16">
                {index < guide.scenario.steps.length - 1 && <span aria-hidden="true" className="absolute bottom-[-20px] left-4 top-9 border-l-2 border-dashed border-brand/25 sm:left-6" />}
                <span aria-hidden="true" className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-brand text-sm font-black text-white shadow-lip sm:left-2">{String(index + 1).padStart(2, '0')}</span>
                <StickerCard className="p-4 sm:p-6">
                  <h3 className="text-base font-black text-ink sm:text-lg"><span className="sr-only">第 {index + 1} 步：</span>{step.heading}</h3>
                  <p className="mt-3 text-sm leading-loose text-ink/80">{step.body}</p>
                  {!!step.relatedCardIds?.length && (
                    <nav aria-label={`${step.heading}的关联知识`} className="mt-5 border-t border-line pt-4">
                      <p className="mb-3 text-xs font-extrabold text-muted">这一步的知识卡 · 打开百科</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {step.relatedCardIds.map((id) => {
                          const card = getCard(id)!;
                          const cardTheme = TRACK_THEME[card.track];
                          return (
                            <Link key={id} to={`/wiki/${id}`} aria-label={`查看知识卡：${card.title}`} className="group flex min-w-0 items-start gap-3 rounded-2xl border-2 border-line bg-paper p-3 shadow-lip transition-colors hover:border-brand/40 hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 focus-visible:ring-offset-2">
                              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cardTheme.soft} ${cardTheme.text}`}><Icon name={cardTheme.icon} size={20} /></span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-black text-ink">{card.title}</span>
                                <span className="mt-1 block text-xs leading-relaxed text-muted">{card.explain}</span>
                                <span className="mt-3 flex items-center gap-1 text-xs font-extrabold text-brand-dark">查看图解与详解<Icon name="arrow-right" size={14} /></span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </nav>
                  )}
                </StickerCard>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="guide-start">
          <StickerCard tone="brand" className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-[0_4px_0_#5A3DE6]"><Icon name="play" size={22} /></span>
              <div><h2 id="guide-start" className="text-xl font-black text-ink">把理解变成记忆</h2><p className="mt-1 text-sm leading-relaxed text-ink/80">接下来逐卡看图解、答题，再按计划复习。</p></div>
            </div>
            <p id="guide-progress-note" className="my-5 rounded-2xl bg-white/80 p-3 text-xs font-semibold leading-relaxed text-muted">阅读导读与百科不计学习进度，不会解锁章节或获得奖励。</p>
            <ButtonLink to={`/study?chapter=${chapter.id}`} aria-describedby="guide-progress-note" full size="lg"><Icon name="play" size={18} />开始本章学习<Icon name="arrow-right" size={18} /></ButtonLink>
          </StickerCard>
        </section>
      </div>
    </Screen>
  );
}
