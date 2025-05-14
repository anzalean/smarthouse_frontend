import { api } from './apiClient.js';

/**
 * API service for role operations
 */
export const rolesApi = {
  /**
   * Get all roles
   * @returns {Promise<Array>} - Array of roles
   */
  getAllRoles: async () => {
    const response = await api.get('/role');
    return response.data;
  },

  /**
   * Get a role by ID
   * @param {string} id - The role ID
   * @returns {Promise<Object>} - The role object
   */
  getRoleById: async id => {
    const response = await api.get(`/role/${id}`);
    return response.data;
  },

  /**
   * Get all user permissions for a specific home
   * @param {string} homeId - The home ID
   * @returns {Promise<Array>} - Array of home access objects with user and role data
   */
  getHomePermissions: async homeId => {
    const response = await api.get(`/role/home/${homeId}/permissions`);
    return response.data;
  },

  /**
   * Create a new role (admin only)
   * @param {Object} roleData - The role data
   * @param {string} roleData.name - The role name (owner, member, guest, admin)
   * @param {string} roleData.description - The role description
   * @param {Array<string>} roleData.permissions - Array of permission strings
   * @returns {Promise<Object>} - The created role
   */
  createRole: async roleData => {
    const response = await api.post('/role', roleData);
    return response.data;
  },

  /**
   * Update a role (admin only)
   * @param {string} id - The role ID
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} - The updated role
   */
  updateRole: async (id, updateData) => {
    const response = await api.put(`/role/${id}`, updateData);
    return response.data;
  },

  /**
   * Delete a role (admin only)
   * @param {string} id - The role ID
   * @returns {Promise<Object>} - Response message
   */
  deleteRole: async id => {
    const response = await api.delete(`/role/${id}`);
    return response.data;
  },

  /**
   * Assign a role to a user for a specific home (home owner only)
   * @param {Object} assignmentData - The role assignment data
   * @param {string} assignmentData.homeId - The home ID
   * @param {string} assignmentData.email - The user's email
   * @param {string} assignmentData.roleName - The role name (owner, member, guest)
   * @param {string} [assignmentData.expiresAt] - Optional expiration date
   * @returns {Promise<Object>} - The role assignment result
   */
  assignRoleToUser: async assignmentData => {
    const response = await api.post('/role/assign', assignmentData);
    return response.data;
  },

  /**
   * Remove a user's role for a specific home (home owner only)
   * @param {string} homeId - The home ID
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - Response message
   */
  removeRoleFromUser: async (homeId, userId) => {
    const response = await api.delete(`/role/${homeId}/user/${userId}`);
    return response.data;
  },
};
