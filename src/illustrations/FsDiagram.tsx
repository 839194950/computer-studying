import { Arrow, Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, SUN_SOFT, type DiagramProps } from './base';

export const FS_PARTS = ['tree', 'inode', 'block', 'journal'];

/**
 * 文件系统：目录只是名字到编号的映射，编号（inode）才记着数据存在哪几块。
 * 所以「改名不搬家、删了还能被占着」都不奇怪。
 */
export function FsDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="tree" focus={focus}>
        <Box x={6} y={14} w={100} h={124} fill={PAPER} rx={10} strokeWidth={2.6} />
        <Label x={56} y={30} size={8}>
          目录树
        </Label>
        <Box x={22} y={38} w={34} h={20} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={39} y={52} size={7} mono>
          /
        </Label>
        <Box x={14} y={68} w={44} h={20} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={36} y={82} size={7} mono>
          docs
        </Label>
        <Box x={14} y={96} w={44} h={20} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={36} y={110} size={7} mono>
          img
        </Label>
        <Box x={62} y={68} w={38} h={20} fill={MINT_SOFT} rx={5} strokeWidth={2} />
        <Label x={81} y={82} size={6.5} mono>
          a.md
        </Label>
        <path d="M39 58 V66" stroke="#241A3D" strokeWidth={1.8} />
        <path d="M36 78 V94" stroke="#241A3D" strokeWidth={1.8} />
        <path d="M58 78 H64" stroke="#241A3D" strokeWidth={1.8} />
      </Part>

      <Part id="inode" focus={focus}>
        <Box x={114} y={14} w={92} h={124} fill={BRAND_SOFT} rx={10} strokeWidth={2.6} />
        <Label x={160} y={30} size={8}>
          inode 表
        </Label>
        <Box x={120} y={38} w={80} h={26} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={160} y={49} size={7} mono>
          #12 文件
        </Label>
        <Label x={160} y={59} size={6} mono fill="#8B85A6">
          大小 · 权限 · 块号
        </Label>
        <Box x={120} y={72} w={80} h={26} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={160} y={83} size={7} mono>
          #13 目录
        </Label>
        <Label x={160} y={93} size={6} mono fill="#8B85A6">
          名字 → 编号
        </Label>
        <Box x={120} y={106} w={80} h={26} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={160} y={117} size={7} mono>
          #14
        </Label>
        <Label x={160} y={127} size={6} mono fill="#8B85A6">
          块号列表
        </Label>
      </Part>

      <Part id="block" focus={focus}>
        <Box x={214} y={14} w={100} h={124} fill={MINT_SOFT} rx={10} strokeWidth={2.6} />
        <Label x={264} y={30} size={8}>
          数据块
        </Label>
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            x={222}
            y={38 + i * 25}
            w={84}
            h={20}
            fill={i === 1 ? '#FFFFFF' : '#F2FFF9'}
            rx={5}
            strokeWidth={2}
          />
        ))}
        <Label x={264} y={52} size={6.5} mono fill="#8B85A6">
          block 8
        </Label>
        <Label x={264} y={77} size={6.5} mono>
          block 9 ← a.md
        </Label>
        <Label x={264} y={102} size={6.5} mono fill="#8B85A6">
          block 10
        </Label>
        <Label x={264} y={127} size={6.5} mono fill="#8B85A6">
          block 11
        </Label>
      </Part>

      <Arrow d="M104 78 C 110 78, 112 56, 118 52" dashed width={2} />
      <Arrow d="M204 52 C 210 52, 210 72, 218 74" dashed width={2} />

      <Part id="journal" focus={focus}>
        <Box x={6} y={150} w={308} h={24} fill={SUN_SOFT} rx={8} strokeWidth={2.2} />
        <Label x={160} y={166} size={7.5}>
          先写日志再改数据：断电后照日志重放，才不会把文件系统撕成两半
        </Label>
      </Part>
    </svg>
  );
}
