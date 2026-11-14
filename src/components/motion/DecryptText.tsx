import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from './useReducedMotion';

const GLYPHS = '01<>/\\|_-+=*#%ABCDEF';

type DecryptTextProps = {
  text: string;
  className?: string;
  /** Total reveal duration in ms. */
  duration?: number;
  delay?: number;
};

/**
 * Left-to-right "decode" effect, after React Bits' DecryptedText. Runs once when
 * visible, uses requestAnimationFrame, and renders the final text immediately for
 * reduced-motion users and screen readers.
 */
export const DecryptText: React.FC<DecryptTextProps> = ({
  text,
  className = '',
  duration = 900,
  delay = 0,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { threshold: 0.5 });
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    if (reduced || !inView || started.current) {
      if (reduced) setOutput(text);
      return;
    }
    started.current = true;
    let raf = 0;
    let start = 0;
    const timer = window.setTimeout(() => {
      const tick = (now: number) => {
        if (!start) start = now;
        const progress = Math.min(1, (now - start) / duration);
        const settled = Math.floor(progress * text.length);
        let next = '';
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          next += i < settled || ch === ' ' || ch === '·' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setOutput(next);
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [inView, reduced, text, duration, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{output}</span>
    </span>
  );
};
