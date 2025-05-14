// Import storeRef from storeRef.js instead of store.js to avoid circular dependencies
import { storeRef } from '../../redux/storeRef';

const processQueue = (error, queue) => {
  queue.forEach(prom => {
    if (error) {
      prom.reject(error);
      // Update Redux state with error
      if (storeRef) {
        const { setError } = require('../../redux/slices/userSlice');
        storeRef.dispatch(
          setError(error.response?.data?.message || 'Authentication failed')
        );
      }
    } else {
      prom.resolve();
    }
  });
  return [];
};

export const refreshTokenHandler = {
  isRefreshing: false,
  failedQueue: [],
  processQueue(error) {
    this.failedQueue = processQueue(error, this.failedQueue);
  },
};
