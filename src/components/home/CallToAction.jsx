import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export function CallToAction() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,rgba(0,0,0,0)_70%)]" />
      </div>
      
      <div className="container px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary/20 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full filter blur-3xl opacity-70" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/10 rounded-full filter blur-3xl opacity-50" />
          
          <div className="relative z-10">
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Ready to take control of your subscriptions?
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join thousands of users who have already saved money and simplified their subscription management.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" className="text-base shadow-lg shadow-primary/20">
                Get Started for Free
              </Button>
              <Button variant="outline" size="lg" className="text-base">
                Schedule a Demo
              </Button>
            </motion.div>
            
            <motion.p 
              className="text-sm text-muted-foreground mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              No credit card required • 14-day free trial • Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
