// This file defines all habit-related routes
const express = require('express');
const router = express.Router();
const {
    createHabit,
    getHabits,
    updateHabit,
    deleteHabit,
} = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

// All routes below require authentication (protect middleware)

// POST /api/habits - Create a new habit
// GET /api/habits - Get all habits for logged-in user
router.route('/').post(protect, createHabit).get(protect, getHabits);

// PUT /api/habits/:id - Update a habit
// DELETE /api/habits/:id - Delete a habit
router.route('/:id').put(protect, updateHabit).delete(protect, deleteHabit);

module.exports = router;
