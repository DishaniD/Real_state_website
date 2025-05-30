const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }, // Will be hashed before saving
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phoneNumber: { type: String, trim: true },
  savedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  // Timestamps are automatically managed by Mongoose with the { timestamps: true } option
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const User = mongoose.model('User', userSchema);

module.exports = User;
