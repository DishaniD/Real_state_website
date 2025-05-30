const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    // In a real app, you might throw an error or exit
    // For now, returning null or a default insecure token for development awareness
    // throw new Error('JWT_SECRET_NOT_DEFINED');
    return null; // Or handle this more gracefully depending on app requirements
  }
  if (!process.env.JWT_EXPIRES_IN) {
    console.warn('Warning: JWT_EXPIRES_IN is not defined. Defaulting to 1h.');
  }

  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Default expiration to 1 hour
  );
};

// Verification function can be added later
// const verifyToken = (token) => {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch (error) {
//     return null; // Or throw error
//   }
// };

module.exports = { generateToken };
