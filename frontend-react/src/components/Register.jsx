import React, { useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faUser, faEnvelope, faLock, faChartLine, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
    const [username, SetUsername] = useState('')
    const [email, SetEmail] = useState('')
    const [password, SetPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegistration = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})
        const userData = { username, email, password }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', userData)
            setSuccess(true)
            setTimeout(() => navigate('/login'), 2000)
        } catch (error) {
            setErrors(error.response?.data || {})
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            {/* Background blobs */}
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />

            <div className="auth-card">
                {/* Logo / Brand */}
                <div className="auth-brand">
                    <div className="auth-brand-icon">
                        <FontAwesomeIcon icon={faChartLine} />
                    </div>
                    <span className="auth-brand-name">StockForecast</span>
                </div>

                <h2 className="auth-title">Create an account</h2>
                <p className="auth-subtitle">Start predicting stocks in seconds</p>

                {success ? (
                    <div className="auth-success">
                        <FontAwesomeIcon icon={faCircleCheck} className="auth-success-icon" />
                        <p className="auth-success-text">Account created! Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleRegistration} className="auth-form">
                        {/* Username */}
                        <div className="auth-field">
                            <span className="auth-field-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                            <input
                                type="text"
                                className={`auth-input ${errors.username ? 'auth-input-error' : ''}`}
                                placeholder="Username"
                                value={username}
                                onChange={(e) => SetUsername(e.target.value)}
                                required
                            />
                        </div>
                        {errors.username && <small className="auth-field-error">{errors.username}</small>}

                        {/* Email */}
                        <div className="auth-field">
                            <span className="auth-field-icon">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                            <input
                                type="email"
                                className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => SetEmail(e.target.value)}
                                required
                            />
                        </div>
                        {errors.email && <small className="auth-field-error">{errors.email}</small>}

                        {/* Password */}
                        <div className="auth-field">
                            <span className="auth-field-icon">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            <input
                                type="password"
                                className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => SetPassword(e.target.value)}
                                required
                            />
                        </div>
                        {errors.password && <small className="auth-field-error">{errors.password}</small>}

                        {/* Submit */}
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                    &nbsp; Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>
                )}

                {/* Footer links */}
                <div className="auth-footer">
                    <span>Already have an account?</span>
                    <Link to="/login" className="auth-link">Sign in</Link>
                    <span className="auth-divider">·</span>
                    <Link to="/" className="auth-link">Home</Link>
                </div>
            </div>
        </div>
    )
}

export default Register
