// API Service - Handles all backend communication
import axios from 'axios'

// Base URL for all API requests
// Base URL: Use environment variable in production, fallback to localhost in dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - automatically attach JWT token to all requests
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token')

        // If token exists, add it to Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If token is invalid or expired, clear it
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
        return Promise.reject(error)
    }
)

// ========== AUTH API CALLS ==========

// Register new user
export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
}

// Login user
export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
}

// ========== HABIT API CALLS (for future use) ==========

// Get all habits
export const getHabits = async () => {
    const response = await api.get('/habits')
    return response.data
}

// Create new habit
export const createHabit = async (habitData) => {
    const response = await api.post('/habits', habitData)
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

// ========== HABIT LOG API CALLS (for future use) ==========

// Create habit log
export const createLog = async (logData) => {
    const response = await api.post('/logs', logData)
    return response.data
}

// Get habit progress
export const getHabitProgress = async (habitId) => {
    const response = await api.get(`/logs/${habitId}`)
    return response.data
}

export default api
