// Habit Service - API calls for CRUD operations
import api from './api'

// Create a new habit
export const createHabit = async (habitData) => {
    const response = await api.post('/habits', habitData)
    return response.data
}

// Get all habits for logged-in user
export const getHabits = async () => {
    const response = await api.get('/habits')
    return response.data
}

// Get single habit by ID
export const getHabitById = async (id) => {
    const response = await api.get(`/habits/${id}`)
    return response.data
}

// Update habit
export const updateHabit = async (id, habitData) => {
    const response = await api.put(`/habits/${id}`, habitData)
    return response.data
}

// Delete habit
export const deleteHabit = async (id) => {
    const response = await api.delete(`/habits/${id}`)
    return response.data
}

// Mark habit as completed for today (legacy - use logService instead)
export const markHabitComplete = async (id) => {
    const today = new Date().toISOString().split('T')[0]
    const response = await api.post('/logs', {
        habitId: id,
        date: today,
        completed: true
    })
    return response.data
}
