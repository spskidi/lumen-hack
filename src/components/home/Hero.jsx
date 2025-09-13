import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary mb-6"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Introducing SubTrack Pro
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Take Control
            </span>
            <br />
            <span>of Your Subscriptions</span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Effortlessly manage all your subscriptions in one place. Track expenses, get renewal alerts, and discover savings with our intelligent subscription management platform.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button size="lg" className="text-base">
              Get Started for Free
            </Button>
            <Button variant="outline" size="lg" className="text-base">
              Watch Demo
            </Button>
          </motion.div>

          <motion.div 
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4, type: 'spring' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/50" />
            <div className="relative">
              <img 
                src="/dashboard-preview.svg" 
                alt="Dashboard preview" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
