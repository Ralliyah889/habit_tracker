// Protected Route Component - Redirects to login if not authenticated
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontSize: '1.5rem',
                color: '#6366f1'
            }}>
                Loading...
            </div>
        )
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // If authenticated, render the protected component
    return children
}

export default ProtectedRoute
