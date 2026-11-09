import React from 'react';

interface ProjectsErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ProjectsErrorState: React.FC<ProjectsErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-900/40 bg-red-950/10 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-800/40 bg-red-900/20 text-red-400">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 7.5h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <h4 className="mt-4 text-base font-semibold text-slate-200">Unable to load projects</h4>
      <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-400">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-750 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Try Again
      </button>
    </div>
  );
};

