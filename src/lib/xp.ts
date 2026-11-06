import { addDays, dayKey } from './time';

/** 某一天的学习战绩。按 dayKey 存在 store.daily 里。 */
export interface DayStat {
  xp: number;
  correct: number;
  bestCombo: number;
}

export const XP_CORRECT = 10;
/** 连对达到这个数后，每题额外加分 */
export const COMBO_THRESHOLD = 3;
export const XP_COMBO_BONUS = 5;
export const XP_FINISH_BONUS = 15;
export const DEFAULT_DAILY_GOAL = 30;

/** 一道题能拿多少经验：答错 0，答对 10，连对 3 题起每题 +5。 */
export function xpForAnswer(correct: boolean, combo: number): number {
  if (!correct) return 0;
  return XP_CORRECT + (combo >= COMBO_THRESHOLD ? XP_COMBO_BONUS : 0);
}

const TITLES = [
  '比特新手',
  '字节学徒',
  '寄存器常客',
  '缓存猎人',
  '内核探索者',
  '协议工匠',
  '系统架构师',
  '极客大师',
];

/** 升到第 level 级所需的累计经验：0, 100, 300, 600, 1000… */
export function xpToReach(level: number): number {
  return 50 * level * (level - 1);
}

export interface LevelInfo {
  level: number;
  title: string;
  /** 本级已经攒到的经验 */
  into: number;
  /** 本级一共要攒多少 */
  span: number;
}

export function levelInfo(totalXp: number): LevelInfo {
  const xp = Number.isFinite(totalXp) && totalXp > 0 ? totalXp : 0;
  let level = 1;
  while (xpToReach(level + 1) <= xp) level += 1;
  const base = xpToReach(level);
  return {
    level,
    title: TITLES[Math.min(level - 1, TITLES.length - 1)],
    into: xp - base,
    span: xpToReach(level + 1) - base,
  };
}

export const EMPTY_DAY: DayStat = { xp: 0, correct: 0, bestCombo: 0 };

export function dayStat(daily: Record<string, DayStat> | undefined, now: number): DayStat {
  return daily?.[dayKey(now)] ?? EMPTY_DAY;
}

const WEEKDAY = ['日', '一', '二', '三', '四', '五', '六'];

export interface WeekDay {
  key: string;
  label: string;
  active: boolean;
  today: boolean;
}

/** 最近 7 天（今天在最右），有经验或有完成记录就算打过卡。 */
export function lastSevenDays(
  daily: Record<string, DayStat> | undefined,
  activeDates: string[],
  now: number,
): WeekDay[] {
  const done = new Set(activeDates);
  return Array.from({ length: 7 }, (_, i) => {
    const t = addDays(now, i - 6);
    const key = dayKey(t);
    return {
      key,
      label: WEEKDAY[new Date(t).getDay()],
      active: (daily?.[key]?.xp ?? 0) > 0 || done.has(key),
      today: i === 6,
    };
  });
}

export interface Quest {
  id: string;
  title: string;
  value: number;
  target: number;
}

/** 每日任务：全部由当天战绩推出来，不需要额外存档。 */
export function dailyQuests(today: DayStat, goal: number): Quest[] {
  return [
    { id: 'xp', title: `拿到 ${goal} 经验`, value: Math.min(today.xp, goal), target: goal },
    { id: 'correct', title: '答对 8 道题', value: Math.min(today.correct, 8), target: 8 },
    { id: 'combo', title: '连对 5 题', value: Math.min(today.bestCombo, 5), target: 5 },
  ];
}

/** 只保留最近 60 天，存档不会无限变大。 */
export function pruneDaily(daily: Record<string, DayStat>, now: number): Record<string, DayStat> {
  const cutoff = dayKey(addDays(now, -60));
  return Object.fromEntries(Object.entries(daily).filter(([k]) => k >= cutoff));
}
