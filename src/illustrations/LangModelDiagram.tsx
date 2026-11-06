import { anim, Box, BRAND, BRAND_SOFT, DiagramDefs, Label, MINT_SOFT, Part, PINK_SOFT, SKY_SOFT, SUN_SOFT, type DiagramProps } from './base';

export const LANGMODEL_PARTS = ['c', 'python', 'js', 'choose'];

/**
 * 三种语言的默认心智模型：
 * C 让你自己管内存，Python 把一切变成对象标签，JS 把执行塞进一个事件循环。
 * 学会一门语言，本质上是换上一套这样的默认假设。
 */
export function LangModelDiagram({ className, focus }: DiagramProps) {
  return (
    <svg className={className} viewBox="0 0 320 180" fill="none" aria-hidden="true">
      <DiagramDefs />

      <Part id="c" focus={focus}>
        <Box x={6} y={20} w={98} h={112} fill={SKY_SOFT} rx={12} strokeWidth={2.6} />
        <Label x={55} y={38} size={11} mono>
          C
        </Label>
        <Label x={55} y={52} size={7.5} fill="#5B4B9E">
          手动管内存
        </Label>
        <Box x={16} y={62} w={36} h={24} fill="#FFFFFF" rx={5} strokeWidth={2.2} />
        <Label x={34} y={77} size={7} mono>
          malloc
        </Label>
        <Box x={58} y={62} w={36} h={24} fill="#FFFFFF" rx={5} strokeWidth={2.2} />
        <Label x={76} y={77} size={7} mono>
          free
        </Label>
        <Label x={55} y={104} size={7} fill="#8B85A6">
          用完自己还回去
        </Label>
        <Label x={55} y={118} size={7} fill="#8B85A6">
          忘了就泄漏
        </Label>
      </Part>

      <Part id="python" focus={focus}>
        <Box x={109} y={20} w={98} h={112} fill={SUN_SOFT} rx={12} strokeWidth={2.6} />
        <Label x={158} y={38} size={11} mono>
          Python
        </Label>
        <Label x={158} y={52} size={7.5} fill="#5B4B9E">
          标签 + 回收
        </Label>
        <Box x={118} y={64} w={22} h={16} fill="#FFFFFF" rx={4} strokeWidth={2} />
        <Label x={129} y={76} size={8} mono>
          a
        </Label>
        <Box x={118} y={88} w={22} h={16} fill="#FFFFFF" rx={4} strokeWidth={2} />
        <Label x={129} y={100} size={8} mono>
          b
        </Label>
        <Box x={156} y={70} w={42} h={28} fill={MINT_SOFT} rx={6} strokeWidth={2.2} />
        <Label x={177} y={88} size={8} mono>
          obj
        </Label>
        <path d="M140 72 C 148 74, 150 78, 156 80" fill="none" stroke={BRAND} strokeWidth={2} />
        <path d="M140 96 C 148 94, 150 90, 156 88" fill="none" stroke={BRAND} strokeWidth={2} />
        <Label x={158} y={112} size={7} fill="#8B85A6">
          没人引用就回收
        </Label>
      </Part>

      <Part id="js" focus={focus}>
        <Box x={212} y={20} w={98} h={112} fill={PINK_SOFT} rx={12} strokeWidth={2.6} />
        <Label x={261} y={38} size={11} mono>
          JS
        </Label>
        <Label x={261} y={52} size={7.5} fill="#5B4B9E">
          单线程 + 队列
        </Label>
        <circle cx={234} cy={80} r={15} fill="#FFFFFF" stroke="#8E84B3" strokeWidth={1.6} />
        <g {...anim('spin', { dur: 2.6 })}>
          <path d="M226 74 A 12 12 0 1 1 228 90" fill="none" stroke={BRAND} strokeWidth={2} strokeLinecap="round" />
        </g>
        <Label x={234} y={84} size={7} mono>
          loop
        </Label>
        {[0, 1, 2].map((i) => (
          <Box key={i} x={256 + i * 16} y={70} w={13} h={20} fill="#FFFFFF" rx={3} strokeWidth={2} />
        ))}
        <Label x={261} y={112} size={7} fill="#8B85A6">
          一件做完再做下一件
        </Label>
      </Part>

      <Part id="choose" focus={focus}>
        <Box x={6} y={140} w={308} h={30} fill={BRAND_SOFT} rx={9} strokeWidth={2.2} />
        <Label x={160} y={159} size={8}>
          选语言先看要什么：控制与性能 → C，表达与迭代 → Python，交互与界面 → JS
        </Label>
      </Part>
    </svg>
  );
}
