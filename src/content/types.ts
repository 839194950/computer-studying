export type TrackId = 'hardware' | 'language' | 'os' | 'security';

export interface Chapter {
  id: string;
  title: string;
  blurb: string;
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
