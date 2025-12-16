import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { awardXP } from '../../services/gamificationService'

export default function MemoryFlash() {
    const navigate = useNavigate()

    // Game States: LANDING, SHOW, INPUT, RESULT
    const [gameState, setGameState] = useState('LANDING')

    // Data
    const [level, setLevel] = useState(1)
    const [sequence, setSequence] = useState('')
    const [userInput, setUserInput] = useState('')
    const [score, setScore] = useState(0)

    // Timer
    const [showTime, setShowTime] = useState(5)

    // Feedback
    const [lastResult, setLastResult] = useState(null) // { success: boolean, correctSeq: string }

    const generateSequence = (lvl) => {
        // Professional curve: Start 4 digits, add 1 every 2 levels?
        // Let's do: 3 + level.
        const length = 3 + lvl
        let seq = ''
        for (let i = 0; i < length; i++) {
            seq += Math.floor(Math.random() * 10)
        }
        return seq
    }

    const startLevel = () => {
        const newSeq = generateSequence(level)
        setSequence(newSeq)
        setUserInput('')
        setShowTime(3 + Math.floor(level * 0.5)) // Dynamic time
        setGameState('SHOW')
    }

    // Sequence Timer
    useEffect(() => {
        if (gameState === 'SHOW') {
            if (showTime > 0) {
                const timer = setInterval(() => setShowTime(prev => prev - 0.1), 100)
                return () => clearInterval(timer)
            } else {
                setGameState('INPUT')
            }
        }
    }, [gameState, showTime])

    const handleSubmit = async () => {
        if (!userInput) return

        const isCorrect = userInput === sequence
        const xpEarned = isCorrect ? 10 * level : 0

        if (isCorrect) {
            await awardXP(xpEarned, `Memory Flash Level ${level}`)
            setScore(s => s + xpEarned)
        }

        setLastResult({
            success: isCorrect,
            correctSeq: sequence
        })
        setGameState('RESULT')
    }

    const handleNext = () => {
        if (lastResult.success) {
            setLevel(l => l + 1)
        } else {
            // Retry same level or reset? "Cognitive Training" usually lets you retry.
            // Let's keep level same if failed.
        }
        startLevel()
    }

    // Helper to format sequence for display (1 2 3 4)
    const formatSeq = (s) => s.split('').join(' ')

    return (
        <div className="cognitive-layout">
            {/* 1. TOP BAR */}
            <div className="cognitive-top-bar">
                <button className="nav-back-btn" onClick={() => navigate('/games')}>
                    <span>←</span> Exit Training
                </button>
                <div className="session-info">
                    Session 1 • Focus Training
                </div>
                <div className="training-tags">
                    {/* Progress dots could go here, using simple text for now */}
                    <span className="tag-item">Level {level}</span>
                </div>
            </div>

            {/* 2. MAIN CONTENT */}
            <div className="cognitive-main">

                {gameState === 'LANDING' && (
                    <div className="instruction-section">
                        <h1 className="training-title" style={{ fontSize: '3.5rem' }}>Memory Flash</h1>
                        <p className="training-subtitle">
                            Prepare to memorize the number sequence. It will appear briefly.
                            <br />Focus on accuracy, not just speed.
                        </p>

                        <div className="training-tags" style={{ marginBottom: '3rem' }}>
                            <span className="tag-item">Difficulty: Adaptive</span>
                            <span className="tag-divider">•</span>
                            <span className="tag-item">XP Earned: {score}</span>
                        </div>

                        <button className="btn-cognitive-primary" onClick={startLevel}>
                            Start Session
                        </button>
                    </div>
                )}

                {gameState === 'SHOW' && (
                    <div className="focus-zone">
                        <div className="sequence-display">
                            {formatSeq(sequence)}
                        </div>
                        <div className="countdown-bar">
                            <div
                                className="countdown-fill"
                                style={{
                                    width: `${(showTime / (3 + Math.floor(level * 0.5))) * 100}%`
                                }}
                            />
                        </div>
                        <p className="secondary-hint" style={{ marginTop: '1rem' }}>Memorize...</p>
                    </div>
                )}

                {gameState === 'INPUT' && (
                    <div className="focus-zone">
                        <p className="recall-prompt">Enter the sequence you remember</p>
                        <input
                            type="number"
                            className="cognitive-input"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            autoFocus
                            placeholder=""
                        />
                        <div className="action-zone">
                            <button className="btn-cognitive-primary" onClick={handleSubmit}>
                                Submit Answer
                            </button>
                            <p className="secondary-hint">Pess Enter to submit</p>
                        </div>
                    </div>
                )}

                {gameState === 'RESULT' && (
                    <div className="feedback-container">
                        <div className={`result-icon ${lastResult.success ? 'result-success' : 'result-error'}`}>
                            {lastResult.success ? '✓' : '×'}
                        </div>

                        <h2 className="result-title">
                            {lastResult.success ? 'Excellent Recall' : 'Sequence Missed'}
                        </h2>

                        <p className="result-subtitle">
                            {lastResult.success
                                ? `You have successfully memorized ${sequence.length} digits.`
                                : `The correct sequence was ${lastResult.correctSeq}. Focus on the order.`
                            }
                        </p>

                        <div className="action-zone" style={{ marginTop: '2rem' }}>
                            <button className="btn-cognitive-primary" onClick={handleNext}>
                                {lastResult.success ? 'Next Level →' : 'Try Again ↻'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
