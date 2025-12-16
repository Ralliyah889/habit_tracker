// This file defines the Habit model (structure) for our database
const mongoose = require('mongoose');

// Define the schema (structure) for Habit
const habitSchema = new mongoose.Schema(
    {
        // Reference to the user who owns this habit
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // This links to the User model
            required: true,
            index: true, // Optimize queries by user
        },

        // Name of the habit (e.g., "Morning Exercise")
        name: {
            type: String,
            required: [true, 'Please add a habit name'],
            trim: true,
        },

        // Category of the habit
        category: {
            type: String,
            enum: ['Health', 'Learning', 'Work', 'Personal', 'Fitness'], // Updated to match Frontend
            required: [true, 'Please select a category'],
        },

        // Description of the habit (optional)
        description: {
            type: String,
            trim: true,
            default: '',
        },

        // How often the habit should be done
        frequency: {
            type: String,
            enum: ['Daily', 'Weekly', 'custom'], // Updated to match Frontend ('custom' is lowercase there)
            required: [true, 'Please select a frequency'],
            default: 'Daily',
        },

        // Custom days for frequency (e.g., ['Mon', 'Wed', 'Fri'])
        customDays: {
            type: [String],
            default: [],
        },

        // When the habit tracking starts
        startDate: {
            type: Date,
            default: Date.now, // Default to current date
        },

        // Current streak count (consecutive days)
        currentStreak: {
            type: Number,
            default: 0,
        },

        // Longest streak ever achieved
        longestStreak: {
            type: Number,
            default: 0,
        },

        // Reminder settings
        reminderEnabled: {
            type: Boolean,
            default: false,
        },

        reminderTime: {
            type: String, // Format: "HH:MM" (24-hour)
            default: null,
        },

        reminderDays: {
            type: [String], // Array of days: ['Mon', 'Tue', 'Wed', etc.]
            default: [],
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Create and export the Habit model
module.exports = mongoose.model('Habit', habitSchema);
