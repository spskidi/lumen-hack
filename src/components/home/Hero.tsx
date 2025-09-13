import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <motion.div 
          className="lg:w-1/2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Take control of your</span>
            <span className="block text-indigo-600">subscriptions today.</span>
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Track, manage, and optimize all your subscriptions in one place. Never pay for what you don't use again.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Get started
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Learn more
            </a>
          </div>
        </motion.div>
        <motion.div 
          className="mt-12 lg:mt-0 lg:ml-8 lg:flex-shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="rounded-lg overflow-hidden shadow-xl transform -rotate-1">
            <img
              className="w-full rounded-lg"
              src="/dashboard-preview.svg"
              alt="App dashboard preview"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
