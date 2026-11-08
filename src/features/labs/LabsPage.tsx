import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Screen } from '../../components/Screen';
import { StickerCard } from '../../components/StickerCard';
import { Icon } from '../../components/Icon';
import { Mascot } from '../../illustrations/Mascot';
import { LabIllustration } from './LabIllustration';
import { getCard } from '../../content';
import { decodeByte, toggleBit, QUERY_ROWS, QUERY_INDEX, queryTrace } from '../../lib/labs';

const control = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-extrabold text-brand-dark shadow-sm transition-colors hover:border-brand/40 hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-50';
const primary = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-extrabold text-white shadow-[0_4px_0_#5A3DE6] transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-50';
export const LABS = [
  { chapter: 'hw-binary', path: '/labs/binary', title: '进制实验台', hint: '切换 8 个 bit，对照位权、无符号数与二补码。', track: 'hardware', kind: 'binary' as const, relatedCardIds: ['hw-binary-01', 'hw-binary-02', 'hw-binary-03'] },
  { chapter: 'db-index', path: '/labs/index', title: '索引查询演示', hint: '逐步比较顺序扫描与有序索引二分查找。', track: 'database', kind: 'index' as const, relatedCardIds: ['db-index-01', 'db-index-02', 'db-index-03', 'db-index-04'] },
];

export function ChapterLabLink({ chapterId }: { chapterId: string }) {
  const lab = LABS.find((item) => item.chapter === chapterId);
  return lab ? <Link className={control + ' mt-3 flex text-center'} to={lab.path}>{lab.title}<Icon name="arrow-right" size={15} /></Link> : null;
}

function LabNote() {
  return <div className="flex items-start gap-3 rounded-2xl border border-line bg-white/70 px-4 py-3"><Icon name="shield" size={18} className="mt-0.5 shrink-0 text-brand" /><p className="text-xs font-semibold leading-relaxed text-muted">自由探索实验，不计学习进度，不改变 SRS、奖励或章节解锁状态。离开页面后实验重置。</p></div>;
}

function LabHeader({ title, subtitle, kind }: { title: string; subtitle: string; kind?: 'binary' | 'index' }) {
  return <>
    <Link to={kind ? '/labs' : '/'} className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-extrabold text-brand-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"><Icon name="arrow-left" size={17} />{kind ? '返回实验室' : '返回首页'}</Link>
    <header className={'relative isolate mb-6 overflow-hidden rounded-[28px] p-6 shadow-float sm:p-8 ' + (kind ? 'border border-line bg-white' : 'bg-gradient-to-br from-[#8A6BFF] via-brand to-brand-dark text-white')}>
      <div aria-hidden="true" className={'absolute -right-16 -top-20 h-72 w-72 rounded-full ' + (kind === 'index' ? 'bg-mint-soft/60' : kind ? 'bg-brand-soft/70' : 'bg-white/10')} />
      <div className="relative grid items-center gap-4 sm:grid-cols-[1fr_240px]">
        <div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1><p className={'mt-3 max-w-md text-sm font-semibold leading-relaxed ' + (kind ? 'text-muted' : 'text-white/85')}>{subtitle}</p>
          {!kind && <p className="mt-5 text-sm font-bold text-white/90">拨动一位，看懂数字。查找一次，理解索引。</p>}
        </div>
        {kind ? <div className="mx-auto w-full max-w-[240px]"><LabIllustration kind={kind} /></div> : <div aria-hidden="true" className="relative mx-auto flex h-32 w-40 items-center justify-center sm:h-40"><div className="absolute inset-1 rounded-full border border-white/20 bg-white/10" /><Mascot size={138} still /></div>}
      </div>
    </header>
  </>;
}

function SectionTitle({ icon, title, detail }: { icon: 'chip' | 'search' | 'book'; title: string; detail: string }) {
  return <div className="mb-6 flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand"><Icon name={icon} size={22} /></span><div><h2 className="text-lg font-black text-ink">{title}</h2><p className="mt-0.5 text-xs font-semibold text-muted">{detail}</p></div></div>;
}

function LabFooter({ chapterId, to, children }: { chapterId: string; to: string; children: ReactNode }) {
  const lab = LABS.find((item) => item.chapter === chapterId)!;
  return <div className="space-y-5">
    <StickerCard className="p-5 sm:p-6">
      <SectionTitle icon="book" title="相关百科知识" detail="把刚才观察到的现象，连回图解与详解。" />
      <nav aria-label="相关百科知识" className="grid gap-3 sm:grid-cols-2">
        {lab.relatedCardIds.map((cardId) => {
          const card = getCard(cardId)!;
          return <Link key={cardId} to={'/wiki/' + cardId} aria-label={'查看知识卡：' + card.title} className="group flex min-w-0 items-start gap-3 rounded-2xl border-2 border-line bg-paper p-3 shadow-lip transition-colors hover:border-brand/40 hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30">
            <Icon name="book" size={20} className="mt-1 shrink-0 text-brand" />
            <span className="min-w-0"><span className="block text-sm font-black text-ink">{card.title}</span><span className="mt-1 block text-xs leading-relaxed text-muted">{card.explain}</span><span className="mt-2 flex items-center gap-1 text-xs font-bold text-brand">查看图解与详解<Icon name="arrow-right" size={14} /></span></span>
          </Link>;
        })}
      </nav>
    </StickerCard>
    <LabNote /><Link className={control} to={to}><Icon name="arrow-left" size={16} />{children}</Link>
  </div>;
}

export function LabsPage() {
  return <Screen><LabHeader title="动手实验室" subtitle="把知识变成可以操作的小实验。" />
    <div className="space-y-6">
      <SectionTitle icon="chip" title="选一个实验，动手试试" detail="不必先通关章节，随时开始探索。" />
      <div className="grid gap-5 sm:grid-cols-2">{LABS.map((lab) => <StickerCard key={lab.path} className="overflow-hidden">
        <div className={'border-b border-line px-7 py-3 ' + (lab.kind === 'binary' ? 'bg-brand-soft/70' : 'bg-mint-soft/70')}><LabIllustration kind={lab.kind} /></div>
        <div className="p-6"><div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-muted"><Icon name={lab.kind === 'binary' ? 'chip' : 'database'} size={15} />{lab.kind === 'binary' ? '硬件与原理' : '数据库'}</div><h2 className="text-2xl font-black">{lab.title}</h2><p className="mb-6 mt-3 text-sm leading-relaxed text-muted">{lab.hint}</p><Link to={lab.path} className={primary + ' w-full'}>打开{lab.title}<Icon name="arrow-right" size={17} /></Link></div>
      </StickerCard>)}</div><LabNote />
    </div>
  </Screen>;
}

export function BinaryLabPage() {
  const [value, setValue] = useState(0);
  const decoded = decodeByte(value);
  return <Screen><LabHeader title="进制实验台" subtitle="固定 8 bit · 同一串位，两种整数解释" kind="binary" />
    <div className="space-y-6">
      <StickerCard className="p-5 sm:p-7">
        <SectionTitle icon="chip" title="拨动你的 8 位开关" detail="从左到右是 b7 到 b0。点击或用键盘切换每一位。" />
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">{decoded.bits.map((bit, position) => <button key={position} className="min-h-28 rounded-2xl border border-line bg-paper px-2 py-3 font-extrabold text-muted shadow-[0_3px_0_#E7E3F3] transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-white aria-pressed:shadow-[0_3px_0_#5A3DE6] aria-pressed:hover:bg-brand-dark" aria-label={'切换 b' + (7 - position)} aria-pressed={bit === 1} onClick={() => setValue(toggleBit(value, 7 - position))}><span className="block text-xs">b{7 - position}</span><span className="my-1 block font-mono text-3xl">{bit}</span><span className="block text-[11px]">权 {2 ** (7 - position)}</span></button>)}</div>
        <div className="mt-6 flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-bold text-muted">边界预设</span>{[0, 127, 128, 255].map((preset) => <button key={preset} className={control} onClick={() => setValue(preset)}>预设 {preset}</button>)}<button className={control + ' sm:ml-auto'} onClick={() => setValue(0)}>重置</button></div>
      </StickerCard>
      <div role="status" aria-live="polite" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-ink px-5 py-4 text-white"><p className="text-sm font-bold">位串：<span className="ml-2 font-mono text-2xl tracking-[0.18em]">{decoded.bits.join('')}</span></p><span className="text-xs text-white/60">同一串位 · 不同解释</span></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <StickerCard tone="brand" className="p-5 sm:p-6"><p className="text-sm font-extrabold text-brand-dark">无符号：<span className="mt-2 block font-mono text-5xl font-black">{decoded.unsigned}</span></p><p className="mt-3 text-xs font-semibold text-muted">（范围 0..255） · 最高位权重 +128</p></StickerCard>
          <StickerCard tone="mint" className="p-5 sm:p-6"><p className="text-sm font-extrabold text-ink">二补码：<span className="mt-2 block font-mono text-5xl font-black">{decoded.signed}</span></p><p className="mt-3 text-xs font-semibold text-muted">（范围 -128..127） · 最高位权重 -128</p></StickerCard>
        </div>
        <p className="rounded-2xl border border-line bg-white px-5 py-4 text-sm leading-7 text-muted"><span className="font-extrabold text-ink">二补码位权求和：</span>{decoded.bits.map((bit, position) => bit + ' × ' + (position === 0 ? '(-128)' : 2 ** (7 - position))).join(' + ')} = <strong className="text-brand-dark">{decoded.signed}</strong></p>
      </div>
      <StickerCard tone="sun" className="p-5"><SectionTitle icon="book" title="为什么同一串位，会得到两个数？" detail="区别在于最高位的解释，而不是数字本身改变了。" /><p className="text-sm leading-7">最高位 b7 在无符号解释中权重为 +128，在二补码解释中权重为 -128；其余位仍为 +64、+32、+16、+8、+4、+2、+1。它不是把其余七位直接加上负号：10000000 表示 -128，11111111 表示 -1。</p></StickerCard>
      <LabFooter chapterId="hw-binary" to="/map/hardware">返回硬件与原理章节</LabFooter>
    </div>
  </Screen>;
}

export function IndexLabPage() {
  const [input, setInput] = useState('47');
  const [step, setStep] = useState(0);
  const valid = /^-?\d+$/.test(input.trim()) && Number.isSafeInteger(Number(input));
  const target = Number(input);
  const traces = valid ? [queryTrace(target, 'scan'), queryTrace(target, 'binary')] : [];
  const finished = valid && traces.every((trace) => step >= trace.length - 1);
  return <Screen><LabHeader title="索引查询演示" subtitle="相同数据、相同目标，每次前进一步" kind="index" />
    <div className="space-y-6">
      <StickerCard className="p-5 sm:p-7">
        <SectionTitle icon="search" title="发起一次查找" detail="让两种查找方式一起出发，观察它们走过的路径。" />
        <label className="mb-2 block text-sm font-extrabold" htmlFor="query-target">目标整数键</label>
        <div className="flex flex-wrap items-center gap-3"><input id="query-target" type="text" inputMode="numeric" className="min-h-12 w-full rounded-xl border border-line bg-paper px-4 py-2 font-mono text-xl font-bold text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 sm:w-48" value={input} aria-invalid={!valid} aria-describedby="query-hint" onChange={(event) => { setInput(event.target.value); setStep(0); }} /><button className={primary} disabled={!valid || finished} onClick={() => setStep(step + 1)}><Icon name="play" size={15} />下一步</button><button className={control} onClick={() => setStep(0)}>重置查询</button></div>
        <p id="query-hint" className={'mt-4 text-xs leading-relaxed ' + (valid ? 'text-muted' : 'text-bad-dark')}>试试 47（存在）或 42（不存在）。更换目标会清零比较次数。{!valid && '请输入有效的安全整数，不接受小数或空值。'}</p>
      </StickerCard>
      <div className="grid items-start gap-5 md:grid-cols-2">{(['scan', 'binary'] as const).map((mode, position) => {
        const rows = mode === 'scan' ? QUERY_ROWS : QUERY_INDEX;
        const trace = traces[position];
        const current = trace?.[Math.min(step, trace.length - 1)];
        const title = mode === 'scan' ? '顺序扫描' : '有序索引二分查找';
        const found = current?.status === 'found';
        const missing = current?.status === 'missing';
        return <section key={mode} aria-label={title}><StickerCard className="overflow-hidden">
          <div className={'border-b border-line px-5 py-5 ' + (mode === 'scan' ? 'bg-brand-soft/60' : 'bg-mint-soft/60')}><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand shadow-sm"><Icon name={mode === 'scan' ? 'search' : 'database'} /></span><h2 className="text-lg font-black">{title}</h2></div><p className="mt-3 text-xs font-semibold leading-relaxed text-muted">{mode === 'scan' ? '按原始记录顺序，从头逐条检查。' : '按键排序，比较中间键，再保留一半范围。'}</p></div>
          <div className="p-5"><ol className="grid grid-cols-3 gap-2">{rows.map((row, rowPosition) => {
            const active = current?.position === rowPosition;
            return <li key={row.key} aria-current={active ? 'step' : undefined} className={'rounded-xl border px-2 py-3 text-center transition-colors ' + (active ? found ? 'border-mint bg-mint-soft text-ink' : 'border-brand bg-brand-soft text-brand-dark' : 'border-line bg-paper text-muted')}><span className="block text-[10px] font-bold">位置 {rowPosition + 1}</span><span className="my-1 block text-lg font-black">键 {row.key}</span><span className="block text-[10px]">{row.name}</span></li>;
          })}</ol>
          <div role="status" aria-live="polite" className="mt-5 space-y-3"><p className="flex items-baseline justify-between border-b border-line pb-3 text-xs font-bold text-muted">比较次数：<span className="font-mono text-3xl font-black text-ink">{current?.comparisons ?? 0}</span></p><p className="text-xs text-muted">当前位置：{current?.position != null ? (current.position + 1) + '（键 ' + current.key + '）' : '—'}</p><p className={'flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold ' + (found ? 'bg-mint-soft text-ink' : missing ? 'bg-sun-soft text-ink' : 'bg-paper text-muted')}><Icon name={found ? 'check' : 'search'} size={16} />结果：{!valid ? '等待有效目标' : found ? '找到键 ' + current?.row?.key + ' · ' + current?.row?.name : missing ? '不存在' : current?.status === 'ready' ? '尚未开始' : '查找中'}</p></div>
          </div>
        </StickerCard></section>;
      })}</div>
      <StickerCard tone="sun" className="p-5"><SectionTitle icon="book" title="模型边界与代价" detail="比较次数，不等于真实数据库的执行时间。" /><div className="space-y-3 text-sm leading-7"><p>这是唯一整数键、固定 9 条记录的简化模型：索引只是排序后的键与记录引用，不是数据库 B+树，也不是真实耗时基准。每次键的三向比较计 1 次，不计算建索引、回表、缓存或磁盘 I/O。</p><p>索引需要额外空间；插入、更新、删除时还要维护索引，增加写入代价。二分查找不代表所有查询都更快，顺序扫描也可能先命中。</p></div></StickerCard>
      <LabFooter chapterId="db-index" to="/map/database">返回数据库章节</LabFooter>
    </div>
  </Screen>;
}
