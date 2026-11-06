import type { HTMLAttributes } from 'react';

type Tone = 'paper' | 'mint' | 'sun' | 'pink' | 'sky' | 'white' | 'brand';

const TONES: Record<Tone, string> = {
  white: 'bg-white border-line shadow-lip',
  paper: 'bg-paper border-line shadow-lip',
  mint: 'bg-mint-soft border-[#C5EED8] shadow-[0_4px_0_#C5EED8]',
  sun: 'bg-sun-soft border-[#FBE3A0] shadow-[0_4px_0_#FBE3A0]',
  pink: 'bg-pink-soft border-[#FFCADB] shadow-[0_4px_0_#FFCADB]',
  sky: 'bg-sky-soft border-[#BCE6FC] shadow-[0_4px_0_#BCE6FC]',
  brand: 'bg-brand-soft border-[#DCD3FF] shadow-[0_4px_0_#DCD3FF]',
};

interface StickerCardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
}

/** 基础卡片：浅描边 + 底部唇边，和按钮是同一套立体语言。 */
export function StickerCard({ tone = 'white', className = '', ...rest }: StickerCardProps) {
  return <div className={['rounded-blob border-2', TONES[tone], className].join(' ')} {...rest} />;
}
