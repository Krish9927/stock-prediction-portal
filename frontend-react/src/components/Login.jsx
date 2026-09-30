import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from './AuthProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faUser, faLock, faChartLine } from '@fortawesome/free-solid-svg-icons'

const Login = () => {
    const [username, SetUsername] = useState('')
    const [password, SetPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setErrors] = useState('')
    const navigate = useNavigate()
    const { isLoggedIN, setIsLoggedIn } = useContext(AuthContext)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrors('')
        const userData = { username, password }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', userData)
            localStorage.setItem('accessToken', response.data.access)
            localStorage.setItem('refreshToken', response.data.refresh)
            setIsLoggedIn(true)
            navigate('/')
        } catch (error) {
            setErrors('Invalid username or password. Please try again.')
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

                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Sign in to access your dashboard</p>

                <form onSubmit={handleLogin} className="auth-form">
                    {/* Username */}
                    <div className="auth-field">
                        <span className="auth-field-icon">
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                        <input
                            type="text"
                            className="auth-input"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => SetUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="auth-field">
                        <span className="auth-field-icon">
                            <FontAwesomeIcon icon={faLock} />
                        </span>
                        <input
                            type="password"
                            className="auth-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => SetPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin />
                                &nbsp; Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer links */}
                <div className="auth-footer">
                    <span>Don't have an account?</span>
                    <Link to="/register" className="auth-link">Create one</Link>
                    <span className="auth-divider">·</span>
                    <Link to="/" className="auth-link">Home</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
