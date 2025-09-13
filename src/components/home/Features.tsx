import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Bell, CreditCard, Zap } from 'lucide-react';

const features = [
  {
    name: 'Track Everything',
    description: 'Monitor all your subscriptions in one dashboard. Never lose track of what you\'re paying for.',
    icon: BarChart2,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    name: 'Smart Alerts',
    description: 'Get notified before your subscriptions renew so you can cancel or update them in time.',
    icon: Bell,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Payment Tracking',
    description: 'See exactly where your money is going with detailed payment history and categorization.',
    icon: CreditCard,
    color: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Instant Insights',
    description: 'Get personalized recommendations to optimize your subscriptions and save money.',
    icon: Zap,
    color: 'from-violet-500 to-purple-500',
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Everything you need to manage subscriptions
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Powerful features to help you take control of your recurring expenses.
          </p>
        </motion.div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                
                <div className={`flex items-center justify-center h-14 w-14 rounded-xl mb-6 bg-gradient-to-r ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                  {feature.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-800 transition-colors duration-300">
                    Learn more
                    <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
