import { Box, BRAND, BRAND_SOFT, DiagramDefs, Label, MINT, MINT_SOFT, Part, PINK, SUN, SUN_SOFT, type DiagramProps } from './base';

export const PERF_PARTS = ['latency', 'pipeline', 'switch', 'parallel'];

/**
 * 性能与并发：四象限各回答一个问题。
 * 左上"差多少"、右上"怎么重叠"、左下"切换多贵"、右下"真并发长什么样"。
 */
export function PerfDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="latency" focus={focus}>
        <Label x={14} y={20} size={9} anchor="start">
          延迟差三个数量级
        </Label>
        <Label x={14} y={40} size={8} anchor="start" fill="#8B85A6">
          寄存器
        </Label>
        <rect x={62} y={32} width={18} height={10} rx={5} fill={MINT} stroke="#241A3D" strokeWidth={2} />
        <Label x={86} y={41} size={7} anchor="start" mono fill="#8B85A6">
          1 ns
        </Label>
        <Label x={14} y={60} size={8} anchor="start" fill="#8B85A6">
          内存
        </Label>
        <rect x={62} y={52} width={54} height={10} rx={5} fill={SUN} stroke="#241A3D" strokeWidth={2} />
        <Label x={122} y={61} size={7} anchor="start" mono fill="#8B85A6">
          100 ns
        </Label>
        <Label x={14} y={80} size={8} anchor="start" fill="#8B85A6">
          磁盘
        </Label>
        <rect x={62} y={72} width={130} height={10} rx={5} fill={PINK} stroke="#241A3D" strokeWidth={2} />
        <Label x={196} y={81} size={7} anchor="start" mono fill="#8B85A6">
          10 ms
        </Label>
      </Part>

      <Part id="pipeline" focus={focus}>
        <Label x={172} y={20} size={9} anchor="start">
          流水线让指令重叠
        </Label>
        {['取', '译', '执', '写'].map((name, i) => (
          <g key={name}>
            <Box x={172 + i * 34} y={32} w={28} h={22} fill={BRAND_SOFT} rx={6} strokeWidth={2.2} />
            <Label x={186 + i * 34} y={47} size={9}>
              {name}
            </Label>
            <Box x={172 + i * 34 + 12} y={62 + i * 12} w={28} h={10} fill={BRAND} rx={4} strokeWidth={1.8} />
          </g>
        ))}
        <Label x={196} y={124} size={7} fill="#8B85A6">
          第 1 条 →
        </Label>
      </Part>

      <Part id="switch" focus={focus}>
        <Label x={14} y={102} size={9} anchor="start">
          切换要保存现场
        </Label>
        <Box x={14} y={112} w={38} h={26} fill={SUN_SOFT} rx={7} strokeWidth={2.2} />
        <Label x={33} y={129} size={8}>
          进程 A
        </Label>
        <Box x={58} y={112} w={38} h={26} fill={MINT_SOFT} rx={7} strokeWidth={2.2} />
        <Label x={77} y={129} size={8}>
          进程 B
        </Label>
        <circle cx={112} cy={125} r={11} fill="#FFFFFF" stroke="#241A3D" strokeWidth={2.4} />
        <Label x={112} y={129} size={8}>
          CPU
        </Label>
        <path d="M100 118 C 94 108, 60 106, 40 110" fill="none" stroke="#241A3D" strokeWidth={2} strokeDasharray="3 3" />
        <path d="M100 132 C 94 142, 60 144, 40 140" fill="none" stroke="#241A3D" strokeWidth={2} strokeDasharray="3 3" />
        <Label x={14} y={158} size={7} anchor="start" fill="#8B85A6">
          寄存器、栈、页表全要换
        </Label>
      </Part>

      <Part id="parallel" focus={focus}>
        <Label x={172} y={102} size={9} anchor="start">
          多核才是真并行
        </Label>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <Box x={172 + i * 30} y={112} w={24} h={26} fill={i < 2 ? MINT : '#FFFFFF'} rx={5} strokeWidth={2.2} />
            <Label x={184 + i * 30} y={129} size={7}>
              核{i + 1}
            </Label>
            <rect x={174 + i * 30} y={144} width={20} height={5} rx={2.5} fill={i < 2 ? MINT : BRAND} opacity={i < 2 ? 1 : 0.25} />
          </g>
        ))}
        <Label x={172} y={162} size={7} anchor="start" fill="#8B85A6">
          两个真跑，两个在等
        </Label>
      </Part>
    </svg>
  );
}
