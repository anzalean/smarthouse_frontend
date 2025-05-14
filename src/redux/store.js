import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import homesReducer from './slices/homesSlice';
import uiReducer from './slices/uiSlice';
import { setStoreRef } from './storeRef';

export const store = configureStore({
  reducer: {
    user: userReducer,
    homes: homesReducer,
    ui: uiReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['user/login/fulfilled', 'user/verify/fulfilled'],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['user.userData'],
      },
    }),
});

// Set the store reference
setStoreRef(store);
