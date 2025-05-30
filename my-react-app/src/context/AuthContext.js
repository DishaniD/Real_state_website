import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // For potential future use within context if needed

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // To check token validity on initial load

  // Configure axios defaults to include token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token); // Ensure LS is in sync
      setIsAuthenticated(true);
      // Optionally, fetch user profile here if token exists to validate it
      // and get up-to-date user info. For now, we'll assume token means authenticated.
      // For simplicity, we'll retrieve basic user info from localStorage if stored during login.
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // Optionally, redirect to login or home page via useNavigate() if called from a component
  };

  // Value provided to child components
  const value = {
    user,
    token,
    isAuthenticated,
    loading, // Provide loading state for initial auth check
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after initial loading is done */}
    </AuthContext.Provider>
  );
};
