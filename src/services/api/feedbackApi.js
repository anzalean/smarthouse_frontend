import { api } from './apiClient.js';

/**
 * API service for user feedback operations
 */
export const feedbackApi = {
  /**
   * Submit user feedback
   * @param {Object} data - Feedback data
   * @param {string} data.category - Category of feedback
   * @param {string} data.message - Feedback message
   * @param {number} [data.rating] - Optional rating (1-5)
   * @returns {Promise<Object>} Response with success message
   */
  submitFeedback: async data => {
    const response = await api.post('/feedback', data);
    return response.data;
  },
};
