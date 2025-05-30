import React from 'react';
import SearchBar from './SearchBar'; // Assuming SearchBar.jsx is in the same directory

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-4 sm:py-24 md:py-32 lg:py-40">
      {/* You can add a background image here if needed:
      <div className="absolute inset-0">
        <img src="path/to/your/image.jpg" alt="Background" className="w-full h-full object-cover opacity-50" />
      </div>
      */}
      <div className="relative z-10 container mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
          Find Your Dream Home
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-12">
          Search from thousands of properties in your area.
        </p>

        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Hero;
