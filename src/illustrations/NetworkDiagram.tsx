import { Flow, Box, BRAND, BRAND_SOFT, DiagramDefs, Label, MINT, MINT_SOFT, PAPER, Part, SKY_SOFT, SUN, SUN_SOFT, type DiagramProps } from './base';

export const NETWORK_PARTS = ['app', 'transport', 'network', 'link'];

const ROWS = [
  { y: 26, layer: '应用层', fill: SKY_SOFT },
  { y: 56, layer: '传输层', fill: SUN_SOFT },
  { y: 86, layer: '网络层', fill: BRAND_SOFT },
  { y: 116, layer: '链路层', fill: MINT_SOFT },
];

/**
 * 网络分层与封装：同一份数据往下走一遍，就多穿一件外套。
 * 右侧四行是同一封包在四层的形态，右端对齐，能直接看出"头是往前加的"。
 */
export function NetworkDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Label x={160} y={14} size={9} fill="#8B85A6">
        往下走一层，就多包一个头
      </Label>

      {ROWS.map((row, i) => {
        const ids = ['app', 'transport', 'network', 'link'];
        return (
          <Part key={row.layer} id={ids[i]} focus={focus}>
            <Box x={6} y={row.y} w={86} h={24} fill={row.fill} rx={8} strokeWidth={2.6} />
            <Label x={49} y={row.y + 16} size={9}>
              {row.layer}
            </Label>
          </Part>
        );
      })}

      <Part id="app" focus={focus}>
        <Box x={124} y={26} w={188} h={24} fill={PAPER} rx={6} strokeWidth={2.4} />
        <Label x={218} y={42} size={8} mono>
          {'"GET /index.html"'}
        </Label>
      </Part>

      <Part id="transport" focus={focus}>
        <Box x={168} y={56} w={36} h={24} fill={SUN} rx={6} strokeWidth={2.4} />
        <Label x={186} y={72} size={8}>
          TCP 头
        </Label>
        <Box x={204} y={56} w={108} h={24} fill={PAPER} rx={6} strokeWidth={2.4} />
        <Label x={258} y={72} size={8} fill="#8B85A6">
          数据
        </Label>
      </Part>

      <Part id="network" focus={focus}>
        <Box x={136} y={86} w={32} h={24} fill={BRAND} rx={6} strokeWidth={2.4} />
        <Label x={152} y={102} size={8} fill="#FFFFFF">
          IP 头
        </Label>
        <Box x={168} y={86} w={36} h={24} fill={SUN} rx={6} strokeWidth={2.4} />
        <Label x={186} y={102} size={8}>
          TCP 头
        </Label>
        <Box x={204} y={86} w={108} h={24} fill={PAPER} rx={6} strokeWidth={2.4} />
        <Label x={258} y={102} size={8} fill="#8B85A6">
          数据
        </Label>
      </Part>

      <Part id="link" focus={focus}>
        <Box x={110} y={116} w={26} h={24} fill={MINT} rx={6} strokeWidth={2.4} />
        <Label x={123} y={132} size={7}>
          帧头
        </Label>
        <Box x={136} y={116} w={32} h={24} fill={BRAND} rx={6} strokeWidth={2.4} />
        <Label x={152} y={132} size={8} fill="#FFFFFF">
          IP 头
        </Label>
        <Box x={168} y={116} w={36} h={24} fill={SUN} rx={6} strokeWidth={2.4} />
        <Label x={186} y={132} size={8}>
          TCP 头
        </Label>
        <Box x={204} y={116} w={80} h={24} fill={PAPER} rx={6} strokeWidth={2.4} />
        <Box x={284} y={116} w={28} h={24} fill={MINT} rx={6} strokeWidth={2.4} />
        <Label x={298} y={132} size={7}>
          帧尾
        </Label>
      </Part>

      <Label x={160} y={166} size={9} fill="#8B85A6">
        接收端反过来，一层层把头剥掉
      </Label>
      {/* 同一份数据从上往下走，每过一层就多一个头 */}
      <Flow d="M101 38 V128" color={BRAND} dur={2.4} />
    </svg>
  );
}
