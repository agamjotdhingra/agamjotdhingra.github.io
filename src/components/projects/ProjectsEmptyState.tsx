import React from 'react';

export const ProjectsEmptyState: React.FC = () => {
  return (
    <div className="rounded-2xl border border-[#1e2026] bg-[#111215] p-10 text-center">
      <h4 className="text-sm font-medium text-zinc-300">
        More projects in progress
      </h4>
      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-zinc-400">
        Currently developing and documenting additional software and electronics projects. Updates will appear here as they are published.
      </p>
    </div>
  );
};