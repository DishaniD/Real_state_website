import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar'; // Adjust path as necessary

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <main className="flex-1 p-6 md:p-10 ml-64 overflow-y-auto"> {/* Ensure ml-64 matches sidebar width */}
        <Outlet /> {/* Content for dashboard pages will be rendered here */}
      </main>
    </div>
  );
};

export default DashboardLayout;
