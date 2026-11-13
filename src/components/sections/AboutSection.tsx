import React from 'react';

const SKILL_GROUPS = [
  {
    title: 'Software & Web',
    skills: ['React 19', 'TypeScript', 'JavaScript', 'Python', 'Node.js', 'Tailwind CSS', 'SQL', 'RESTful APIs'],
  },
  {
    title: 'Electronics & Systems',
    skills: ['Digital Electronics', 'Microcontrollers', 'Computer Architecture', 'Circuit Fundamentals', 'C / C++'],
  },
  {
    title: 'Machine Learning & Tools',
    skills: ['Scikit-learn', 'Pandas', 'NumPy', 'Streamlit', 'Git & GitHub', 'Linux', 'Supabase'],
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="w-full border-t border-[#1c1e24] px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Narrative Column */}
          <div className="space-y-6 text-left lg:col-span-6">
            <span className="text-xs font-mono font-medium tracking-wider text-zinc-400 uppercase">
              About
            </span>

            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Studying at the intersection of circuits, software, and intelligence.
            </h2>

            <div className="space-y-4 text-base leading-relaxed text-zinc-400">
              <p>
                I am an Electronics and Computer Engineering (ENC) undergraduate at Thapar Institute of Engineering and Technology in Patiala, Punjab (batch 2025–2029).
              </p>
              <p>
                My academic focus combines electrical engineering fundamentals with modern computing principles. I am fascinated by understanding systems all the way from semiconductor physics and logic gates to high-level web applications and applied machine learning models.
              </p>
              <p>
                This portfolio serves as an open record of the projects I am actively building, the technologies I am learning, and my growth as an engineer.
              </p>
            </div>
          </div>

          {/* Technical Disciplines Column */}
          <div className="space-y-8 text-left lg:col-span-6 lg:pt-8">
            <div className="rounded-2xl border border-[#1e2026] bg-[#101114] p-6 sm:p-8">
              <h3 className="text-sm font-semibold tracking-tight text-zinc-200">
                Academic Background
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Thapar Institute of Engineering and Technology · Patiala
              </p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                B.E. in Electronics and Computer Engineering (ENC), 2025–2029. Focus areas include circuit analysis, digital systems, object-oriented programming, data structures, and computer organization.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-mono font-medium tracking-wider text-zinc-400 uppercase">
                Technical Toolkit
              </h3>

              <div className="space-y-5">
                {SKILL_GROUPS.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <h4 className="text-xs font-medium text-zinc-300">
                      {group.title}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-[#23252c] bg-[#131418] px-2.5 py-1 text-xs text-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};