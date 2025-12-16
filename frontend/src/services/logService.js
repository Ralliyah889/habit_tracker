// Log Service - API calls for habit completion tracking
import api from './api'

// Mark habit as completed for today
export const markHabitCompleted = async (habitId) => {
    const today = new Date().toISOString().split('T')[0]
    const response = await api.post('/logs', {
        habitId,
        date: today,
        completed: true
    })
    return response.data
}

// Mark habit as completed for a specific date
export const markHabitCompletedForDate = async (habitId, date) => {
    const response = await api.post('/logs', {
        habitId,
        date,
        completed: true
    })
    return response.data
}

// Get habit logs and progress
export const getHabitLogs = async (habitId) => {
    const response = await api.get(`/logs/${habitId}`)
    return response.data
}

// Check if habit is completed today
export const checkTodayCompletion = async (habitId) => {
    const today = new Date().toISOString().split('T')[0]
    try {
        const logs = await getHabitLogs(habitId)
        const todayLog = logs.logs.find(log => log.date === today)
        return {
            completedToday: !!todayLog,
            log: todayLog || null
        }
    } catch (error) {
        return {
            completedToday: false,
            log: null
        }
    }
}
