import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const DashboardSidebar = () => {
  const { logout, user } = useAuth(); // Get logout function and user
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
  };

  const baseLinkClasses = "block px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150";
  const activeLinkClasses = "bg-blue-600 text-white";
  const inactiveLinkClasses = "text-gray-700 hover:bg-blue-100 hover:text-blue-700";

  const getNavLinkClass = ({ isActive }) =>
    `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`;

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed top-0 left-0 pt-5 flex flex-col"> {/* Added flex flex-col */}
      <div> {/* Wrapper for logo and nav links to allow logout to be at bottom */}
        <div className="px-6 mb-4">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            RealEstate Co.
          </Link>
          {user && user.firstName && (
            <p className="text-sm text-gray-600 mt-1">Welcome, {user.firstName}!</p>
          )}
           {!user && (<p className="text-xs text-gray-500 mt-1">User Dashboard</p>)}
        </div>
        <nav className="flex flex-col space-y-2 px-4">
          <NavLink to="/dashboard" end className={getNavLinkClass}>
            Dashboard Home
          </NavLink>
          <NavLink to="/dashboard/profile" className={getNavLinkClass}>
            My Profile
          </NavLink>
          <NavLink to="/dashboard/saved-properties" className={getNavLinkClass}>
            Saved Properties
          </NavLink>
          <NavLink to="/dashboard/contacted-properties" className={getNavLinkClass}>
            Contacted Properties
          </NavLink>
          <NavLink to="/" className={getNavLinkClass}>
            Back to Main Site
          </NavLink>
        </nav>
      </div>
      {/* Logout Button pushed to the bottom */}
      <div className="mt-auto p-4">
        <button
          onClick={handleLogout}
          className={`${baseLinkClasses} ${inactiveLinkClasses} w-full text-left`}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
