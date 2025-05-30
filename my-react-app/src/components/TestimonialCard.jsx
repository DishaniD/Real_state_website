import React from 'react';

const StarRating = ({ rating }) => {
  const totalStars = 5;
  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
    if (i <= rating) {
      stars.push(<span key={i} className="text-yellow-400">&#9733;</span>); // Filled star
    } else {
      stars.push(<span key={i} className="text-gray-300">&#9733;</span>); // Empty star (or use a different character for outline)
    }
  }
  return <div className="flex">{stars}</div>;
};

const TestimonialCard = ({ avatarUrl, userName, comment, rating }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-2 flex flex-col items-center text-center max-w-sm mx-auto">
      <img 
        src={avatarUrl || "https://via.placeholder.com/100/E0E0E0/BDBDBD?text=User"} 
        alt={`Avatar of ${userName}`} 
        className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-blue-500" 
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-1">
        {userName}
      </h3>
      {rating && <StarRating rating={rating} />}
      <p className="text-gray-600 italic mt-3 text-sm">
        "{comment}"
      </p>
    </div>
  );
};

export default TestimonialCard;
