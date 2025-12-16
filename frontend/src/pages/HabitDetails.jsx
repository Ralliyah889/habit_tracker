// Habit Details Page - Complete Progress History
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './HabitDetails.css'

function HabitDetails() {
    const navigate = useNavigate()
    const { id } = useParams()

    // Mock habit data (in real app, fetch from API)
    const habit = {
        id: 1,
        name: 'Morning Exercise',
        category: 'Health',
        frequency: 'Daily',
        startDate: '2024-11-01',
        currentStreak: 7,
        longestStreak: 15,
        completionRate: 82,
    }

    // Mock calendar data for December 2024
    const [currentMonth, setCurrentMonth] = useState(11) // December (0-indexed)
    const [currentYear, setCurrentYear] = useState(2024)

    // Generate calendar days
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay()
    }

    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

    // Mock completion data (day number -> completed)
    const completionData = {
        1: true, 2: true, 3: false, 4: true, 5: true,
        6: true, 7: true, 8: false, 9: true, 10: true,
        11: true, 12: true, 13: true, 14: false, 15: true,
        16: true, 17: true, 18: true, 19: true, 20: false,
        21: true, 22: true, 23: true, 24: true, 25: true,
        26: false, 27: true, 28: true, 29: true, 30: true,
    }

    // Mock history data
    const history = [
        { date: '2024-12-14', status: 'Completed', time: '7:30 AM' },
        { date: '2024-12-13', status: 'Completed', time: '7:15 AM' },
        { date: '2024-12-12', status: 'Completed', time: '7:45 AM' },
        { date: '2024-12-11', status: 'Completed', time: '7:20 AM' },
        { date: '2024-12-10', status: 'Completed', time: '7:00 AM' },
        { date: '2024-12-09', status: 'Completed', time: '7:30 AM' },
        { date: '2024-12-08', status: 'Completed', time: '7:10 AM' },
        { date: '2024-12-07', status: 'Missed', time: null },
        { date: '2024-12-06', status: 'Completed', time: '7:25 AM' },
        { date: '2024-12-05', status: 'Completed', time: '7:40 AM' },
    ]

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11)
            setCurrentYear(currentYear - 1)
        } else {
            setCurrentMonth(currentMonth - 1)
        }
    }

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0)
            setCurrentYear(currentYear + 1)
        } else {
            setCurrentMonth(currentMonth + 1)
        }
    }

    const handleBack = () => {
        navigate('/dashboard')
    }

    const today = new Date().getDate()

    return (
        <div className="habit-details">
            {/* Navbar */}
            <nav className="navbar">
                <div className="container">
                    <div className="nav-content">
                        <div className="logo">
                            <div className="logo-mark"></div>
                            <span className="logo-text">HabitFlow</span>
                        </div>
                        <button className="btn-back" onClick={handleBack}>
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="details-content">
                <div className="container">

                    {/* 1. HABIT HEADER SECTION */}
                    <section className="section header-section">
                        <div className="header-main">
                            <div className="header-info">
                                <h1 className="habit-title">{habit.name}</h1>
                                <div className="habit-badges">
                                    <span className="badge category">{habit.category}</span>
                                    <span className="badge frequency">{habit.frequency}</span>
                                </div>
                                <p className="start-date">Started on {new Date(habit.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="header-stats">
                                <div className="stat-item">
                                    <div className="stat-label">Current Streak</div>
                                    <div className="stat-value">{habit.currentStreak} days</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-label">Longest Streak</div>
                                    <div className="stat-value">{habit.longestStreak} days</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. CALENDAR VIEW */}
                    <section className="section calendar-section">
                        <div className="section-header">
                            <h2 className="section-title">Calendar View</h2>
                            <div className="month-controls">
                                <button className="month-btn" onClick={handlePreviousMonth}>
                                    ← Previous
                                </button>
                                <span className="month-label">
                                    {monthNames[currentMonth]} {currentYear}
                                </span>
                                <button className="month-btn" onClick={handleNextMonth}>
                                    Next →
                                </button>
                            </div>
                        </div>

                        <div className="calendar">
                            <div className="calendar-header">
                                <div className="day-name">Sun</div>
                                <div className="day-name">Mon</div>
                                <div className="day-name">Tue</div>
                                <div className="day-name">Wed</div>
                                <div className="day-name">Thu</div>
                                <div className="day-name">Fri</div>
                                <div className="day-name">Sat</div>
                            </div>
                            <div className="calendar-grid">
                                {/* Empty cells for days before month starts */}
                                {[...Array(firstDay)].map((_, index) => (
                                    <div key={`empty-${index}`} className="calendar-day empty"></div>
                                ))}

                                {/* Actual days */}
                                {[...Array(daysInMonth)].map((_, index) => {
                                    const day = index + 1
                                    const isCompleted = completionData[day]
                                    const isToday = day === today && currentMonth === 11 && currentYear === 2024

                                    return (
                                        <div
                                            key={day}
                                            className={`calendar-day ${isCompleted ? 'completed' : 'missed'} ${isToday ? 'today' : ''}`}
                                        >
                                            <span className="day-number">{day}</span>
                                            <span className="day-status">
                                                {isCompleted ? '✓' : '•'}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Two Column Layout */}
                    <div className="two-column">
                        {/* Left Column */}
                        <div className="left-column">
                            {/* 3. HISTORY / LOG LIST */}
                            <section className="section history-section">
                                <h2 className="section-title">History</h2>
                                <div className="history-list">
                                    {history.map((entry, index) => (
                                        <div key={index} className={`history-item ${entry.status.toLowerCase()}`}>
                                            <div className="history-date">
                                                {new Date(entry.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                            <div className="history-status">
                                                <span className={`status-badge ${entry.status.toLowerCase()}`}>
                                                    {entry.status}
                                                </span>
                                                {entry.time && (
                                                    <span className="history-time">{entry.time}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="right-column">
                            {/* 4. INSIGHTS SECTION */}
                            <section className="section insights-section">
                                <h2 className="section-title">Insights</h2>
                                <div className="insights-content">
                                    <div className="insight-stat">
                                        <div className="insight-label">Completion Rate</div>
                                        <div className="insight-value">{habit.completionRate}%</div>
                                        <div className="insight-bar">
                                            <div
                                                className="insight-bar-fill"
                                                style={{ width: `${habit.completionRate}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="insight-stat">
                                        <div className="insight-label">Best Performing Week</div>
                                        <div className="insight-value">Week of Dec 1-7</div>
                                        <div className="insight-detail">7 of 7 days completed</div>
                                    </div>

                                    <div className="insight-message">
                                        <p>You're most consistent on weekdays. Consider setting reminders for weekends to maintain your streak.</p>
                                    </div>
                                </div>
                            </section>

                            {/* 5. ACTIONS SECTION */}
                            <section className="section actions-section">
                                <h2 className="section-title">Actions</h2>
                                <div className="actions-grid">
                                    <button className="action-btn primary">
                                        Mark Today as Completed
                                    </button>
                                    <button className="action-btn secondary">
                                        Edit Habit
                                    </button>
                                    <button className="action-btn danger">
                                        Delete Habit
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default HabitDetails
