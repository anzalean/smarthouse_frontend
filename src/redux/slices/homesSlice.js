import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  homesApi,
  devicesApi,
  sensorsApi,
  roomsApi,
  automationsApi,
  rolesApi,
  logsApi,
} from '../../services/api';
import { setLoader, addNotification } from './uiSlice';
import {
  getSavedHomeId,
  saveHomeId,
  clearSavedHomeId,
} from '../../utils/localStorage';

const initialState = {
  list: [],
  currentHome: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  automations: [],
  roles: [],
  devicesLogs: [],
  sensorsLogs: [],
  homeAccesses: [],
};

// Async thunks for homes
export const fetchHomes = createAsyncThunk(
  'homes/fetchHomes',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'homes', active: true }));
      const homes = await homesApi.getAllHomes();

      // Спробуємо отримати збережений ID будинку
      const savedHomeId = getSavedHomeId();

      return { homes, savedHomeId };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch homes';
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'homes', active: false }));
    }
  }
);

export const fetchHomeById = createAsyncThunk(
  'homes/fetchHomeById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'homes', active: true }));
      // Зберігаємо ID вибраного будинку в localStorage
      saveHomeId(id);
      const home = await homesApi.getHomeById(id);
      return home;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch home details';
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'homes', active: false }));
    }
  }
);

export const createHome = createAsyncThunk(
  'homes/createHome',
  async (homeData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'homes', active: true }));
      const response = await homesApi.createHome(homeData);

      // Зберігаємо ID нового будинку в localStorage
      if (response.home && response.home._id) {
        saveHomeId(response.home._id);
      }

      dispatch(
        addNotification({
          type: 'success',
          message: 'Home created successfully',
        })
      );
      return response.home;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create home';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'homes', active: false }));
    }
  }
);

export const updateHomeDetails = createAsyncThunk(
  'homes/updateHome',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'homes', active: true }));
      const updatedHome = await homesApi.updateHome(id, data);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Home updated successfully',
        })
      );
      return updatedHome;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update home';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'homes', active: false }));
    }
  }
);

export const removeHome = createAsyncThunk(
  'homes/removeHome',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'homes', active: true }));
      await homesApi.deleteHome(id);

      dispatch(
        addNotification({
          type: 'success',
          message: 'Home deleted successfully',
        })
      );

      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete home';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'homes', active: false }));
    }
  }
);

// Async thunks for devices
/**
 * Fetches all devices for a specific home and stores them in the home object
 * @param {string} homeId - The ID of the home to fetch devices for
 * @returns {Promise} - Thunk action that resolves with the fetched devices
 *
 * @example
 * // In a component:
 * useEffect(() => {
 *   if (currentHome?._id) {
 *     dispatch(fetchDevicesByHomeId(currentHome._id));
 *   }
 * }, [currentHome, dispatch]);
 */
export const fetchDevicesByHomeId = createAsyncThunk(
  'homes/fetchDevicesByHomeId',
  async (homeId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'devices', active: true }));
      const devices = await devicesApi.getDevicesByHomeId(homeId);
      return { homeId, devices };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch devices';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'devices', active: false }));
    }
  }
);

/**
 * Creates a new device and adds it to the corresponding home
 * @param {Object} deviceData - The device data
 * @param {string} deviceData.homeId - The ID of the home this device belongs to (required)
 * @param {string} deviceData.name - Name of the device (required)
 * @param {string} deviceData.deviceType - Type of the device (required, e.g. 'AirPurifier', 'Camera', etc.)
 * @returns {Promise} - Thunk action that resolves with the created device
 *
 * @example
 * // In a form submit handler:
 * const handleSubmit = (formData) => {
 *   dispatch(createDevice({
 *     homeId: currentHome._id,
 *     name: formData.name,
 *     deviceType: formData.type,
 *     roomId: formData.roomId,
 *     manufacturer: formData.manufacturer,
 *     model: formData.model
 *   }))
 *   .unwrap()
 *   .then(() => {
 *     // Success handling (e.g., close modal)
 *     setShowModal(false);
 *   })
 *   .catch((error) => {
 *     // Error handling if needed beyond the automatic notification
 *     console.error(error);
 *   });
 * };
 */
export const createDevice = createAsyncThunk(
  'homes/createDevice',
  async (deviceData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'devices', active: true }));
      const device = await devicesApi.createDevice(deviceData);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Device created successfully',
        })
      );
      return device;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create device';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'devices', active: false }));
    }
  }
);

export const updateDevice = createAsyncThunk(
  'homes/updateDevice',
  async (
    { id, data, isStatusToggle = false },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Вибираємо тип лоадера в залежності від того, чи це перемикання статусу
      const loaderName = isStatusToggle ? 'deviceStatusToggle' : 'devices';

      // Включаємо відповідний лоадер
      dispatch(setLoader({ name: loaderName, active: true }));

      const updatedDevice = await devicesApi.updateDevice(id, data);

      dispatch(
        addNotification({
          type: 'success',
          message: 'Device updated successfully',
        })
      );
      return updatedDevice;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update device';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      // Вимикаємо відповідний лоадер
      const loaderName = isStatusToggle ? 'deviceStatusToggle' : 'devices';
      dispatch(setLoader({ name: loaderName, active: false }));
    }
  }
);

