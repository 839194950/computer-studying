import { Box, DiagramDefs, Label, MINT_SOFT, Part, SUN_SOFT, type DiagramProps } from './base';

export const BINARY_PARTS = ['bit', 'byte', 'number', 'text'];

const BITS = [0, 1, 0, 0, 0, 0, 0, 1];
const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

/**
 * 二进制与编码：同样的 8 个开关，可以当数字读，也可以当字符读。
 * 这是"编码"这件事最核心的直觉——字节本身没有含义，解读方式才给它含义。
 */
export function BinaryDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="bit" focus={focus}>
        {BITS.map((bit, i) => {
          const x = 12 + i * 23;
          return (
            <g key={i}>
              <Label x={x + 8} y={24} size={8.5} fill="#6B6385" mono>
                {WEIGHTS[i]}
              </Label>
              <rect
                x={x}
                y={32}
                width={16}
                height={30}
                rx={4}
                fill={bit === 1 ? '#7B5CFF' : '#FFFFFF'}
                stroke="#241A3D"
                strokeWidth={2.6}
              />
              <Label x={x + 8} y={52} size={11} fill={bit === 1 ? '#FFFFFF' : '#8B85A6'} mono>
                {bit}
              </Label>
            </g>
          );
        })}
        <Label x={93} y={76} size={9} fill="#8B85A6">
          每一位：通 = 1，断 = 0
        </Label>
      </Part>

      <Part id="byte" focus={focus}>
        <rect
          x={6}
          y={16}
          width={176}
          height={54}
          rx={10}
          fill="none"
          stroke="#241A3D"
          strokeWidth={2.6}
          strokeDasharray="6 5"
        />
        <Label x={256} y={28} size={10}>
          1 字节 = 8 位
        </Label>
        <Label x={256} y={44} size={9} fill="#8B85A6">
          共 256 种组合
        </Label>
      </Part>

      <Part id="number" focus={focus}>
        <Box x={6} y={96} w={150} h={62} fill={SUN_SOFT} rx={12} />
        <Label x={81} y={114} size={10}>
          当数字读
        </Label>
        <Label x={81} y={134} size={13} mono>
          64 + 1 = 65
        </Label>
        <Label x={81} y={150} size={8} fill="#8B85A6">
          按每一位的权重相加
        </Label>
      </Part>

      <Part id="text" focus={focus}>
        <Box x={164} y={96} w={150} h={62} fill={MINT_SOFT} rx={12} />
        <Label x={239} y={114} size={10}>
          当字符读
        </Label>
        <Label x={239} y={136} size={14} mono>
          {'65 → "A"'}
        </Label>
        <Label x={239} y={150} size={8} fill="#8B85A6">
          查 ASCII / UTF-8 对照表
        </Label>
      </Part>
    </svg>
  );
}
