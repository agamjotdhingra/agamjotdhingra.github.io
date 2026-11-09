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
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-emerald-950/20 sm:p-7">
      {/* Top Section: Title & Action Links */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-emerald-400">
            {title}
          </h3>

          {/* Action Links (shown only if at least one URL exists) */}
          {hasLinks && (
            <div className="flex items-center gap-3 shrink-0 text-slate-400">
              {hasGithub && (
                <a
                  href={github_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-1.5 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label={`View ${title} source code on GitHub`}
                  title="Source Code"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                  className="rounded-lg p-1.5 transition-colors hover:bg-slate-800 hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label={`View live demo of ${title}`}
                  title="Live Demo"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Project Description */}
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          {description}
        </p>
      </div>

      {/* Bottom Section: Technology Tags (Rendered only when available) */}
      {tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center rounded-md border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs font-mono font-medium text-emerald-400/90"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

