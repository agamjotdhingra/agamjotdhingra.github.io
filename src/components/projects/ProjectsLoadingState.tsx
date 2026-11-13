import React from 'react';

export const ProjectsLoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2" role="status" aria-label="Loading projects">
      {[1, 2].map((index) => (
        <div
          key={index}
          className="flex flex-col justify-between rounded-2xl border border-[#1e2026] bg-[#111215] p-6 sm:p-7 animate-pulse"
        >
          <div>
            <div className="h-6 w-3/5 rounded bg-zinc-800" />
            <div className="mt-4 space-y-2">
              <div className="h-3.5 w-full rounded bg-zinc-850" />
              <div className="h-3.5 w-5/6 rounded bg-zinc-850" />
              <div className="h-3.5 w-2/3 rounded bg-zinc-850" />
            </div>
          </div>
          <div className="mt-6 flex gap-2 border-t border-[#1c1e24] pt-4">
            <div className="h-5 w-16 rounded bg-zinc-800" />
            <div className="h-5 w-20 rounded bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
};