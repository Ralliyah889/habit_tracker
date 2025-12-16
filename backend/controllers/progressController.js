// Progress Controller - Weekly and Monthly Analytics
const HabitLog = require('../models/HabitLog');
const Habit = require('../models/Habit');

// Helper function to get start and end of current week (Monday-Sunday)
const getCurrentWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday

    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { start: monday, end: sunday };
};

// Helper function to get start and end of current month
const getCurrentMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return { start, end };
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

// @desc    Get weekly progress
// @route   GET /api/progress/weekly
// @access  Private
const getWeeklyProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { start, end } = getCurrentWeek();

        // Get user's habits
        const habits = await Habit.find({ userId });
        const totalHabits = habits.length;

        if (totalHabits === 0) {
            return res.json({
                weekStart: formatDate(start),
                weekEnd: formatDate(end),
                totalHabits: 0,
                daysActive: 0,
                totalCompletions: 0,
                completionPercentage: 0,
                dailyData: [],
                message: 'No habits created yet'
            });
        }

        // Get all logs for this week
        const startStr = formatDate(start);
        const endStr = formatDate(end);

        const logs = await HabitLog.find({
            user: userId,
            date: { $gte: startStr, $lte: endStr },
            completed: true
        });

        // Calculate daily completions
        const dailyData = [];
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(start);
            currentDay.setDate(start.getDate() + i);
            const dateStr = formatDate(currentDay);

            const completionsForDay = logs.filter(log => log.date === dateStr).length;

            dailyData.push({
                day: dayNames[i],
                date: dateStr,
                completions: completionsForDay,
                percentage: totalHabits > 0 ? Math.round((completionsForDay / totalHabits) * 100) : 0
            });
        }

        // Calculate summary stats
        const daysActive = dailyData.filter(day => day.completions > 0).length;
        const totalCompletions = logs.length;
        const maxPossibleCompletions = totalHabits * 7;
        const completionPercentage = maxPossibleCompletions > 0
            ? Math.round((totalCompletions / maxPossibleCompletions) * 100)
            : 0;

        res.json({
            weekStart: formatDate(start),
            weekEnd: formatDate(end),
            totalHabits,
            daysActive,
            totalCompletions,
            completionPercentage,
            dailyData,
            insights: {
                bestDay: dailyData.reduce((best, day) =>
                    day.completions > best.completions ? day : best, dailyData[0]
                ),
                consistency: daysActive >= 5 ? 'Excellent' : daysActive >= 3 ? 'Good' : 'Needs Improvement'
            }
        });
    } catch (error) {
        console.error('Error fetching weekly progress:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get monthly progress
// @route   GET /api/progress/monthly
// @access  Private
const getMonthlyProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { start, end } = getCurrentMonth();

        // Get user's habits
        const habits = await Habit.find({ userId });
        const totalHabits = habits.length;

        if (totalHabits === 0) {
            return res.json({
                monthStart: formatDate(start),
                monthEnd: formatDate(end),
                totalHabits: 0,
                daysActive: 0,
                totalCompletions: 0,
                completionPercentage: 0,
                dailyData: [],
                weeklyData: [],
                message: 'No habits created yet'
            });
        }

        // Get all logs for this month
        const startStr = formatDate(start);
        const endStr = formatDate(end);

        const logs = await HabitLog.find({
            user: userId,
            date: { $gte: startStr, $lte: endStr },
            completed: true
        });

        // Calculate daily completions for the entire month
        const dailyData = [];
        const daysInMonth = end.getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDay = new Date(start.getFullYear(), start.getMonth(), i);
            const dateStr = formatDate(currentDay);

            const completionsForDay = logs.filter(log => log.date === dateStr).length;

            dailyData.push({
                date: dateStr,
                day: i,
                completions: completionsForDay,
                percentage: totalHabits > 0 ? Math.round((completionsForDay / totalHabits) * 100) : 0
            });
        }

        // Calculate weekly breakdown
        const weeklyData = [];
        let weekNum = 1;

        for (let i = 0; i < daysInMonth; i += 7) {
            const weekDays = dailyData.slice(i, i + 7);
            const weekCompletions = weekDays.reduce((sum, day) => sum + day.completions, 0);
            const weekPercentage = weekDays.length > 0 && totalHabits > 0
                ? Math.round((weekCompletions / (totalHabits * weekDays.length)) * 100)
                : 0;

            weeklyData.push({
                week: weekNum++,
                completions: weekCompletions,
                percentage: weekPercentage,
                days: weekDays.length
            });
        }

        // Calculate summary stats
        const daysActive = dailyData.filter(day => day.completions > 0).length;
        const totalCompletions = logs.length;
        const maxPossibleCompletions = totalHabits * daysInMonth;
        const completionPercentage = maxPossibleCompletions > 0
            ? Math.round((totalCompletions / maxPossibleCompletions) * 100)
            : 0;

        // Find best week
        const bestWeek = weeklyData.reduce((best, week) =>
            week.percentage > best.percentage ? week : best, weeklyData[0]
        );

        res.json({
            monthStart: formatDate(start),
            monthEnd: formatDate(end),
            monthName: start.toLocaleString('default', { month: 'long' }),
            totalHabits,
            daysActive,
            totalCompletions,
            completionPercentage,
            dailyData,
            weeklyData,
            insights: {
                bestWeek: bestWeek ? `Week ${bestWeek.week}` : 'N/A',
                bestWeekPercentage: bestWeek ? bestWeek.percentage : 0,
                consistency: completionPercentage >= 80 ? 'Excellent' :
                    completionPercentage >= 60 ? 'Good' :
                        completionPercentage >= 40 ? 'Fair' : 'Needs Improvement'
            }
        });
    } catch (error) {
        console.error('Error fetching monthly progress:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get calendar data (habits and logs) for a specific month
// @route   GET /api/progress/calendar
// @access  Private
const getCalendarData = async (req, res) => {
    try {
        const userId = req.user._id;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1; // 1-12

        // Start and end of the requested month
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999);

        // Get user's habits
        const habits = await Habit.find({ userId });

        // Get logs for the requested month
        const startStr = formatDate(start);
        const endStr = formatDate(end);

        const logs = await HabitLog.find({
            user: userId,
            date: { $gte: startStr, $lte: endStr },
            completed: true
        });

        res.json({
            year,
            month,
            monthName: start.toLocaleString('default', { month: 'long' }),
            habits,
            logs
        });
    } catch (error) {
        console.error('Error fetching calendar data:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getWeeklyProgress,
    getMonthlyProgress,
    getCalendarData
};
