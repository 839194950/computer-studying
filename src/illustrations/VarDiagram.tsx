import { useId } from 'react';
import { MINT, Ripple, Arrow, Box, BRAND, DiagramDefs, Label, MINT_SOFT, Part, PINK_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const VAR_PARTS = ['name', 'box', 'type', 'ref'];

export function VarDiagram({ className, focus }: DiagramProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <title id={titleId}>变量与类型：名字、对象与共享引用</title>
      <desc id={descriptionId}>以 Python 为例：名字 x 绑定到整数对象 42，int 的精度可增长，受内存限制；a 与 b 共享同一个列表，通过任一名字修改列表，另一个也能看到。重新绑定名字不等于修改对象；方框和箭头不是物理内存布局。</desc>
      <DiagramDefs />

      <Label x={10} y={20} size={9} anchor="start" fill="#8B85A6">
        Python 示例：名字绑定对象
      </Label>

      <Part id="name" focus={focus}>
        <Box x={10} y={30} w={38} h={28} fill={SUN_SOFT} rx={7} strokeWidth={2.4} />
        <Label x={29} y={48} size={11} mono>
          x
        </Label>
        <Arrow d="M49 44 H61" color={BRAND} />
      </Part>
      <Part id="box" focus={focus}>
        <Box x={64} y={30} w={62} h={28} fill={MINT_SOFT} rx={7} strokeWidth={2.4} />
        <Label x={95} y={49} size={12} mono>
          42
        </Label>
      </Part>
      <Part id="type" focus={focus}>
        <Label x={134} y={44} size={9} anchor="start" fill="#5B4B9E">
          int：精度可增长，
        </Label>
        <Label x={134} y={57} size={9} anchor="start" fill="#5B4B9E">
          受可用内存限制
        </Label>
      </Part>

      <line x1={10} y1={82} x2={310} y2={82} stroke="#8E84B3" strokeWidth={1.6} strokeDasharray="4 5" opacity="0.28" />

      <Label x={10} y={102} size={9} anchor="start" fill="#8B85A6">
        两个名字可以指向同一个对象
      </Label>

      <Part id="name" focus={focus}>
        <Box x={10} y={112} w={34} h={24} fill={SUN_SOFT} rx={6} strokeWidth={2.4} />
        <Label x={27} y={128} size={10} mono>
          a
        </Label>
        <Box x={10} y={142} w={34} h={24} fill={SUN_SOFT} rx={6} strokeWidth={2.4} />
        <Label x={27} y={158} size={10} mono>
          b
        </Label>
      </Part>

      <Part id="ref" focus={focus}>
        <Arrow d="M46 124 C 70 124, 84 132, 108 136" color={BRAND} />
        <Arrow d="M46 154 C 70 154, 84 146, 108 140" color={BRAND} />
        <Box x={110} y={112} w={92} h={56} fill={PINK_SOFT} />
        <Label x={156} y={134} size={10}>
          同一个对象
        </Label>
        <Label x={156} y={150} size={8} mono fill="#8B85A6">
          {'[1, 2]'}
        </Label>
      </Part>

      <Part id="ref" focus={focus}>
        <Label x={214} y={134} size={9} anchor="start" fill="#5B4B9E">
          通过 a 改列表，
        </Label>
        <Label x={214} y={147} size={9} anchor="start" fill="#5B4B9E">
          b 看到的一样变
        </Label>
      </Part>
      <Ripple cx={95} cy={44} r={14} color={MINT} dur={2.6} />
    </svg>
  );
}
