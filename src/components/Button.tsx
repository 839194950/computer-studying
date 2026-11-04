import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white',
  ghost: 'bg-white text-ink',
  danger: 'bg-pink text-ink',
};

const SIZES: Record<Size, string> = {
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-4 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex select-none items-center justify-center gap-2 rounded-sticker border-[3px] border-ink',
        'font-black shadow-pop transition-transform duration-150',
        'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-pop',
        VARIANTS[variant],
        SIZES[size],
        full ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    />
  );
}
