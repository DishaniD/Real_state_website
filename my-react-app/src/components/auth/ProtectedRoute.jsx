import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust path as necessary

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You can render a loading spinner here while auth state is being determined
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading authentication status...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" replace />;
  }

  // If using React Router v6 element-based routing for children:
  // return children;
  // If Outlet is preferred for nested routes under this protected element:
  return <Outlet />; // Use Outlet if this ProtectedRoute wraps other <Route> elements
};

export default ProtectedRoute;
