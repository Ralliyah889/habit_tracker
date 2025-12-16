import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { awardXP } from '../../services/gamificationService'

export default function Breathing() {
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState(false)
    const [phase, setPhase] = useState('Ready') // Ready, Inhale, Hold, Exhale
    const [instruction, setInstruction] = useState('Press Start')
    const [cycles, setCycles] = useState(0)

    useEffect(() => {
        let isRunning = isActive;

        const runCycle = async () => {
            if (!isRunning) return

            // INHALE (4s)
            setPhase('Inhale')
            setInstruction('Breathe In')
            await new Promise(r => setTimeout(r, 4000))
            if (!isActive) return

            // HOLD (4s)
            setPhase('Hold')
            setInstruction('Hold Breath')
            await new Promise(r => setTimeout(r, 4000))
            if (!isActive) return

            // EXHALE (6s)
            setPhase('Exhale')
            setInstruction('Slow Exhale')
            await new Promise(r => setTimeout(r, 6000))
            if (!isActive) return

            setCycles(c => c + 1)
            // Recursion if still active
            if (isActive) runCycle()
        }

        if (isActive) {
            runCycle()
        } else {
            setPhase('Ready')
            setInstruction('Press Start')
        }

        // Cleanup function to set flag
        return () => { isRunning = false }
    }, [isActive])

    const toggleSession = async () => {
        if (isActive) {
            setIsActive(false)
            if (cycles > 1) {
                await awardXP(20, 'Breathing Session')
            }
        } else {
            setIsActive(true)
            setCycles(0)
        }
    }

    // Determine animation class
    const getAnimClass = () => {
        if (!isActive) return ''
        if (phase === 'Inhale') return 'breathe-inhale'
        if (phase === 'Hold') return 'breathe-hold'
        if (phase === 'Exhale') return 'breathe-exhale'
        return ''
    }

    return (
        <div className="cognitive-layout">
            <div className="cognitive-top-bar">
                <button className="nav-back-btn" onClick={() => navigate('/games')}>
                    <span>←</span> Exit
                </button>
                <div className="session-info">Stress Reduction • Box Breathing</div>
                <div className="training-tags">
                    <span className="tag-item">Cycles: {cycles}</span>
                </div>
            </div>

            <div className="cognitive-main">

                <h1 className="training-title" style={{ marginBottom: '4rem' }}>Resonance Breathing</h1>

                <div className="focus-zone">
                    <div className="breathing-wrapper">
                        {/* Static track */}
                        <div className="breathing-track"></div>

                        {/* Animated Circle */}
                        <div className={`cognitive-breathing-circle ${getAnimClass()}`}>
                            {isActive ? '' : 'Start'}
                        </div>

                        {/* Instruction Label */}
                        <div className="instruction-label" style={{
                            opacity: isActive ? 1 : 0.5,
                            transform: isActive ? 'translateY(20px)' : 'translateY(0)',
                            transition: 'all 0.5s'
                        }}>
                            {instruction}
                        </div>
                    </div>
                </div>

                <div className="action-zone">
                    <button className="btn-cognitive-primary" onClick={toggleSession}>
                        {isActive ? 'End Session' : 'Begin Exercise'}
                    </button>
                    {!isActive && (
                        <p className="secondary-hint" style={{ marginTop: '1rem', maxWidth: '400px' }}>
                            Follow the animation. Inhale for 4s, Hold for 4s, Exhale for 6s.<br />
                            Proven to lower cortisol and improve focus.
                        </p>
                    )}
                </div>

            </div>
        </div>
    )
}
