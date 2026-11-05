import { Arrow, Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, SKY_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const CPU_PARTS = ['cpu', 'cache', 'ram', 'disk'];

/**
 * 计算机组成：CPU 内部三段 + 缓存 + 内存 + 磁盘。
 * 越往右越慢越大，底部一排是量级刻度，帮人建立"快慢差三个数量级"的直觉。
 */
export function CpuDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="cpu" focus={focus}>
        <Box x={6} y={26} w={92} h={112} fill={BRAND_SOFT} />
        <Label x={52} y={18} size={11}>
          CPU
        </Label>
        <Box x={16} y={34} w={72} h={28} fill={SKY_SOFT} rx={7} strokeWidth={2.4} />
        <Label x={52} y={52} size={9}>
          控制器
        </Label>
        <Box x={16} y={68} w={72} h={28} fill={SUN_SOFT} rx={7} strokeWidth={2.4} />
        <Label x={52} y={86} size={9}>
          运算器 ALU
        </Label>
        <Box x={16} y={102} w={72} h={26} fill={MINT_SOFT} rx={7} strokeWidth={2.4} />
        <Label x={52} y={119} size={9}>
          寄存器
        </Label>
      </Part>

      <Part id="cache" focus={focus}>
        <Box x={108} y={44} w={44} h={76} fill={SUN_SOFT} />
        <Label x={130} y={38} size={10}>
          缓存
        </Label>
        <rect x={114} y={52} width={32} height={18} rx={5} fill="#FFFFFF" stroke="#241A3D" strokeWidth={2.2} />
        <Label x={130} y={64} size={8}>
          L1
        </Label>
        <rect x={114} y={76} width={32} height={18} rx={5} fill="#FFFFFF" stroke="#241A3D" strokeWidth={2.2} />
        <Label x={130} y={88} size={8}>
          L2
        </Label>
        <Label x={130} y={134} size={8} fill="#5B4B9E">
          ~5 ns
        </Label>
      </Part>

      <Part id="ram" focus={focus}>
        <Box x={164} y={44} w={72} h={76} fill={PAPER} />
        <Label x={200} y={38} size={10}>
          内存
        </Label>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={172 + i * 16}
            y={54}
            width={12}
            height={52}
            rx={4}
            fill={i === 1 ? '#7B5CFF' : '#FFFFFF'}
            stroke="#241A3D"
            strokeWidth={2.2}
          />
        ))}
        <Label x={200} y={134} size={8} fill="#5B4B9E">
          ~100 ns
        </Label>
      </Part>

      <Part id="disk" focus={focus}>
        <Box x={248} y={52} w={64} h={68} fill={SKY_SOFT} />
        <Label x={280} y={46} size={10}>
          磁盘 / SSD
        </Label>
        <circle cx={280} cy={80} r={18} fill="#FFFFFF" stroke="#241A3D" strokeWidth={2.6} />
        <circle cx={280} cy={80} r={4} fill="#5AD2FF" stroke="#241A3D" strokeWidth={2} />
        <path d="M280 80 L294 70" stroke="#241A3D" strokeWidth={2.4} strokeLinecap="round" />
        <Label x={280} y={134} size={8} fill="#5B4B9E">
          ~10 ms
        </Label>
      </Part>

      <Arrow d="M100 84 H106" />
      <Arrow d="M154 84 H162" />
      <Arrow d="M238 84 H246" />
      <Label x={160} y={162} size={9} fill="#8B85A6">
        越往右：容量越大，访问越慢
      </Label>
    </svg>
  );
}
