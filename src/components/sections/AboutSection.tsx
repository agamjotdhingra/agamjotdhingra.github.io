import React from 'react';

const SKILL_CATEGORIES = [
  {
    title: 'Languages',
    skills: ['C / C++', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'HTML5 / CSS3'],
  },
  {
    title: 'Software & Web',
    skills: ['React 19', 'Node.js', 'Vite', 'Tailwind CSS', 'RESTful APIs', 'Next.js'],
  },
  {
    title: 'Electronics & Systems',
    skills: ['Digital Electronics', 'Microcontrollers', 'Computer Architecture', 'Circuit Fundamentals'],
  },
  {
    title: 'AI, Data & Tooling',
    skills: ['Python AI Stack', 'Supabase & PostgreSQL', 'Git & GitHub', 'Linux', 'Docker'],
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="w-full max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-12 text-left">
        <div className="flex items-center gap-2">
          <span className="h-px w-8 bg-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Background &amp; Skills
          </span>
        </div>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          About &amp; Technical Expertise
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Bridging electronics, software engineering, and artificial intelligence to build impactful systems.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Narrative Column */}
        <div className="space-y-6 text-slate-300 lg:col-span-5">
          <p className="text-base leading-relaxed text-slate-300">
            I am an Electronics and Computer Engineering undergraduate at Thapar Institute of Engineering and Technology
            (2025–2029). My passion lies at the intersection of embedded hardware, modern software development, and
            artificial intelligence.
          </p>
          <p className="text-base leading-relaxed text-slate-400">
            I enjoy deconstructing how systems operate—from low-level microcontrollers and circuits to high-level cloud
            services and responsive web applications. This portfolio documents my learning journey, technical experiments,
            and software projects.
          </p>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Focus Areas
            </h4>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Full-stack web applications &amp; cloud APIs
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Electronics, microcontrollers &amp; computer systems
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Practical artificial intelligence &amp; automation
              </li>
            </ul>
          </div>
        </div>

        {/* Skills Cards Column */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
          {SKILL_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-900/60"
            >
              <h3 className="text-sm font-semibold text-white">{category.title}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-md border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs font-mono font-medium text-slate-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
