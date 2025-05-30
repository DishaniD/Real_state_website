import React from 'react';
import PropertyCard from './PropertyCard';

const mockProperties = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-b3dc39778542?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    address: '123 Sunshine Avenue, Miami, FL',
    beds: 4,
    baths: 3,
    size: 2200,
    price: 750000,
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    address: '456 Mountain View, Denver, CO',
    beds: 3,
    baths: 2.5,
    size: 1800,
    price: 550000,
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    address: '789 Lakefront Drive, Chicago, IL',
    beds: 5,
    baths: 4,
    size: 3100,
    price: 980000,
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    address: '101 Urban Loft, New York, NY',
    beds: 2,
    baths: 2,
    size: 1200,
    price: 1200000,
  }
];

const FeaturedProperties = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Featured Properties
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mockProperties.map(property => (
            <PropertyCard
              key={property.id}
              imageUrl={property.imageUrl}
              address={property.address}
              beds={property.beds}
              baths={property.baths}
              size={property.size}
              price={property.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
