import React, { useRef } from 'react';
import { useInView } from './useReducedMotion';

type SplitTextProps = {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** Per-word stagger in ms. */
  stagger?: number;
  /** Delay before the first word, in ms. */
  delay?: number;
  /** Optional class applied to specific words (by index) for typographic emphasis. */
  wordClassName?: (word: string, index: number) => string | undefined;
};

/**
 * Word-by-word blur/rise reveal, modelled on React Bits' BlurText but driven by CSS
 * transitions (no animation library). The full string is exposed to assistive tech
 * via aria-label; the animated spans are hidden from it.
 */
export const SplitText: React.FC<SplitTextProps> = ({
  text,
  as = 'span',
  className = '',
  stagger = 70,
  delay = 0,
  wordClassName,
}) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { threshold: 0.2 });
  const Tag = as as React.ElementType;
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag ref={ref} className={className} aria-label={text} data-in={inView ? '' : undefined}>
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span className="split-word-mask" aria-hidden="true">
            <span
              className={`split-word ${wordClassName?.(word, i) ?? ''}`.trim()}
              style={{ '--split-delay': `${delay + i * stagger}ms` } as React.CSSProperties}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </Tag>
  );
};
