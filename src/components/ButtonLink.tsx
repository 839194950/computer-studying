import { Link, type LinkProps } from 'react-router-dom';
import { buttonClasses, type ButtonSize, type ButtonVariant } from './Button';

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
}

/**
 * 长得像按钮的链接。语义是导航就渲染 `<a>`，
 * 避免 `<Link><Button>` 产生 `<a><button>` 嵌套（读屏会当成两个控件）。
 */
export function ButtonLink({
  variant,
  size,
  full,
  className = '',
  ...rest
}: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, full, className })} {...rest} />;
}