export const removeDevice = createAsyncThunk(
  'homes/removeDevice',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'devices', active: true }));
      await devicesApi.deleteDevice(id);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Device deleted successfully',
        })
      );
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to delete device';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'devices', active: false }));
    }
  }
);

// Async thunks for sensors
/**
 * Fetches all sensors for a specific home and stores them in the home object
 * @param {string} homeId - The ID of the home to fetch sensors for
 * @returns {Promise} - Thunk action that resolves with the fetched sensors
 *
 * @example
 * // In a component:
 * useEffect(() => {
 *   if (currentHome?._id) {
 *     dispatch(fetchSensorsByHomeId(currentHome._id));
 *   }
 * }, [currentHome, dispatch]);
 */
export const fetchSensorsByHomeId = createAsyncThunk(
  'homes/fetchSensorsByHomeId',
  async (homeId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'sensors', active: true }));
      const sensors = await sensorsApi.getSensorsByHomeId(homeId);
      return { homeId, sensors };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch sensors';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'sensors', active: false }));
    }
  }
);

/**
 * Creates a new sensor and adds it to the corresponding home
 * @param {Object} sensorData - The sensor data
 * @param {string} sensorData.homeId - The ID of the home this sensor belongs to (required)
 * @param {string} sensorData.name - Name of the sensor (required)
 * @param {string} sensorData.sensorType - Type of the sensor (required, e.g. 'TemperatureSensor', 'MotionSensor', etc.)
 * @returns {Promise} - Thunk action that resolves with the created sensor
 *
 * @example
 * // In a form submit handler:
 * const handleSubmit = (formData) => {
 *   dispatch(createSensor({
 *     homeId: currentHome._id,
 *     name: formData.name,
 *     sensorType: formData.type,
 *     roomId: formData.roomId,
 *     manufacturer: formData.manufacturer,
 *     model: formData.model
 *   }))
 *   .unwrap()
 *   .then(() => {
 *     // Success handling (e.g., close modal)
 *     setShowModal(false);
 *   })
 *   .catch((error) => {
 *     // Error handling if needed beyond the automatic notification
 *     console.error(error);
 *   });
 * };
 */
export const createSensor = createAsyncThunk(
  'homes/createSensor',
  async (sensorData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'sensors', active: true }));
      const sensor = await sensorsApi.createSensor(sensorData);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Sensor created successfully',
        })
      );
      return sensor;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create sensor';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'sensors', active: false }));
    }
  }
);

export const updateSensor = createAsyncThunk(
  'homes/updateSensor',
  async (
    { id, data, isStatusToggle = false },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Використовуємо різні лоадери для різних типів операцій
      const loaderName = isStatusToggle ? 'sensorStatusToggle' : 'sensors';
      dispatch(setLoader({ name: loaderName, active: true }));

      const updatedSensor = await sensorsApi.updateSensor(id, data);

      // Показуємо повідомлення тільки якщо це не просто перемикання статусу
      if (!isStatusToggle) {
        dispatch(
          addNotification({
            type: 'success',
            message: 'Sensor updated successfully',
          })
        );
      }

      return updatedSensor;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update sensor';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      // Вимикаємо той самий лоадер, який був увімкнений
      const loaderName = isStatusToggle ? 'sensorStatusToggle' : 'sensors';
      dispatch(setLoader({ name: loaderName, active: false }));
    }
  }
);

export const removeSensor = createAsyncThunk(
  'homes/removeSensor',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'sensors', active: true }));
      await sensorsApi.deleteSensor(id);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Sensor deleted successfully',
        })
      );
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to delete sensor';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'sensors', active: false }));
    }
  }
);

// Async thunks for rooms
/**
 * Fetches all rooms for a specific home and stores them in the home object
 * @param {string} homeId - The ID of the home to fetch rooms for
 * @returns {Promise} - Thunk action that resolves with the fetched rooms
 *
 * @example
 * // In a component:
 * useEffect(() => {
 *   if (currentHome?._id) {
 *     dispatch(fetchRoomsByHomeId(currentHome._id));
 *   }
 * }, [currentHome, dispatch]);
 */
export const fetchRoomsByHomeId = createAsyncThunk(
  'homes/fetchRoomsByHomeId',
  async (homeId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'rooms', active: true }));
      const rooms = await roomsApi.getRoomsByHomeId(homeId);
      return { homeId, rooms };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch rooms';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'rooms', active: false }));
    }
  }
);

