import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

type ScrollWordsProps = {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** Words (lower-cased, punctuation stripped) to render in the accent serif. */
  emphasis?: string[];
};

/**
 * Scroll-linked word illumination, after React Bits' ScrollReveal. Each word's
 * brightness follows the element's progress through the viewport. Implemented with a
 * single passive scroll listener writing one CSS variable — no layout thrash, no GSAP.
 */
export const ScrollWords: React.FC<ScrollWordsProps> = ({ text, as = 'p', className = '', emphasis = [] }) => {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const Tag = as as React.ElementType;
  const words = text.split(/\s+/).filter(Boolean);
  const emph = new Set(emphasis.map((w) => w.toLowerCase()));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.style.setProperty('--scroll-progress', '1');
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top hits 90% of the viewport, 1 when its bottom reaches 45%.
      const startY = vh * 0.9;
      const endY = vh * 0.45;
      const total = startY - endY + rect.height;
      const progress = Math.min(1, Math.max(0, (startY - rect.top) / total));
      el.style.setProperty('--scroll-progress', progress.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  return (
    <Tag ref={ref} className={`scroll-words ${className}`.trim()} aria-label={text}>
      {words.map((word, i) => {
        const key = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        return (
          <React.Fragment key={`${word}-${i}`}>
            <span
              aria-hidden="true"
              className={`scroll-word ${emph.has(key) ? 'font-editorial italic text-accent' : ''}`.trim()}
              style={{ '--word-at': (i / words.length).toFixed(3) } as React.CSSProperties}
            >
              {word}
            </span>
            {i < words.length - 1 && ' '}
          </React.Fragment>
        );
      })}
    </Tag>
  );
};
