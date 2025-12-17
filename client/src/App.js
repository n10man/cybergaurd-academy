import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Setup2FA from './pages/Setup2FA';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Production deployment active

// Placeholder component for module pages
function ModulePage() {
  const { moduleType } = useParams();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Module: {moduleType}</h1>
      <p>This module is under development.</p>
    </div>
  );
}

function App() {
  React.useEffect(() => {
    // 🚀 DEVELOPMENT: Skip login and go directly to dashboard
    const isDevelopment = true; // Set to false to enable login
    if (isDevelopment && window.location.pathname === '/') {
      // Set mock user and token for testing
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', 'dev-token-12345');
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          username: 'DevUser',
          email: 'dev@test.com'
        }));
        localStorage.setItem('gameProgress', 'start');
      }
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/setup-2fa" element={<Setup2FA />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/module/:moduleType"
              element={
                <ProtectedRoute>
                  <ModulePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
