import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PropertyDetailsPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/${propertyId}`);
        setProperty(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setMainImage(response.data.images[0]);
        } else {
          setMainImage("https://via.placeholder.com/1200x600/E0E0E0/BDBDBD?text=Property+Image+Not+Available");
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError(err.response?.data?.message || 'Failed to fetch property details.');
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  if (loading) {
    return <div className="container mx-auto p-8 text-center text-xl">Loading property details...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-8 text-center text-red-500 text-xl bg-red-100 rounded-md">{error}</div>;
  }

  if (!property) {
    return <div className="container mx-auto p-8 text-center text-xl">Property not found.</div>;
  }

  // Default agent info if not populated or available
  const agentName = property.agent?.userId?.firstName ? `${property.agent.userId.firstName} ${property.agent.userId.lastName || ''}` : (property.agent?.agencyName || 'Contact for details');
  const agentContactEmail = property.agent?.contactInfo?.email || property.agent?.userId?.email || '#';


  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Property Images Gallery */}
      <div className="mb-8">
        <img
          src={mainImage || (property.images && property.images.length > 0 ? property.images[0] : "https://via.placeholder.com/1200x600/E0E0E0/BDBDBD?text=Property+Image+Not+Available")}
          alt="Main property view"
          className="w-full h-auto md:h-[500px] object-cover rounded-lg shadow-lg mb-4"
        />
        {property.images && property.images.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {property.images.map((img, index) => (
              <img
                key={index}
                src={img || "https://via.placeholder.com/300x200/E0E0E0/BDBDBD?text=Thumb"}
                alt={`Property thumbnail ${index + 1}`}
                className={`w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity ${img === mainImage ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{property.address}, {property.city}, {property.zipCode}</h1>
            <p className="text-4xl font-bold text-blue-600 mb-4">${property.price ? property.price.toLocaleString() : 'N/A'}</p>
            <div className="flex flex-wrap items-center text-gray-700 space-x-4 sm:space-x-6 mb-4">
              <span><strong className="font-semibold">{property.beds}</strong> Beds</span>
              <span><strong className="font-semibold">{property.baths}</strong> Baths</span>
              <span><strong className="font-semibold">{property.sqft ? property.sqft.toLocaleString() : 'N/A'}</strong> SqFt</span>
              <span><strong className="font-semibold">{property.propertyType}</strong></span>
               {property.status && <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">{property.status}</span>}
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Property Overview</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {property.description || 'No description available.'}
            </p>
          </div>

          {property.features && property.features.length > 0 && (
            <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features & Amenities</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-gray-700">
                {property.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white shadow-xl rounded-lg p-6 sticky top-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Contact Agent</h2>
            {property.agent?.profileImage && (
                <img src={property.agent.profileImage} alt={agentName} className="w-24 h-24 rounded-full mx-auto my-3 object-cover"/>
            )}
            <p className="text-lg text-center font-medium text-gray-700 mb-1">{agentName}</p>
            <p className="text-sm text-center text-blue-600 mb-5">
                <a href={`mailto:${agentContactEmail}`} className="hover:underline">{agentContactEmail}</a>
            </p>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" id="name" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Your Name" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" id="phone" name="phone" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="(123) 456-7890" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" name="message" rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder={`I'm interested in ${property.address}...`}></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-150 ease-in-out" onClick={(e) => e.preventDefault()}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
