import { anim, Arrow, Box, BRAND, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, PAPER, Part, SKY_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const DS_PARTS = ['array', 'list', 'hash', 'tradeoff'];

const ARRAY = [3, 8, 5, 1, 9];
const LIST = ['A', 'B', 'C'];
const BUCKETS = [0, 1, 2, 3];

/**
 * 三种最常用的结构，摆在一起看差别：
 * 数组靠连续内存换随机访问，链表靠指针换插入删除，哈希靠计算换平均 O(1)。
 */
export function DataStructDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="array" focus={focus}>
        <Label x={8} y={42} size={9} anchor="start">
          数组
        </Label>
        {ARRAY.map((v, i) => (
          <g key={i}>
            <Box x={54 + i * 28} y={26} w={24} h={24} fill={SKY_SOFT} rx={5} strokeWidth={2.2} />
            <Label x={66 + i * 28} y={42} size={10} mono>
              {v}
            </Label>
            <Label x={66 + i * 28} y={62} size={7} fill="#8B85A6" mono>
              {i}
            </Label>
          </g>
        ))}
        <Label x={204} y={38} size={8} anchor="start" fill="#5B4B9E">
          连续摆放，
        </Label>
        <Label x={204} y={52} size={8} anchor="start" fill="#5B4B9E">
          下标直接算地址
        </Label>
      </Part>

      <Part id="list" focus={focus}>
        <Label x={8} y={86} size={9} anchor="start">
          链表
        </Label>
        {LIST.map((v, i) => (
          <Box key={v} x={54 + i * 50} y={70} w={38} h={22} fill={SUN_SOFT} rx={6} strokeWidth={2.2} />
        ))}
        {LIST.map((v, i) => (
          <Label key={v} x={73 + i * 50} y={85} size={9} mono>
            {v}
          </Label>
        ))}
        <Arrow d="M93 81 H102" />
        <Arrow d="M143 81 H152" />
        <Label x={204} y={82} size={8} anchor="start" fill="#5B4B9E">
          散落各处，靠指针串
        </Label>
        <Label x={204} y={96} size={8} anchor="start" fill="#8B85A6">
          插中间不用搬家
        </Label>
      </Part>

      <Part id="hash" focus={focus}>
        <Label x={8} y={130} size={9} anchor="start">
          哈希表
        </Label>
        <Box x={54} y={116} w={42} h={22} fill={MINT_SOFT} rx={5} strokeWidth={2.2} />
        <Label x={75} y={131} size={8} mono>
          key
        </Label>
        <Arrow d="M98 127 H110" color={BRAND} />
        <Label x={104} y={110} size={7} fill="#5B4B9E">
          hash()
        </Label>
        {BUCKETS.map((b) => (
          <g key={b} {...(b === 2 ? anim('pop', { dur: 2.4 }) : {})}>
            <Box x={112 + b * 18} y={112} w={14} h={28} fill={b === 2 ? BRAND : PAPER} rx={4} strokeWidth={2.2} />
          </g>
        ))}
        <Label x={204} y={126} size={8} anchor="start" fill="#5B4B9E">
          算一下落到哪个桶，
        </Label>
        <Label x={204} y={140} size={8} anchor="start" fill="#8B85A6">
          平均 O(1)，冲突要处理
        </Label>
      </Part>

      <Part id="tradeoff" focus={focus}>
        <Box x={6} y={152} w={308} h={22} fill={BRAND_SOFT} rx={8} strokeWidth={2.2} />
        <Label x={160} y={167} size={8}>
          查找快 → 数组 / 哈希　　插入删除快 → 链表　　没有免费的午餐
        </Label>
      </Part>
    </svg>
  );
}
