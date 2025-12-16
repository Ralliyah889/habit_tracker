// Focus & Brain Training Hub
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGamificationStats } from '../services/gamificationService'
import './DarkDashboard.css'

export default function Games() {
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getGamificationStats()
                setStats(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchStats()
    }, [])

    const xpPercentage = stats ? ((stats.xp % 100) / 100) * 100 : 0

    return (
        <div className="dark-app">
            <nav className="dark-nav">
                <div className="nav-wrapper">
                    <div className="nav-left">
                        <div className="brand">
                            <span className="brand-text">HabitFlow</span>
                        </div>
                        <div className="nav-links">
                            <a href="/dashboard" className="nav-link">Dashboard</a>
                            <a href="/habits" className="nav-link">Habits</a>
                            <a href="/progress" className="nav-link">Progress</a>
                            <a href="/games" className="nav-link active">Games</a>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="dark-main">
                <div className="dark-container">

                    {/* Header */}
                    <div className="page-header-section">
                        <div>
                            <h1 className="page-title-dark">Focus & Brain Training</h1>
                            <p className="page-subtitle-dark">
                                Scientifically designed activities to improve focus, memory, and study performance.
                            </p>
                        </div>
                    </div>

                    {/* XP / Focus Level Bar */}
                    <div className="xp-progress-panel">
                        <div className="xp-progress-header">
                            <div>
                                <span className="focus-level-label">Focus Level {stats?.level || 1}</span>
                                <span className="focus-xp-text"> • {stats?.xp || 0} XP Earned</span>
                            </div>
                            <span className="xp-value">{stats?.xpToNextLevel || 100} XP to next level</span>
                        </div>
                        <div className="xp-progress-bar">
                            <div className="xp-progress-fill" style={{ width: `${xpPercentage}%` }}></div>
                        </div>
                    </div>

                    {/* Games Grid */}
                    <div className="games-grid">

                        {/* Game 1: Focus Timer */}
                        <div className="game-card" onClick={() => navigate('/games/focus-timer')}>
                            <div className="game-icon icon-focus">
                                <span>⏱️</span>
                            </div>
                            <h3 className="game-title">Deep Focus Timer</h3>
                            <p className="game-description">
                                Based on Pomodoro. Detects distractions and tracks deep work sessions.
                            </p>
                            <div className="game-tag-row">
                                <span className="game-tag">Focus</span>
                                <span className="game-tag">Productivity</span>
                            </div>
                        </div>

                        {/* Game 2: Memory Flash */}
                        <div className="game-card" onClick={() => navigate('/games/memory-flash')}>
                            <div className="game-icon icon-memory">
                                <span>🧠</span>
                            </div>
                            <h3 className="game-title">Memory Flash</h3>
                            <p className="game-description">
                                Memorize number sequences to train working memory and recall speed.
                            </p>
                            <div className="game-tag-row">
                                <span className="game-tag">Memory</span>
                                <span className="game-tag">Cognition</span>
                            </div>
                        </div>

                        {/* Game 3: Attention Grid */}
                        <div className="game-card" onClick={() => navigate('/games/attention-grid')}>
                            <div className="game-icon icon-attention">
                                <span>👀</span>
                            </div>
                            <h3 className="game-title">Attention Grid</h3>
                            <p className="game-description">
                                Find numbers 1-25 in order. Trains visual scanning and concentration.
                            </p>
                            <div className="game-tag-row">
                                <span className="game-tag">Attention</span>
                                <span className="game-tag">Speed</span>
                            </div>
                        </div>

                        {/* Game 4: Breathing */}
                        <div className="game-card" onClick={() => navigate('/games/breathing')}>
                            <div className="game-icon icon-calm">
                                <span>🧘</span>
                            </div>
                            <h3 className="game-title">Box Breathing</h3>
                            <p className="game-description">
                                Reduce anxiety and reset your mental state before studying.
                            </p>
                            <div className="game-tag-row">
                                <span className="game-tag">Calm</span>
                                <span className="game-tag">Anti-Anxiety</span>
                            </div>
                        </div>

                    </div>

                    <div className="game-disclaimer">
                        <p>These activities are not for entertainment. They are cognitive training tools designed to enhance your study capabilities.</p>
                    </div>

                </div>
            </main>
        </div>
    )
}
