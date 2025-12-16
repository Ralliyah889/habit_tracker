// Landing Page - Dark Mode with Smooth Animations
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="landing-dark">
            {/* Navbar */}
            <nav className="landing-nav">
                <div className="landing-nav-content">
                    <div className="landing-brand">
                        <div className="landing-logo">
                            <div className="landing-logo-gradient"></div>
                        </div>
                        <span className="landing-brand-text">Habit Tracker</span>
                    </div>
                    <div className="landing-nav-actions">
                        <button className="btn-login" onClick={() => navigate('/login')}>
                            Login
                        </button>
                        <button className="btn-signup" onClick={() => navigate('/register')}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Build Better Habits,
                            <br />
                            <span className="hero-title-gradient">One Day at a Time</span>
                        </h1>
                        <p className="hero-description">
                            Track your daily habits, maintain streaks, and stay consistent.
                            Start your journey to a better you today.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn-primary-large" onClick={() => navigate('/register')}>
                                Get Started Free
                            </button>
                            <button className="btn-secondary-large" onClick={() => navigate('/login')}>
                                Sign In
                            </button>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="feature-cards">
                            <div className="feature-card card-1">
                                <div className="feature-icon"></div>
                                <h3 className="feature-title">Track Progress</h3>
                                <p className="feature-text">Monitor your daily habits</p>
                            </div>

                            <div className="feature-card card-2">
                                <div className="feature-icon"></div>
                                <h3 className="feature-title">Build Streaks</h3>
                                <p className="feature-text">Stay motivated every day</p>
                            </div>

                            <div className="feature-card card-3">
                                <div className="feature-icon"></div>
                                <h3 className="feature-title">See Growth</h3>
                                <p className="feature-text">Visualize your improvement</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-container">
                    <h2 className="section-title">Everything You Need to Succeed</h2>
                    <p className="section-subtitle">
                        Powerful features to help you build and maintain healthy habits
                    </p>

                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon-large purple-gradient"></div>
                            <h3 className="feature-item-title">Daily Tracking</h3>
                            <p className="feature-item-text">
                                Mark habits as complete and track your daily progress with ease
                            </p>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon-large orange-gradient"></div>
                            <h3 className="feature-item-title">Streak Counter</h3>
                            <p className="feature-item-text">
                                Build momentum with streak tracking and never break the chain
                            </p>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon-large cyan-gradient"></div>
                            <h3 className="feature-item-title">Progress Analytics</h3>
                            <p className="feature-item-text">
                                Visualize your consistency with beautiful charts and insights
                            </p>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon-large pink-gradient"></div>
                            <h3 className="feature-item-title">Smart Insights</h3>
                            <p className="feature-item-text">
                                Get personalized suggestions to improve your habit consistency
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Transform Your Life?</h2>
                        <p className="cta-text">
                            Join thousands of users building better habits every day
                        </p>
                        <button className="btn-cta" onClick={() => navigate('/register')}>
                            Start Your Journey Today
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <div className="footer-logo-gradient"></div>
                        </div>
                        <span className="footer-brand-text">Habit Tracker</span>
                    </div>
                    <p className="footer-text">
                        Build better habits, one day at a time
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
