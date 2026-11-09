import React, { useEffect, useState, useCallback } from 'react';
import { Project } from '@/types';
import { getPublishedProjects } from '@/services/projectsService';
import { ProjectCard } from './ProjectCard';
import { ProjectsLoadingState } from './ProjectsLoadingState';
import { ProjectsEmptyState } from './ProjectsEmptyState';
import { ProjectsErrorState } from './ProjectsErrorState';

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await getPublishedProjects();

    if (result.error) {
      setError(result.error);
      setProjects([]);
    } else {
      setProjects(result.projects);
      setError(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <section id="projects" className="w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-10 text-left">
        <div className="flex items-center gap-2">
          <span className="h-px w-8 bg-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Showcase
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Featured Projects
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          A dynamic showcase of applications, open-source work, and technical experiments.
        </p>
      </div>

      {/* State Rendering */}
      {loading && <ProjectsLoadingState />}

      {!loading && error && (
        <ProjectsErrorState message={error} onRetry={fetchProjects} />
      )}

      {!loading && !error && projects.length === 0 && (
        <ProjectsEmptyState />
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id ?? `${project.title}-${index}`}
              project={project}
            />
          ))}
        </div>
      )}
    </section>
  );
};

