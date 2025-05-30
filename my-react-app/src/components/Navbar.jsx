import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth(); // Get auth state and functions
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
    setIsOpen(false); // Close mobile menu if open
  };

  const baseLinkClasses = "px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkClasses = "bg-blue-500 text-white";
  const inactiveLinkClasses = "text-gray-700 hover:bg-blue-100 hover:text-blue-700";

  const getNavLinkClass = ({ isActive }) =>
    `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`;

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/properties", text: "Properties" },
    { to: "/agent-profile", text: "Agent Profile" }, // This could be conditional too
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl text-blue-600">RealEstate</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map(link => (
                <NavLink key={link.text} to={link.to} className={getNavLinkClass}>
                  {link.text}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard" className={getNavLinkClass}>
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className={`${baseLinkClasses} ${inactiveLinkClasses} border border-blue-500`}
                  >
                    Logout
                  </button>
                  {user && user.firstName && <span className="text-gray-700 text-sm font-medium ml-2">Hi, {user.firstName}!</span>}
                </>
              ) : (
                <>
                  <NavLink to="/login" className={getNavLinkClass}>
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={`${baseLinkClasses} ${inactiveLinkClasses} border border-blue-500`}
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-blue-500 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-500 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <NavLink key={link.text} to={link.to} className={({isActive}) => `${baseLinkClasses} block ${isActive ? activeLinkClasses : inactiveLinkClasses}`} onClick={() => setIsOpen(false)}>
                {link.text}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={({isActive}) => `${baseLinkClasses} block ${isActive ? activeLinkClasses : inactiveLinkClasses}`} onClick={() => setIsOpen(false)}>
                  Dashboard
                </NavLink>
                <button onClick={handleLogout} className={`${baseLinkClasses} block w-full text-left ${inactiveLinkClasses}`}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({isActive}) => `${baseLinkClasses} block ${isActive ? activeLinkClasses : inactiveLinkClasses}`} onClick={() => setIsOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={({isActive}) => `${baseLinkClasses} block ${isActive ? activeLinkClasses : inactiveLinkClasses}`} onClick={() => setIsOpen(false)}>
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
