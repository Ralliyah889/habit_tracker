import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { awardXP } from '../../services/gamificationService'

export default function AttentionGrid() {
    const navigate = useNavigate()

    // States: LANDING, PLAYING, WON
    const [gameState, setGameState] = useState('LANDING')
    const [grid, setGrid] = useState([])
    const [nextNum, setNextNum] = useState(1)

    // Timer
    const [elapsed, setElapsed] = useState(0)
    const [timerId, setTimerId] = useState(null)

    // Visual Feedback
    const [mistakeId, setMistakeId] = useState(null)

    const generateGrid = () => {
        const nums = Array.from({ length: 25 }, (_, i) => i + 1)
        for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        return nums
    }

    const startGame = () => {
        setGrid(generateGrid())
        setNextNum(1)
        setElapsed(0)
        setGameState('PLAYING')

        // Start Timer
        const id = setInterval(() => {
            setElapsed(prev => prev + 0.1)
        }, 100)
        setTimerId(id)
    }

    const handleClick = async (num) => {
        if (num === nextNum) {
            if (num === 25) {
                // WON
                clearInterval(timerId)
                setGameState('WON')
                await awardXP(30, 'Attention Grid Master')
            } else {
                setNextNum(prev => prev + 1)
            }
        } else {
            // Mistake
            setMistakeId(num)
            setTimeout(() => setMistakeId(null), 400)
        }
    }

    // Cleanup
    useEffect(() => {
        return () => clearInterval(timerId)
    }, [timerId])

    return (
        <div className="cognitive-layout">
            <div className="cognitive-top-bar">
                <button className="nav-back-btn" onClick={() => navigate('/games')}>
                    <span>←</span> Exit Training
                </button>
                <div className="session-info">Visual Attention • Grid Search</div>
                <div className="training-tags">
                    <span className="tag-item">Time: {elapsed.toFixed(1)}s</span>
                </div>
            </div>

            <div className="cognitive-main">

                {gameState === 'LANDING' && (
                    <div className="instruction-section">
                        <h1 className="training-title" style={{ fontSize: '3rem' }}>Attention Grid</h1>
                        <p className="training-subtitle">
                            Scan the grid and click numbers 1 to 25 in ascending order.<br />
                            Test your visual processing speed.
                        </p>
                        <button className="btn-cognitive-primary" onClick={startGame}>
                            Begin Assessment
                        </button>
                    </div>
                )}

                {gameState === 'PLAYING' && (
                    <div className="focus-zone">
                        <div style={{ marginBottom: '1rem', color: '#9ca3af' }}>
                            Target: <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{nextNum}</span>
                        </div>

                        <div className="cognitive-grid-container">
                            {grid.map((num) => (
                                <div
                                    key={num}
                                    className={`cognitive-grid-cell ${num < nextNum ? 'found' : ''} ${mistakeId === num ? 'mistake' : ''}`}
                                    onClick={() => handleClick(num)}
                                    // Disable clicks on found items
                                    style={num < nextNum ? { pointerEvents: 'none' } : {}}
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'WON' && (
                    <div className="feedback-container">
                        <div className="result-icon result-success">🏆</div>
                        <h2 className="result-title">Assessment Complete</h2>
                        <p className="result-subtitle">
                            You cleared the grid in <strong style={{ color: '#fff' }}>{elapsed.toFixed(2)} seconds</strong>.
                        </p>

                        <div className="action-zone">
                            <button className="btn-cognitive-primary" onClick={startGame}>
                                Run Again
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
