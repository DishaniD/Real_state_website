const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust path as necessary
const { generateToken } = require('../utils/jwtUtils'); // Adjust path as necessary

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
    });

    await user.save();

    // Generate JWT
    const token = generateToken(user._id);
    if (!token) {
        // This case might happen if JWT_SECRET is not set, as per jwtUtils.js
        return res.status(500).json({ message: 'Could not generate token. Server configuration error.' });
    }

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: 'User registered successfully.'
    });

  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error during user registration.' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    // Generate JWT
    const token = generateToken(user._id);
    if (!token) {
        return res.status(500).json({ message: 'Could not generate token. Server configuration error.' });
    }

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: 'Logged in successfully.'
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
