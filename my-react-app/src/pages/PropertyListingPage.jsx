import React, { useState, useEffect, useCallback } from 'react';
import PropertyCard from '../components/PropertyCard';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

// Helper to build query string, excluding empty values
const buildQueryString = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

const PropertyListingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters: initial state from URL query params or defaults
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get('search') || '',
      beds: params.get('beds') || '', // e.g. '3' for 3 beds, '3+' for 3 or more
      baths: params.get('baths') || '',
      propertyType: params.get('propertyType') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      status: params.get('status') || '',
    };
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(location.search);
    return parseInt(params.get('page')) || 1;
  });
  const [totalPages, setTotalPages] = useState(0);
  const propertiesPerPage = 6;

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = {
        page: currentPage,
        limit: propertiesPerPage,
        search: filters.search,
        city: filters.city, // Assuming you add city to filters if needed
        propertyType: filters.propertyType,
        status: filters.status,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      };
      // Handle beds/baths 'X+' format for backend if it expects numerical gte
      if (filters.beds) {
        queryParams.beds = filters.beds.includes('+') ? { gte: parseInt(filters.beds) } : parseInt(filters.beds);
        // Backend needs to be able to parse beds[gte]=VALUE from query string if object is passed
        // For simplicity, if backend expects beds=3 or beds_gte=3:
        if (filters.beds.endsWith('+')) queryParams['beds[gte]'] = parseInt(filters.beds);
        else queryParams.beds = parseInt(filters.beds);
      }
      if (filters.baths) {
        if (filters.baths.endsWith('+')) queryParams['baths[gte]'] = parseInt(filters.baths);
        else queryParams.baths = parseInt(filters.baths);
      }


      const queryString = buildQueryString(queryParams);
      const response = await axios.get(`http://localhost:5000/api/properties?${queryString}`);

      setProperties(response.data.properties || []);
      setTotalPages(response.data.totalPages || 0);
      setCurrentPage(response.data.currentPage || 1);

      // Update URL with current filters and page
      navigate(`${location.pathname}?${queryString}`, { replace: true });

    } catch (err) {
      console.error("Error fetching properties:", err);
      setError(err.response?.data?.message || 'Failed to fetch properties. Please try again later.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, location.pathname, navigate]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]); // fetchProperties is memoized with useCallback

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
    // Fetch will be triggered by useEffect due to filters changing in fetchProperties dependencies
  };

  const handleSearchChange = (e) => {
     setFilters(prev => ({ ...prev, search: e.target.value }));
     setCurrentPage(1);
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Fetch will be triggered by useEffect due to currentPage changing
    }
  };

  const homeTypes = ['Any', 'House', 'Apartment', 'Condo', 'Townhouse', 'Land'];
  const bedOptions = ['Any', '1+', '2+', '3+', '4+', '5+'];
  const bathOptions = ['Any', '1+', '2+', '3+', '4+'];
  const statusOptions = ['Any', 'For Sale', 'For Rent'];


  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">Find Your Perfect Property</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          name="search"
          placeholder="Search by address, city, zip, or keywords..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="beds" className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
          <select id="beds" name="beds" value={filters.beds} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {bedOptions.map(option => <option key={option} value={option === 'Any' ? '' : option}>{option}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="baths" className="block text-sm font-medium text-gray-700 mb-1">Baths</label>
          <select id="baths" name="baths" value={filters.baths} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {bathOptions.map(option => <option key={option} value={option === 'Any' ? '' : option}>{option}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Home Type</label>
          <select id="propertyType" name="propertyType" value={filters.propertyType} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {homeTypes.map(type => <option key={type} value={type === 'Any' ? '' : type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select id="status" name="status" value={filters.status} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {statusOptions.map(option => <option key={option} value={option === 'Any' ? '' : option}>{option}</option>)}
          </select>
        </div>
        {/* Add Min/Max Price inputs if desired */}
      </div>

      {loading && <p className="text-center text-lg">Loading properties...</p>}
      {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {!loading && !error && properties.length === 0 && (
        <p className="text-center text-gray-600 text-xl py-10">No properties found matching your criteria.</p>
      )}

      {!loading && !error && properties.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
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

          {totalPages > 1 && (
            <nav className="flex justify-center items-center space-x-2">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                Prev
              </button>
              {[...Array(totalPages).keys()].map(number => (
                <button key={number + 1} onClick={() => paginate(number + 1)}
                  className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {number + 1}
                </button>
              ))}
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyListingPage;
