import React from 'react';

interface ProjectsErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ProjectsErrorState: React.FC<ProjectsErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#121316] p-8 text-center">
      <h4 className="text-sm font-medium text-zinc-300">Unable to load projects</h4>
      <p className="mx-auto mt-1 max-w-md text-xs text-zinc-500">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 hover:text-white"
      >
        Retry
      </button>
    </div>
  );
};