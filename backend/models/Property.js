const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  zipCode: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
  sqft: { type: Number, required: true },
  propertyType: { 
    type: String, 
    enum: ['House', 'Apartment', 'Condo', 'Townhouse', 'Land'], 
    required: true 
  },
  description: { type: String, trim: true },
  images: [{ type: String }], // Array of image URLs
  agent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Agent' 
  },
  status: { 
    type: String, 
    enum: ['For Sale', 'For Rent', 'Sold', 'Pending'], 
    default: 'For Sale' 
  },
  features: [{ type: String }], // e.g., ["Garage", "Heating", "Cooling", "Pool"]
  yearBuilt: { type: Number },
  // Timestamps are automatically managed by Mongoose with the { timestamps: true } option
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
