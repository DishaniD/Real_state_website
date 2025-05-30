import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import Layout from './layouts/Layout'; // Main site layout
import DashboardLayout from './layouts/DashboardLayout'; // Dashboard layout

// Main Site Pages
import HomePage from './pages/HomePage';
import AgentProfilePage from './pages/AgentProfilePage';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Dashboard Pages
import DashboardHomePage from './pages/dashboard/DashboardHomePage';
import SavedPropertiesPage from './pages/dashboard/SavedPropertiesPage';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Standalone Pages (no main Layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Main Site Routes - Wrapped by Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/agent-profile" element={<AgentProfilePage />} />
            <Route path="/properties" element={<PropertyListingPage />} />
            <Route path="/property/:propertyId" element={<PropertyDetailsPage />} />
          </Route>

          {/* Dashboard Routes - Protected and Wrapped by DashboardLayout */}
          <Route element={<ProtectedRoute />}> {/* Protects all nested dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHomePage />} />
              <Route path="profile" element={<div className="text-xl p-5">User Profile Page (Placeholder - To be built)</div>} />
              <Route path="saved-properties" element={<SavedPropertiesPage />} />
              <Route path="contacted-properties" element={<div className="text-xl p-5">Contacted Properties Page (Placeholder - To be built)</div>} />
            </Route>
          </Route>

          {/* Catch-all for 404 or redirect to home */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
