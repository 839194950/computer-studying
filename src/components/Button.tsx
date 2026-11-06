import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white',
  ghost: 'bg-white text-ink',
  danger: 'bg-pink text-ink',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-4 text-base',
};

interface ButtonClassesOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  className?: string;
}

/**
 * 按钮外观的唯一来源。`Button` 与 `ButtonLink` 共用，
 * 需要「看起来是按钮、行为是跳转」时渲染成 `<Link>`，不要 `<a><button>` 套娃。
 */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  full = false,
  className = '',
}: ButtonClassesOptions = {}): string {
  return [
    'inline-flex select-none items-center justify-center gap-2 rounded-sticker border-[3px] border-ink',
    'font-black shadow-pop transition-transform duration-150',
    'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-pop',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
    VARIANTS[variant],
    SIZES[size],
    full ? 'w-full' : '',
    className,
  ].join(' ');
}

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<ButtonClassesOptions, 'className'> {
  className?: string;
}

export function Button({ variant, size, full, className = '', ...rest }: ButtonProps) {
  return <button className={buttonClasses({ variant, size, full, className })} {...rest} />;
}
