import axios from 'axios';
import { refreshTokenHandler } from '../auth/refreshToken';
import { storeRef } from '../../redux/storeRef';

const API_URL =
  import.meta.env.VITE_REACT_APP_API_URL || 'https://smarthouse-backend.onrender.com/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const setupInterceptors = () => {
  api.interceptors.request.use(
    config => {
      if (config.skipAuthRefresh) {
        delete config.skipAuthRefresh;
        return config;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== '/auth/refresh'
      ) {
        if (refreshTokenHandler.isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshTokenHandler.failedQueue.push({ resolve, reject });
          })
            .then(() => api(originalRequest))
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        refreshTokenHandler.isRefreshing = true;

        try {
          await api.post(
            '/auth/refresh',
            {},
            {
              skipAuthRefresh: true,
            }
          );
          refreshTokenHandler.processQueue(null);
          refreshTokenHandler.isRefreshing = false;
          return api(originalRequest);
        } catch (refreshError) {
          const axiosError = refreshError;
          refreshTokenHandler.processQueue(axiosError);
          refreshTokenHandler.isRefreshing = false;
          if (axiosError.response?.status === 401 && storeRef) {
            // Use dynamic import to avoid circular dependencies
            import('../../redux/slices/userSlice').then(module => {
              storeRef.dispatch(module.logoutUser());
            });
          }
          return Promise.reject(axiosError);
        }
      }

      return Promise.reject(error);
    }
  );
};
