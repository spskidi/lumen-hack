import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

const plans = [
  {
    name: 'Starter',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for individuals just getting started',
    features: [
      'Track up to 5 subscriptions',
      'Basic analytics',
      'Email support',
      'Web & mobile access'
    ],
    featured: false,
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: { monthly: 9, yearly: 7 },
    description: 'Ideal for power users and small teams',
    features: [
      'Unlimited subscriptions',
      'Advanced analytics',
      'Priority support',
      'Export data',
      'Team members (up to 5)'
    ],
    featured: true,
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    price: { monthly: 29, yearly: 24 },
    description: 'For businesses with advanced needs',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Dedicated account manager',
      'Custom integrations',
      'SLA & priority support',
      'API access'
    ],
    featured: false,
    cta: 'Contact Sales',
  },
];

const PricingCard = ({ plan, isYearly, index }) => {
  const isFeatured = plan.featured;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex flex-col p-8 rounded-2xl border ${
        isFeatured 
          ? 'border-primary/30 bg-gradient-to-b from-primary/5 to-background shadow-lg scale-[1.03]' 
          : 'border-border/50 hover:border-primary/30 hover:shadow-lg transition-all'
      }`}
    >
      {isFeatured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            <Zap className="w-4 h-4 mr-1.5" />
            Most Popular
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
        <p className="text-muted-foreground">{plan.description}</p>
      </div>
      
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold">
            ${isYearly ? plan.price.yearly : plan.price.monthly}
          </span>
          <span className="text-muted-foreground ml-1">
            /{isYearly ? 'year' : 'month'}
          </span>
        </div>
        {isYearly && plan.price.yearly < plan.price.monthly * 10 && (
          <p className="text-sm text-green-500 mt-1">
            Save {Math.round((1 - plan.price.yearly / (plan.price.monthly * 12)) * 100)}% annually
          </p>
        )}
      </div>
      
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button
        size="lg"
        className={`w-full mt-auto ${
          isFeatured ? 'bg-primary hover:bg-primary/90' : 'bg-foreground/5 hover:bg-foreground/10 text-foreground'
        }`}
      >
        {plan.cta}
      </Button>
    </motion.div>
  );
};

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  
  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary mb-4"
          >
            Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Start for free, upgrade as you grow. No hidden fees, cancel anytime.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center bg-muted rounded-full p-1 mt-8"
          >
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                !isYearly ? 'bg-background shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                isYearly ? 'bg-background shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly <span className="text-primary ml-1">Save 20%</span>
            </button>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard 
              key={plan.name} 
              plan={plan} 
              isYearly={isYearly}
              index={index}
            />
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          <p>Need a custom plan? <a href="#contact" className="text-primary hover:underline">Contact our sales team</a></p>
          <p className="mt-2">All plans come with a 14-day free trial. No credit card required.</p>
        </motion.div>
      </div>
    </section>
  );
}
