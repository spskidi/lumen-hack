import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Pricing from '../components/home/Pricing';
import CTA from '../components/home/CTA';

export const Home: React.FC = () => {
  return (
    <div className="space-y-20 md:space-y-32">
      <Hero />
      <Features />
      <Pricing />
      <CTA />
    </div>
  );
};

