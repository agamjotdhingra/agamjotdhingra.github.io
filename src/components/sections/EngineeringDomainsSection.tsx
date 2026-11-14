import React from 'react';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';

interface DomainCard {
  title: string;
  tagline: string;
  description: string;
  corePillars: string[];
  glyph: React.ReactNode;
}

/* Small line-art glyphs, one per discipline. */
const ChipGlyph = (
  <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <rect x="14" y="14" width="20" height="20" rx="2" />
    <rect x="19" y="19" width="10" height="10" rx="1" className="text-accent" stroke="currentColor" />
    {[18, 24, 30].map((p) => (
      <g key={p}>
        <path d={`M${p} 14V8M${p} 34v6M14 ${p}H8M34 ${p}h6`} />
      </g>
    ))}
  </svg>
);

const StackGlyph = (
  <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    <path d="M24 8 40 16 24 24 8 16z" />
    <path d="M8 24l16 8 16-8" />
    <path d="M8 32l16 8 16-8" className="text-accent" stroke="currentColor" />
  </svg>
);

const NetGlyph = (
  <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
    {[12, 24, 36].map((y) => <circle key={`a${y}`} cx="10" cy={y} r="2.5" />)}
    {[18, 30].map((y) => <circle key={`b${y}`} cx="24" cy={y} r="2.5" />)}
    <circle cx="38" cy="24" r="2.5" className="text-accent" stroke="currentColor" />
    <path d="M12.5 12 21.5 18M12.5 12l9 18M12.5 24l9-6M12.5 24l9 6M12.5 36l9-18M12.5 36l9-6M26.5 18 35.5 24M26.5 30l9-6" opacity="0.6" />
  </svg>
);

const DOMAINS: DomainCard[] = [
  {
    title: 'Electronics & Embedded Systems',
    tagline: 'Silicon, Circuits & Microcontrollers',
    description:
      'Investigating how electrical state transitions in hardware become computing operations, from digital logic and sequential circuits to deterministic microcontroller timers and low-level C/C++.',
    corePillars: ['Digital Electronics', 'Microcontroller Interfacing', 'Computer Architecture', 'Circuit Fundamentals'],
    glyph: ChipGlyph,
  },
  {
    title: 'Software Engineering & Infrastructure',
    tagline: 'Full-Stack Systems & Cloud Architectures',
    description:
      'Engineering responsive, resilient software systems using React 19, TypeScript, and modern backend services. Emphasizing clean boundaries, defensive data validation, and predictable state management.',
    corePillars: ['React 19 & TypeScript', 'RESTful API Design', 'PostgreSQL & Relational Data', 'Systems Architecture'],
    glyph: StackGlyph,
  },
  {
    title: 'Artificial Intelligence & Machine Learning',
    tagline: 'Data Pipelines & Applied Modeling',
    description:
      'Exploring machine learning pipelines, classifier evaluation on imbalanced tabular distributions, and applied intelligence layers that assist human workflows without false claims of general intelligence.',
    corePillars: ['Scikit-learn & Python ML', 'Data Preprocessing & EDA', 'Feature Engineering', 'Evaluation & Metrics'],
    glyph: NetGlyph,
  },
];

export const EngineeringDomainsSection: React.FC = () => {
  return (
    <section id="domains" className="relative w-full px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="01"
          label="Domains of focus"
          title="Three disciplines, one signal chain."
          emphasis={['signal', 'chain.']}
          description="As an Electronics and Computer Engineering (ENC) undergraduate, my studies bridge foundational silicon logic, scalable software design, and applied intelligence."
        />

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          {DOMAINS.map((domain, i) => (
            <Reveal key={domain.title} delay={i * 120} className="h-full">
              <SpotlightCard
                className="flex h-full flex-col !rounded-2xl !p-7 text-left"
                spotlightColor="#f4b740"
                intensity={0.12}
                spotlightSize={320}
                borderGlow={0.7}
                style={{ '--spotlight-card-surface': '#101114' } as React.CSSProperties}
              >
                <div className="flex items-start justify-between">
                  <span className="text-zinc-500">{domain.glyph}</span>
                  <span className="font-mono text-[11px] text-zinc-600">0{i + 1}</span>
                </div>

                <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.16em] text-accent/90">{domain.tagline}</div>
                <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.02em] text-white">{domain.title}</h3>
                <p className="mt-4 text-[13.5px] leading-relaxed text-zinc-400">{domain.description}</p>

                <ul className="mt-auto space-y-0 pt-8">
                  {domain.corePillars.map((pillar) => (
                    <li
                      key={pillar}
                      className="flex items-center justify-between border-t border-[#1c1e24] py-2.5 font-mono text-[11.5px] text-zinc-300"
                    >
                      {pillar}
                      <span className="h-1 w-1 rounded-full bg-zinc-700" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
