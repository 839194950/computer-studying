import { useId, type ReactNode } from 'react';
import { Box, Label, INK, BRAND, BRAND_SOFT, MINT_SOFT, SKY_SOFT, SUN_SOFT, PAPER } from './base';

function Diagram({ title, description, height, children }: {
  title: string; description: string; height: number; children: ReactNode;
}) {
  const id = useId();
  return (
    <svg role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`} viewBox={`0 0 360 ${height}`} className="mx-auto block h-auto w-full max-w-[440px]" fill="none">
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-desc`}>{description}</desc>
      {children}
    </svg>
  );
}

/** 箭头直接绘制，不依赖全局 marker ID；只表达图中注明的方向。 */
function Down({ y, label }: { y: number; label?: string }) {
  return <g stroke={BRAND} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={`M180 ${y} v26 m-5 -5 l5 5 5 -5`} />
    {label && <Label x={194} y={y + 18} anchor="start" size={12}>{label}</Label>}
  </g>;
}

export function ComputerRolesDiagram() {
  return (
    <Diagram title="部件协作：CPU、内存、存储与输入输出" description="输入设备提供数据，输出设备呈现结果；通过输入输出系统与 CPU、内存协作。CPU 执行指令，内存暂放运行中的指令和数据，SSD 或硬盘长期保存文件。连线表示协作关系，不是实际接线图；缓存未在此图展开。" height={380}>
      <Box x={16} y={12} w={148} h={62} fill={SKY_SOFT} />
      <Label x={90} y={38} size={16}>输入 · 键盘</Label>
      <Label x={90} y={60} size={13}>提供操作与数据</Label>
      <Box x={196} y={12} w={148} h={62} fill={SKY_SOFT} />
      <Label x={270} y={38} size={16}>输出 · 屏幕</Label>
      <Label x={270} y={60} size={13}>呈现处理结果</Label>
      <path d="M90 78 V94 H270 V78 M180 94 V114" stroke={BRAND} strokeWidth={2} />
      <Label x={180} y={134} size={14}>输入 / 输出系统</Label>
      <path d="M180 145 V162 M90 180 V162 H270 V180" stroke={BRAND} strokeWidth={2} />
      <Box x={16} y={180} w={148} h={74} fill={BRAND_SOFT} />
      <Label x={90} y={210} size={18}>CPU</Label>
      <Label x={90} y={236} size={13}>执行指令、处理数据</Label>
      <Box x={196} y={180} w={148} h={74} fill={MINT_SOFT} />
      <Label x={270} y={210} size={18}>内存 RAM</Label>
      <Label x={270} y={236} size={13}>暂放指令和数据</Label>
      <path d="M168 215 H192 m-4 -4 l4 4 -4 4 M172 211 l-4 4 4 4 M270 258 V294 m-4 -4 l4 4 4 -4 M266 262 l4 -4 4 4" stroke={BRAND} strokeWidth={2} strokeLinejoin="round" />
      <Label x={254} y={280} anchor="end" size={12}>读文件 / 写回保存</Label>
      <Box x={16} y={300} w={328} h={65} fill={SUN_SOFT} />
      <Label x={180} y={327} size={16}>存储 · SSD / 硬盘</Label>
      <Label x={180} y={350} size={13}>长期保存程序与文件，断电后仍保留</Label>
    </Diagram>
  );
}

export function ProgramExecutionDiagram() {
  return (
    <Diagram title="程序运行：从加载到执行，再到保存" description="打开笔记应用时，操作系统将所需代码和数据从存储加载到内存。CPU 从内存体系取指，译码并执行，反复处理输入和更新结果。屏幕显示不等于文件已经保存；保存时数据经操作系统和输入输出系统写回存储。此图省略缓存细节，加载不代表一次读入整个程序。" height={468}>
      {[
        { y: 12, fill: SUN_SOFT, title: '1 · 存储中有程序文件', text: 'SSD / 硬盘：笔记应用与旧笔记' },
        { y: 120, fill: MINT_SOFT, title: '2 · 内存准备运行内容', text: '操作系统加载所需代码和数据' },
        { y: 228, fill: BRAND_SOFT, title: '3 · CPU 反复执行', text: '取指 → 译码 → 执行 → 下一条' },
        { y: 372, fill: SUN_SOFT, title: '4 · 保存到存储', text: '经操作系统与 I/O 写回文件' },
      ].map((step) => <g key={step.y}>
        <Box x={16} y={step.y} w={328} h={70} fill={step.fill} />
        <Label x={180} y={step.y + 28} size={17}>{step.title}</Label>
        <Label x={180} y={step.y + 53} size={13}>{step.text}</Label>
      </g>)}
      <Down y={86} label="按需加载" />
      <Down y={194} label="取指、读写数据" />
      <Label x={180} y={325} size={13}>键盘输入 → 处理 → 屏幕更新</Label>
      <Down y={335} label="需要保存时" />
      <Label x={180} y={463} size={12}>屏幕上看得到 ≠ 已经保存到文件</Label>
    </Diagram>
  );
}

