import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Hero from '../components/Hero.tsx';
import CorePillars from '../components/home/CorePillars';
import FeaturedPrograms from '../components/home/FeaturedPrograms';

import LearningMethod from '../components/home/LearningMethod';
import AudiencePathways from '../components/home/AudiencePathways';
import FinalCTA from '../components/home/FinalCTA';

const Home: React.FC = () => {
  return (
    <MainLayout>
      <Hero />
      <CorePillars />
      <FeaturedPrograms />
      
      <LearningMethod />
      <AudiencePathways />
      <FinalCTA />
    </MainLayout>
  );
};

export default Home;
