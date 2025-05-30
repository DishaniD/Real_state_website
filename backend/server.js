require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined. Please set it in your .env file.');
  // process.exit(1); // Optionally exit if DB connection is critical
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Successfully connected to MongoDB.');
    })
    .catch(err => {
      console.error('Error connecting to MongoDB:', err.message);
      // Depending on the app's requirements, you might want to exit here
      // or allow the app to run without a DB connection for some functionalities.
      // For now, we'll log the error and continue.
    });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
