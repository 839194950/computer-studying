import type { HTMLAttributes } from 'react';

type Tone = 'paper' | 'mint' | 'sun' | 'pink' | 'sky' | 'white';

const TONES: Record<Tone, string> = {
  paper: 'bg-paper',
  mint: 'bg-mint',
  sun: 'bg-sun',
  pink: 'bg-pink',
  sky: 'bg-sky',
  white: 'bg-white',
};

interface StickerCardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
}

export function StickerCard({ tone = 'white', className = '', ...rest }: StickerCardProps) {
  return (
    <div
      className={[
        'rounded-blob border-[3px] border-ink shadow-pop',
        TONES[tone],
        className,
      ].join(' ')}
      {...rest}
    />
  );
}
