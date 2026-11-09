import React from 'react';

export const ProjectsLoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2" role="status" aria-label="Loading projects">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/30 p-6 sm:p-7 animate-pulse"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              {/* Title skeleton */}
              <div className="h-6 w-3/5 rounded-md bg-slate-800" />
              {/* Links skeleton */}
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded bg-slate-800" />
                <div className="h-5 w-5 rounded bg-slate-800" />
              </div>
            </div>

            {/* Description lines skeleton */}
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-slate-800/70" />
              <div className="h-4 w-5/6 rounded bg-slate-800/70" />
              <div className="h-4 w-2/3 rounded bg-slate-800/60" />
            </div>
          </div>

          {/* Tags skeleton */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/40 pt-3">
            <div className="h-5 w-16 rounded bg-slate-800/70" />
            <div className="h-5 w-20 rounded bg-slate-800/70" />
            <div className="h-5 w-14 rounded bg-slate-800/70" />
          </div>
        </div>
      ))}
    </div>
  );
};

