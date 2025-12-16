// Complete log controller with improved streak calculation
const HabitLog = require('../models/HabitLog');
const Habit = require('../models/Habit');

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

// Helper function to calculate streaks
const calculateStreaks = async (habitId) => {
    try {
        // Get all completed logs for this habit, sorted by date descending
        const logs = await HabitLog.find({
            habitId,
            completed: true
        }).sort({ date: -1 });

        if (logs.length === 0) {
            return { currentStreak: 0, longestStreak: 0 };
        }

        // Calculate current streak (consecutive days from today backward)
        let currentStreak = 0;
        const today = getTodayDate();
        let checkDate = new Date(today);

        for (let i = 0; i < logs.length; i++) {
            const logDate = logs[i].date;
            const expectedDate = checkDate.toISOString().split('T')[0];

            if (logDate === expectedDate) {
                currentStreak++;
                // Move to previous day
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                // Streak broken
                break;
            }
        }

        // Calculate longest streak in history
        let longestStreak = 0;
        let tempStreak = 0;
        let prevDate = null;

        // Sort logs by date ascending for longest streak calculation
        const sortedLogs = [...logs].reverse();

        for (let log of sortedLogs) {
            if (!prevDate) {
                tempStreak = 1;
            } else {
                const prev = new Date(prevDate);
                const curr = new Date(log.date);
                const diffDays = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    // Consecutive day
                    tempStreak++;
                } else {
                    // Streak broken, save if it's the longest
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            }
            prevDate = log.date;
        }

        // Check final streak
        longestStreak = Math.max(longestStreak, tempStreak);

        return { currentStreak, longestStreak };
    } catch (error) {
        console.error('Error calculating streaks:', error);
        return { currentStreak: 0, longestStreak: 0 };
    }
};

// @desc    Mark habit as completed
// @route   POST /api/logs
// @access  Private
const createLog = async (req, res) => {
    try {
        const { habitId, date, completed } = req.body;
        const userId = req.user._id;

        if (!habitId || !date) {
            return res.status(400).json({ message: 'Please provide habitId and date' });
        }

        // Verify habit exists and belongs to user
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        if (habit.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to log this habit' });
        }

        // Use YYYY-MM-DD format
        const completionDate = date.split('T')[0];

        // Check if log already exists
        let log = await HabitLog.findOne({ habitId, date: completionDate });

        if (log) {
            return res.status(200).json({
                message: 'Habit already marked as completed for this date',
                log,
                alreadyCompleted: true
            });
        }

        // Create new log
        log = await HabitLog.create({
            habitId,
            user: userId,
            date: completionDate,
            completed: completed !== undefined ? completed : true
        });

        // Calculate and update streaks
        const streaks = await calculateStreaks(habitId);
        await Habit.findByIdAndUpdate(habitId, {
            currentStreak: streaks.currentStreak,
            longestStreak: streaks.longestStreak
        });

        res.status(201).json({
            message: 'Habit marked as completed',
            log,
            streaks,
            alreadyCompleted: false
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get habit progress and streak
// @route   GET /api/logs/:habitId
// @access  Private
const getHabitProgress = async (req, res) => {
    try {
        const { habitId } = req.params;
        const userId = req.user._id;

        // Verify habit belongs to user
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        if (habit.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this habit' });
        }

        // Get all logs
        const logs = await HabitLog.find({ habitId }).sort({ date: -1 });

        // Calculate streaks
        const streaks = await calculateStreaks(habitId);

        // Update habit with latest streaks
        await Habit.findByIdAndUpdate(habitId, {
            currentStreak: streaks.currentStreak,
            longestStreak: streaks.longestStreak
        });

        res.json({
            habitId,
            habitName: habit.name,
            frequency: habit.frequency,
            currentStreak: streaks.currentStreak,
            longestStreak: streaks.longestStreak,
            totalCompleted: logs.filter(log => log.completed).length,
            logs,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createLog,
    getHabitProgress,
    calculateStreaks
};
