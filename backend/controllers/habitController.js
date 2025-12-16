// This file contains all habit-related logic (CRUD operations)
const Habit = require('../models/Habit');

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private (requires authentication)
const createHabit = async (req, res) => {
    try {
        // Get data from request body
        const { name, category, frequency, startDate } = req.body;

        // Check if required fields are provided
        if (!name || !category || !frequency) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Create new habit linked to the logged-in user
        const habit = await Habit.create({
            userId: req.user._id, // Get user ID from the auth middleware
            name,
            category,
            frequency,
            startDate: startDate || Date.now(),
        });

        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all habits for logged-in user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
    try {
        // Find all habits belonging to the logged-in user
        const habits = await Habit.find({ userId: req.user._id }).sort({ createdAt: -1 });

        res.json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
    try {
        // Find the habit by ID
        const habit = await Habit.findById(req.params.id);

        // Check if habit exists
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Check if the habit belongs to the logged-in user
        if (habit.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this habit' });
        }

        // Update the habit with new data
        const updatedHabit = await Habit.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Return updated doc and run validations
        );

        res.json(updatedHabit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
    try {
        // Find the habit by ID
        const habit = await Habit.findById(req.params.id);

        // Check if habit exists
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Check if the habit belongs to the logged-in user
        if (habit.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this habit' });
        }

        // Delete the habit
        await Habit.findByIdAndDelete(req.params.id);

        res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createHabit,
    getHabits,
    updateHabit,
    deleteHabit,
};
