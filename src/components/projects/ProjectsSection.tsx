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
    <section id="projects" className="w-full border-t border-[#1c1e24] px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="max-w-2xl text-left">
          <span className="text-xs font-mono font-medium tracking-wider text-zinc-400 uppercase">
            Projects
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Selected Work &amp; Technical Experiments
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            A dynamic collection of software applications, hackathon solutions, and machine learning explorations.
          </p>
        </div>

        {/* State Rendering */}
        <div className="mt-12">
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
        </div>
      </div>
    </section>
  );
};