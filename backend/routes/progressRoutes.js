// Progress Routes - Weekly and Monthly Analytics
const express = require('express');
const router = express.Router();
const { getWeeklyProgress, getMonthlyProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

// All routes require authentication

// GET /api/progress/weekly - Get weekly progress
router.get('/weekly', protect, getWeeklyProgress);

// GET /api/progress/monthly - Get monthly progress
router.get('/monthly', protect, getMonthlyProgress);

// GET /api/progress/calendar - Get calendar data
router.get('/calendar', protect, require('../controllers/progressController').getCalendarData);

module.exports = router;
