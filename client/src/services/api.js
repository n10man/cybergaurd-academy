const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    if (error.message) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Auth API calls
export const login = async (email, password) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (username, email, password) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
};

export const verifyToken = async () => {
  return apiRequest('/auth/verify', {
    method: 'GET',
  });
};

export const verifyEmail = async (token) => {
  return apiRequest(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: 'GET',
  });
};

// Progress API calls
export const getUserProgress = async (userId) => {
  return apiRequest(`/progress/${userId}`, {
    method: 'GET',
  });
};

export const saveUserProgress = async (progressData) => {
  return apiRequest('/progress/save', {
    method: 'POST',
    body: JSON.stringify(progressData),
  });
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/health', {
    method: 'GET',
  });
};


