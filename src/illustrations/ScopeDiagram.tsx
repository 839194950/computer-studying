import { MINT, Ripple, Arrow, Box, BRAND, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, Part, PINK_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const SCOPE_PARTS = ['global', 'local', 'block', 'closure'];

/**
 * 作用域：三层同心框，越往里越窄。
 * 一个名字只在它所在的框以及更里面可见；闭包是「框已经离开，但名字还被带着走」。
 */
export function ScopeDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="global" focus={focus}>
        <Box x={4} y={12} w={312} h={158} fill="#FFFFFF" rx={14} strokeWidth={3} />
        <Label x={14} y={28} size={9} anchor="start" fill="#5B4B9E">
          全局作用域
        </Label>
        <Box x={92} y={18} w={68} h={18} fill={SUN_SOFT} rx={5} strokeWidth={2} />
        <Label x={126} y={31} size={8} mono>
          appName
        </Label>
      </Part>

      <Part id="local" focus={focus}>
        <Box x={16} y={48} w={250} h={112} fill={BRAND_SOFT} rx={12} strokeWidth={2.6} />
        <Label x={26} y={66} size={9} anchor="start" fill="#5B4B9E">
          函数作用域
        </Label>
        <Box x={110} y={56} w={52} h={18} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={136} y={69} size={8} mono>
          count
        </Label>
      </Part>

      <Part id="block" focus={focus}>
        <Box x={30} y={94} w={176} h={52} fill={MINT_SOFT} rx={10} strokeWidth={2.6} />
        <Label x={40} y={112} size={9} anchor="start" fill="#127A52">
          块级作用域 {'{ }'}
        </Label>
        <Box x={150} y={102} w={38} h={18} fill="#FFFFFF" rx={5} strokeWidth={2} />
        <Label x={169} y={115} size={8} mono>
          n
        </Label>
        <Label x={40} y={136} size={7.5} anchor="start" fill="#127A52">
          出了花括号就没了
        </Label>
      </Part>

      <Part id="closure" focus={focus}>
        <Box x={210} y={92} w={104} h={56} fill={PINK_SOFT} rx={10} strokeWidth={2.6} />
        <Label x={262} y={110} size={9}>
          闭包
        </Label>
        <Ripple cx={169} cy={111} r={9} color={MINT} />
        <Label x={262} y={124} size={7.5} fill="#8B85A6">
          函数 + 记住的 n
        </Label>
        <Label x={262} y={139} size={7} fill="#C1437E">
          外层返回也还在
        </Label>
        <Arrow d="M190 112 C 196 108, 200 106, 206 104" color={BRAND} dashed width={2.2} />
      </Part>
    </svg>
  );
}
