require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Route imports
const propertyRoutes = require('./routes/propertyRoutes');
const authRoutes = require('./routes/authRoutes');
const agentRoutes = require('./routes/agentRoutes'); // Import agent routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes); // Mount agent routes

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Backend API root is running. Use API-specific routes.' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined. Please set it in your .env file.');
  // process.exit(1); // Optionally exit if DB connection is critical
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected successfully to Atlas!');
    })
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
      // process.exit(1); // Optionally exit if DB connection is critical
    });
}

// Simple error logging
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // process.exit(1); // Important: For critical errors, you might want to exit
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
