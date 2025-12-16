// Dark Mode Dashboard - Fun, Motivating & Professional with Real Data
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import HabitModal from '../components/HabitModal'
import { getHabits, createHabit } from '../services/habitService'
import { markHabitCompleted } from '../services/logService'
import { getWeeklyProgress } from '../services/progressService'
import { initializeNotifications } from '../services/notificationService'
import './DarkDashboard.css'

function Dashboard() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const [habits, setHabits] = useState([])
    const [weeklyStats, setWeeklyStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Fetch data
    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const [habitsData, progressData] = await Promise.all([
                getHabits(),
                getWeeklyProgress()
            ])

            const fetchedHabits = habitsData.habits || habitsData || []

            // Add color based on category
            const habitsWithColor = fetchedHabits.map(habit => ({
                ...habit,
                color: getColorClass(habit.category)
            }))

            setHabits(habitsWithColor)
            setWeeklyStats(progressData)

            // Initialize notifications for habits with reminders
            initializeNotifications(habitsWithColor)
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err)
            if (err.response?.status === 401) {
                logout()
                navigate('/login')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSaveHabit = async (habitData) => {
        await createHabit(habitData)
        // Refresh data
        await fetchDashboardData()
    }

    const getColorClass = (category) => {
        const colorMap = {
            'Health': 'purple',
            'Learning': 'blue',
            'Work': 'orange',
            'Personal': 'pink',
            'Fitness': 'green',
        }
        return colorMap[category] || 'cyan'
    }

    // Filter habits for Today
    const todaysHabits = habits.filter(habit => {
        const todayDay = format(new Date(), 'EEE') // Mon, Tue, etc.

        if (habit.frequency === 'Daily') return true
        if (habit.frequency === 'Weekly') return true // Show weekly habits every day until completed? Or simplified default.
        if (habit.frequency === 'custom' && habit.customDays) {
            return habit.customDays.includes(todayDay)
        }
        return false
    })

    const totalHabits = todaysHabits.length
    const completedToday = todaysHabits.filter(h => h.completed).length
    const completionPercent = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0

    // Calculate current streak from habits (showing max streak from all habits for motivation)
    const currentStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak || 0), 0)
    const longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleToggleHabit = async (habitId, e) => {
        if (e) e.stopPropagation()
        try {
            // Mark habit as completed
            const result = await markHabitCompleted(habitId)

            if (result.alreadyCompleted) {
                alert('Habit already completed today!')
            } else {
                // Refresh data to get updated streaks and progress
                await fetchDashboardData()
            }
        } catch (err) {
            console.error('Failed to mark habit complete:', err)
            alert('Failed to mark habit as complete')
        }
    }

    return (
        <div className="dark-app">
            {/* Navbar */}
            <nav className="dark-nav">
                <div className="nav-wrapper">
                    <div className="nav-left">
                        <div className="brand">
                            <div className="brand-logo">
                                <div className="logo-gradient"></div>
                            </div>
                            <span className="brand-text">Habit Tracker</span>
                        </div>
                        <div className="nav-links">
                            <a href="/dashboard" className="nav-link active">Dashboard</a>
                            <a href="/habits" className="nav-link">Habits</a>
                            <a href="/progress" className="nav-link">Progress</a>
                            <a href="/games" className="nav-link">Games</a>
                        </div>
                    </div>
                    <div className="nav-right">
                        <button
                            onClick={toggleTheme}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                padding: '0.5rem',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-secondary)'
                            }}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <div className="user-badge">
                            <div className="user-avatar-dark">{user?.name?.charAt(0) || 'U'}</div>
                            <span className="user-name-dark">{user?.name}</span>
                        </div>
                        <button className="btn-logout-dark" onClick={handleLogout}>Sign out</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="dark-main">
                <div className="dark-container">

                    <div className="dashboard-header">
                        <div>
                            <h1 className="page-title-dark">Dashboard</h1>
                            <p className="page-subtitle-dark">Welcome back, {user?.name?.split(' ')[0] || 'User'}! Ready to crush your goals?</p>
                        </div>
                        {/* Top button removed as requested */}
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card card-purple">
                            <div className="stat-icon">
                                <span className="icon-check">✓</span>
                            </div>
                            <div className="stat-info">
                                <div className="stat-label">Today's Focus</div>
                                <div className="stat-value">{completedToday}/{totalHabits}</div>
                                <div className="stat-detail">{completionPercent}% done</div>
                            </div>
                        </div>

                        <div className="stat-card card-orange">
                            <div className="stat-icon">
                                <span className="icon-fire">▲</span>
                            </div>
                            <div className="stat-info">
                                <div className="stat-label">Top Streak</div>
                                <div className="stat-value">{currentStreak} <span style={{ fontSize: '0.5em' }}>days</span></div>
                                <div className="stat-detail">Best: {longestStreak}</div>
                            </div>
                        </div>

                        <div className="stat-card card-cyan" onClick={() => navigate('/games')} style={{ cursor: 'pointer' }}>
                            <div className="stat-icon">
                                <span className="icon-game">🎮</span>
                            </div>
                            <div className="stat-info">
                                <div className="stat-label">Games & Rewards</div>
                                <div className="stat-value">Play Now</div>
                                <div className="stat-detail">Earn XP & Badges →</div>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="main-grid">

                        {/* Today's Habits */}
                        <div className="habits-panel">
                            <div className="panel-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <h2 className="panel-title">Today's Habits</h2>
                                    <span className="panel-date">{format(new Date(), 'EEEE, MMMM do')}</span>
                                </div>
                                <button className="btn-add" onClick={() => setIsModalOpen(true)}>+ Add Habit</button>
                            </div>
                            <div className="habits-list">
                                {loading ? (
                                    <p style={{ color: '#a3a3a3', textAlign: 'center', padding: '2rem' }}>
                                        Loading habits...
                                    </p>
                                ) : todaysHabits.length === 0 ? (
                                    <div className="empty-state">
                                        <p>No habits scheduled for today.</p>
                                        <button className="btn-link" onClick={() => setIsModalOpen(true)}>+ Add New Habit</button>
                                    </div>
                                ) : (
                                    todaysHabits.map(habit => (
                                        <div
                                            key={habit._id}
                                            className={`habit-item habit-${habit.color} ${habit.completed ? 'completed' : ''}`}
                                            onClick={() => !habit.completed && handleToggleHabit(habit._id)}
                                            style={{ cursor: habit.completed ? 'default' : 'pointer' }}
                                        >
                                            <div className="habit-checkbox">
                                                <div className={`checkbox ${habit.completed ? 'checked' : ''}`}>
                                                    {habit.completed && <span className="check-mark">✓</span>}
                                                </div>
                                            </div>
                                            <div className="habit-content">
                                                <div className="habit-name">{habit.name}</div>
                                                <div className="habit-meta">
                                                    <span className="habit-category">{habit.category}</span>
                                                    {(habit.currentStreak || 0) >= 3 && (
                                                        <>
                                                            <span className="meta-dot">•</span>
                                                            <span className="habit-streak fire-text">🔥 {habit.currentStreak} day streak!</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {!habit.completed && (
                                                <button
                                                    className="btn-quick-done"
                                                    onClick={(e) => handleToggleHabit(habit._id, e)}
                                                >
                                                    Mark Done
                                                </button>
                                            )}
                                            {habit.completed && (
                                                <div className={`habit-badge badge-${habit.color}`}>
                                                    Done!
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Progress & Motivation */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Weekly Progress */}
                            <div className="progress-panel">
                                <div className="panel-header">
                                    <h2 className="panel-title">Weekly Progress</h2>
                                    <span className="panel-metric">Last 7 Days</span>
                                </div>
                                <div className="weekly-chart">
                                    {weeklyStats?.dailyData ? (
                                        weeklyStats.dailyData.map((day) => (
                                            <div key={day.day} className="chart-bar">
                                                <div className="bar-container">
                                                    <div
                                                        className="bar-fill"
                                                        style={{ height: `${day.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="bar-label">{day.day}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center', width: '100%', padding: '1rem' }}>No data yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Motivation Card */}
                            <div className="motivation-card">
                                <div className="motivation-gradient"></div>
                                <div className="motivation-content">
                                    <div className="motivation-icon">+</div>
                                    <h3 className="motivation-title">You're doing amazing!</h3>
                                    <p className="motivation-text">
                                        {completedToday} habits completed today. Every small step counts towards your goals.
                                    </p>
                                    <div className="motivation-stats">
                                        <div className="mini-stat">
                                            <div className="mini-value">{completionPercent}%</div>
                                            <div className="mini-label">Today</div>
                                        </div>
                                        <div className="mini-stat">
                                            <div className="mini-value">{currentStreak}d</div>
                                            <div className="mini-label">Streak</div>
                                        </div>
                                        <div className="mini-stat">
                                            <div className="mini-value">{totalHabits}</div>
                                            <div className="mini-label">To Do</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tips or Mini Calendar could go here */}
                        </div>

                    </div>
                </div>
            </main>

            {/* Habit Modal */}
            <HabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveHabit}
            />
        </div>
    )
}

export default Dashboard
