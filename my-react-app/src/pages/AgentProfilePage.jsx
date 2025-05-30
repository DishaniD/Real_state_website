import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard'; // Adjust path as needed
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // To get token/user info
import { Link } from 'react-router-dom'; // For a "Create Profile" button

const AgentProfilePage = () => {
  const [agentProfile, setAgentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth(); // Get token for authenticated request

  useEffect(() => {
    const fetchAgentProfile = async () => {
      if (!token) {
        setError("You must be logged in to view this page.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/agents/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAgentProfile(response.data);
      } catch (err) {
        console.error("Error fetching agent profile:", err);
        if (err.response && err.response.status === 404) {
          setError("Agent profile not found for this user. Would you like to create one?");
          // In a real app, you might offer a link/button to a profile creation page
        } else {
          setError(err.response?.data?.message || 'Failed to fetch agent profile.');
        }
        setAgentProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentProfile();
  }, [token]);

  if (loading) {
    return <div className="container mx-auto p-8 text-center text-xl">Loading agent profile...</div>;
  }

  if (error && !agentProfile) { // Show error prominently if no profile and error occurred
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-red-500 text-xl bg-red-100 p-4 rounded-md">{error}</p>
        {/* Optionally, add a button/link to create a profile if error indicates it's not found */}
        {error.includes("not found") && (
           <Link to="/dashboard/create-agent-profile" /* Route to be created */ className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Agent Profile
          </Link>
        )}
      </div>
    );
  }

  if (!agentProfile) {
     // This case might be redundant if error handles the 404, but good as a fallback.
    return <div className="container mx-auto p-8 text-center text-xl">No agent profile available.</div>;
  }

  const { userId: user, listings, ...agentDetails } = agentProfile;

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Agent Details Section */}
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center">
        <img
          src={agentDetails.profileImage || "https://via.placeholder.com/150/007BFF/FFFFFF?text=Agent"}
          alt={`${user?.firstName || 'Agent'} - Profile`}
          className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-blue-500 mb-6 md:mb-0 md:mr-8"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{user?.firstName || ''} {user?.lastName || ''}</h1>
          <p className="text-xl text-blue-600 font-semibold">{agentDetails.title || "Real Estate Agent"}</p>
          {agentDetails.yearsOfExperience && <p className="text-md text-gray-600 mt-1">{agentDetails.yearsOfExperience} Years of Experience</p>}
          <div className="mt-4 space-y-1">
            {(agentDetails.contactInfo?.mobilePhone || user?.phoneNumber) && (
              <p className="text-gray-700 flex items-center justify-center md:justify-start">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                {agentDetails.contactInfo?.mobilePhone || user?.phoneNumber}
              </p>
            )}
            {(agentDetails.contactInfo?.email || user?.email) && (
              <p className="text-gray-700 flex items-center justify-center md:justify-start">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                {agentDetails.contactInfo?.email || user?.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      {agentDetails.bio && (
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Me</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {agentDetails.bio}
          </p>
        </div>
      )}

      {/* Specialties Section */}
      {agentDetails.specialties && agentDetails.specialties.length > 0 && (
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Specialties</h2>
           <div className="flex flex-wrap gap-2">
            {agentDetails.specialties.map((spec, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}


      {/* Listings Section */}
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center md:text-left">My Listings</h2>
        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map(property => (
              <PropertyCard
                key={property._id}
                id={property._id}
                imageUrl={property.images && property.images.length > 0 ? property.images[0] : undefined}
                address={property.address}
                beds={property.beds}
                baths={property.baths}
                sqft={property.sqft}
                price={property.price}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-5">No listings available at the moment. Add your first property!</p>
        )}
      </div>
    </div>
  );
};

export default AgentProfilePage;
