const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Optional: to fetch user details if needed

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's payload (userId)
      // You can choose to either just attach the userId or fetch the full user object
      // Attaching just userId is lighter. If you need user details frequently, fetch them.
      req.user = { id: decoded.userId };
      // Example if you want to attach the full user object (excluding password):
      // req.user = await User.findById(decoded.userId).select('-password');
      // if (!req.user) {
      //   return res.status(401).json({ message: 'Not authorized, user not found' });
      // }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
