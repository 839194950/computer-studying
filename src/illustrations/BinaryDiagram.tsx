import { anim, Box, BRAND, DiagramDefs, Flow, Label, MINT_SOFT, Part, SUN_SOFT, type DiagramProps } from './base';

export const BINARY_PARTS = ['bit', 'byte', 'number', 'text'];

const BITS = [0, 1, 0, 0, 0, 0, 0, 1];
const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];
const X0 = 14;
const STEP = 22;

/**
 * 一个字节的两种读法：8 个开关，按权重加起来是 65，查表就是字母 A。
 * 动效：为 1 的两位轮流亮起，各自的权重沿虚线落到下方的算式里。
 */
export function BinaryDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="byte" focus={focus}>
        <rect x={6} y={12} width={186} height={66} rx={12} fill="#FBFAFF" stroke="#BEAEFF" strokeWidth={1.6} strokeDasharray="5 4" className="dg-march" />
        <Label x={256} y={34} size={10.5}>
          1 字节 = 8 位
        </Label>
        <Label x={256} y={50} size={8.5} fill="#8B85A6">
          2⁸ = 256 种组合
        </Label>
        <Label x={256} y={64} size={8} fill="#8B85A6" mono>
          0 ~ 255
        </Label>
      </Part>

      <Part id="bit" focus={focus}>
        {BITS.map((bit, i) => {
          const x = X0 + i * STEP;
          const on = bit === 1;
          return (
            <g key={i}>
              <Label x={x + 8.5} y={26} size={7.5} fill={on ? BRAND : '#A49DBF'} mono>
                {WEIGHTS[i]}
              </Label>
              <g {...(on ? anim('pop', { delay: i === 1 ? 0 : 1.3 }) : {})}>
                <Box x={x} y={32} w={17} h={28} fill={on ? BRAND : '#FFFFFF'} rx={5} />
                <Label x={x + 8.5} y={51} size={11} fill={on ? '#FFFFFF' : '#A49DBF'} mono>
                  {bit}
                </Label>
              </g>
            </g>
          );
        })}
        <Label x={99} y={73} size={8} fill="#8B85A6">
          每一位是一个开关：通 = 1，断 = 0
        </Label>
      </Part>

      <Part id="number" focus={focus}>
        <Box x={6} y={96} w={150} h={66} fill={SUN_SOFT} rx={12} />
        <Label x={81} y={113} size={10}>
          当数字读
        </Label>
        <Label x={81} y={136} size={13} mono>
          64 + 1 = 65
        </Label>
        <Label x={81} y={153} size={8} fill="#8A6A16">
          按每一位的权重相加
        </Label>
        <Flow d={`M${X0 + STEP + 8.5} 62 C ${X0 + STEP + 8.5} 86, 58 92, 62 120`} color={BRAND} dur={2.6} />
        <Flow d={`M${X0 + 7 * STEP + 8.5} 62 C ${X0 + 7 * STEP + 8.5} 86, 112 92, 104 120`} color={BRAND} dur={2.6} delay={1.3} />
      </Part>

      <Part id="text" focus={focus}>
        <Box x={164} y={96} w={150} h={66} fill={MINT_SOFT} rx={12} />
        <Label x={239} y={113} size={10}>
          当字符读
        </Label>
        <Label x={222} y={138} size={13} mono>
          65 →
        </Label>
        <g {...anim('float')}>
          <Box x={250} y={121} w={26} h={24} fill="#FFFFFF" rx={6} />
          <Label x={263} y={138.5} size={14} mono fill="#127A52">
            A
          </Label>
        </g>
        <Label x={239} y={157} size={8} fill="#127A52">
          查 ASCII / UTF-8 对照表
        </Label>
      </Part>
    </svg>
  );
}
