// This file defines the HabitLog model for tracking habit completion
const mongoose = require('mongoose');

// Define the schema (structure) for HabitLog
const habitLogSchema = new mongoose.Schema(
    {
        // Reference to the habit being tracked
        habitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Habit', // This links to the Habit model
            required: true,
        },

        // Reference to the user who owns this log
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // Date when the habit was completed (stored as string YYYY-MM-DD)
        date: {
            type: String,
            required: true,
        },

        // Whether the habit was completed on this date
        completed: {
            type: Boolean,
            default: true, // Default is true when creating a log
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Create a compound index to ensure one log per habit per day
// This prevents duplicate entries for the same habit on the same day
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

// Performance Index: Speeds up streak calculation which filters by habitId + completed and sorts by date
habitLogSchema.index({ habitId: 1, completed: 1, date: -1 });

// Create and export the HabitLog model
module.exports = mongoose.model('HabitLog', habitLogSchema);
