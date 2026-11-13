import React from 'react';

interface DomainCard {
  title: string;
  tagline: string;
  description: string;
  corePillars: string[];
}

const DOMAINS: DomainCard[] = [
  {
    title: 'Electronics & Embedded Systems',
    tagline: 'Silicon, Circuits & Microcontrollers',
    description: 'Investigating how electrical state transitions in hardware become computing operations, from digital logic and sequential circuits to deterministic microcontroller timers and low-level C/C++.',
    corePillars: ['Digital Electronics', 'Microcontroller Interfacing', 'Computer Architecture', 'Circuit Fundamentals'],
  },
  {
    title: 'Software Engineering & Infrastructure',
    tagline: 'Full-Stack Systems & Cloud Architectures',
    description: 'Engineering responsive, resilient software systems using React 19, TypeScript, and modern backend services. Emphasizing clean boundaries, defensive data validation, and predictable state management.',
    corePillars: ['React 19 & TypeScript', 'RESTful API Design', 'PostgreSQL & Relational Data', 'Systems Architecture'],
  },
  {
    title: 'Artificial Intelligence & Machine Learning',
    tagline: 'Data Pipelines & Applied Modeling',
    description: 'Exploring machine learning pipelines, classifier evaluation on imbalanced tabular distributions, and applied intelligence layers that assist human workflows without false claims of general intelligence.',
    corePillars: ['Scikit-learn & Python ML', 'Data Preprocessing & EDA', 'Feature Engineering', 'Evaluation & Metrics'],
  },
];

export const EngineeringDomainsSection: React.FC = () => {
  return (
    <section id="domains" className="w-full border-t border-[#1c1e24] px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl text-left">
          <span className="text-xs font-mono font-medium tracking-wider text-zinc-400 uppercase">
            Domains of Focus
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Three Core Engineering Vectors
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            As an Electronics and Computer Engineering (ENC) undergraduate, my studies bridge foundational silicon logic, scalable software design, and applied intelligence.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {DOMAINS.map((domain) => (
            <div
              key={domain.title}
              className="flex flex-col justify-between rounded-2xl border border-[#1e2026] bg-[#111215] p-6 text-left transition-colors hover:border-zinc-700"
            >
              <div>
                <div className="font-mono text-[11px] text-zinc-400">
                  {domain.tagline}
                </div>
                <h3 className="mt-2 text-base font-semibold text-white">
                  {domain.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                  {domain.description}
                </p>
              </div>

              <div className="mt-6 border-t border-[#1c1e24] pt-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                  Core Competencies
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {domain.corePillars.map((pillar) => (
                    <span
                      key={pillar}
                      className="rounded border border-[#272930] bg-[#15161a] px-2 py-0.5 font-mono text-[11px] text-zinc-300"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

