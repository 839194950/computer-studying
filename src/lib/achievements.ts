import type { Track } from '../content/types';
import type { CardProgress } from './srs';
import { chapterState } from './queue';

export interface Achievement {
  id: string;
  title: string;
  hint: string;
  /** 徽章底色，对应 tailwind 色名 */
  tone: 'brand' | 'mint' | 'sun' | 'pink' | 'sky' | 'flame';
  value: number;
  target: number;
  unlocked: boolean;
}

interface AchievementInput {
  tracks: Track[];
  progress: Record<string, CardProgress>;
  longestStreak: number;
  xp: number;
}

/** 成就全部从现有进度推出来，不单独存档，导入导出也不会丢。 */
export function achievements({ tracks, progress, longestStreak, xp }: AchievementInput): Achievement[] {
  const cards = tracks.flatMap((t) => t.cards);
  const touched = cards.filter((c) => progress[c.id]).length;
  const mastered = cards.filter((c) => (progress[c.id]?.box ?? 0) >= 4).length;
  const chaptersDone = tracks.reduce(
    (n, t) => n + t.chapters.filter((ch) => chapterState(t, ch.id, progress) === 'done').length,
    0,
  );
  const tracksDone = tracks.filter(
    (t) => t.cards.length > 0 && t.cards.every((c) => (progress[c.id]?.box ?? 0) >= 4),
  ).length;

  const make = (
    id: string,
    title: string,
    hint: string,
    tone: Achievement['tone'],
    value: number,
    target: number,
  ): Achievement => ({
    id,
    title,
    hint,
    tone,
    value: Math.min(value, target),
    target,
    unlocked: value >= target,
  });

  return [
    make('first', '第一步', '学完第一张卡', 'mint', touched, 1),
    make('ten', '十张入脑', '学过 10 张卡', 'sky', touched, 10),
    make('streak3', '三天不断', '连续打卡 3 天', 'flame', longestStreak, 3),
    make('streak7', '一周坚持', '连续打卡 7 天', 'flame', longestStreak, 7),
    make('chapter', '首章通关', '记牢一整章', 'sun', chaptersDone, 1),
    make('xp500', '五百经验', '累计 500 经验', 'brand', xp, 500),
    make('track', '一线贯通', '记牢一整条主线', 'pink', tracksDone, 1),
    make('master', '记忆大师', `记牢全部 ${cards.length} 张卡`, 'brand', mastered, cards.length),
  ];
}
