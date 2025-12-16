// Add/Edit Habit Modal Component
import { useState, useEffect } from 'react'
import { requestNotificationPermission } from '../services/notificationService'
import './HabitModal.css'

function HabitModal({ isOpen, onClose, onSave, editHabit = null }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Health',
        frequency: 'Daily',
        startDate: new Date().toISOString().split('T')[0],
        reminderEnabled: false,
        reminderTime: '09:00',
        reminderDays: [],
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Populate form if editing
    useEffect(() => {
        if (editHabit) {
            setFormData({
                name: editHabit.name || '',
                category: editHabit.category || 'Health',
                frequency: editHabit.frequency || 'Daily',
                description: editHabit.description || '',
                customDays: editHabit.customDays || [],
                startDate: editHabit.startDate ? new Date(editHabit.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                reminderEnabled: editHabit.reminderEnabled || false,
                reminderTime: editHabit.reminderTime || '09:00',
                reminderDays: editHabit.reminderDays || [],
            })
        } else {
            setFormData({
                name: '',
                category: 'Health',
                frequency: 'Daily',
                description: '',
                customDays: [],
                startDate: new Date().toISOString().split('T')[0],
                reminderEnabled: false,
                reminderTime: '09:00',
                reminderDays: [],
            })
        }
    }, [editHabit, isOpen])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleDayToggle = (day) => {
        const days = formData.reminderDays.includes(day)
            ? formData.reminderDays.filter(d => d !== day)
            : [...formData.reminderDays, day]
        setFormData({ ...formData, reminderDays: days })
    }

    const handleReminderToggle = async (e) => {
        const enabled = e.target.checked

        if (enabled) {
            // Request notification permission
            const hasPermission = await requestNotificationPermission()
            if (!hasPermission) {
                alert('Please enable notifications in your browser settings to use reminders.')
                return
            }
        }

        setFormData({ ...formData, reminderEnabled: enabled })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await onSave(formData)
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save habit')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{editHabit ? 'Edit Habit' : 'Add New Habit'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Habit Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder="e.g., Morning Exercise"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description (Optional)</label>
                        <textarea
                            name="description"
                            className="form-input"
                            placeholder="Add details about your habit..."
                            value={formData.description}
                            onChange={handleChange}
                            disabled={loading}
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            name="category"
                            className="form-input"
                            value={formData.category}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="Health">Health</option>
                            <option value="Learning">Learning</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Fitness">Fitness</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Frequency</label>
                        <select
                            name="frequency"
                            className="form-input"
                            value={formData.frequency}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="custom">Custom Days</option>
                        </select>
                    </div>

                    {formData.frequency === 'custom' && (
                        <div className="form-group">
                            <label className="form-label">Select Days</label>
                            <div className="day-selector">
                                {weekDays.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        className={`day-btn ${formData.customDays?.includes(day) ? 'active' : ''}`}
                                        onClick={() => {
                                            const currentDays = formData.customDays || []
                                            const days = currentDays.includes(day)
                                                ? currentDays.filter(d => d !== day)
                                                : [...currentDays, day]
                                            setFormData({ ...formData, customDays: days })
                                        }}
                                        disabled={loading}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            className="form-input"
                            value={formData.startDate}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    {/* Reminder Settings */}
                    <div className="form-group">
                        <label className="form-checkbox-label">
                            <input
                                type="checkbox"
                                name="reminderEnabled"
                                checked={formData.reminderEnabled}
                                onChange={handleReminderToggle}
                                disabled={loading}
                            />
                            <span>Enable Reminders</span>
                        </label>
                    </div>

                    {formData.reminderEnabled && (
                        <>
                            <div className="form-group">
                                <label className="form-label">Reminder Time</label>
                                <input
                                    type="time"
                                    name="reminderTime"
                                    className="form-input"
                                    value={formData.reminderTime}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Reminder Days</label>
                                <div className="day-selector">
                                    {weekDays.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            className={`day-btn ${formData.reminderDays.includes(day) ? 'active' : ''}`}
                                            onClick={() => handleDayToggle(day)}
                                            disabled={loading}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                                <small className="form-hint">Leave empty for daily reminders</small>
                            </div>
                        </>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Saving...' : editHabit ? 'Update Habit' : 'Create Habit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default HabitModal
