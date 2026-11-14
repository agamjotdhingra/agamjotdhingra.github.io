import React from 'react';
import { SplitText } from '@/components/motion/SplitText';
import { Reveal } from '@/components/motion/Reveal';

type SectionHeaderProps = {
  /** Two-digit section index, e.g. "02". */
  index: string;
  label: string;
  title: string;
  /** Words in the title rendered in the italic serif accent. */
  emphasis?: string[];
  description?: string;
  aside?: React.ReactNode;
  badge?: React.ReactNode;
};

/** Consistent, numbered editorial section header used across the home page. */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  index,
  label,
  title,
  emphasis = [],
  description,
  aside,
  badge,
}) => {
  const emph = new Set(emphasis.map((w) => w.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl text-left">
        <Reveal variant="fade" className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-zinc-700" aria-hidden="true" />
          <span>{label}</span>
          {badge}
        </Reveal>
        <SplitText
          as="h2"
          text={title}
          className="mt-5 block text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl"
          wordClassName={(w) =>
            emph.has(w.toLowerCase().replace(/[^a-z0-9&]/g, ''))
              ? 'font-editorial font-normal italic tracking-[-0.02em] text-zinc-300'
              : undefined
          }
        />
        {description && (
          <Reveal delay={150}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-zinc-400">{description}</p>
          </Reveal>
        )}
      </div>
      {aside && <Reveal delay={200} className="shrink-0">{aside}</Reveal>}
    </div>
  );
};
