import {
  anim,
  Box,
  BRAND,
  BRAND_SOFT,
  DiagramDefs,
  Flow,
  Label,
  MINT,
  MINT_SOFT,
  Part,
  PINK,
  Ripple,
  SKY,
  SUN,
  SUN_SOFT,
  type DiagramProps,
} from './base';

export const PERF_PARTS = ['latency', 'pipeline', 'switch', 'parallel'];

const LATENCY = [
  { name: '寄存器', w: 10, color: MINT, text: '1 ns' },
  { name: '内存', w: 38, color: SUN, text: '100 ns' },
  { name: '磁盘', w: 72, color: PINK, text: '10 ms' },
];

const STAGES = ['取', '译', '执', '写'];
const ROW_COLORS = [BRAND, SKY, MINT];

/**
 * 性能四象限，每格一个直觉：
 * 左上：延迟差几个数量级（条会反复长出来）；右上：流水线让几条指令同时各占一个阶段（竖条扫过表示"此刻"）；
 * 左下：切换进程要搬现场（一颗光点从 A 经 CPU 搬到 B）；右下：多核才是真并行（只有两核的进度条在长）。
 */
export function PerfDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="latency" focus={focus}>
        <Label x={10} y={16} size={9} anchor="start">
          延迟差几个数量级
        </Label>
        {LATENCY.map((row, i) => (
          <g key={row.name}>
            <Label x={10} y={36 + i * 20} size={8} anchor="start" fill="#8B85A6">
              {row.name}
            </Label>
            <rect x={46} y={29 + i * 20} width={row.w} height={9} rx={4.5} fill={row.color} {...anim('grow', { delay: i * 0.25 })} />
            <Label x={50 + row.w} y={36.5 + i * 20} size={7} anchor="start" fill="#8B85A6" mono>
              {row.text}
            </Label>
          </g>
        ))}
        <Label x={10} y={92} size={7} anchor="start" fill="#8B85A6">
          条长只是示意，真实差距远比这大
        </Label>
      </Part>

      <Part id="pipeline" focus={focus}>
        <Label x={170} y={16} size={9} anchor="start">
          流水线让指令重叠
        </Label>
        {STAGES.map((name, c) => (
          <g key={name}>
            <Box x={170 + c * 36} y={24} w={32} h={18} fill={BRAND_SOFT} rx={6} />
            <Label x={186 + c * 36} y={36.5} size={8.5}>
              {name}
            </Label>
          </g>
        ))}
        {ROW_COLORS.map((color, r) =>
          STAGES.map((_, c) =>
            c >= r ? (
              <rect key={`${r}-${c}`} x={172 + c * 36} y={50 + r * 11} width={28} height={8} rx={4} fill={color} opacity={0.85} />
            ) : null,
          ),
        )}
        {/* travel 的关键帧会把 opacity 拉到 1，所以透明度放在外层 g 上 */}
        <g opacity={0.14}>
          <rect x={169} y={47} width={34} height={36} rx={6} fill={BRAND} {...anim('travel', { dx: 108, dur: 3.2 })} />
        </g>
        <Label x={170} y={95} size={7} anchor="start" fill="#8B85A6">
          同一时刻，三条指令各占一个阶段
        </Label>
      </Part>

      <Part id="switch" focus={focus}>
        <Label x={10} y={110} size={9} anchor="start">
          切换要保存现场
        </Label>
        <Box x={10} y={124} w={44} h={24} fill={SUN_SOFT} rx={7} />
        <Label x={32} y={140} size={8}>
          进程 A
        </Label>
        <circle cx={82} cy={136} r={12} fill="#FFFFFF" stroke="#8E84B3" strokeWidth={1.6} />
        <Label x={82} y={139} size={7.5}>
          CPU
        </Label>
        <Ripple cx={82} cy={136} r={12} />
        <Box x={110} y={124} w={44} h={24} fill={MINT_SOFT} rx={7} />
        <Label x={132} y={140} size={8}>
          进程 B
        </Label>
        <path d="M32 122 C 44 111, 120 111, 132 122" stroke="#8E84B3" strokeWidth={1.4} strokeDasharray="3 3" className="dg-march" />
        <Flow d="M32 122 C 44 111, 120 111, 132 122" color={BRAND} dur={2.6} dash={8} />
        <Label x={10} y={166} size={7} anchor="start" fill="#8B85A6">
          寄存器、栈、页表全要换，换一次就有开销
        </Label>
      </Part>

      <Part id="parallel" focus={focus}>
        <Label x={170} y={114} size={9} anchor="start">
          多核才是真并行
        </Label>
        {[0, 1, 2, 3].map((i) => {
          const busy = i < 2;
          return (
            <g key={i}>
              <Box x={170 + i * 36} y={124} w={30} h={24} fill={busy ? MINT : '#FFFFFF'} rx={6} />
              <Label x={185 + i * 36} y={140} size={7.5} fill={busy ? '#FFFFFF' : '#8B85A6'}>
                核{i + 1}
              </Label>
              <rect x={170 + i * 36} y={153} width={30} height={4} rx={2} fill="#ECE9F5" />
              {busy && (
                <rect x={170 + i * 36} y={153} width={30} height={4} rx={2} fill={MINT} {...anim('grow', { delay: i * 0.4, dur: 2.4 })} />
              )}
            </g>
          );
        })}
        <Label x={170} y={168} size={7} anchor="start" fill="#8B85A6">
          两核在跑，两核空着：线程多≠更快
        </Label>
      </Part>
    </svg>
  );
}
