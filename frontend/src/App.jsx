// Main App Component with Authentication and Routing
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { ThemeProvider } from './context/ThemeContext'

// Lazy Load Pages (Code Splitting)
const LandingPage = lazy(() => import('./pages/LandingPage'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const HabitDetails = lazy(() => import('./pages/HabitDetails'))
const Habits = lazy(() => import('./pages/Habits'))
const Progress = lazy(() => import('./pages/Progress'))
const Games = lazy(() => import('./pages/Games'))

// Game Components
const FocusTimer = lazy(() => import('./pages/games/FocusTimer'))
const MemoryFlash = lazy(() => import('./pages/games/MemoryFlash'))
const AttentionGrid = lazy(() => import('./pages/games/AttentionGrid'))
const Breathing = lazy(() => import('./pages/games/Breathing'))

// Loading Component
const PageLoader = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
    }}>
        Loading...
    </div>
)

function App() {
    return (
        // Wrap entire app with AuthProvider and ThemeProvider
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Routes - Require Authentication */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/habits"
                                element={
                                    <ProtectedRoute>
                                        <Habits />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/progress"
                                element={
                                    <ProtectedRoute>
                                        <Progress />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/games"
                                element={
                                    <ProtectedRoute>
                                        <Games />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/games/focus-timer" element={<ProtectedRoute><FocusTimer /></ProtectedRoute>} />
                            <Route path="/games/memory-flash" element={<ProtectedRoute><MemoryFlash /></ProtectedRoute>} />
                            <Route path="/games/attention-grid" element={<ProtectedRoute><AttentionGrid /></ProtectedRoute>} />
                            <Route path="/games/breathing" element={<ProtectedRoute><Breathing /></ProtectedRoute>} />
                            <Route
                                path="/habit/:id"
                                element={
                                    <ProtectedRoute>
                                        <HabitDetails />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Suspense>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default App
