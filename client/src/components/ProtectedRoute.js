import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Helper function to decode JWT token (base64 decode only, no verification)
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    try {
      // Decode token to check expiration (without verification, just to check expiry)
      const decoded = decodeToken(token);
      
      if (!decoded) {
        setIsValid(false);
        return;
      }

      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        // Token expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsValid(false);
        return;
      }

      // Token is valid
      setIsValid(true);
    } catch (error) {
      console.error('Error validating token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsValid(false);
    }
  }, [token]);

  // Show nothing while checking
  if (isValid === null) {
    return null;
  }

  // Redirect to login if no token or token is invalid/expired
  if (!token || !isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;


