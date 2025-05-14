import { api } from './apiClient.js';

/**
 * API service for sensor operations
 */
export const sensorsApi = {
  /**
   * Fetches all sensors for a specific home
   * @param {string} homeId - The ID of the home to fetch sensors for
   * @returns {Promise<Array>} Array of sensor objects
   */
  getSensorsByHomeId: async homeId => {
    const response = await api.get(`/sensor/home/${homeId}`);
    return response.data;
  },

  /**
   * Fetches a specific sensor by ID
   * @param {string} id - The ID of the sensor to fetch
   * @returns {Promise<Object>} Sensor object
   */
  getSensorById: async id => {
    const response = await api.get(`/sensor/${id}`);
    return response.data;
  },

  /**
   * Creates a new sensor
   * @param {Object} data - The sensor data
   * @param {string} data.homeId - The ID of the home this sensor belongs to (required)
   * @param {string} data.name - Name of the sensor (required)
   * @param {string} data.sensorType - Type of the sensor (required, e.g. 'TemperatureSensor', 'MotionSensor', etc.)
   * @param {string} [data.roomId] - The ID of the room this sensor is in (optional)
   * @param {string} [data.manufacturer] - Manufacturer name
   * @param {string} [data.model] - Model name/number
   * @param {string} [data.serialNumber] - Serial number
   * @param {string} [data.firmware] - Firmware version
   * @param {Object} [data.status] - Status information
   * @param {boolean} [data.status.isActive] - Whether the sensor is active
   * @param {number} [data.status.batteryLevel] - Battery level (0-100)
   * @returns {Promise<Object>} The created sensor
   */
  createSensor: async data => {
    const response = await api.post('/sensor', data);
    return response.data.sensor;
  },

  /**
   * Updates an existing sensor
   * @param {string} id - The ID of the sensor to update
   * @param {Object} data - The updated sensor data
   * @returns {Promise<Object>} The updated sensor
   */
  updateSensor: async (id, data) => {
    const response = await api.put(`/sensor/${id}`, data);
    return response.data;
  },

  /**
   * Deletes a sensor
   * @param {string} id - The ID of the sensor to delete
   * @returns {Promise<Object>} Response data
   */
  deleteSensor: async id => {
    const response = await api.delete(`/sensor/${id}`);
    return response.data;
  },

  /**
   * Get all sensors for a specific room
   * @param {string} roomId - ID of the room to get sensors for
   * @returns {Promise<Array>} - Promise that resolves to an array of sensors
   */
  getSensorsByRoomId: async roomId => {
    const response = await api.get(`/sensor/room/${roomId}`);
    return response.data;
  },
};
