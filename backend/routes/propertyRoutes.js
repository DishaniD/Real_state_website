const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Agent = require('../models/Agent'); // Needed for linking property to agent
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/properties
// @desc    Get all properties with filtering, searching, and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default to 10 properties per page
    const skip = (page - 1) * limit;

    // Build Query
    const query = {};
    if (req.query.city) {
      query.city = { $regex: req.query.city, $options: 'i' }; // Case-insensitive search
    }
    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType;
    }
    if (req.query.beds) { // e.g., beds=3 (exact) or beds[gte]=3 (greater or equal)
      if (req.query.beds.gte) query.beds = { $gte: parseInt(req.query.beds.gte) };
      else query.beds = parseInt(req.query.beds);
    }
    if (req.query.baths) {
      if (req.query.baths.gte) query.baths = { $gte: parseInt(req.query.baths.gte) };
      else query.baths = parseInt(req.query.baths);
    }
    if (req.query.minPrice) {
      query.price = { ...query.price, $gte: parseInt(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      query.price = { ...query.price, $lte: parseInt(req.query.maxPrice) };
    }
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Search functionality (address, description keywords)
    if (req.query.search) {
      query.$or = [
        { address: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { city: { $regex: req.query.search, $options: 'i' } },
        { zipCode: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const properties = await Property.find(query)
      .populate('agent', 'userId contactInfo agencyName') // Populate agent details
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    const totalProperties = await Property.countDocuments(query);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalProperties / limit),
      totalProperties,
      properties,
    });
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    res.status(500).json({ message: 'Server error while fetching properties.' });
  }
});

// @route   GET /api/properties/:id
// @desc    Get a single property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent', 'userId contactInfo agencyName profileImage');
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property by ID:', error.message);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Property not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while fetching property.' });
  }
});

// @route   POST /api/properties
// @desc    Create a new property
// @access  Private (Agent role)
router.post('/', protect, async (req, res) => {
  try {
    // Check if the authenticated user is an agent
    const agentProfile = await Agent.findOne({ userId: req.user.id });
    if (!agentProfile) {
      return res.status(403).json({ message: 'User is not an agent or agent profile not found. Property creation restricted.' });
    }

    const newPropertyData = { ...req.body, agent: agentProfile._id }; // Assign agent ID

    const property = new Property(newPropertyData);
    await property.save();

    // Add this property to the agent's listings
    agentProfile.listings.push(property._id);
    await agentProfile.save();

    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while creating property.' });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update a property
// @access  Private (Agent role, owner of property)
router.put('/:id', protect, async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Check if the authenticated user is an agent and owns this property
    const agentProfile = await Agent.findOne({ userId: req.user.id });
    if (!agentProfile || property.agent.toString() !== agentProfile._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to update this property.' });
    }

    // Add updatedAt timestamp manually or rely on schema option {timestamps: true}
    req.body.updatedAt = new Date();

    property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json(property);
  } catch (error) {
    console.error('Error updating property:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Property not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while updating property.' });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a property
// @access  Private (Agent role, owner of property)
router.delete('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    const agentProfile = await Agent.findOne({ userId: req.user.id });
    if (!agentProfile || property.agent.toString() !== agentProfile._id.toString()) {
      // Also consider admin role here in a real app
      return res.status(403).json({ message: 'User not authorized to delete this property.' });
    }

    await Property.findByIdAndDelete(req.params.id);

    // Remove property from agent's listings
    if (agentProfile) {
        agentProfile.listings.pull(property._id);
        await agentProfile.save();
    }

    res.status(200).json({ message: 'Property deleted successfully.' });
  } catch (error) {
    console.error('Error deleting property:', error.message);
     if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Property not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while deleting property.' });
  }
});

module.exports = router;
