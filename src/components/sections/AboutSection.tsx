import React from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollWords } from '@/components/motion/ScrollWords';

/**
 * Concrete tools only. Conceptual areas (digital electronics, computer architecture,
 * API design…) live in the Domains section so the two lists don't repeat each other.
 */
const TOOLKIT = [
  { title: 'Languages', skills: ['TypeScript', 'JavaScript', 'Python', 'C / C++', 'SQL'] },
  {
    title: 'Frameworks & Libraries',
    skills: ['React 19', 'Node.js', 'Tailwind CSS', 'Scikit-learn', 'Pandas', 'NumPy', 'Streamlit'],
  },
  { title: 'Tools & Platforms', skills: ['Git & GitHub', 'Linux', 'Supabase'] },
];

const SPEC = [
  { k: 'Institution', v: 'Thapar Institute of Engineering and Technology' },
  { k: 'Programme', v: 'B.E. Electronics and Computer Engineering (ENC)' },
  { k: 'Batch', v: '2025 – 2029' },
  { k: 'Location', v: 'Patiala, Punjab, India' },
  {
    k: 'Coursework focus',
    v: 'Circuit analysis, digital systems, object-oriented programming, data structures, computer organization',
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative w-full border-t border-[#16171c] px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="02" label="About" title="Studying at the intersection of circuits, software, and intelligence." emphasis={['circuits,', 'software,', 'intelligence.']} />

        {/* Scroll-lit statement */}
        <ScrollWords
          className="mt-20 max-w-5xl text-[1.65rem] font-medium leading-[1.3] tracking-[-0.025em] text-white sm:text-[2.6rem]"
          text="I am fascinated by understanding systems all the way down — from semiconductor physics and logic gates to high-level web applications and applied machine learning models."
          emphasis={['all', 'the', 'way', 'down']}
        />

        <div className="mt-20 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Narrative */}
          <div className="space-y-5 text-left text-[15px] leading-relaxed text-zinc-400 lg:col-span-5">
            <Reveal>
              <p>
                I am an Electronics and Computer Engineering (ENC) undergraduate at Thapar Institute of Engineering and
                Technology in Patiala, Punjab (batch 2025–2029).
              </p>
            </Reveal>
            <Reveal delay={100}>
              <p>
                My academic focus combines electrical engineering fundamentals with modern computing principles.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p>
                This portfolio serves as an open record of the projects I am actively building, the technologies I am
                learning, and my growth as an engineer.
              </p>
            </Reveal>
          </div>

          {/* Spec sheet */}
          <Reveal delay={150} className="lg:col-span-7">
            <div className="rounded-2xl border border-[#1c1e24] bg-[#0f1013]">
              <div className="flex items-center justify-between border-b border-[#1c1e24] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                <span>Academic background</span>
                <span className="text-accent/80">spec.sheet</span>
              </div>
              <dl className="divide-y divide-[#1c1e24]">
                {SPEC.map((row) => (
                  <div key={row.k} className="grid grid-cols-1 gap-1 px-5 py-3.5 text-left sm:grid-cols-[150px_1fr] sm:gap-6">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-500">{row.k}</dt>
                    <dd className="text-[13.5px] text-zinc-200">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        {/* Toolkit */}
        <div className="mt-24">
          <Reveal variant="fade" className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            <span className="h-px w-8 bg-zinc-700" aria-hidden="true" />
            Technical toolkit
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#1c1e24] bg-[#1c1e24] md:grid-cols-3">
            {TOOLKIT.map((group, gi) => (
              <Reveal key={group.title} delay={gi * 120} className="bg-[#0b0b0d] p-6 text-left">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">{group.title}</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="cursor-default rounded-full border border-[#24262d] px-3 py-1.5 text-[12.5px] text-zinc-300 transition-colors duration-300 hover:border-accent/50 hover:bg-accent/[0.06] hover:text-white"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
