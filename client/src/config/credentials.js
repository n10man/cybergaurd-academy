// Credentials Configuration
// This is the single source of truth for all login credentials used in the training module
// 
// IMPORTANT: If you change credentials here, they will only take effect on:
// 1. First page load (if localStorage is empty)
// 2. After calling resetCredentials() from console
// 3. To force update, run in browser console: localStorage.removeItem('training_credentials'); location.reload();
//
// The sticky note and login system pull from localStorage, so they'll always show 
// whatever was last saved there.

export const TRAINING_CREDENTIALS = {
  email: 'employee@cybergaurd.my',
  password: 'K9$mP#xL2@nRvQ8wT5yJ',
  devEmail: 'david.tan@cybergaurd.my'
};

// Store credentials in localStorage so they can be updated dynamically
const STORAGE_KEY = 'training_credentials';

// Initialize localStorage with default credentials on first load IMMEDIATELY
if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(TRAINING_CREDENTIALS));
}

export const getCredentials = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored credentials:', e);
      return TRAINING_CREDENTIALS;
    }
  }
  return TRAINING_CREDENTIALS;
};

export const setCredentials = (newCredentials) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newCredentials));
  console.log('Credentials updated:', newCredentials);
};

export const resetCredentials = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(TRAINING_CREDENTIALS));
  console.log('Credentials reset to defaults');
};
