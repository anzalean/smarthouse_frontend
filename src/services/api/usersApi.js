import { api } from './apiClient.js';

/**
 * API service for user operations
 */
export const usersApi = {
  /**
   * Get a paginated list of users
   * @param {Object} params - Request parameters
   * @param {number} [params.page=1] - Page number for pagination
   * @param {number} [params.limit=10] - Number of users per page
   * @param {string} [params.search] - Search query to filter users
   * @returns {Promise<Object>} Paginated users data
   */
  getAll: async params => {
    const response = await api.get('/user', {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
      },
    });
    return response.data;
  },

  /**
   * Get the current authenticated user's profile
   * @returns {Promise<Object>} Current user data
   */
  getCurrentUser: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },

  /**
   * Get a user by ID
   * @param {string} id - User ID to fetch
   * @returns {Promise<Object>} User data
   */
  getById: async id => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },

  /**
   * Update a user's profile
   * @param {string} id - User ID to update
   * @param {Object} data - User data to update
   * @returns {Promise<Object>} Updated user data
   */
  update: async (id, data) => {
    const response = await api.put(`/user/${id}`, data);
    return response.data;
  },

  /**
   * Change a user's password
   * @param {string} id - User ID
   * @param {Object} data - Password change data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @param {string} data.confirmPassword - Confirm new password
   * @returns {Promise<Object>} Response with success message
   */
  changePassword: async (id, data) => {
    const response = await api.post(`/user/${id}/change-password`, data);
    return response.data;
  },

  /**
   * Delete a user account
   * @param {string} id - User ID to delete
   * @returns {Promise<Object>} Response with success message
   */
  delete: async id => {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  },

  /**
   * Admin-only: Get all users in the system
   * @returns {Promise<Array>} Array of user objects
   */
  getAllUsers: async () => {
    const response = await api.get('/user/admin/users');
    return response.data;
  },

  /**
   * Admin-only: Update a user's status
   * @param {string} id - User ID to update
   * @param {string} status - New status ('active' or 'blocked')
   * @returns {Promise<Object>} Response with updated user data
   */
  updateUserStatus: async (id, status) => {
    const response = await api.put(`/user/admin/users/${id}/status`, {
      status,
    });
    return response.data;
  },
};
