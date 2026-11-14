import React, { useRef } from 'react';
import { useInView } from './useReducedMotion';

type RevealProps = {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** Delay in milliseconds before the element animates in. */
  delay?: number;
  /** Visual variant: rise (default), fade, or blur. */
  variant?: 'rise' | 'fade' | 'blur';
  id?: string;
};

/**
 * Scroll-triggered entrance (in the spirit of React Bits' AnimatedContent / FadeContent),
 * implemented with IntersectionObserver + CSS transitions so it costs no JS per frame.
 * Reduced-motion users get the content immediately (see `.reveal` in index.css).
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  as = 'div',
  className = '',
  delay = 0,
  variant = 'rise',
  id,
}) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={variant}
      data-in={inView ? '' : undefined}
      className={`reveal ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
};
