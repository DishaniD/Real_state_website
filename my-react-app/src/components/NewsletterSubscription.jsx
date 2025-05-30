import React from 'react';

const NewsletterSubscription = () => {
  return (
    <section className="bg-blue-600 py-12 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-3">
          Subscribe to Our Newsletter
        </h2>
        <p className="mb-6 text-blue-100 max-w-xl mx-auto">
          Get the latest updates on new properties, market trends, and exclusive offers directly in your inbox.
        </p>
        <form className="flex flex-col sm:flex-row justify-center items-center max-w-lg mx-auto gap-3">
          <label htmlFor="email-subscription" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="email-subscription"
            name="email"
            placeholder="Enter your email address"
            className="px-4 py-3 rounded-md shadow-sm focus:ring-2 focus:ring-white focus:outline-none text-gray-800 w-full sm:flex-grow"
            required
          />
          <button
            type="submit"
            className="bg-white hover:bg-blue-100 text-blue-600 font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out w-full sm:w-auto"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSubscription;
