import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { ContactSection } from '@/components/sections/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col items-center">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
