import { api } from './apiClient.js';

/**
 * Get device logs with filter options
 * @param {Object} options - Filter options
 * @param {string} options.deviceId - Optional device ID
 * @param {string} options.homeId - Optional home ID
 * @param {string} options.period - Time period ('day', 'week', 'month')
 * @param {string} options.deviceType - Optional device type filter
 * @param {number} options.limit - Optional limit of logs to return
 * @param {number} options.skip - Optional number of logs to skip
 * @returns {Promise} The response containing device logs
 */
const getDeviceLogs = async (options = {}) => {
  const queryParams = new URLSearchParams();

  if (options.deviceId) queryParams.append('deviceId', options.deviceId);
  if (options.homeId) queryParams.append('homeId', options.homeId);
  if (options.period) queryParams.append('period', options.period);
  if (options.deviceType) queryParams.append('deviceType', options.deviceType);
  if (options.limit) queryParams.append('limit', options.limit);
  if (options.skip) queryParams.append('skip', options.skip);

  const response = await api.get(`/logs/device?${queryParams.toString()}`);
  return response.data.data;
};

/**
 * Get a specific device log by ID
 * @param {string} id - The device log ID
 * @returns {Promise} The response containing the device log
 */
const getDeviceLogById = async id => {
  const response = await api.get(`/logs/device/${id}`);
  return response.data.data;
};

/**
 * Get sensor logs with filter options
 * @param {Object} options - Filter options
 * @param {string} options.sensorId - Optional sensor ID
 * @param {string} options.homeId - Optional home ID
 * @param {string} options.period - Time period ('day', 'week', 'month')
 * @param {string} options.sensorType - Optional sensor type filter
 * @param {number} options.limit - Optional limit of logs to return
 * @param {number} options.skip - Optional number of logs to skip
 * @returns {Promise} The response containing sensor logs
 */
const getSensorLogs = async (options = {}) => {
  const queryParams = new URLSearchParams();

  if (options.sensorId) queryParams.append('sensorId', options.sensorId);
  if (options.homeId) queryParams.append('homeId', options.homeId);
  if (options.period) queryParams.append('period', options.period);
  if (options.sensorType) queryParams.append('sensorType', options.sensorType);
  if (options.limit) queryParams.append('limit', options.limit);
  if (options.skip) queryParams.append('skip', options.skip);

  const response = await api.get(`/logs/sensor?${queryParams.toString()}`);
  return response.data.data;
};

/**
 * Get a specific sensor log by ID
 * @param {string} id - The sensor log ID
 * @returns {Promise} The response containing the sensor log
 */
const getSensorLogById = async id => {
  const response = await api.get(`/logs/sensor/${id}`);
  return response.data.data;
};

export const logsApi = {
  getDeviceLogs,
  getDeviceLogById,
  getSensorLogs,
  getSensorLogById,
};
