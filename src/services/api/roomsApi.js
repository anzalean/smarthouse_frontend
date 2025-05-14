import { api } from './apiClient.js';

/**
 * API service for room operations
 */
export const roomsApi = {
  /**
   * Get all rooms for a specific home
   * @param {string} homeId - ID of the home to get rooms for
   * @returns {Promise<Array>} - Promise that resolves to an array of rooms
   */
  getRoomsByHomeId: async homeId => {
    const response = await api.get(`/room?homeId=${homeId}`);
    return response.data;
  },

  /**
   * Get a specific room by ID
   * @param {string} roomId - ID of the room to retrieve
   * @returns {Promise<Object>} - Promise that resolves to the room object
   */
  getRoomById: async roomId => {
    const response = await api.get(`/room/${roomId}`);
    return response.data;
  },

  /**
   * Get room with its devices and sensors
   * @param {string} roomId - ID of the room to retrieve with details
   * @returns {Promise<Object>} - Promise that resolves to the room object with devices and sensors
   */
  getRoomDetails: async roomId => {
    const response = await api.get(`/room/${roomId}/details`);
    return response.data;
  },

  /**
   * Create a new room
   * @param {Object} roomData - The room data to create
   * @param {string} roomData.homeId - The ID of the home this room belongs to
   * @param {string} roomData.name - The name of the room
   * @param {string} [roomData.type] - The type of room
   * @returns {Promise<Object>} - Promise that resolves to the created room
   */
  createRoom: async roomData => {
    const response = await api.post('/room', roomData);
    return response.data;
  },

  /**
   * Update a room
   * @param {string} roomId - ID of the room to update
   * @param {Object} updateData - Data to update on the room
   * @returns {Promise<Object>} - Promise that resolves to the updated room
   */
  updateRoom: async (roomId, updateData) => {
    const response = await api.put(`/room/${roomId}`, updateData);
    return response.data;
  },

  /**
   * Delete a room
   * @param {string} roomId - ID of the room to delete
   * @returns {Promise<Object>} - Promise with deletion confirmation
   */
  deleteRoom: async roomId => {
    const response = await api.delete(`/room/${roomId}`);
    return response.data;
  },
};
