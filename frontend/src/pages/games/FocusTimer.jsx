import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { awardXP } from '../../services/gamificationService'

export default function FocusTimer() {
    const navigate = useNavigate()
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [cycle, setCycle] = useState(1)

    // Feedback
    const [sessionComplete, setSessionComplete] = useState(false)
    const timerRef = useRef(null)

    // Visibility (Focus Check)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isActive && !isPaused) {
                setIsPaused(true)
                // Could add a "Distraction detected" toast here
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [isActive, isPaused])

    useEffect(() => {
        if (isActive && !isPaused && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            handleComplete()
        }
        return () => clearInterval(timerRef.current)
    }, [isActive, isPaused, timeLeft])

    const handleComplete = async () => {
        clearInterval(timerRef.current)
        setIsActive(false)
        setSessionComplete(true)
        await awardXP(50, 'Deep Work Session')
    }

    const toggleTimer = () => {
        setIsActive(!isActive)
        setIsPaused(false)
    }

    const resetTimer = () => {
        setIsActive(false)
        setIsPaused(false)
        setTimeLeft(25 * 60)
        setSessionComplete(false)
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    return (
        <div className="cognitive-layout">
            <div className="cognitive-top-bar">
                <button className="nav-back-btn" onClick={() => navigate('/games')}>
                    <span>←</span> Exit
                </button>
                <div className="session-info">Productivity • Deep Work</div>
                <div className="training-tags">
                    <span className="tag-item">Session {cycle}</span>
                </div>
            </div>

            <div className="cognitive-main">

                {!sessionComplete ? (
                    <>
                        <h1 className="training-title">Focus Timer</h1>
                        <p className="training-subtitle">
                            25-minute Pomodoro session. Distraction detection enabled.<br />
                            Keep this tab open to maintain flow.
                        </p>

                        <div className="focus-zone">
                            <div className={`focus-timer-display ${isActive ? 'focus-timer-active' : ''}`}>
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="action-zone" style={{ flexDirection: 'row', gap: '1rem' }}>
                            <button
                                className="btn-cognitive-primary"
                                onClick={toggleTimer}
                                style={isActive ? { background: '#ef4444', color: 'white' } : {}}
                            >
                                {isActive ? (isPaused ? 'Resume' : 'Pause Session') : 'Start Focus'}
                            </button>

                            <button
                                className="nav-back-btn"
                                style={{ border: '1px solid #4b5563' }}
                                onClick={resetTimer}
                            >
                                Reset
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="feedback-container">
                        <div className="result-icon result-success">🎉</div>
                        <h2 className="result-title">Session Complete</h2>
                        <p className="result-subtitle">
                            +50 XP Awarded. Take a 5 minute break.
                        </p>

                        <div className="action-zone">
                            <button className="btn-cognitive-primary" onClick={() => {
                                setCycle(c => c + 1)
                                resetTimer()
                            }}>
                                Start Next Session
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
