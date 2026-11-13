import React from 'react';
import { Project } from '@/types';
import { normalizeTechStack } from '@/utils/formatters';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, description, tech_stack, github_url, live_url } = project;
  const tags = normalizeTechStack(tech_stack);
  const hasGithub = Boolean(github_url && github_url.trim().length > 0);
  const hasLiveDemo = Boolean(live_url && live_url.trim().length > 0);
  const hasLinks = hasGithub || hasLiveDemo;

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-[#1e2026] bg-[#111215] p-6 transition-all duration-200 hover:border-zinc-700 hover:bg-[#15161b] sm:p-7">
      <div>
        {/* Header with Title and Links */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-zinc-100 sm:text-xl">
            {title}
          </h3>

          {hasLinks && (
            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              {hasGithub && (
                <a
                  href={github_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                  aria-label={`Source code for ${title} on GitHub`}
                  title="Source Code"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}

              {hasLiveDemo && (
                <a
                  href={live_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                  aria-label={`Live demo of ${title}`}
                  title="Live Demo"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {description}
        </p>
      </div>

      {/* Tech Tags */}
      {tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5 border-t border-[#1c1e24] pt-4">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="rounded border border-[#272930] bg-[#141519] px-2 py-0.5 font-mono text-[11px] text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};