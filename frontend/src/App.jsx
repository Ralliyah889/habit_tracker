// Main App Component with Authentication and Routing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import HabitDetails from './pages/HabitDetails'
import Habits from './pages/Habits'
import Progress from './pages/Progress'
import Games from './pages/Games'
import FocusTimer from './pages/games/FocusTimer'
import MemoryFlash from './pages/games/MemoryFlash'
import AttentionGrid from './pages/games/AttentionGrid'
import Breathing from './pages/games/Breathing'

import { ThemeProvider } from './context/ThemeContext'

function App() {
    return (
        // Wrap entire app with AuthProvider and ThemeProvider
        <AuthProvider>
            <ThemeProvider>
                <Router>
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
                </Router>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default App
