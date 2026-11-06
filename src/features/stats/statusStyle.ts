import type { CardStatus } from '../../lib/stats';

/** 四色状态的唯一来源：图例、堆叠条、卡片行都从这里取，别各写一套。 */
export const STATUS_ORDER: CardStatus[] = ['mastered', 'learning', 'forgotten', 'new'];

export const STATUS_STYLE: Record<CardStatus, { bg: string; label: string }> = {
  mastered: { bg: 'bg-mint', label: '记牢了' },
  learning: { bg: 'bg-sun', label: '刚学会' },
  forgotten: { bg: 'bg-bad', label: '快忘了' },
  new: { bg: 'bg-[#DCD6EE]', label: '没学过' },
};
