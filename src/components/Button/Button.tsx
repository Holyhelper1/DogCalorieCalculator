import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary';

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

export function Button({ children, className = '', variant = 'primary', ...props }: Props) {
  const variantClass = variant === 'primary' ? styles.primary : styles.secondary;
  const composedClassName = `${styles.button} ${variantClass} ${className}`.trim();

  return (
    <button className={composedClassName} {...props}>
      {children}
    </button>
  );
}