/**
 * Creates a new room and adds it to the corresponding home
 * @param {Object} roomData - The room data
 * @param {string} roomData.homeId - The ID of the home this room belongs to (required)
 * @param {string} roomData.name - Name of the room (required)
 * @param {string} roomData.type - Type of the room (optional)
 * @returns {Promise} - Thunk action that resolves with the created room
 *
 * @example
 * // In a form submit handler:
 * const handleSubmit = (formData) => {
 *   dispatch(createRoom({
 *     homeId: currentHome._id,
 *     name: formData.name,
 *     type: formData.type
 *   }))
 *   .unwrap()
 *   .then(() => {
 *     // Success handling (e.g., close modal)
 *     setShowModal(false);
 *   })
 *   .catch((error) => {
 *     // Error handling if needed beyond the automatic notification
 *     console.error(error);
 *   });
 * };
 */
export const createRoom = createAsyncThunk(
  'homes/createRoom',
  async (roomData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'rooms', active: true }));
      const room = await roomsApi.createRoom(roomData);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Room created successfully',
        })
      );
      return room;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create room';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'rooms', active: false }));
    }
  }
);

export const updateRoom = createAsyncThunk(
  'homes/updateRoom',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'rooms', active: true }));
      const updatedRoom = await roomsApi.updateRoom(id, data);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Room updated successfully',
        })
      );
      return updatedRoom;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update room';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'rooms', active: false }));
    }
  }
);

export const removeRoom = createAsyncThunk(
  'homes/removeRoom',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'rooms', active: true }));
      await roomsApi.deleteRoom(id);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Room deleted successfully',
        })
      );
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete room';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'rooms', active: false }));
    }
  }
);

/**
 * Fetches all devices for a specific room
 * @param {string} roomId - The ID of the room to fetch devices for
 * @returns {Promise} - Thunk action that resolves with the fetched devices
 */
export const fetchDevicesByRoomId = createAsyncThunk(
  'homes/fetchDevicesByRoomId',
  async (roomId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'devices', active: true }));
      const devices = await devicesApi.getDevicesByRoomId(roomId);
      return { roomId, devices };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch devices for room';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'devices', active: false }));
    }
  }
);

/**
 * Fetches all sensors for a specific room
 * @param {string} roomId - The ID of the room to fetch sensors for
 * @returns {Promise} - Thunk action that resolves with the fetched sensors
 */
export const fetchSensorsByRoomId = createAsyncThunk(
  'homes/fetchSensorsByRoomId',
  async (roomId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'sensors', active: true }));
      const sensors = await sensorsApi.getSensorsByRoomId(roomId);
      return { roomId, sensors };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch sensors for room';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'sensors', active: false }));
    }
  }
);

// Async thunks for automations
export const fetchAutomationsByHomeId = createAsyncThunk(
  'homes/fetchAutomationsByHomeId',
  async (homeId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'automations', active: true }));
      const automations = await automationsApi.getAutomationsByHomeId(homeId);
      return { homeId, automations };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch automations';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'automations', active: false }));
    }
  }
);

export const createAutomation = createAsyncThunk(
  'homes/createAutomation',
  async (automationData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'automations', active: true }));
      const automation = await automationsApi.createAutomation(automationData);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Automation created successfully',
        })
      );
      return automation;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create automation';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'automations', active: false }));
    }
  }
);

export const updateAutomation = createAsyncThunk(
  'homes/updateAutomation',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'automations', active: true }));
      const updatedAutomation = await automationsApi.updateAutomation(id, data);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Automation updated successfully',
        })
      );
      return updatedAutomation;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update automation';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'automations', active: false }));
    }
  }
);

export const toggleAutomationStatus = createAsyncThunk(
  'homes/toggleAutomationStatus',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'automationStatusToggle', active: true }));
      const updatedAutomation = await automationsApi.toggleAutomationStatus(id);
      return updatedAutomation;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to toggle automation status';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'automationStatusToggle', active: false }));
    }
  }
);

export const deleteAutomation = createAsyncThunk(
  'homes/deleteAutomation',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'automations', active: true }));
      await automationsApi.deleteAutomation(id);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Automation deleted successfully',
        })
      );
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to delete automation';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'automations', active: false }));
    }
  }
);

// Async thunks for roles
export const fetchRoles = createAsyncThunk(
  'homes/fetchRoles',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'roles', active: true }));
      const roles = await rolesApi.getAllRoles();
      return roles;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch roles';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'roles', active: false }));
    }
  }
);

// Fetch home permissions (users with their roles for a specific home)
export const fetchHomePermissions = createAsyncThunk(
  'homes/fetchHomePermissions',
  async (homeId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'homePermissions', active: true }));
      const permissions = await rolesApi.getHomePermissions(homeId);
      return permissions;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch home permissions';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'homePermissions', active: false }));
    }
  }
);

export const assignRole = createAsyncThunk(
  'homes/assignRole',
  async (assignmentData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'roles', active: true }));
      const result = await rolesApi.assignRoleToUser(assignmentData);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Role assigned successfully',
        })
      );
      return result;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to assign role';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'roles', active: false }));
    }
  }
);

export const removeRole = createAsyncThunk(
  'homes/removeRole',
  async ({ homeId, userId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'roles', active: true }));
      await rolesApi.removeRoleFromUser(homeId, userId);
      dispatch(
        addNotification({
          type: 'success',
          message: 'Role removed successfully',
        })
      );
      return { homeId, userId };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove role';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'roles', active: false }));
    }
  }
);

