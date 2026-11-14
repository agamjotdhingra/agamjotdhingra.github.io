import React, { useState } from 'react';
import { Project } from '@/types';
import { normalizeTechStack } from '@/utils/formatters';
import { ProjectArchitectureModal } from './ProjectArchitectureModal';
import { TraceSignature } from './TraceSignature';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import Magnet from '@/components/reactbits/Magnet';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

const domainLabels: Record<string, string> = {
  electronics: 'Electronics & Systems',
  software: 'Software Engineering',
  ai: 'Artificial Intelligence',
};

const GitHubIcon = (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

const ExternalIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0 }) => {
  const [archModalOpen, setArchModalOpen] = useState(false);
  const { title, description, tech_stack, github_url, live_url, architecture, domain } = project;
  const tags = normalizeTechStack(tech_stack);
  const hasGithub = Boolean(github_url && github_url.trim().length > 0);
  const hasLiveDemo = Boolean(live_url && live_url.trim().length > 0);
  const flip = index % 2 === 1;

  return (
    <>
      <SpotlightCard
        className="!rounded-3xl !p-0 text-left"
        spotlightColor="#f4b740"
        intensity={0.1}
        spotlightSize={420}
        borderGlow={0.6}
        style={{ '--spotlight-card-surface': '#0e0f12' } as React.CSSProperties}
      >
        <article className="group grid grid-cols-1 gap-8 p-6 sm:p-9 lg:grid-cols-12 lg:gap-12 lg:p-11">
          {/* Copy */}
          <div className={`flex flex-col lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
            <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.16em]">
              <span className="text-accent">P—{String(index + 1).padStart(2, '0')}</span>
              <span className="h-px w-6 bg-zinc-700" aria-hidden="true" />
              <span className="text-zinc-500">{domain ? domainLabels[domain] || domain : 'Engineering Project'}</span>
            </div>

            <h3 className="mt-5 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl">
              {title}
            </h3>

            <p className="mt-5 text-[14.5px] leading-relaxed text-zinc-400">{description}</p>

            {tags.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-1.5" aria-label="Technologies">
                {tags.map((tag, i) => (
                  <li
                    key={`${tag}-${i}`}
                    className="rounded-md border border-[#23252c] bg-[#121317] px-2 py-1 font-mono text-[11px] text-zinc-400 transition-colors duration-300 group-hover:border-[#2c2f37] group-hover:text-zinc-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-9">
              {architecture && (
                <Magnet padding={30} magnetStrength={4} maxOffset={6}>
                  <button
                    type="button"
                    onClick={() => setArchModalOpen(true)}
                    className="group/btn inline-flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-2.5 text-[13px] font-medium text-zinc-950 transition-colors hover:bg-white"
                  >
                    Architecture &amp; key decisions
                    <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden="true">
                      &rarr;
                    </span>
                  </button>
                </Magnet>
              )}
              {hasGithub && (
                <a
                  href={github_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#2a2d36] px-4 py-2.5 text-[13px] text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
                  aria-label={`Source code for ${title} on GitHub`}
                >
                  {GitHubIcon}
                  Source
                </a>
              )}
              {hasLiveDemo && (
                <a
                  href={live_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#2a2d36] px-4 py-2.5 text-[13px] text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
                  aria-label={`Live demo of ${title}`}
                >
                  Live demo
                  {ExternalIcon}
                </a>
              )}
            </div>
          </div>

          {/* Visual */}
          <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
            <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 lg:sticky lg:top-28">
              <TraceSignature title={title} domain={domain} index={index} />
            </div>
          </div>
        </article>
      </SpotlightCard>

      {archModalOpen && (
        <ProjectArchitectureModal project={project} onClose={() => setArchModalOpen(false)} />
      )}
    </>
  );
};
