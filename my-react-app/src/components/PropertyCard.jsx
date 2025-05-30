import React from 'react';

const PropertyCard = ({ imageUrl, address, beds, baths, size, price }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <img 
        src={imageUrl || "https://via.placeholder.com/400x250/E0E0E0/BDBDBD?text=RealEstateProperty"} 
        alt={`Property at ${address}`} 
        className="w-full h-56 object-cover" 
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate" title={address}>
          {address}
        </h3>
        <div className="flex items-center text-gray-600 mb-4 space-x-3">
          <span className="flex items-center">
            {/* Placeholder for bed icon */}
            <svg className="w-5 h-5 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12H5m14 0h-7m7 0V5m0 14v-7"></path></svg>
            {beds} beds
          </span>
          <span className="flex items-center">
            {/* Placeholder for bath icon */}
            <svg className="w-5 h-5 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 19H5V5h14v14zM5 12h14"></path></svg>
            {baths} baths
          </span>
          <span className="flex items-center">
            {/* Placeholder for size icon */}
            <svg className="w-5 h-5 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4h4M4 4l5 5m-5 6v4h4m-4-4l5-5m6-5h4v4m-4-4l-5 5m5 6h4v-4m-4 4l-5-5"></path></svg>
            {size} sqft
          </span>
        </div>
        <p className="text-2xl font-bold text-blue-600">
          ${price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default PropertyCard;
