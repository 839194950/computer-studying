import { Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, PINK_SOFT, type DiagramProps } from './base';

export const MEMORY_PARTS = ['virtual', 'page', 'fault', 'swap'];

/**
 * 虚拟内存：左边是程序以为自己拿到的连续空间，中间是页表这本账，
 * 右边才是真正散落的物理内存。缺页就是账上还没记，得去磁盘取。
 */
export function MemoryDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="virtual" focus={focus}>
        <Box x={6} y={16} w={88} h={126} fill={PAPER} rx={10} strokeWidth={2.6} />
        <Label x={50} y={32} size={8}>
          虚拟地址
        </Label>
        <Box x={14} y={40} w={72} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={50} y={55} size={8} mono>
          页 0
        </Label>
        <Box x={14} y={68} w={72} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={50} y={83} size={8} mono>
          页 1
        </Label>
        <Box x={14} y={124} w={72} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={50} y={139} size={8} mono>
          页 3
        </Label>
      </Part>

      <Part id="fault" focus={focus}>
        <Box x={14} y={96} w={72} h={22} fill={PINK_SOFT} rx={5} strokeWidth={2.2} dashed />
        <Label x={50} y={109} size={8} mono>
          页 2
        </Label>
      </Part>

      <Part id="page" focus={focus}>
        <Box x={106} y={16} w={96} h={126} fill={BRAND_SOFT} rx={10} strokeWidth={2.6} />
        <Label x={154} y={32} size={8}>
          页表
        </Label>
        <Box x={112} y={40} w={84} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={154} y={55} size={7} mono>
          页 0 → 帧 2
        </Label>
        <Box x={112} y={68} w={84} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={154} y={83} size={7} mono>
          页 1 → 帧 0
        </Label>
        <Box x={112} y={124} w={84} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={154} y={139} size={7} mono>
          页 3 → 帧 1
        </Label>
      </Part>

      <Part id="fault" focus={focus}>
        <Box x={112} y={96} w={84} h={22} fill={PINK_SOFT} rx={5} strokeWidth={2.2} />
        <Label x={154} y={111} size={7} mono>
          页2→磁盘 缺页
        </Label>
      </Part>

      <Part id="page" focus={focus}>
        <Box x={212} y={16} w={102} h={126} fill={MINT_SOFT} rx={10} strokeWidth={2.6} />
        <Label x={263} y={32} size={8}>
          物理内存
        </Label>
        <Box x={220} y={40} w={86} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={263} y={55} size={7} mono>
          帧 0 · 页1
        </Label>
        <Box x={220} y={68} w={86} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={263} y={83} size={7} mono>
          帧 1 · 页3
        </Label>
        <Box x={220} y={96} w={86} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={263} y={111} size={7} mono>
          帧 2 · 页0
        </Label>
        <Box x={220} y={124} w={86} h={22} fill="#FFFFFF" rx={5} strokeWidth={2} dashed />
        <Label x={263} y={139} size={7} mono fill="#8B85A6">
          帧 3 · 空闲
        </Label>
      </Part>

      <Part id="swap" focus={focus}>
        <Box x={6} y={152} w={308} h={22} fill={PINK_SOFT} rx={8} strokeWidth={2.2} />
        <Label x={160} y={167} size={7.5}>
          内存不够时，久不用的页被换到磁盘，下次访问再换回来
        </Label>
      </Part>
    </svg>
  );
}
