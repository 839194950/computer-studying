import { Arrow, Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, SKY_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const CPU_PARTS = ['cpu', 'cache', 'ram', 'disk'];

/**
 * 计算机组成：CPU 内部三段 + 缓存 + 内存 + 磁盘。
 * 越往右越慢越大，底部一排是量级刻度，帮人建立"快慢差三个数量级"的直觉。
 * 横向留 20px 给箭头，不要把四个盒子挤成一条线。
 */
export function CpuDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="cpu" focus={focus}>
        <Box x={6} y={26} w={84} h={112} fill={BRAND_SOFT} />
        <Label x={48} y={18} size={11}>
          CPU
        </Label>
        <Box x={14} y={34} w={68} h={28} fill={SKY_SOFT} rx={7} strokeWidth={2.4} />
        <Label x={48} y={52} size={9}>
          控制器
        </Label>
        <Box x={14} y={68} w={68} h={28} fill={SUN_SOFT} rx={7} strokeWidth={2.4} />
        <Label x={48} y={86} size={9}>
          运算器 ALU
        </Label>
        <Box x={14} y={102} w={68} h={26} fill={MINT_SOFT} rx={7} strokeWidth={2.4} />
        <Label x={48} y={119} size={9}>
          寄存器
        </Label>
      </Part>

      <Part id="cache" focus={focus}>
        <Box x={112} y={44} w={40} h={76} fill={SUN_SOFT} />
        <Label x={132} y={38} size={10}>
          缓存
        </Label>
        <Box x={117} y={52} w={30} h={18} fill="#FFFFFF" rx={5} strokeWidth={2.2} />
        <Label x={132} y={64} size={8}>
          L1
        </Label>
        <Box x={117} y={76} w={30} h={18} fill="#FFFFFF" rx={5} strokeWidth={2.2} />
        <Label x={132} y={88} size={8}>
          L2
        </Label>
        <Label x={132} y={134} size={8} fill="#5B4B9E">
          ~5 ns
        </Label>
      </Part>

      <Part id="ram" focus={focus}>
        <Box x={172} y={44} w={64} h={76} fill={PAPER} />
        <Label x={204} y={38} size={10}>
          内存
        </Label>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={175 + i * 15}
            y={54}
            width={12}
            height={52}
            rx={4}
            fill={i === 1 ? '#7B5CFF' : '#FFFFFF'}
            stroke="#241A3D"
            strokeWidth={2.2}
          />
        ))}
        <Label x={204} y={134} size={8} fill="#5B4B9E">
          ~100 ns
        </Label>
      </Part>

      <Part id="disk" focus={focus}>
        <Box x={256} y={52} w={56} h={68} fill={SKY_SOFT} />
        <Label x={284} y={46} size={10}>
          磁盘 / SSD
        </Label>
        <circle cx={284} cy={80} r={15} fill="#FFFFFF" stroke="#241A3D" strokeWidth={2.6} />
        <circle cx={284} cy={80} r={4} fill="#5AD2FF" stroke="#241A3D" strokeWidth={2} />
        <path d="M284 80 L296 70" stroke="#241A3D" strokeWidth={2.4} strokeLinecap="round" />
        <Label x={284} y={134} size={8} fill="#5B4B9E">
          ~10 ms
        </Label>
      </Part>

      {/* 箭头是结构骨架，不随聚焦淡出，但压一点透明度免得抢主体 */}
      <g opacity={0.72}>
        <Arrow d="M90 84 H112" width={2.4} />
        <Arrow d="M152 84 H172" width={2.4} />
        <Arrow d="M236 84 H256" width={2.4} />
      </g>

      <Label x={160} y={164} size={9} fill="#8B85A6">
        越往右：容量越大，访问越慢
      </Label>
    </svg>
  );
}
