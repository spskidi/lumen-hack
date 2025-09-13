import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PricingTier {
  name: string;
  href: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  limits: {
    subscriptionCount: number | 'unlimited';
    teamMembers: number | 'unlimited';
    logRetention: string;
    apiAccess: boolean;
    customDomains: boolean;
    sso: boolean;
    support: string;
  };
  features: string[];
  cta: string;
  popular: boolean;
}

interface PricingTier {
  name: string;
  href: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  limits: {
    subscriptionCount: number | 'unlimited';
    teamMembers: number | 'unlimited';
    logRetention: string;
    apiAccess: boolean;
    customDomains: boolean;
    sso: boolean;
    support: string;
  };
  features: string[];
  cta: string;
  popular: boolean;
}

interface PricingData {
  tiers: PricingTier[];
}

const pricing: PricingData = {
  tiers: [
    {
      name: 'Free',
      href: '#',
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Get started with basic subscription tracking',
      limits: {
        subscriptionCount: 3,
        teamMembers: 1,
        logRetention: '30 days',
        apiAccess: false,
        customDomains: false,
        sso: false,
        support: 'Email (48h)'
      },
      features: [
        'Track up to 3 subscriptions',
        'Basic subscription analytics',
        '30 days of log history',
        'Email support',
        'Basic billing information tracking'
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Starter',
      href: '#',
      priceMonthly: 7.99,
      priceYearly: 5.99,
      description: 'Perfect for individuals with multiple subscriptions',
      limits: {
        subscriptionCount: 15,
        teamMembers: 1,
        logRetention: '1 year',
        apiAccess: false,
        customDomains: false,
        sso: false,
        support: 'Email (24h)'
      },
      features: [
        'Track up to 15 subscriptions',
        'Advanced analytics & reports',
        '1 year log retention',
        'Email & chat support',
        'Export subscription data',
        'Basic API access',
        'Payment method management'
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Team',
      href: '#',
      priceMonthly: 19.99,
      priceYearly: 15.99,
      description: 'For teams managing subscriptions together',
      limits: {
        subscriptionCount: 50,
        teamMembers: 5,
        logRetention: '3 years',
        apiAccess: true,
        customDomains: false,
        sso: false,
        support: 'Priority (12h)'
      },
      features: [
        'Track up to 50 subscriptions',
        'Team collaboration',
        '3 years log retention',
        'Full API access',
        'Custom subscription categories',
        'Advanced billing analytics',
        'Priority support',
        'Custom report scheduling'
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Business',
      href: '#',
      priceMonthly: 49.99,
      priceYearly: 39.99,
      description: 'For businesses with complex subscription needs',
      limits: {
        subscriptionCount: 200,
        teamMembers: 20,
        logRetention: '5 years',
        apiAccess: true,
        customDomains: true,
        sso: true,
        support: 'Priority (4h)'
      },
      features: [
        'Track up to 200 subscriptions',
        'Advanced team permissions',
        '5 years log retention',
        'Custom domains',
        'SSO integration',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantees'
      ],
      cta: 'Contact Sales',
      popular: false,
    },
    {
      name: 'Enterprise',
      href: '#',
      priceMonthly: 99.99,
      priceYearly: 899.99,
      description: 'For large organizations with advanced requirements',
      limits: {
        subscriptionCount: 'unlimited',
        teamMembers: 'unlimited',
        logRetention: 'Unlimited',
        apiAccess: true,
        customDomains: true,
        sso: true,
        support: '24/7 Dedicated'
      },
      features: [
        'Unlimited subscriptions',
        'Unlimited team members',
        'Unlimited log retention',
        'Custom SLAs',
        'On-premise deployment',
        'Custom development',
        'Security audit',
        'Dedicated infrastructure'
      ],
      cta: 'Contact Sales',
      popular: false,
    }
  ],
};

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState<boolean>(false);
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  const toggleTier = (tierName: string): void => {
    setExpandedTier(expandedTier === tierName ? null : tierName);
  };

  const formatLimit = (value: number | 'unlimited'): string | number => {
    return value === 'unlimited' ? 'Unlimited' : value;
  };

  return (
    <section id="pricing" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Subscription Management Plans
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Choose the perfect plan for your subscription tracking needs
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

        <div className="mt-12 space-y-6 lg:grid lg:grid-cols-1 lg:gap-6 lg:space-y-0">
          {pricing.tiers.map((tier: PricingTier, index: number) => (
            <motion.div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border ${
                tier.popular ? 'border-indigo-500 shadow-xl' : 'border-gray-200 hover:border-gray-300'
              } overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {tier.popular && (
                <div className="bg-indigo-600 py-1 text-center">
                  <span className="text-sm font-medium text-white">MOST POPULAR</span>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                    <p className="mt-1 text-gray-500">{tier.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-gray-900">
                      ${isAnnual ? tier.priceYearly : tier.priceMonthly}
                      <span className="text-base font-medium text-gray-500">
                        /{isAnnual ? 'mo billed annually' : 'mo'}
                      </span>
                    </p>
                    {isAnnual && tier.priceYearly < tier.priceMonthly * 10 && (
                      <p className="text-sm text-green-600">
                        Save {Math.round((1 - (tier.priceYearly * 12) / (tier.priceMonthly * 12)) * 100)}% annually
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Key Limits</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Subscriptions:</span>
                        <span className="font-medium">{formatLimit(tier.limits.subscriptionCount)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Team Members:</span>
                        <span className="font-medium">{formatLimit(tier.limits.teamMembers)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Log Retention:</span>
                        <span className="font-medium">{tier.limits.logRetention}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Support:</span>
                        <span className="font-medium">{tier.limits.support}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                    <ul className="space-y-2">
                      {tier.features.slice(0, 4).map((feature: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                          <span className="ml-2 text-gray-600">{feature}</span>
                        </li>
                      ))}
                      {tier.features.length > 4 && (
                        <li>
                          <button
                            onClick={() => toggleTier(tier.name)}
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            {expandedTier === tier.name ? 'Show less' : `+${tier.features.length - 4} more features`}
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {expandedTier === tier.name && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">All Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tier.features.map((feature: string, i: number) => (
                        <div key={i} className="flex items-start">
                          <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                          <span className="ml-2 text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <a
                    href={tier.href}
                    className={`block w-full text-center px-6 py-3 rounded-md border border-transparent text-base font-medium ${
                      tier.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    {tier.cta}
                  </a>
                  {tier.name === 'Free' && (
                    <p className="mt-2 text-center text-sm text-gray-500">No credit card required</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900">Need a custom solution?</h3>
          <p className="mt-2 text-gray-600">
            We offer custom enterprise plans with dedicated support and advanced features.
          </p>
          <a
            href="#contact"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
