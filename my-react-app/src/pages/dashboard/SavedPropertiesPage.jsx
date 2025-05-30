import React from 'react';
import PropertyCard from '../../components/PropertyCard'; // Adjust path as necessary

const mockSavedProperties = [
  {
    _id: "savedProp1",
    address: "777 Urban Oasis, City Center",
    beds: 2,
    baths: 2,
    sqft: 1200,
    price: 450000,
    images: ["https://via.placeholder.com/400x250/E0E0E0/BDBDBD?text=Saved+Prop+1"],
    propertyType: "Condo",
    status: "For Sale"
  },
  {
    _id: "savedProp2",
    address: "888 Suburban Dream, Green Valley",
    beds: 4,
    baths: 3,
    sqft: 2200,
    price: 620000,
    images: ["https://via.placeholder.com/400x250/E0E0E0/BDBDBD?text=Saved+Prop+2"],
    propertyType: "House",
    status: "For Sale"
  },
  {
    _id: "savedProp3",
    address: "999 Cozy Corner, Old Town",
    beds: 3,
    baths: 1.5,
    sqft: 1500,
    price: 380000,
    images: ["https://via.placeholder.com/400x250/E0E0E0/BDBDBD?text=Saved+Prop+3"],
    propertyType: "Townhouse",
    status: "For Rent"
  },
];

const SavedPropertiesPage = () => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">My Saved Properties</h1>
      {mockSavedProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSavedProperties.map(property => (
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
        <p className="text-gray-600">You haven't saved any properties yet.</p>
      )}
    </div>
  );
};

export default SavedPropertiesPage;
