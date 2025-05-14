import { api } from './apiClient.js';

/**
 * API service for device operations
 */
export const devicesApi = {
  /**
   * Fetches all devices for a specific home
   * @param {string} homeId - The ID of the home to fetch devices for
   * @returns {Promise<Array>} Array of device objects
   */
  getDevicesByHomeId: async homeId => {
    const response = await api.get(`/device/home/${homeId}`);
    return response.data;
  },

  /**
   * Fetches a specific device by ID
   * @param {string} id - The ID of the device to fetch
   * @returns {Promise<Object>} Device object
   */
  getDeviceById: async id => {
    const response = await api.get(`/device/${id}`);
    return response.data;
  },

  /**
   * Creates a new device
   * @param {Object} data - The device data
   * @param {string} data.homeId - The ID of the home this device belongs to (required)
   * @param {string} data.name - Name of the device (required)
   * @param {string} data.deviceType - Type of the device (required, e.g. 'AirPurifier', 'Camera', etc.)
   * @param {string} [data.roomId] - The ID of the room this device is in (optional)
   * @param {string} [data.manufacturer] - Manufacturer name
   * @param {string} [data.model] - Model name/number
   * @param {string} [data.serialNumber] - Serial number
   * @param {string} [data.firmware] - Firmware version
   * @param {Object} [data.status] - Status information
   * @param {boolean} [data.status.isOnline] - Whether the device is online
   * @param {number} [data.status.batteryLevel] - Battery level (0-100)
   * @param {Object} [data.configuration] - Device configuration
   * @returns {Promise<Object>} The created device
   */
  createDevice: async data => {
    const response = await api.post('/device', data);
    return response.data.device;
  },

  /**
   * Updates an existing device
   * @param {string} id - The ID of the device to update
   * @param {Object} data - The updated device data
   * @returns {Promise<Object>} The updated device
   */
  updateDevice: async (id, data) => {
    const response = await api.put(`/device/${id}`, data);
    return response.data;
  },

  /**
   * Deletes a device
   * @param {string} id - The ID of the device to delete
   * @returns {Promise<Object>} Response data
   */
  deleteDevice: async id => {
    const response = await api.delete(`/device/${id}`);
    return response.data;
  },

  /**
   * Get all devices for a specific room
   * @param {string} roomId - ID of the room to get devices for
   * @returns {Promise<Array>} - Promise that resolves to an array of devices
   */
  getDevicesByRoomId: async roomId => {
    const response = await api.get(`/device/room/${roomId}`);
    return response.data;
  },
};
