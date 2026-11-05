export type TrackId = 'hardware' | 'language' | 'os' | 'security';

export interface Chapter {
  id: string;
  title: string;
  blurb: string;
}

/** 讲解面的一步：把注意力聚到图上的某几块，并配一句旁白。 */
export interface TeachStep {
  /** 这一步的旁白，≤ 44 字 */
  caption: string;
  /** 要点亮的图元 id，见插画的 parts 定义 */
  focus: string[];
}

export interface Card {
  id: string;
  track: TrackId;
  chapter: string;
  title: string;
  /** 插画 key，见 src/illustrations/registry.ts */
  illustration: string;
  /** 讲解面的一句话，≤ 40 字 */
  explain: string;
  /** 分步图解；至少两步，最后一步讲完才允许进入答题 */
  steps: TeachStep[];
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Track {
  id: TrackId;
  title: string;
  chapters: Chapter[];
  cards: Card[];
}
