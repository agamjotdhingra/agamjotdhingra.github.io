import React, { useEffect, useState, useCallback } from 'react';
import { Project } from '@/types';
import { getPublishedProjects } from '@/services/projectsService';
import { ProjectCard } from './ProjectCard';
import { ProjectsLoadingState } from './ProjectsLoadingState';
import { ProjectsEmptyState } from './ProjectsEmptyState';
import { ProjectsErrorState } from './ProjectsErrorState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';

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
    <section id="projects" className="relative w-full border-t border-[#16171c] px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="03"
          label="Selected work"
          title="Selected work & technical experiments."
          emphasis={['technical', 'experiments.']}
          description="A dynamic collection of software applications, hackathon solutions, and machine learning explorations."
        />

        {/* State Rendering */}
        <div className="mt-16">
          {loading && <ProjectsLoadingState />}

          {!loading && error && (
            <ProjectsErrorState message={error} onRetry={fetchProjects} />
          )}

          {!loading && !error && projects.length === 0 && (
            <ProjectsEmptyState />
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="flex flex-col gap-6">
              {projects.map((project, index) => (
                <Reveal key={project.id ?? `${project.title}-${index}`} delay={60}>
                  <ProjectCard project={project} index={index} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};