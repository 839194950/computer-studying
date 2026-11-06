import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'success' | 'ghost' | 'danger' | 'sun';
export type ButtonSize = 'md' | 'lg';

/**
 * 3D 按钮：底部一道深色"唇边"，按下时整体下沉、唇边消失，
 * 和手机游戏里的实体按钮一样有回弹感。
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white shadow-[0_4px_0_#5A3DE6] hover:bg-[#8668FF]',
  success: 'bg-mint text-white shadow-[0_4px_0_#1FA463] hover:bg-[#3AD688]',
  danger: 'bg-bad text-white shadow-[0_4px_0_#DB3654] hover:bg-[#FF6680]',
  sun: 'bg-sun text-ink shadow-[0_4px_0_#E0A300] hover:bg-[#FFCD4A]',
  ghost: 'border-2 border-line bg-white text-ink shadow-[0_4px_0_#E7E3F3] hover:bg-paper',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'min-h-[44px] px-4 py-2 text-sm',
  lg: 'min-h-[54px] px-6 py-3 text-base',
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
    'relative inline-flex select-none items-center justify-center gap-2 rounded-2xl',
    'font-extrabold tracking-wide transition-[transform,box-shadow,background-color] duration-100 ease-out',
    'active:translate-y-[4px] active:shadow-none',
    'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-[#E9E6F2] disabled:text-muted disabled:shadow-none disabled:active:translate-y-0',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30',
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

export function Button({ variant, size, full, className = '', type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, full, className })} {...rest} />;
}
