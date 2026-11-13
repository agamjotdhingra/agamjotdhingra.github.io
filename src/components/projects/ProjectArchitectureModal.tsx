import React, { useEffect } from 'react';
import { Project } from '@/types';

interface ProjectArchitectureModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectArchitectureModal: React.FC<ProjectArchitectureModalProps> = ({
  project,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project || !project.architecture) return null;

  const { architecture } = project;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="architecture-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-[#272930] bg-[#0f1013] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1c1e24] px-6 py-4 sm:px-8">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              System Architecture &amp; Engineering Dossier
            </span>
            <h2 id="architecture-title" className="mt-1 text-lg font-semibold text-white sm:text-xl">
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            aria-label="Close architecture view"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-6 sm:px-8 space-y-7 text-left text-sm text-zinc-300">
          {/* Problem Statement */}
          <section className="space-y-2">
            <h3 className="text-xs font-mono font-medium tracking-wider uppercase text-zinc-400">
              01 // The Problem
            </h3>
            <p className="leading-relaxed text-zinc-300">
              {architecture.problem}
            </p>
          </section>

          {/* System Design */}
          <section className="space-y-2 border-t border-[#1c1e24] pt-5">
            <h3 className="text-xs font-mono font-medium tracking-wider uppercase text-zinc-400">
              02 // System Design &amp; Architecture
            </h3>
            <p className="leading-relaxed text-zinc-300">
              {architecture.systemDesign}
            </p>
          </section>

          {/* Key Architectural Decisions */}
          {architecture.keyDecisions.length > 0 && (
            <section className="space-y-3 border-t border-[#1c1e24] pt-5">
              <h3 className="text-xs font-mono font-medium tracking-wider uppercase text-zinc-400">
                03 // Key Architectural Decisions
              </h3>
              <ul className="space-y-2">
                {architecture.keyDecisions.map((decision, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-zinc-300">
                    <span className="font-mono text-xs text-zinc-400">0{idx + 1}.</span>
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Technology Choices & Tradeoffs */}
          {architecture.techChoices.length > 0 && (
            <section className="space-y-3 border-t border-[#1c1e24] pt-5">
              <h3 className="text-xs font-mono font-medium tracking-wider uppercase text-zinc-400">
                04 // Technology Choices &amp; Trade-offs
              </h3>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {architecture.techChoices.map((choice, idx) => (
                  <div key={idx} className="rounded-xl border border-[#23252c] bg-[#141519] p-3.5">
                    <div className="font-mono text-xs font-semibold text-zinc-200">
                      {choice.tech}
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-zinc-400">
                      {choice.reason}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Code Reference Snippet */}
          {architecture.codeSnippet && (
            <section className="space-y-2 border-t border-[#1c1e24] pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-medium tracking-wider uppercase text-zinc-400">
                  05 // Code Reference
                </h3>
                <span className="font-mono text-[11px] text-zinc-400">
                  {architecture.codeSnippet.filename}
                </span>
              </div>
              <pre className="overflow-x-auto rounded-xl border border-[#23252c] bg-[#0a0a0c] p-4 font-mono text-xs leading-relaxed text-zinc-300">
                <code>{architecture.codeSnippet.code}</code>
              </pre>
            </section>
          )}

          {/* Lessons Learned */}
          <section className="space-y-2 border-t border-[#1c1e24] pt-5">
            <h3 className="text-xs font-mono font-medium tracking-wider uppercase text-zinc-400">
              06 // Lessons Learned &amp; Reflections
            </h3>
            <p className="leading-relaxed text-zinc-400 italic font-editorial text-base">
              &ldquo;{architecture.lessonsLearned}&rdquo;
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#1c1e24] bg-[#0a0a0c]/60 px-6 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                View Repository &rarr;
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Launch Demo &rarr;
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

