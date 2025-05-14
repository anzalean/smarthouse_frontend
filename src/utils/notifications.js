import { store } from '../redux/store';
import { addNotification } from '../redux/slices/uiSlice';

/**
 * Helper functions to dispatch notifications from anywhere in the app
 */

export const showNotification = (message, options = {}) => {
  store.dispatch(
    addNotification({
      message,
      ...options,
    })
  );
};

export const showSuccessNotification = (message, options = {}) => {
  showNotification(message, { type: 'success', ...options });
};

export const showInfoNotification = (message, options = {}) => {
  showNotification(message, { type: 'info', ...options });
};

export const showWarningNotification = (message, options = {}) => {
  showNotification(message, { type: 'warning', ...options });
};

export const showErrorNotification = (message, options = {}) => {
  showNotification(message, { type: 'error', ...options });
};