// Async thunks for logs
/**
 * Fetches device logs for a device or home with filtering options
 * @param {Object} options - Filter options
 * @param {string} options.deviceId - Optional device ID
 * @param {string} options.homeId - Optional home ID
 * @param {string} options.period - Time period ('day', 'week', 'month')
 * @param {string} options.deviceType - Optional device type filter
 * @param {number} options.limit - Optional limit of logs to return
 * @param {number} options.skip - Optional number of logs to skip
 * @returns {Promise} - Thunk action that resolves with the fetched logs
 */
export const fetchDeviceLogs = createAsyncThunk(
  'homes/fetchDeviceLogs',
  async (options, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'deviceLogs', active: true }));
      const logs = await logsApi.getDeviceLogs(options);
      return logs;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch device logs';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'deviceLogs', active: false }));
    }
  }
);

/**
 * Fetches a specific device log by ID
 * @param {string} id - The device log ID
 * @returns {Promise} - Thunk action that resolves with the fetched log
 */
export const fetchDeviceLogById = createAsyncThunk(
  'homes/fetchDeviceLogById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'deviceLogs', active: true }));
      const log = await logsApi.getDeviceLogById(id);
      return log;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch device log';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'deviceLogs', active: false }));
    }
  }
);

/**
 * Fetches sensor logs for a sensor or home with filtering options
 * @param {Object} options - Filter options
 * @param {string} options.sensorId - Optional sensor ID
 * @param {string} options.homeId - Optional home ID
 * @param {string} options.period - Time period ('day', 'week', 'month')
 * @param {string} options.sensorType - Optional sensor type filter
 * @param {number} options.limit - Optional limit of logs to return
 * @param {number} options.skip - Optional number of logs to skip
 * @returns {Promise} - Thunk action that resolves with the fetched logs
 */
export const fetchSensorLogs = createAsyncThunk(
  'homes/fetchSensorLogs',
  async (options, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'sensorLogs', active: true }));
      const logs = await logsApi.getSensorLogs(options);
      return logs;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch sensor logs';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'sensorLogs', active: false }));
    }
  }
);

/**
 * Fetches a specific sensor log by ID
 * @param {string} id - The sensor log ID
 * @returns {Promise} - Thunk action that resolves with the fetched log
 */
export const fetchSensorLogById = createAsyncThunk(
  'homes/fetchSensorLogById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoader({ name: 'sensorLogs', active: true }));
      const log = await logsApi.getSensorLogById(id);
      return log;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch sensor log';
      dispatch(
        addNotification({
          type: 'error',
          message,
        })
      );
      return rejectWithValue(message);
    } finally {
      dispatch(setLoader({ name: 'sensorLogs', active: false }));
    }
  }
);

