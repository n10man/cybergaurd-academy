import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('[LOGIN] Form submission');

    // Input validation
    if (!formData.email || !formData.password) {
      const errorMsg = 'Email and password are required';
      console.warn(`[LOGIN] Validation failed: ${errorMsg}`);
      setError(errorMsg);
      return;
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      const errorMsg = 'Invalid email format';
      console.warn(`[LOGIN] Invalid email: ${formData.email}`);
      setError(errorMsg);
      return;
    }

    console.log(`[LOGIN] Validation passed for email: ${formData.email}`);
    setLoading(true);

    try {
      console.log('[LOGIN] Sending login request to server...');
      const response = await login(formData.email, formData.password);
      
      if (response.token) {
        console.log('[LOGIN] ✅ Login successful, redirecting to 2FA/Dashboard');
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        // Navigate to 2FA if needed, otherwise dashboard
        navigate('/dashboard');
      } else {
        const errorMsg = response.message || 'Login failed. Please try again.';
        console.error(`[LOGIN] No token received: ${errorMsg}`);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please try again.';
      console.error(`[LOGIN] ❌ Error: ${errorMsg}`);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <button onClick={() => navigate('/')} className="back-button" style={{marginTop: '15px', width: '100%', padding: '10px', backgroundColor: '#555', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
          Back to Main Menu
        </button>
      </div>
    </div>
  );
}

export default Login;


