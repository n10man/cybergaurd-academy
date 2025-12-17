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
