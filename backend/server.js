// This is the main entry point of our application
// It sets up the Express server and connects to MongoDB

// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoutes');
const logRoutes = require('./routes/logRoutes');
const progressRoutes = require('./routes/progressRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

// Create Express application
const app = express();

// MIDDLEWARE
// Enable CORS (Cross-Origin Resource Sharing) for frontend access
app.use(cors());

// Parse JSON request bodies (so we can read req.body)
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ROUTES
// Test route to check if server is running
app.get('/', (req, res) => {
    res.json({ message: '✅ Habit Tracker API is running!' });
});

// Authentication routes (register, login)
app.use('/api/auth', authRoutes);

// Habit routes (CRUD operations)
app.use('/api/habits', habitRoutes);

// Habit log routes (mark completed, get progress)
app.use('/api/logs', logRoutes);

// Progress routes (weekly, monthly analytics)
app.use('/api/progress', progressRoutes);

// Gamification routes (XP, badges, daily spin)
app.use('/api/gamification', gamificationRoutes);

// ERROR HANDLING MIDDLEWARE
// This should be the last middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
});

