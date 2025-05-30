const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true // Assuming one agent profile per user
  },
  title: { type: String, trim: true }, // e.g., "Real Estate Agent"
  bio: { type: String, trim: true },
  yearsOfExperience: { type: Number },
  specialties: [{ type: String }], // e.g., ["Luxury Homes", "First-time Buyers"]
  profileImage: { type: String }, // URL to profile image
  contactInfo: {
    officePhone: { type: String, trim: true },
    mobilePhone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true } // Can be different from user account email
  },
  agencyName: { type: String, trim: true },
  licenseNumber: { type: String, trim: true, unique: true, sparse: true }, // Unique if provided
  listings: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property' 
  }], // Properties managed by the agent
  // Timestamps are automatically managed by Mongoose with the { timestamps: true } option
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
