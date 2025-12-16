// Gamification Routes
const express = require('express');
const router = express.Router();
const {
    awardXP,
    awardBadge,
    getGamificationStats,
    dailySpin,
    enableDailySpin
} = require('../controllers/gamificationController');
const { protect } = require('../middleware/auth');

// All routes require authentication

// GET /api/gamification/stats - Get user gamification stats
router.get('/stats', protect, getGamificationStats);

// POST /api/gamification/award-xp - Award XP to user
router.post('/award-xp', protect, awardXP);

// POST /api/gamification/award-badge - Award badge to user
router.post('/award-badge', protect, awardBadge);

// POST /api/gamification/spin - Daily reward spin
router.post('/spin', protect, dailySpin);

// POST /api/gamification/enable-spin - Enable daily spin
router.post('/enable-spin', protect, enableDailySpin);

module.exports = router;
