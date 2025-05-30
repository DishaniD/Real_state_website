import React from 'react';

const SearchBar = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="flex flex-col">
          <label htmlFor="address" className="mb-1 text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="e.g., 123 Main St"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="city" className="mb-1 text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="e.g., San Francisco"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="zipcode" className="mb-1 text-sm font-medium text-gray-700">ZIP Code</label>
          <input
            type="text"
            id="zipcode"
            name="zipcode"
            placeholder="e.g., 94107"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="md:col-span-3 mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out w-full"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
