// This file defines the User model (structure) for our database
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema (structure) for User
const userSchema = new mongoose.Schema(
    {
        // User's full name
        name: {
            type: String,
            required: [true, 'Please add a name'], // This field is mandatory
            trim: true, // Remove extra spaces
        },

        // User's email (must be unique)
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true, // No two users can have the same email
            lowercase: true, // Convert to lowercase
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },

        // User's password (will be hashed before saving)
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password by default in queries
        },

        // User role (either 'user' or 'admin')
        role: {
            type: String,
            enum: ['user', 'admin'], // Only these two values are allowed
            default: 'user', // Default role is 'user'
        },

        // Gamification data
        xp: {
            type: Number,
            default: 0,
        },

        level: {
            type: Number,
            default: 1,
        },

        badges: {
            type: [String], // Array of badge IDs
            default: [],
        },

        dailySpinAvailable: {
            type: Boolean,
            default: false,
        },

        lastSpinDate: {
            type: String, // YYYY-MM-DD
            default: null,
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// MIDDLEWARE: This runs before saving a user to the database
// It hashes the password for security
userSchema.pre('save', async function (next) {
    // Only hash the password if it's new or modified
    if (!this.isModified('password')) {
        next();
    }

    // Generate a salt (random string) and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// METHOD: Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
