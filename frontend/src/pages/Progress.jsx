// Progress Page - Weekly, Monthly, and Calendar Analytics
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns'
import { useAuth } from '../context/AuthContext'
import { getWeeklyProgress, getMonthlyProgress, getCalendarData } from '../services/progressService'
import './DarkDashboard.css'

function Progress() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const [view, setView] = useState('weekly') // 'weekly', 'monthly', 'calendar'
    const [weeklyData, setWeeklyData] = useState(null)
    const [monthlyData, setMonthlyData] = useState(null)
    const [calendarData, setCalendarData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date())

    useEffect(() => {
        fetchProgressData()
    }, [view, currentDate])

    const fetchProgressData = async () => {
        try {
            setLoading(true)
            setError('')

            if (view === 'weekly') {
                const data = await getWeeklyProgress()
                setWeeklyData(data)
            } else if (view === 'monthly') {
                const data = await getMonthlyProgress()
                setMonthlyData(data)
            } else if (view === 'calendar') {
                const data = await getCalendarData(currentDate.getFullYear(), currentDate.getMonth() + 1)
                setCalendarData(data)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch progress data')
            if (err.response?.status === 401) {
                logout()
                navigate('/login')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const getDayStatus = (date, habits, logs) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        const dayOfWeek = format(date, 'EEE') // Mon, Tue...
        const isFuture = isAfter(startOfDay(date), startOfDay(new Date()))

        // Filter habits scheduled for this day
        const scheduledHabits = habits.filter(habit => {
            if (habit.frequency === 'Daily') return true
            if (habit.frequency === 'Weekly') return true // Assuming weekly means at least once? Or specific days?
            // For simple Weekly, let's assume it 'can' be done any day, but for tracking "Missed", it's tricky.
            // Let's rely on Custom Days if Custom.
            if (habit.frequency === 'custom' && habit.customDays) {
                return habit.customDays.includes(dayOfWeek)
            }
            return true
        })

        if (scheduledHabits.length === 0) return 'empty' // No habits for this day

        // Check completions
        const dayLogs = logs.filter(log => log.date === dateStr)
        const completedCount = dayLogs.length

        // Check if specific scheduled habits are done
        // This is a simplified check:
        // Completed: All scheduled habits done
        // Pending: Future/Today not all done
        // Missed: Past not all done

        if (completedCount >= scheduledHabits.length) return 'completed'
        if (isFuture) return 'pending'

        // If past and not all done
        return 'missed' // Partial or None
    }

    const renderCalendar = () => {
        if (!calendarData) return null

        const monthStart = startOfMonth(currentDate)
        const monthEnd = endOfMonth(currentDate)
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

        return (
            <div className="calendar-container">
                <div className="calendar-header-controls">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>←</button>
                    <h3>{format(currentDate, 'MMMM yyyy')}</h3>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>→</button>
                </div>
                <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="calendar-day-header">{day}</div>
                    ))}
                    {/* Add empty slots for days before start of month */}
                    {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="calendar-day empty"></div>
                    ))}
                    {days.map(day => {
                        const status = getDayStatus(day, calendarData.habits || [], calendarData.logs || [])
                        return (
                            <div key={day.toString()} className={`calendar-day ${status}`}>
                                <span className="day-number">{format(day, 'd')}</span>
                                <div className="day-status-indicator">
                                    {status === 'completed' && '✅'}
                                    {status === 'missed' && '❌'}
                                    {status === 'pending' && '⏳'}
                                    {status === 'empty' && '-'}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="calendar-legend">
                    <div className="legend-item"><span className="legend-icon">✅</span> Completed</div>
                    <div className="legend-item"><span className="legend-icon">❌</span> Missed</div>
                    <div className="legend-item"><span className="legend-icon">⏳</span> Pending</div>
                </div>
            </div>
        )
    }

    return (
        <div className="dark-app">
            <nav className="dark-nav">
                <div className="nav-wrapper">
                    <div className="nav-left">
                        <div className="brand">
                            <div className="brand-logo">
                                <div className="logo-gradient"></div>
                            </div>
                            <span className="brand-text">HabitFlow</span>
                        </div>
                        <div className="nav-links">
                            <a href="/dashboard" className="nav-link">Dashboard</a>
                            <a href="/habits" className="nav-link">Habits</a>
                            <a href="/progress" className="nav-link active">Progress</a>
                            <a href="/games" className="nav-link">Games</a>
                        </div>
                    </div>
                    <div className="nav-right">
                        <div className="user-badge">
                            <div className="user-avatar-dark">{user?.name?.charAt(0) || 'U'}</div>
                            <span className="user-name-dark">{user?.name}</span>
                        </div>
                        <button className="btn-logout-dark" onClick={handleLogout}>Sign out</button>
                    </div>
                </div>
            </nav>

            <main className="dark-main">
                <div className="dark-container">
                    {/* Header with Toggle */}
                    <div className="page-header-section">
                        <div>
                            <h1 className="page-title-dark">Your Progress</h1>
                            <p className="page-subtitle-dark">Track your habit consistency over time</p>
                        </div>
                        <div className="view-toggle">
                            <button
                                className={`toggle-btn ${view === 'weekly' ? 'active' : ''}`}
                                onClick={() => setView('weekly')}
                            >
                                Weekly
                            </button>
                            <button
                                className={`toggle-btn ${view === 'monthly' ? 'active' : ''}`}
                                onClick={() => setView('monthly')}
                            >
                                Monthly
                            </button>
                            <button
                                className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`}
                                onClick={() => setView('calendar')}
                            >
                                Calendar
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message" style={{ marginBottom: '1.5rem' }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="loading-state">
                            <p style={{ color: '#a3a3a3', textAlign: 'center', padding: '3rem' }}>
                                Loading progress data...
                            </p>
                        </div>
                    ) : (
                        <>
                            {view === 'calendar' ? renderCalendar() : (
                                <>
                                    {/* Existing Weekly/Monthly Views (Collapsed for brevity if needed or kept) */}
                                    {/* I will restore the original logic for Weekly/Monthly below */}

                                    {view === 'weekly' && weeklyData && (
                                        <>
                                            <div className="stats-grid">
                                                <div className="stat-card card-purple">
                                                    <div className="stat-icon"><span className="icon-chart">■</span></div>
                                                    <div className="stat-info">
                                                        <div className="stat-label">Completion Rate</div>
                                                        <div className="stat-value">{weeklyData.completionPercentage}%</div>
                                                        <div className="stat-detail">This week</div>
                                                    </div>
                                                </div>
                                                <div className="stat-card card-orange">
                                                    <div className="stat-icon"><span className="icon-star">★</span></div>
                                                    <div className="stat-info">
                                                        <div className="stat-label">Days Active</div>
                                                        <div className="stat-value">{weeklyData.daysActive}/7</div>
                                                        <div className="stat-detail">{weeklyData.insights?.consistency || 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="stat-card card-cyan">
                                                    <div className="stat-icon"><span className="icon-trend">▲</span></div>
                                                    <div className="stat-info">
                                                        <div className="stat-label">Total Completions</div>
                                                        <div className="stat-value">{weeklyData.totalCompletions}</div>
                                                        <div className="stat-detail">Habits completed</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="progress-panel">
                                                <div className="panel-header">
                                                    <h2 className="panel-title">Weekly Overview</h2>
                                                    <span className="panel-metric">{weeklyData.completionPercentage}% avg</span>
                                                </div>
                                                <div className="weekly-chart">
                                                    {weeklyData.dailyData?.map((day) => (
                                                        <div key={day.day} className="chart-bar">
                                                            <div className="bar-container">
                                                                <div className="bar-fill" style={{ height: `${day.percentage}%` }}></div>
                                                            </div>
                                                            <div className="bar-label">{day.day}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {view === 'monthly' && monthlyData && (
                                        <>
                                            <div className="stats-grid">
                                                <div className="stat-card card-purple">
                                                    <div className="stat-icon"><span className="icon-chart">■</span></div>
                                                    <div className="stat-info">
                                                        <div className="stat-label">Monthly Completion</div>
                                                        <div className="stat-value">{monthlyData.completionPercentage}%</div>
                                                        <div className="stat-detail">{monthlyData.monthName}</div>
                                                    </div>
                                                </div>
                                                <div className="stat-card card-orange">
                                                    <div className="stat-icon"><span className="icon-star">★</span></div>
                                                    <div className="stat-info">
                                                        <div className="stat-label">Best Week</div>
                                                        <div className="stat-value">{monthlyData.insights?.bestWeek || 'N/A'}</div>
                                                        <div className="stat-detail">{monthlyData.insights?.bestWeekPercentage || 0}% completion</div>
                                                    </div>
                                                </div>
                                                <div className="stat-card card-cyan">
                                                    <div className="stat-icon"><span className="icon-trend">▲</span></div>
                                                    <div className="stat-info">
                                                        <div className="stat-label">Days Active</div>
                                                        <div className="stat-value">{monthlyData.daysActive}</div>
                                                        <div className="stat-detail">{monthlyData.insights?.consistency || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="progress-panel">
                                                <div className="panel-header">
                                                    <h2 className="panel-title">Weekly Breakdown</h2>
                                                    <span className="panel-metric">{monthlyData.monthName}</span>
                                                </div>
                                                <div className="monthly-progress-list">
                                                    {monthlyData.weeklyData?.map((week) => (
                                                        <div key={week.week} className="monthly-progress-item">
                                                            <div className="progress-item-header">
                                                                <span className="progress-item-label">Week {week.week}</span>
                                                                <span className="progress-item-value">{week.percentage}%</span>
                                                            </div>
                                                            <div className="progress-bar-horizontal">
                                                                <div className="progress-fill-horizontal" style={{ width: `${week.percentage}%` }}></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Progress
