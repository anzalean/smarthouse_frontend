import { api } from './apiClient.js';

/**
 * API service for home operations
 */
export const homesApi = {
  /**
   * Get all homes for the current user
   * @returns {Promise<Array>} List of homes
   */
  getAllHomes: async () => {
    const response = await api.get('/home');
    return response.data;
  },

  /**
   * Get a specific home by ID
   * @param {string} id - Home ID to fetch
   * @returns {Promise<Object>} Home data
   */
  getHomeById: async id => {
    const response = await api.get(`/home/${id}`);
    return response.data;
  },

  /**
   * Create a new home
   * @param {Object} data - Home data
   * @param {Object} data.homeData - Basic home information
   * @param {string} data.homeData.name - Home name
   * @param {string} [data.homeData.type] - Home type (apartment, house, etc.)
   * @param {Object} data.addressData - Home address
   * @param {string} data.addressData.street - Street address
   * @param {string} data.addressData.city - City
   * @param {string} data.addressData.region - Region/Oblast
   * @param {string} data.addressData.postalCode - Postal/ZIP code
   * @param {string} data.addressData.country - Country
   * @param {string} data.addressData.buildingNumber - Building number
   * @param {string} data.addressData.apartmentNumber - Apartment number (for apartments)
   * @returns {Promise<Object>} Created home data
   */
  createHome: async data => {
    const response = await api.post('/home', data);
    return response.data;
  },

  /**
   * Update an existing home
   * @param {string} id - Home ID to update
   * @param {Object} data - Updated home data
   * @returns {Promise<Object>} Updated home data
   */
  updateHome: async (id, data) => {
    const response = await api.put(`/home/${id}`, data);
    return response.data;
  },

  /**
   * Delete a home
   * @param {string} id - Home ID to delete
   * @returns {Promise<Object>} Response with success message
   */
  deleteHome: async id => {
    const response = await api.delete(`/home/${id}`);
    return response.data;
  },
};
