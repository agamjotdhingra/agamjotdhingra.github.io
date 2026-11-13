import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { EngineeringDomainsSection } from '@/components/sections/EngineeringDomainsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { CurrentlyExploringSection } from '@/components/sections/CurrentlyExploringSection';
import { NotebookSection } from '@/components/notebook/NotebookSection';
import { GithubActivitySection } from '@/components/sections/GithubActivitySection';
import { ContactSection } from '@/components/sections/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col items-center">
      <HeroSection />
      <EngineeringDomainsSection />
      <AboutSection />
      <ProjectsSection />
      <CurrentlyExploringSection />
      <NotebookSection />
      <GithubActivitySection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
