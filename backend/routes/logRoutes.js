// This file defines all habit log routes
const express = require('express');
const router = express.Router();
const { createLog, getHabitProgress } = require('../controllers/logController');
const { protect } = require('../middleware/auth');

// All routes below require authentication

// POST /api/logs - Mark a habit as completed for a date
router.post('/', protect, createLog);

// GET /api/logs/:habitId - Get progress and streak for a habit
router.get('/:habitId', protect, getHabitProgress);

module.exports = router;