const homesSlice = createSlice({
  name: 'homes',
  initialState,
  reducers: {
    setHomes: (state, action) => {
      state.list = action.payload;
    },
    addHome: (state, action) => {
      state.list.push(action.payload);
    },
    updateHome: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.list.findIndex(home => home._id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updates };

        // Update current home if needed
        if (state.currentHome && state.currentHome._id === id) {
          state.currentHome = { ...state.currentHome, ...updates };
        }
      }
    },
    deleteHome: (state, action) => {
      state.list = state.list.filter(home => home._id !== action.payload);
      if (state.currentHome && state.currentHome._id === action.payload) {
        state.currentHome = null;
      }
    },
    setCurrentHome: (state, action) => {
      state.currentHome = action.payload;
    },
    clearCurrentHome: state => {
      state.currentHome = null;
      clearSavedHomeId();
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    clearError: state => {
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: builder => {
    builder
      // Fetch homes cases
      .addCase(fetchHomes.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchHomes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { homes, savedHomeId } = action.payload;

        // Process each home in the response
        state.list = homes.map(home => {
          // Try to find this home in the existing state
          const existingHome = state.list.find(h => h._id === home._id);

          // If we found an existing home with this ID, use its rooms if the incoming home has no rooms
          const mergedRooms =
            home.rooms && home.rooms.length > 0
              ? // If incoming home has rooms, use them but ensure devices/sensors arrays exist
                home.rooms.map(room => ({
                  ...room,
                  devices: room.devices || [],
                  sensors: room.sensors || [],
                }))
              : // If no rooms in the API response but home exists in state, keep existing rooms
                (existingHome && existingHome.rooms) || [];

          return {
            ...home,
            rooms: mergedRooms,
          };
        });

        // Встановлюємо поточний будинок з масиву
        if (savedHomeId && state.list.some(home => home._id === savedHomeId)) {
          // Якщо є збережений ID і будинок з таким ID є в списку
          state.currentHome = state.list.find(home => home._id === savedHomeId);
        } else if (state.list.length > 0) {
          // Якщо немає збереженого ID, але є будинки, встановлюємо перший
          state.currentHome = state.list[0];
          // Зберігаємо ID вибраного будинку в localStorage
          saveHomeId(state.list[0]._id);
        }

        state.error = null;
      })
      .addCase(fetchHomes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch home by ID cases
      .addCase(fetchHomeById.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchHomeById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const home = action.payload;
        state.currentHome = home;
        
        // Оновлюємо дані в списку всіх будинків
        const index = state.list.findIndex((item) => item._id === home._id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...home };
        }
        
        if (home.rooms) {
          home.rooms.forEach(room => {
            room.devices = room.devices || [];
            room.sensors = room.sensors || [];
          });
        }
      })
      .addCase(fetchHomeById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Create home cases
      .addCase(createHome.pending, state => {
        state.status = 'loading';
      })
      .addCase(createHome.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newHome = {
          ...action.payload,
          devices: [],
          sensors: [],
        };
        state.list.push(newHome);
        // Встановлюємо новостворений будинок як поточний
        state.currentHome = newHome;
        state.error = null;
      })
      .addCase(createHome.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update home cases
      .addCase(updateHomeDetails.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateHomeDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedHome = action.payload;
        const index = state.list.findIndex(
          home => home._id === updatedHome._id
        );

        if (index !== -1) {
          // Preserve rooms structure
          const existingRooms = state.list[index].rooms || [];

          state.list[index] = {
            ...updatedHome,
            rooms: existingRooms,
          };
        }

        if (state.currentHome && state.currentHome._id === updatedHome._id) {
          // Preserve rooms structure for current home too
          const existingRooms = state.currentHome.rooms || [];

          state.currentHome = {
            ...updatedHome,
            rooms: existingRooms,
          };
        }

        state.error = null;
      })
      .addCase(updateHomeDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Delete home cases
      .addCase(removeHome.pending, state => {
        state.status = 'loading';
      })
      .addCase(removeHome.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const deletedHomeId = action.payload;
        const isCurrentHomeDeleted =
          state.currentHome && state.currentHome._id === deletedHomeId;

        // Видаляємо будинок зі списку
        state.list = state.list.filter(home => home._id !== deletedHomeId);

        // Якщо поточний будинок був видалений, встановлюємо новий поточний будинок
        if (isCurrentHomeDeleted) {
          if (state.list.length > 0) {
            // Встановлюємо перший доступний будинок як поточний
            state.currentHome = state.list[0];
            // Зберігаємо ID вибраного будинку в localStorage
            saveHomeId(state.list[0]._id);
          } else {
            // Якщо більше немає будинків
            state.currentHome = null;
            clearSavedHomeId();
          }
        }

        state.error = null;
      })
      .addCase(removeHome.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch devices by home ID cases
      .addCase(fetchDevicesByHomeId.fulfilled, (state, action) => {
        const { homeId, devices } = action.payload;
        const homeIndex = state.list.findIndex(home => home._id === homeId);

        if (homeIndex !== -1) {
          // Group devices by roomId
          const devicesByRoom = devices.reduce((acc, device) => {
            if (device.roomId) {
              if (!acc[device.roomId]) {
                acc[device.roomId] = [];
              }
              acc[device.roomId].push(device);
            }
            return acc;
          }, {});

          // Add devices to their respective rooms in the home
          if (state.list[homeIndex].rooms) {
            state.list[homeIndex].rooms.forEach(room => {
              const roomDevices = devicesByRoom[room._id] || [];
              room.devices = roomDevices;
            });
          }
        }

        if (state.currentHome && state.currentHome._id === homeId) {
          // Group devices by roomId
          const devicesByRoom = devices.reduce((acc, device) => {
            if (device.roomId) {
              if (!acc[device.roomId]) {
                acc[device.roomId] = [];
              }
              acc[device.roomId].push(device);
            }
            return acc;
          }, {});

          // Add devices to their respective rooms in currentHome
          if (state.currentHome.rooms) {
            state.currentHome.rooms.forEach(room => {
              const roomDevices = devicesByRoom[room._id] || [];
              room.devices = roomDevices;
            });
          }
        }
      })

      // Fetch devices by room ID cases
      .addCase(fetchDevicesByRoomId.fulfilled, (state, action) => {
        const { roomId, devices } = action.payload;

        // Update devices in the specified room in all homes
        state.list.forEach(home => {
          if (home.rooms) {
            const roomIndex = home.rooms.findIndex(room => room._id === roomId);
            if (roomIndex !== -1) {
              home.rooms[roomIndex].devices = devices;
            }
          }
        });

        // Update devices in currentHome if applicable
        if (state.currentHome && state.currentHome.rooms) {
          const roomIndex = state.currentHome.rooms.findIndex(
            room => room._id === roomId
          );
          if (roomIndex !== -1) {
            state.currentHome.rooms[roomIndex].devices = devices;
          }
        }
      })

      // Create device case
      .addCase(createDevice.fulfilled, (state, action) => {
        const device = action.payload;
        const { homeId, roomId } = device;

        if (!roomId) return;

        // Add device to the appropriate room in the homes list
        const homeIndex = state.list.findIndex(home => home._id === homeId);
        if (homeIndex !== -1 && state.list[homeIndex].rooms) {
          const roomIndex = state.list[homeIndex].rooms.findIndex(
            room => room._id === roomId
          );
          if (roomIndex !== -1) {
            if (!state.list[homeIndex].rooms[roomIndex].devices) {
              state.list[homeIndex].rooms[roomIndex].devices = [];
            }
            state.list[homeIndex].rooms[roomIndex].devices.push(device);
          }
        }

        // Add device to the appropriate room in currentHome
        if (
          state.currentHome &&
          state.currentHome._id === homeId &&
          state.currentHome.rooms
        ) {
          const roomIndex = state.currentHome.rooms.findIndex(
            room => room._id === roomId
          );

          if (roomIndex !== -1) {
            if (!state.currentHome.rooms[roomIndex].devices) {
              state.currentHome.rooms[roomIndex].devices = [];
            }
            state.currentHome.rooms[roomIndex].devices.push(device);
          }
        }
      })

      // Update device case
      .addCase(updateDevice.fulfilled, (state, action) => {
        const updatedDevice = action.payload;
        const { homeId, roomId } = updatedDevice;

        if (!roomId) return;

        // Update device in the appropriate room in the homes list
        const homeIndex = state.list.findIndex(home => home._id === homeId);
        if (homeIndex !== -1 && state.list[homeIndex].rooms) {
          const roomIndex = state.list[homeIndex].rooms.findIndex(
            room => room._id === roomId
          );

          if (
            roomIndex !== -1 &&
            state.list[homeIndex].rooms[roomIndex].devices
          ) {
            const deviceIndex = state.list[homeIndex].rooms[
              roomIndex
            ].devices.findIndex(device => device._id === updatedDevice._id);

            if (deviceIndex !== -1) {
              state.list[homeIndex].rooms[roomIndex].devices[deviceIndex] =
                updatedDevice;
            } else {
              // If the device wasn't in this room before (room was changed), add it
              state.list[homeIndex].rooms[roomIndex].devices.push(
                updatedDevice
              );
            }
          }
        }

        // Update device in the appropriate room in currentHome
        if (
          state.currentHome &&
          state.currentHome._id === homeId &&
          state.currentHome.rooms
        ) {
          const roomIndex = state.currentHome.rooms.findIndex(
            room => room._id === roomId
          );

          if (roomIndex !== -1 && state.currentHome.rooms[roomIndex].devices) {
            const deviceIndex = state.currentHome.rooms[
              roomIndex
            ].devices.findIndex(device => device._id === updatedDevice._id);

            if (deviceIndex !== -1) {
              state.currentHome.rooms[roomIndex].devices[deviceIndex] =
                updatedDevice;
            } else {
              // If the device wasn't in this room before (room was changed), add it
              state.currentHome.rooms[roomIndex].devices.push(updatedDevice);
            }
          }
        }
      })

      // Remove device case
      .addCase(removeDevice.fulfilled, (state, action) => {
        const deviceId = action.payload;

        // Find the device in rooms and remove it
        if (state.list) {
          state.list.forEach(home => {
            if (home.rooms) {
              home.rooms.forEach(room => {
                if (room.devices) {
                  room.devices = room.devices.filter(
                    device => device._id !== deviceId
                  );
                }
              });
            }
          });
        }

        // Also remove from currentHome if it exists
        if (state.currentHome && state.currentHome.rooms) {
          state.currentHome.rooms.forEach(room => {
            if (room.devices) {
              room.devices = room.devices.filter(
                device => device._id !== deviceId
              );
            }
          });
        }
      })

      // Fetch sensors by home ID cases
      .addCase(fetchSensorsByHomeId.fulfilled, (state, action) => {
        const { homeId, sensors } = action.payload;
        const homeIndex = state.list.findIndex(home => home._id === homeId);

        if (homeIndex !== -1) {
          // Group sensors by roomId
          const sensorsByRoom = sensors.reduce((acc, sensor) => {
            if (sensor.roomId) {
              if (!acc[sensor.roomId]) {
                acc[sensor.roomId] = [];
              }
              acc[sensor.roomId].push(sensor);
            }
            return acc;
          }, {});

          // Add sensors to their respective rooms in the home
          if (state.list[homeIndex].rooms) {
            state.list[homeIndex].rooms.forEach(room => {
              const roomSensors = sensorsByRoom[room._id] || [];
              room.sensors = roomSensors;
            });
          }
        }

        if (state.currentHome && state.currentHome._id === homeId) {
          // Group sensors by roomId
          const sensorsByRoom = sensors.reduce((acc, sensor) => {
            if (sensor.roomId) {
              if (!acc[sensor.roomId]) {
                acc[sensor.roomId] = [];
              }
              acc[sensor.roomId].push(sensor);
            }
            return acc;
          }, {});

          // Add sensors to their respective rooms in currentHome
          if (state.currentHome.rooms) {
            state.currentHome.rooms.forEach(room => {
              const roomSensors = sensorsByRoom[room._id] || [];
              room.sensors = roomSensors;
            });
          }
        }
      })

      // Fetch sensors by room ID cases
      .addCase(fetchSensorsByRoomId.fulfilled, (state, action) => {
        const { roomId, sensors } = action.payload;

        // Update sensors in the specified room in all homes
        state.list.forEach(home => {
          if (home.rooms) {
            const roomIndex = home.rooms.findIndex(room => room._id === roomId);
            if (roomIndex !== -1) {
              home.rooms[roomIndex].sensors = sensors;
            }
          }
        });

        // Update sensors in currentHome if applicable
        if (state.currentHome && state.currentHome.rooms) {
          const roomIndex = state.currentHome.rooms.findIndex(
            room => room._id === roomId
          );
          if (roomIndex !== -1) {
            state.currentHome.rooms[roomIndex].sensors = sensors;
          }
        }
      })

      // Create sensor case
      .addCase(createSensor.fulfilled, (state, action) => {
        const sensor = action.payload;
        const { homeId, roomId } = sensor;

        if (!roomId) return;

        // Add sensor to the appropriate room in the homes list
        const homeIndex = state.list.findIndex(home => home._id === homeId);
        if (homeIndex !== -1 && state.list[homeIndex].rooms) {
          const roomIndex = state.list[homeIndex].rooms.findIndex(
            room => room._id === roomId
          );

          if (roomIndex !== -1) {
            if (!state.list[homeIndex].rooms[roomIndex].sensors) {
              state.list[homeIndex].rooms[roomIndex].sensors = [];
            }
            state.list[homeIndex].rooms[roomIndex].sensors.push(sensor);
          }
        }

        // Add sensor to the appropriate room in currentHome
        if (
          state.currentHome &&
          state.currentHome._id === homeId &&
          state.currentHome.rooms
        ) {
          const roomIndex = state.currentHome.rooms.findIndex(
            room => room._id === roomId
          );

          if (roomIndex !== -1) {
            if (!state.currentHome.rooms[roomIndex].sensors) {
              state.currentHome.rooms[roomIndex].sensors = [];
            }
            state.currentHome.rooms[roomIndex].sensors.push(sensor);
          }
        }
      })

      // Update sensor case
      .addCase(updateSensor.fulfilled, (state, action) => {
        const updatedSensor = action.payload;
        const { homeId, roomId } = updatedSensor;

        if (!roomId) return;

        // Update sensor in the appropriate room in the homes list
        const homeIndex = state.list.findIndex(home => home._id === homeId);
        if (homeIndex !== -1 && state.list[homeIndex].rooms) {
          const roomIndex = state.list[homeIndex].rooms.findIndex(
            room => room._id === roomId
          );

          if (
            roomIndex !== -1 &&
            state.list[homeIndex].rooms[roomIndex].sensors
          ) {
            const sensorIndex = state.list[homeIndex].rooms[
              roomIndex
            ].sensors.findIndex(sensor => sensor._id === updatedSensor._id);

            if (sensorIndex !== -1) {
              state.list[homeIndex].rooms[roomIndex].sensors[sensorIndex] =
                updatedSensor;
            } else {
              // If the sensor wasn't in this room before (room was changed), add it
              state.list[homeIndex].rooms[roomIndex].sensors.push(
                updatedSensor
              );
            }
          }
        }

        // Update sensor in the appropriate room in currentHome
        if (
          state.currentHome &&
          state.currentHome._id === homeId &&
          state.currentHome.rooms
        ) {
          const roomIndex = state.currentHome.rooms.findIndex(
            room => room._id === roomId
          );

          if (roomIndex !== -1 && state.currentHome.rooms[roomIndex].sensors) {
            const sensorIndex = state.currentHome.rooms[
              roomIndex
            ].sensors.findIndex(sensor => sensor._id === updatedSensor._id);

            if (sensorIndex !== -1) {
              state.currentHome.rooms[roomIndex].sensors[sensorIndex] =
                updatedSensor;
            } else {
              // If the sensor wasn't in this room before (room was changed), add it
              state.currentHome.rooms[roomIndex].sensors.push(updatedSensor);
            }
          }
        }
      })

      // Remove sensor case
      .addCase(removeSensor.fulfilled, (state, action) => {
        const sensorId = action.payload;

        // Find the sensor in rooms and remove it
        if (state.list) {
          state.list.forEach(home => {
            if (home.rooms) {
              home.rooms.forEach(room => {
                if (room.sensors) {
                  room.sensors = room.sensors.filter(
                    sensor => sensor._id !== sensorId
                  );
                }
              });
            }
          });
        }

        // Also remove from currentHome if it exists
        if (state.currentHome && state.currentHome.rooms) {
          state.currentHome.rooms.forEach(room => {
            if (room.sensors) {
              room.sensors = room.sensors.filter(
                sensor => sensor._id !== sensorId
              );
            }
          });
        }
      })

      // Fetch rooms by home ID cases
      .addCase(fetchRoomsByHomeId.fulfilled, (state, action) => {
        const { homeId, rooms } = action.payload;
        const homeIndex = state.list.findIndex(home => home._id === homeId);

        if (homeIndex !== -1) {
          state.list[homeIndex].rooms = rooms;
        }

        if (state.currentHome && state.currentHome._id === homeId) {
          state.currentHome.rooms = rooms;
        }
      })

      // Create room case
      .addCase(createRoom.fulfilled, (state, action) => {
        const room = action.payload;
        const homeId = room.homeId;
        const homeIndex = state.list.findIndex(home => home._id === homeId);

        if (homeIndex !== -1) {
          if (!state.list[homeIndex].rooms) {
            state.list[homeIndex].rooms = [];
          }
          state.list[homeIndex].rooms.push(room);
        }

        if (state.currentHome && state.currentHome._id === homeId) {
          if (!state.currentHome.rooms) {
            state.currentHome.rooms = [];
          }
          state.currentHome.rooms.push(room);
        }
      })

      // Update room case
      .addCase(updateRoom.fulfilled, (state, action) => {
        const updatedRoom = action.payload;
        const homeId = updatedRoom.homeId;
        const homeIndex = state.list.findIndex(home => home._id === homeId);

        if (homeIndex !== -1 && state.list[homeIndex].rooms) {
          const roomIndex = state.list[homeIndex].rooms.findIndex(
            room => room._id === updatedRoom._id
          );

          if (roomIndex !== -1) {
            state.list[homeIndex].rooms[roomIndex] = updatedRoom;
          }
        }

        if (
          state.currentHome &&
          state.currentHome._id === homeId &&
          state.currentHome.rooms
        ) {
          const roomIndex = state.currentHome.rooms.findIndex(
            room => room._id === updatedRoom._id
          );

          if (roomIndex !== -1) {
            state.currentHome.rooms[roomIndex] = updatedRoom;
          }
        }
      })

      // Remove room case
      .addCase(removeRoom.fulfilled, (state, action) => {
        const roomId = action.payload;

        // Find which home has this room
        const homeWithRoom = state.list.find(
          home => home.rooms && home.rooms.some(room => room._id === roomId)
        );

        if (homeWithRoom) {
          const homeIndex = state.list.findIndex(
            home => home._id === homeWithRoom._id
          );
          state.list[homeIndex].rooms = state.list[homeIndex].rooms.filter(
            room => room._id !== roomId
          );

          if (state.currentHome && state.currentHome._id === homeWithRoom._id) {
            state.currentHome.rooms = state.currentHome.rooms.filter(
              room => room._id !== roomId
            );
          }
        }
      })

      // Fetch automations by home ID cases
      .addCase(fetchAutomationsByHomeId.fulfilled, (state, action) => {
        const { homeId, automations } = action.payload;
        state.automations = automations;
      })

      // Create automation case
      .addCase(createAutomation.fulfilled, (state, action) => {
        state.automations.push(action.payload);
      })

      // Update automation case
      .addCase(updateAutomation.fulfilled, (state, action) => {
        const index = state.automations.findIndex(
          a => a._id === action.payload._id
        );
        if (index !== -1) {
          state.automations[index] = action.payload;
        }
      })

      // Toggle automation status case
      .addCase(toggleAutomationStatus.fulfilled, (state, action) => {
        const index = state.automations.findIndex(
          a => a._id === action.payload._id
        );
        if (index !== -1) {
          state.automations[index] = action.payload;
        }
      })

      // Delete automation case
      .addCase(deleteAutomation.fulfilled, (state, action) => {
        state.automations = state.automations.filter(
          a => a._id !== action.payload
        );
      })

      // Fetch roles case
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      })

      // Fetch home permissions case
      .addCase(fetchHomePermissions.fulfilled, (state, action) => {
        state.homeAccesses = action.payload;
      })
      .addCase(fetchHomePermissions.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch device logs cases
      .addCase(fetchDeviceLogs.fulfilled, (state, action) => {
        state.devicesLogs = action.payload;
      })
      .addCase(fetchDeviceLogs.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch device log by ID cases
      .addCase(fetchDeviceLogById.fulfilled, (state, action) => {
        // This is a single log, we could add it to the logs array if needed
      })

      // Fetch sensor logs cases
      .addCase(fetchSensorLogs.fulfilled, (state, action) => {
        state.sensorsLogs = action.payload;
      })
      .addCase(fetchSensorLogs.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch sensor log by ID cases
      .addCase(fetchSensorLogById.fulfilled, (state, action) => {
        // This is a single log, we could add it to the logs array if needed
      });
  },
});

export const {
  setHomes,
  addHome,
  updateHome,
  deleteHome,
  setCurrentHome,
  clearCurrentHome,
  setError,
  clearError,
} = homesSlice.actions;

/**
 * Зміна поточного будинку без додаткових запитів на сервер
 * @param {string} homeId - ID будинку, який потрібно встановити як поточний
 * @returns {function} - Thunk функція
 */
export const switchCurrentHome = homeId => (dispatch, getState) => {
  const { list } = getState().homes;
  const home = list.find(home => home._id === homeId);

  if (home) {
    dispatch(setCurrentHome(home));
  }
};

export default homesSlice.reducer;
