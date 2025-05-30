import React from 'react';

const DashboardHomePage = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your Dashboard!</h1>
      <p className="text-lg text-gray-600">
        Select an option from the sidebar to view your profile, saved properties, or contacted properties.
      </p>
      {/* You can add more widgets or summary information here later */}
    </div>
  );
};

export default DashboardHomePage;
