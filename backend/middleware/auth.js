// This middleware protects routes by verifying JWT tokens
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (only logged-in users can access)
const protect = async (req, res, next) => {
    let token;

    // Check if the request has an Authorization header with a Bearer token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract the token from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by ID from the token and attach to request
            // We exclude the password field using .select('-password')
            req.user = await User.findById(decoded.id).select('-password');

            // Continue to the next middleware or route handler
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token was found
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check if user is an admin
const admin = (req, res, next) => {
    // Check if user exists and has admin role
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, continue
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

module.exports = { protect, admin };
