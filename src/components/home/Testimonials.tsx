import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Testimonials from real users
const mockTestimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Product Manager',
    company: 'TechCorp',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: "I was shocked to realize I was paying for three different music services. This app helped me cut $35/month from my budget. The cancellation reminders alone are worth the price!",
    rating: 5
  },
  {
    id: 2,
    name: 'Sarah Miller',
    role: 'Freelance Designer',
    company: 'Self-Employed',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: "Between client tools and personal subscriptions, I was losing track of what I was paying for. Now I can see everything in one place and actually remember to cancel free trials.",
    rating: 5
  },
  {
    id: 3,
    name: 'David Kim',
    role: 'Small Business Owner',
    company: 'Bean & Brew Café',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    content: "Found three subscriptions we didn't even know we still had. The team loves how easy it is to track everything now. Game changer for our bottom line.",
    rating: 4
  },
  {
    id: 4,
    name: 'Emma Wilson',
    role: 'Finance Director',
    company: 'BrightPath Education',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    content: "We saved over $8,000 in the first quarter by identifying unused licenses and duplicate tools. The ROI was immediate.",
    rating: 5
  },
];

// Star rating component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<typeof mockTestimonials>([]);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTestimonials(mockTestimonials);
      } catch (err) {
        setError('Failed to load testimonials');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Get current testimonials to display (2 at a time)
  const currentTestimonials = testimonials.slice(currentIndex, currentIndex + 2);

  // Handle navigation
  const next = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 2 >= testimonials.length ? 0 : prevIndex + 2
    );
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - (testimonials.length % 2 || 2) : prevIndex - 2
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
            Real people, real savings
          </h2>
          <motion.p 
            className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Join thousands who've taken control
          </motion.p>
          <motion.p 
            className="mt-3 max-w-2xl mx-auto text-xl text-gray-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The average user saves $50/month in the first 30 days
          </motion.p>
        </motion.div>

        <motion.div 
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 p-2 rounded-full bg-white shadow-md text-indigo-600 hover:bg-indigo-50 z-10"
            aria-label="Previous testimonial"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {currentTestimonials.map((testimonial) => (
                  <motion.div 
                    key={testimonial.id}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full border border-gray-100"
                    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                  >
                    <div className="flex items-center mb-4">
                      <motion.img
                        className="h-12 w-12 rounded-full object-cover border-2 border-indigo-100"
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        whileHover={{ scale: 1.05 }}
                      />
                      <div className="ml-4">
                        <p className="text-lg font-medium text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                    <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                      <StarRating rating={testimonial.rating} />
                      <span className="ml-2 text-sm text-gray-500">
                        {testimonial.rating}.0/5.0
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 p-2 rounded-full bg-white shadow-md text-indigo-600 hover:bg-indigo-50 z-10"
            aria-label="Next testimonial"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>
        </motion.div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 2)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index * 2 ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial set ${index + 1}`}
            />
          ))}
        </div>

        {/* Trusted by section */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-8">
            Trusted by teams at
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5 items-center">
            {[
              { name: 'Netflix', icon: '🎬' },
              { name: 'Spotify', icon: '🎵' },
              { name: 'Adobe', icon: '🎨' },
              { name: 'Microsoft', icon: '💻' },
              { name: 'Slack', icon: '💬' }
            ].map((company, index) => (
              <motion.div 
                key={index} 
                className="col-span-1 flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <span className="text-3xl mb-2">{company.icon}</span>
                <span className="text-sm font-medium text-gray-700">{company.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
