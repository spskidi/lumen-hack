import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingState from '../LoadingState';

const mockTestimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'Acme Inc.',
    content: 'SubTrack has completely transformed how we manage our subscriptions. The dashboard is intuitive and the analytics are incredibly insightful.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'CTO',
    company: 'TechStart',
    content: 'The team at SubTrack has been incredibly responsive to our needs. Their platform has saved us countless hours of manual tracking.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Finance Manager',
    company: 'Global Corp',
    content: 'We\'ve reduced our SaaS spending by 30% since implementing SubTrack. The cost analysis tools are game-changing.',
    rating: 4,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Operations Lead',
    company: 'StartUpX',
    content: 'The automated renewal alerts have saved us from several unexpected renewals. The peace of mind is worth the subscription alone.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
  },
  {
    id: 5,
    name: 'Jessica Williams',
    role: 'Small Business Owner',
    company: 'Williams & Co.',
    content: 'The customer support is exceptional. They helped me set up custom categories and reports that perfectly fit my business needs.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
  },
  {
    id: 6,
    name: 'Robert Taylor',
    role: 'Finance Director',
    company: 'FinanceCorp',
    content: 'We implemented SubTrack across our entire organization and have already reduced our SaaS spend by 30% in the first quarter.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
  }
];

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-border hover:shadow-md transition-shadow h-full">
    <div className="flex items-center mb-4">
      <img 
        src={testimonial.avatar} 
        alt={testimonial.name}
        className="h-12 w-12 rounded-full object-cover mr-4"
      />
      <div>
        <h4 className="font-medium text-foreground">{testimonial.name}</h4>
        <p className="text-sm text-muted-foreground">{testimonial.role} • {testimonial.company}</p>
      </div>
    </div>
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i}
          className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
    <p className="text-muted-foreground">"{testimonial.content}"</p>
  </div>
);

const Testimonials = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTestimonials(mockTestimonials);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex(prev => 
      prev === Math.ceil(testimonials.length / 2) - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex(prev => 
      prev === 0 ? Math.ceil(testimonials.length / 2) - 1 : prev - 1
    );
  };

  const currentTestimonials = testimonials.slice(currentIndex * 2, currentIndex * 2 + 2);

  if (isLoading) {
    return (
      <LoadingState 
        isLoading={isLoading} 
        loadingText="Loading testimonials..."
        className="py-12"
        fullPage={false}
      />
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Error loading testimonials</h2>
        <p className="text-muted-foreground text-lg">{error}</p>
      </div>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-block px-4 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by thousands of users
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of satisfied users who have taken control of their subscriptions.
            </p>
          </motion.div>

          <div className="mt-12 relative">
            {/* Navigation Arrows */}
            <button 
              onClick={prevTestimonial}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
            
            <div className="grid gap-8 md:grid-cols-2">
              {currentTestimonials.map((testimonial) => (
                <TestimonialCard 
                  key={testimonial.id}
                  testimonial={testimonial} 
                />
              ))}
            </div>

            <button 
              onClick={nextTestimonial}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-6 bg-primary' 
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial set ${index + 1}`}
              />
            ))}
          </div>

          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="inline-flex items-center justify-center flex-wrap gap-4 bg-background border border-border rounded-full px-6 py-3 shadow-sm max-w-lg mx-auto">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${30 + i}.jpg`}
                    alt="User"
                    className="h-8 w-8 rounded-full border-2 border-background"
                  />
                ))}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm font-medium">4.9/5 from 2,000+ reviews</span>
                </div>
                <p className="text-xs text-muted-foreground">Trusted by teams at top companies</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
