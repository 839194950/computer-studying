import { ALL_CARDS, TRACKS } from '../../content';

export function AboutCard() {
  return (
    <div className="rounded-blob border-2 border-dashed border-line p-4 text-xs font-semibold leading-relaxed text-muted">
      <p className="font-black text-ink">记忆芯 · v1</p>
      <p className="mt-1">
        间隔重复：答对往后推（1/3/7/21/60 天），答错降一档并当天再来。卡片的四种颜色分别代表记牢了、刚学会、快忘了、没学过。
      </p>
      <p className="mt-2">
        {TRACKS.length} 条主线共 {ALL_CARDS.length} 张卡，每章配一张概念图，讲解时分步点亮图上对应的部分，并附 2 节详细讲解。内容参考菜鸟教程的知识分类，文字为自有表述。
      </p>
    </div>
  );
}
