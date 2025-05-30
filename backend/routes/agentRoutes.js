const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const User = require('../models/User'); // For populating user details
const Property = require('../models/Property'); // For populating listings
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/agents
// @desc    Get all agents
// @access  Public
router.get('/', async (req, res) => {
  try {
    const agents = await Agent.find()
      .populate('userId', 'firstName lastName email phoneNumber profileImage') // Populate user details
      .populate('listings', 'address city price beds baths sqft images status'); // Populate basic property info
    res.status(200).json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error.message);
    res.status(500).json({ message: 'Server error while fetching agents.' });
  }
});

// @route   GET /api/agents/me
// @desc    Get current logged-in user's agent profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const agentProfile = await Agent.findOne({ userId: req.user.id })
      .populate('userId', 'firstName lastName email phoneNumber')
      .populate('listings', 'address city price beds baths sqft images status'); // Populate with relevant fields

    if (!agentProfile) {
      // It's not an error for a user to not have an agent profile.
      // Send 200 with null or a specific message, or 404 if preferred.
      // For consistency, let's send 404 if no profile, client can interpret.
      return res.status(404).json({ message: 'Agent profile not found for this user.' });
    }
    res.status(200).json(agentProfile);
  } catch (error) {
    console.error("Error fetching current user's agent profile:", error.message);
    res.status(500).json({ message: "Server error while fetching agent profile." });
  }
});

// @route   GET /api/agents/:id
// @desc    Get a single agent by their Agent model ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id)
      .populate('userId', 'firstName lastName email phoneNumber profileImage')
      .populate('listings'); // Can specify fields for listings if needed

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found.' });
    }
    res.status(200).json(agent);
  } catch (error) {
    console.error('Error fetching agent by ID:', error.message);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Agent not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while fetching agent.' });
  }
});

// @route   POST /api/agents
// @desc    Create or apply to be an agent (creates an agent profile)
// @access  Private (Authenticated users)
router.post('/', protect, async (req, res) => {
  try {
    const userId = req.user.id; // From protect middleware

    // Check if user already has an agent profile
    let agentProfile = await Agent.findOne({ userId });
    if (agentProfile) {
      return res.status(400).json({ message: 'User already has an agent profile.' });
    }

    // Create new agent profile
    const agentData = { ...req.body, userId };
    agentProfile = new Agent(agentData);
    await agentProfile.save();

    res.status(201).json(agentProfile);
  } catch (error) {
    console.error('Error creating agent profile:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while creating agent profile.' });
  }
});

// @route   PUT /api/agents/:id
// @desc    Update an agent's profile (Agent model ID)
// @access  Private (Owner of agent profile)
router.put('/:id', protect, async (req, res) => {
  try {
    const agentId = req.params.id;
    const currentUserId = req.user.id;

    let agentProfile = await Agent.findById(agentId);
    if (!agentProfile) {
      return res.status(404).json({ message: 'Agent profile not found.' });
    }

    // Check if the authenticated user is the owner of this agent profile
    if (agentProfile.userId.toString() !== currentUserId) {
      return res.status(403).json({ message: 'User not authorized to update this agent profile.' });
    }

    // Add updatedAt timestamp manually or rely on schema option {timestamps: true}
    req.body.updatedAt = new Date();

    agentProfile = await Agent.findByIdAndUpdate(agentId, req.body, { new: true, runValidators: true });

    res.status(200).json(agentProfile);
  } catch (error) {
    console.error('Error updating agent profile:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Agent not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while updating agent profile.' });
  }
});

// Note: Deleting an agent profile might involve more complex logic
// (e.g., what happens to their listings? Reassign or delete?).
// For now, a DELETE endpoint for agents is not implemented to keep it simpler.

module.exports = router;
