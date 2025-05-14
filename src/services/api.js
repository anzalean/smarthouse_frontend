// Re-export all API services from the modular structure
// This file exists for backward compatibility

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
} from './api/index.js';
