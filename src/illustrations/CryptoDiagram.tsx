import {
  anim,
  Arrow,
  Box,
  BRAND,
  BRAND_SOFT,
  DiagramDefs,
  Flow,
  Label,
  MINT,
  MINT_SOFT,
  Part,
  PINK_SOFT,
  SUN,
  SUN_SOFT,
  type DiagramProps,
} from './base';

export const CRYPTO_PARTS = ['hash', 'sym', 'asym', 'sign'];

/** 一把小钥匙：圆头 + 齿。cx/cy 是钥匙圈的圆心。 */
function Key({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#FFFFFF" stroke={color} strokeWidth={2.4} />
      <path d={`M${cx + 5} ${cy} H${cx + 20} M${cx + 15} ${cy} V${cy + 4} M${cx + 19} ${cy} V${cy + 3}`} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </g>
  );
}

/**
 * 密码学四件事：哈希只做指纹，对称用一把钥匙，非对称用两把，
 * 签名是把非对称反过来用——私钥签，公钥验。
 * 动效：哈希的输入不断流进去、指纹不变；对称的锁一开一合；非对称两把钥匙交替发光；签名印章按下去。
 */
export function CryptoDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="hash" focus={focus}>
        <Box x={6} y={10} w={150} h={78} fill={PINK_SOFT} rx={12} />
        <Label x={16} y={27} size={9} anchor="start">
          哈希 · 单行道
        </Label>
        <Box x={14} y={36} w={46} h={22} fill="#FFFFFF" rx={6} />
        <Label x={37} y={50.5} size={7}>
          任意长度
        </Label>
        <Arrow d="M62 47 H78" color="#C1437E" />
        <Box x={82} y={36} w={66} h={22} fill="#FFFFFF" rx={6} />
        <Label x={115} y={50.5} size={7.5} mono>
          a1b2c3d4
        </Label>
        <g {...anim('blink', { dur: 2.4 })}>
          <rect x={146} y={41} width={1.8} height={12} fill="#C1437E" />
        </g>
        <Label x={81} y={76} size={7.5} fill="#C1437E">
          只能往下算，回不去
        </Label>
      </Part>

      <Part id="sym" focus={focus}>
        <Box x={164} y={10} w={150} h={78} fill={SUN_SOFT} rx={12} />
        <Label x={174} y={27} size={9} anchor="start">
          对称 · 一把钥匙
        </Label>
        {/* 锁：锁梁上下跳表示开合 */}
        <path d="M184 47 V41 a8 8 0 0 1 16 0 V47" stroke="#E8B400" strokeWidth={3} strokeLinecap="round" {...anim('float', { dur: 1.8 })} />
        <Box x={178} y={46} w={28} h={24} fill="#FFFFFF" rx={6} />
        <circle cx={192} cy={56} r={3} fill={SUN} />
        <rect x={191} y={57} width={2} height={6} rx={1} fill={SUN} />
        <Key cx={238} cy={52} color="#E8B400" />
        <Flow d="M260 58 C 250 70, 222 72, 208 62" color={SUN} dur={1.8} dash={10} />
        <Label x={250} y={76} size={7.5} fill="#8A6A16">
          加密解密都用它
        </Label>
      </Part>

      <Part id="asym" focus={focus}>
        <Box x={6} y={96} w={150} h={78} fill={BRAND_SOFT} rx={12} />
        <Label x={16} y={113} size={9} anchor="start">
          非对称 · 两把钥匙
        </Label>
        <g {...anim('pulse', { dur: 2.4 })}>
          <Key cx={24} cy={131} color={BRAND} />
        </g>
        <Label x={52} y={134} size={7.5} anchor="start" fill="#5B4B9E">
          公钥：公开，用来加密
        </Label>
        <g {...anim('pulse', { dur: 2.4, delay: 1.2 })}>
          <Key cx={24} cy={155} color="#C1437E" />
        </g>
        <Label x={52} y={158} size={7.5} anchor="start" fill="#C1437E">
          私钥：只你有，用来解密
        </Label>
      </Part>

      <Part id="sign" focus={focus}>
        <Box x={164} y={96} w={150} h={78} fill={MINT_SOFT} rx={12} />
        <Label x={174} y={113} size={9} anchor="start">
          签名 · 反过来用
        </Label>
        <Box x={174} y={122} w={40} h={42} fill="#FFFFFF" rx={6} />
        <path d="M181 132 H207 M181 140 H203 M181 148 H199" stroke="#A6EACD" strokeWidth={2} strokeLinecap="round" />
        <g {...anim('pop', { dur: 2.2 })}>
          <circle cx={208} cy={157} r={9} fill={MINT} />
          <Label x={208} y={160.5} size={8} fill="#FFFFFF">
            签
          </Label>
        </g>
        <Label x={230} y={136} size={7.5} anchor="start" fill="#127A52">
          私钥签名
        </Label>
        <Label x={230} y={150} size={7.5} anchor="start" fill="#127A52">
          公钥验证
        </Label>
        <Label x={230} y={164} size={7} anchor="start" fill="#8B85A6">
          证明是你发的
        </Label>
      </Part>
    </svg>
  );
}
