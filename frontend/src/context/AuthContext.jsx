// Authentication Context - Manages global auth state
import { createContext, useState, useContext, useEffect } from 'react'
import { loginUser, registerUser } from '../services/api'

// Create Auth Context
export const AuthContext = createContext(null)

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    // State to track if user is logged in
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check if user is already logged in on app load
    useEffect(() => {
        const checkAuth = () => {
            try {
                // Get token and user from localStorage
                const token = localStorage.getItem('token')
                const savedUser = localStorage.getItem('user')

                // If both exist, user is logged in
                if (token && savedUser) {
                    setUser(JSON.parse(savedUser))
                }
            } catch (error) {
                console.error('Error checking auth:', error)
                // Clear invalid data
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    // Login function
    const login = async (email, password) => {
        try {
            // Call backend login API
            const data = await loginUser({ email, password })

            // Save token and user data to localStorage
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
            }))

            // Update state
            setUser({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
            })

            return { success: true }
        } catch (error) {
            console.error('Login error:', error)

            // Return error message
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please try again.',
            }
        }
    }

    // Register function
    const register = async (name, email, password) => {
        try {
            // Call backend register API
            const data = await registerUser({ name, email, password })

            // Save token and user data to localStorage
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
            }))

            // Update state
            setUser({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
            })

            return { success: true }
        } catch (error) {
            console.error('Register error:', error)

            // Return error message
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed. Please try again.',
            }
        }
    }

    // Logout function
    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        // Clear state
        setUser(null)
    }

    // Context value
    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
