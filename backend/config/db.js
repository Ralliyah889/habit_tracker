// This file handles the connection to MongoDB database
const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Log success message with host name
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and exit the process
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

// Export the function so we can use it in server.js
module.exports = connectDB;
