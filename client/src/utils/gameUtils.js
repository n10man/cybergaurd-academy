import { getUserProgress, saveUserProgress } from '../services/api';

/**
 * Load user progress from API
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} User progress data
 */
export const loadProgress = async (userId) => {
  try {
    const response = await getUserProgress(userId);
    return response;
  } catch (error) {
    console.error('Error loading progress:', error);
    throw error;
  }
};

/**
 * Save user progress to API
 * @param {string} userId - The user's ID
 * @param {Object} progressData - Progress data to save
 * @returns {Promise<Object>} Saved progress data
 */
export const saveProgress = async (userId, progressData) => {
  try {
    const response = await saveUserProgress({ userId, ...progressData });
    return response;
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
};

/**
 * Handle module interaction - transition from map to learning module
 * @param {string} moduleType - Type of module (e.g., 'phishing', 'malware', 'social-engineering')
 */
export const handleModuleInteraction = (moduleType) => {
  console.log(`Transitioning to module: ${moduleType}`);
  // Navigate to module route
  window.location.href = `/module/${moduleType}`;
};

/**
 * Return to map after module completion
 * @param {string} completedModule - The completed module type
 * @param {Object} earnedBadge - Badge information if earned
 */
export const returnToMap = (completedModule, earnedBadge = null) => {
  console.log(`Returning to map after completing: ${completedModule}`);
  if (earnedBadge) {
    console.log('Badge earned:', earnedBadge);
  }
  // Navigate back to dashboard/map
  window.location.href = '/dashboard';
};

