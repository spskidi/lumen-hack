import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Bell, CreditCard, Zap } from 'lucide-react';

const features = [
  {
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    title: "Track Everything",
    description: "Get a complete overview of all your subscriptions in one dashboard with detailed analytics and spending insights."
  },
  {
    icon: <Bell className="h-6 w-6 text-primary" />,
    title: "Smart Alerts",
    description: "Never miss a payment with timely reminders before your subscriptions renew or when free trials are about to end."
  },
  {
    icon: <CreditCard className="h-6 w-6 text-primary" />,
    title: "Save Money",
    description: "Discover potential savings by identifying unused subscriptions and finding better deals on the services you love."
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "One-Click Management",
    description: "Easily cancel or pause subscriptions with just one click, without the hassle of logging into multiple accounts."
  }
];

const FeatureCard = ({ icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="flex flex-col items-start p-6 bg-card rounded-xl border border-border/50 hover:border-primary/30 transition-colors hover:shadow-lg"
  >
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary mb-4"
          >
            Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Everything you need to manage subscriptions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Powerful features designed to help you take control of your subscriptions and save money.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} index={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
