import React from 'react';
import TestimonialCard from './TestimonialCard';

const mockTestimonials = [
  {
    id: 1,
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    userName: 'Sarah L.',
    comment: 'Working with RealEstate Inc. was a dream! They helped me find the perfect home for my family quickly and efficiently. Highly recommend!',
    rating: 5,
  },
  {
    id: 2,
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    userName: 'John B.',
    comment: 'The agents are very knowledgeable and guided me through every step of the selling process. Made it so much less stressful.',
    rating: 5,
  },
  {
    id: 3,
    avatarUrl: 'https://randomuser.me/api/portraits/women/67.jpg',
    userName: 'Maria G.',
    comment: 'Found a great rental property through them. The platform is easy to use and the team is responsive.',
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTestimonials.map(testimonial => (
            <TestimonialCard
              key={testimonial.id}
              avatarUrl={testimonial.avatarUrl}
              userName={testimonial.userName}
              comment={testimonial.comment}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
