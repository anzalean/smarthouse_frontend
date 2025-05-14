import { api } from './apiClient.js';

/**
 * API service for authentication operations
 */
export const authApi = {
  /**
   * Log in a user
   * @param {Object} data - Login credentials
   * @param {string} data.email - User's email
   * @param {string} data.password - User's password
   * @returns {Promise<Object>} User data with auth tokens
   */
  login: async data => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  /**
   * Verify the current user's authentication status
   * @returns {Promise<Object>} Current user data if authenticated
   */
  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  /**
   * Register a new user
   * @param {Object} data - Registration data
   * @param {string} data.email - User's email
   * @param {string} data.password - User's password
   * @param {string} data.firstName - User's first name
   * @param {string} data.lastName - User's last name
   * @returns {Promise<Object>} Newly created user data
   */
  register: async data => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Log out the current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    await api.post('/auth/logout');
  },

  /**
   * Request a password reset email
   * @param {string} email - Email of the account to reset
   * @returns {Promise<Object>} Response with success message
   */
  forgotPassword: async email => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset a user's password with a valid token
   * @param {string} token - Password reset token
   * @param {string} password - New password
   * @returns {Promise<Object>} Response with success message
   */
  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  /**
   * Get Google OAuth URL for redirect
   * @returns {Promise<Object>} Google OAuth URL
   */
  getGoogleAuthUrl: async () => {
    const response = await api.get('/auth/google/url');
    return response.data;
  },

  /**
   * Authenticate using Google access token and user info
   * @param {object} googleData - Object containing Google access token and user info
   * @returns {Promise<Object>} User data
   */
  googleLogin: async googleData => {
    const response = await api.post('/auth/google/login', googleData);
    return response.data;
  },
};
