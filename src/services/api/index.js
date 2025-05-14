import { api, setupInterceptors } from './apiClient.js';
import { authApi } from './authApi.js';
import { usersApi } from './usersApi.js';
import { feedbackApi } from './feedbackApi.js';
import { homesApi } from './homesApi.js';
import { devicesApi } from './devicesApi.js';
import { sensorsApi } from './sensorsApi.js';
import { roomsApi } from './roomsApi.js';
import { automationsApi } from './automationsApi.js';
import { rolesApi } from './rolesApi.js';
import { logsApi } from './logsApi.js';

// Initialize interceptors
setupInterceptors();

export {
  api,
  authApi,
  usersApi,
  feedbackApi,
  homesApi,
  devicesApi,
  sensorsApi,
  roomsApi,
  automationsApi,
  rolesApi,
  logsApi,
};
