import { Box, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, SUN_SOFT, type DiagramProps } from './base';

export const DEFENSE_PARTS = ['input', 'least', 'encrypt', 'log'];

/**
 * 纵深防御：不是找一道打不破的墙，而是让每层都能独立挡一下。
 * 外面是日志与监控（能看见），往里依次是最小权限、输入校验，最中心是数据本身。
 */
export function DefenseDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="log" focus={focus}>
        <Box x={4} y={10} w={312} h={158} fill={PAPER} rx={16} strokeWidth={3} />
        <Label x={16} y={26} size={8} anchor="start" fill="#5B4B9E">
          日志与监控 · 出事看得见
        </Label>
      </Part>

      <Part id="least" focus={focus}>
        <Box x={26} y={34} w={268} h={120} fill={SUN_SOFT} rx={14} strokeWidth={2.8} />
        <Label x={38} y={50} size={8} anchor="start" fill="#8A6A16">
          最小权限 · 拿不到就不用防
        </Label>
      </Part>

      <Part id="input" focus={focus}>
        <Box x={50} y={58} w={220} h={82} fill={BRAND_SOFT} rx={12} strokeWidth={2.8} />
        <Label x={62} y={74} size={8} anchor="start" fill="#5B4B9E">
          输入校验与转义 · 别信任何输入
        </Label>
      </Part>

      <Part id="encrypt" focus={focus}>
        <Box x={74} y={86} w={172} h={44} fill={MINT_SOFT} rx={10} strokeWidth={2.8} />
        <Label x={160} y={104} size={8.5}>
          数据加密与慢哈希
        </Label>
        <Label x={160} y={118} size={7} fill="#127A52">
          库被拖走，也别让人直接读到密码
        </Label>
      </Part>

      <Part id="input" focus={focus}>
        <Label x={160} y={160} size={7.5} fill="#8B85A6">
          任何一层被绕过，其余几层还在 —— 单点防御迟早会被打穿
        </Label>
      </Part>
    </svg>
  );
}
