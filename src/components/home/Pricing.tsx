import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const pricing = {
  tiers: [
    {
      name: 'Free',
      href: '#',
      priceMonthly: 0,
      description: 'Perfect for tracking a few subscriptions',
      features: [
        'Track up to 5 subscriptions',
        'Basic analytics',
        'Email support',
        'Web access only',
      ],
      cta: 'Get started',
      popular: false,
    },
    {
      name: 'Pro',
      href: '#',
      priceMonthly: 9,
      description: 'For power users who want more control',
      features: [
        'Unlimited subscriptions',
        'Advanced analytics',
        'Priority support',
        'Mobile app access',
        'Email reports',
      ],
      cta: 'Start free trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      href: '#',
      priceMonthly: 29,
      description: 'For teams and businesses',
      features: [
        'Everything in Pro, plus:',
        'Team members',
        'Shared subscriptions',
        'Custom reporting',
        'Dedicated account manager',
      ],
      cta: 'Contact sales',
      popular: false,
    },
  ],
};

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Choose the perfect plan for your needs
          </p>
          
          <div className="mt-6 flex items-center justify-center">
            <span className={`mr-3 text-sm font-medium ${!isAnnual ? 'text-indigo-600' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              type="button"
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-indigo-100 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="ml-3 text-sm font-medium text-gray-500">
              <span className="mr-1">Annual</span>
              <span className="text-indigo-600">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="mt-12 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
          {pricing.tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border ${
                tier.popular ? 'border-indigo-500 shadow-xl' : 'border-gray-200'
              } p-8`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-800">
                    Most popular
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                <p className="mt-4 text-gray-500">{tier.description}</p>
                <p className="mt-6">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${isAnnual ? Math.floor(tier.priceMonthly * 12 * 0.8) : tier.priceMonthly}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    {isAnnual ? '/year' : '/month'}
                  </span>
                </p>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex">
                      <Check className="h-6 w-6 flex-shrink-0 text-green-500" aria-hidden="true" />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={tier.href}
                className={`mt-8 block w-full rounded-md border border-transparent px-6 py-3 text-center text-base font-medium ${
                  tier.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
