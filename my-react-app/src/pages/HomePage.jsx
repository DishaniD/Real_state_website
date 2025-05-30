import React from 'react';
import Hero from '../components/Hero';
import FeaturedProperties from '../components/FeaturedProperties';
import Testimonials from '../components/Testimonials';
import NewsletterSubscription from '../components/NewsletterSubscription';

const HomePage = () => {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <Testimonials />
      <NewsletterSubscription />
    </>
  );
};

export default HomePage;