export function StorageHierarchyDiagram() {
  return (
    <Diagram title="存储层级：寄存器、缓存、内存与持久存储" description="典型层级由上到下是寄存器、CPU 缓存、主内存 RAM、SSD 或硬盘。通常越靠上越快、容量越小。寄存器保存当前操作数，缓存保存内存内容的副本，RAM 保存运行中的程序和数据，SSD 或硬盘保存持久文件。缓存通常位于 CPU 芯片内，不是内存条，也不是硬盘；图示宽度不代表真实容量比例。" height={388}>
      <Label x={180} y={22} size={14}>上层通常更快、更小；下层更大、更慢</Label>
      <rect x={73} y={39} width={214} height={157} rx={18} stroke={BRAND} strokeWidth={2} strokeDasharray="5 4" />
      <Label x={180} y={60} size={12}>CPU 芯片内（典型情况）</Label>
      <Box x={106} y={72} w={148} h={48} fill={BRAND_SOFT} />
      <Label x={180} y={92} size={16}>寄存器</Label>
      <Label x={180} y={111} size={12}>当前操作数与状态</Label>
      <Box x={86} y={136} w={188} h={48} fill={SUN_SOFT} />
      <Label x={180} y={156} size={16}>缓存 Cache</Label>
      <Label x={180} y={175} size={12}>内存内容的副本</Label>
      <Box x={54} y={213} w={252} h={56} fill={MINT_SOFT} />
      <Label x={180} y={236} size={16}>主内存 RAM</Label>
      <Label x={180} y={258} size={13}>运行中的程序与数据 · 易失</Label>
      <Box x={16} y={290} w={328} h={56} fill={SKY_SOFT} />
      <Label x={180} y={313} size={16}>持久存储 · SSD / 硬盘</Label>
      <Label x={180} y={335} size={13}>程序与文件 · 断电后保留</Label>
      <Label x={180} y={376} size={12} fill={INK}>层级示意，宽度不按真实容量比例绘制</Label>
    </Diagram>
  );
}

export function ChapterGuideDiagrams() {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="space-y-4">
      <h2 id={headingId} className="text-xl font-black text-ink">三张图看懂计算机组成</h2>
      {[
        { title: '部件各司其职', Diagram: ComputerRolesDiagram, caption: '连线表示协作而非实际接线。CPU 负责执行，内存承载运行现场，存储保留文件，输入输出连接用户。' },
        { title: '程序如何跑起来', Diagram: ProgramExecutionDiagram, caption: '以打开笔记应用为例：按需加载、循环执行、处理输入输出、保存写回。为突出主流程，这里省略缓存细节。' },
        { title: '不要把缓存当内存条', Diagram: StorageHierarchyDiagram, caption: '寄存器、缓存、RAM 通常断电失去内容；SSD / 硬盘用于持久保存。层级表达典型速度与容量趋势，不代表固定延迟。' },
      ].map(({ title, Diagram: Illustration, caption }, index) => (
        <figure key={title} className="rounded-3xl border-2 border-line bg-white p-3 shadow-lip sm:p-6">
          <h3 className="mb-4 text-base font-black text-ink"><span className="mr-2 text-brand-dark">0{index + 1}</span>{title}</h3>
          <Illustration />
          <figcaption className="mt-4 rounded-xl p-3 text-sm leading-relaxed text-ink" style={{ background: PAPER }}>{caption}</figcaption>
        </figure>
      ))}
    </section>
  );
}
