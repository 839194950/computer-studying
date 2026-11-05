import { Arrow, Box, BRAND, DiagramDefs, Label, MINT_SOFT, Part, PINK_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const VAR_PARTS = ['name', 'box', 'type', 'ref'];

/**
 * 变量与类型：名字是贴纸，盒子是值，引用是两个名字贴到同一个盒子上。
 * 把「变量是盒子」这个直觉先立对，后面讲赋值、传参才不会错。
 */
export function VarDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Label x={10} y={20} size={9} anchor="start" fill="#8B85A6">
        名字贴在值上
      </Label>

      <Part id="name" focus={focus}>
        <Box x={10} y={30} w={38} h={28} fill={SUN_SOFT} rx={7} strokeWidth={2.4} />
        <Label x={29} y={48} size={11} mono>
          x
        </Label>
      </Part>
      <Part id="box" focus={focus}>
        <Box x={64} y={30} w={62} h={28} fill={MINT_SOFT} rx={7} strokeWidth={2.4} />
        <Label x={95} y={49} size={12} mono>
          42
        </Label>
      </Part>
      <Part id="type" focus={focus}>
        <Label x={134} y={44} size={9} anchor="start" fill="#5B4B9E">
          int：固定宽度，
        </Label>
        <Label x={134} y={57} size={9} anchor="start" fill="#5B4B9E">
          值就装在这里
        </Label>
      </Part>

      <line x1={10} y1={82} x2={310} y2={82} stroke="#241A3D" strokeWidth={1.5} strokeDasharray="4 5" opacity="0.28" />

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
          {'{ n: 1 }'}
        </Label>
      </Part>

      <Part id="type" focus={focus}>
        <Label x={214} y={134} size={9} anchor="start" fill="#5B4B9E">
          改 a 里的内容，
        </Label>
        <Label x={214} y={147} size={9} anchor="start" fill="#5B4B9E">
          b 看到的一样变
        </Label>
      </Part>
    </svg>
  );
}
