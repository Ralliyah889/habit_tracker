// Notification Service - Browser Notifications for Habit Reminders

// Request notification permission from user
export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications')
        return false
    }

    if (Notification.permission === 'granted') {
        return true
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission()
        return permission === 'granted'
    }

    return false
}

// Check if notifications are supported and permitted
export const isNotificationSupported = () => {
    return 'Notification' in window && Notification.permission === 'granted'
}

// Show a notification
export const showNotification = (title, options = {}) => {
    if (!isNotificationSupported()) {
        console.log('Notifications not supported or not permitted')
        return
    }

    const defaultOptions = {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        requireInteraction: false,
        ...options
    }

    try {
        const notification = new Notification(title, defaultOptions)

        // Auto-close after 10 seconds
        setTimeout(() => {
            notification.close()
        }, 10000)

        return notification
    } catch (error) {
        console.error('Error showing notification:', error)
    }
}

// Show habit reminder notification
export const showHabitReminder = (habitName, category = '') => {
    const categoryEmoji = {
        'Health': '💪',
        'Learning': '📚',
        'Work': '💼',
        'Personal': '🎯',
        'Fitness': '🏃',
    }

    const emoji = categoryEmoji[category] || '✅'

    return showNotification(`Time to complete: ${habitName}`, {
        body: `Don't forget to complete your ${category || 'habit'} today!`,
        icon: '/favicon.ico',
        tag: `habit-${habitName}`, // Prevents duplicate notifications
    })
}

// Schedule notifications for habits
export const scheduleHabitNotifications = (habits) => {
    if (!isNotificationSupported()) {
        return
    }

    const now = new Date()
    const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()]

    habits.forEach(habit => {
        if (!habit.reminderEnabled || !habit.reminderTime) {
            return
        }

        // Check if reminder is for today
        if (habit.reminderDays && habit.reminderDays.length > 0) {
            if (!habit.reminderDays.includes(currentDay)) {
                return
            }
        }

        // Parse reminder time
        const [hours, minutes] = habit.reminderTime.split(':').map(Number)
        const reminderTime = new Date()
        reminderTime.setHours(hours, minutes, 0, 0)

        // Calculate time until reminder
        const timeUntilReminder = reminderTime.getTime() - now.getTime()

        // Only schedule if reminder is in the future today
        if (timeUntilReminder > 0 && timeUntilReminder < 24 * 60 * 60 * 1000) {
            setTimeout(() => {
                // Check if habit is already completed today before showing notification
                checkAndNotify(habit)
            }, timeUntilReminder)
        }
    })
}

// Check if habit is completed today, then notify
const checkAndNotify = async (habit) => {
    try {
        // You can add API call here to check if habit is completed today
        // For now, we'll just show the notification
        showHabitReminder(habit.name, habit.category)
    } catch (error) {
        console.error('Error checking habit completion:', error)
    }
}

// Initialize notifications on app load
export const initializeNotifications = async (habits) => {
    const hasPermission = await requestNotificationPermission()

    if (hasPermission) {
        scheduleHabitNotifications(habits)
    }
}
