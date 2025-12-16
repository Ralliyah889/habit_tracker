// Habits Page - Real CRUD with Backend Integration
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import HabitModal from '../components/HabitModal'
import { getHabits, createHabit, updateHabit, deleteHabit } from '../services/habitService'
import './DarkDashboard.css'

function Habits() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const [habits, setHabits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingHabit, setEditingHabit] = useState(null)

    // Fetch habits on component mount
    useEffect(() => {
        fetchHabits()
    }, [])

    const fetchHabits = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await getHabits()
            setHabits(data.habits || data || [])
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch habits')
            if (err.response?.status === 401) {
                logout()
                navigate('/login')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleAddHabit = () => {
        setEditingHabit(null)
        setIsModalOpen(true)
    }

    const handleEditHabit = (habit) => {
        setEditingHabit(habit)
        setIsModalOpen(true)
    }

    const handleSaveHabit = async (habitData) => {
        if (editingHabit) {
            // Update existing habit
            await updateHabit(editingHabit._id, habitData)
        } else {
            // Create new habit
            await createHabit(habitData)
        }
        // Refresh habits list
        await fetchHabits()
    }

    const handleDeleteHabit = async (habitId) => {
        if (window.confirm('Are you sure you want to delete this habit?')) {
            try {
                await deleteHabit(habitId)
                // Refresh habits list
                await fetchHabits()
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete habit')
            }
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
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

    const calculateStreak = (habit) => {
        // Simple streak calculation - can be enhanced
        return habit.streak || habit.currentStreak || 0
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
                            <a href="/habits" className="nav-link active">Habits</a>
                            <a href="/progress" className="nav-link">Progress</a>
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
                    <div className="page-header-section">
                        <div>
                            <h1 className="page-title-dark">Your Habits</h1>
                            <p className="page-subtitle-dark">Manage and track all your habits in one place</p>
                        </div>
                        <button className="btn-add" onClick={handleAddHabit}>+ Add Habit</button>
                    </div>

                    {error && (
                        <div className="error-message" style={{ marginBottom: '1.5rem' }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="loading-state">
                            <p style={{ color: '#a3a3a3', textAlign: 'center', padding: '3rem' }}>
                                Loading habits...
                            </p>
                        </div>
                    ) : habits.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">+</div>
                            <h3 className="empty-title">No Habits Yet</h3>
                            <p className="empty-text">
                                Start building better habits by creating your first one!
                            </p>
                            <button className="btn-add" onClick={handleAddHabit}>
                                Create Your First Habit
                            </button>
                        </div>
                    ) : (
                        <div className="habits-grid-page">
                            {habits.map(habit => (
                                <div key={habit._id} className={`habit-card-page habit-${getColorClass(habit.category)}`}>
                                    <div className="habit-card-header">
                                        <h3 className="habit-card-title">{habit.name}</h3>
                                        <span className={`category-badge badge-${getColorClass(habit.category)}`}>
                                            {habit.category}
                                        </span>
                                    </div>
                                    <div className="habit-card-body">
                                        <div className="habit-detail-row">
                                            <span className="detail-label-dark">Frequency</span>
                                            <span className="detail-value-dark">{habit.frequency}</span>
                                        </div>
                                        <div className="habit-detail-row">
                                            <span className="detail-label-dark">Current Streak</span>
                                            <span className="detail-value-dark">{calculateStreak(habit)} days</span>
                                        </div>
                                        <div className="habit-detail-row">
                                            <span className="detail-label-dark">Started</span>
                                            <span className="detail-value-dark">
                                                {new Date(habit.startDate || habit.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="habit-card-actions">
                                        <button className="btn-edit-dark" onClick={() => handleEditHabit(habit)}>
                                            Edit
                                        </button>
                                        <button className="btn-delete-dark" onClick={() => handleDeleteHabit(habit._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Add/Edit Habit Modal */}
            <HabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveHabit}
                editHabit={editingHabit}
            />
        </div>
    )
}

export default Habits
