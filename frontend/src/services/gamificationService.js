// Gamification Service - API calls for games and rewards
import api from './api'

// Get user gamification stats
export const getGamificationStats = async () => {
    const response = await api.get('/gamification/stats')
    return response.data
}

// Award XP to user
export const awardXP = async (amount, reason) => {
    const response = await api.post('/gamification/award-xp', { amount, reason })
    return response.data
}

// Award badge to user
export const awardBadge = async (badgeId) => {
    const response = await api.post('/gamification/award-badge', { badgeId })
    return response.data
}

// Daily reward spin
export const dailySpin = async () => {
    const response = await api.post('/gamification/spin')
    return response.data
}

// Enable daily spin
export const enableDailySpin = async () => {
    const response = await api.post('/gamification/enable-spin')
    return response.data
}
