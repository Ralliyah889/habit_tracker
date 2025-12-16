// Gamification Controller - XP, Badges, and Rewards
const User = require('../models/User');

// XP required for each level
const XP_PER_LEVEL = 100;

// Calculate level from XP
const calculateLevel = (xp) => {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
};

// @desc    Award XP to user
// @route   POST /api/gamification/award-xp
// @access  Private
const awardXP = async (req, res) => {
    try {
        const { amount, reason } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add XP
        user.xp += amount;
        user.level = calculateLevel(user.xp);

        await user.save();

        res.json({
            message: `Earned ${amount} XP for ${reason}!`,
            xp: user.xp,
            level: user.level,
            xpToNextLevel: (user.level * XP_PER_LEVEL) - user.xp
        });
    } catch (error) {
        console.error('Error awarding XP:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Award badge to user
// @route   POST /api/gamification/award-badge
// @access  Private
const awardBadge = async (req, res) => {
    try {
        const { badgeId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user already has this badge
        if (user.badges.includes(badgeId)) {
            return res.json({ message: 'Badge already earned', badges: user.badges });
        }

        // Add badge
        user.badges.push(badgeId);
        await user.save();

        res.json({
            message: 'New badge earned!',
            badge: badgeId,
            badges: user.badges
        });
    } catch (error) {
        console.error('Error awarding badge:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user gamification stats
// @route   GET /api/gamification/stats
// @access  Private
const getGamificationStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            xp: user.xp,
            level: user.level,
            xpToNextLevel: (user.level * XP_PER_LEVEL) - user.xp,
            badges: user.badges,
            dailySpinAvailable: user.dailySpinAvailable,
            lastSpinDate: user.lastSpinDate
        });
    } catch (error) {
        console.error('Error fetching gamification stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Daily reward spin
// @route   POST /api/gamification/spin
// @access  Private
const dailySpin = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date().toISOString().split('T')[0];

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if spin is available
        if (!user.dailySpinAvailable) {
            return res.status(400).json({
                message: 'Daily spin not available. Complete all habits first!'
            });
        }

        // Check if already spun today
        if (user.lastSpinDate === today) {
            return res.status(400).json({ message: 'Already spun today!' });
        }

        // Random reward
        const rewards = [
            { type: 'xp', amount: 50, label: '50 XP' },
            { type: 'xp', amount: 100, label: '100 XP' },
            { type: 'xp', amount: 150, label: '150 XP' },
            { type: 'badge', id: 'lucky', label: 'Lucky Badge' },
            { type: 'streak_protection', label: 'Streak Protection' },
        ];

        const reward = rewards[Math.floor(Math.random() * rewards.length)];

        // Apply reward
        if (reward.type === 'xp') {
            user.xp += reward.amount;
            user.level = calculateLevel(user.xp);
        } else if (reward.type === 'badge' && !user.badges.includes(reward.id)) {
            user.badges.push(reward.id);
        }

        // Update spin status
        user.dailySpinAvailable = false;
        user.lastSpinDate = today;

        await user.save();

        res.json({
            message: 'Spin successful!',
            reward,
            xp: user.xp,
            level: user.level,
            badges: user.badges
        });
    } catch (error) {
        console.error('Error spinning:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Enable daily spin (when all habits completed)
// @route   POST /api/gamification/enable-spin
// @access  Private
const enableDailySpin = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.dailySpinAvailable = true;
        await user.save();

        res.json({ message: 'Daily spin unlocked!', dailySpinAvailable: true });
    } catch (error) {
        console.error('Error enabling spin:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    awardXP,
    awardBadge,
    getGamificationStats,
    dailySpin,
    enableDailySpin
};
