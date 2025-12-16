// Progress Service - Weekly and Monthly Analytics API calls
import api from './api'

// Get weekly progress data
export const getWeeklyProgress = async () => {
    const response = await api.get('/progress/weekly')
    return response.data
}

// Get monthly progress data
export const getMonthlyProgress = async () => {
    const response = await api.get('/progress/monthly')
    return response.data
}

// Get calendar data for a specific year and month
export const getCalendarData = async (year, month) => {
    const response = await api.get(`/progress/calendar?year=${year}&month=${month}`)
    return response.data
}
