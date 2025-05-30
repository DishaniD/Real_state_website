import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import axios from 'axios'; // Import axios

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch a limited number of properties, e.g., 4 newest "For Sale"
        // The backend API needs to support sorting by createdAt. Assuming 'createdAt_desc' for newest.
        // For now, let's assume the backend sorts by newest by default if no sort param is given.
        // Or, if the backend has a specific "featured" flag or sorting parameter, use that.
        // For this example, we'll fetch with a limit and assume default sort is okay for "featured".
        const response = await axios.get('http://localhost:5000/api/properties?limit=4&status=For Sale&sort=createdAt_desc');

        if (response.data && response.data.properties) {
          setProperties(response.data.properties);
        } else {
          setProperties([]); // Handle cases where 'properties' might be missing
        }
      } catch (err) {
        console.error("Failed to fetch featured properties:", err);
        setError(err.response?.data?.message || 'Could not load featured properties at this time.');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Featured Properties
        </h2>
        {loading && <p className="text-center text-lg">Loading featured properties...</p>}
        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

        {!loading && !error && properties.length === 0 && (
          <p className="text-center text-gray-600 text-xl py-5">No featured properties available at the moment.</p>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.map(property => (
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
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
