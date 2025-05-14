import { createSlice } from '@reduxjs/toolkit';
import {
  forgotPassword,
  resetPassword,
  submitFeedback,
  getAllUsers,
  updateUserStatus,
} from './userSlice';
import { createHome, updateHomeDetails, removeHome } from './homesSlice';

const initialState = {
  loaders: {
    global: false,
    homes: false,
    devices: false,
    deviceStatusToggle: false,
    sensors: false,
    sensorStatusToggle: false,
    rooms: false,
    auth: false,
    passwordReset: false,
    feedback: false,
    saveHome: false,
    removeHome: false,
    automations: false,
    automationStatusToggle: false,
    roles: false,
    homePermissions: false,
    adminUsers: false,
    userStatusUpdate: false,
    deviceLogs: false,
    sensorLogs: false,
  },
  notifications: [
    // Test notifications for demonstration
    // {
    //   id: 1,
    //   type: 'success',
    //   message: 'Welcome to Smart Home!',
    //   timestamp: new Date().toISOString(),
    //   duration: 2000,
    // },
    // {
    //   id: 2,
    //   type: 'info',
    //   message: 'You have 3 new devices available',
    //   timestamp: new Date().toISOString(),
    //   duration: 2000,
    // },
    // {
    //   id: 3,
    //   type: 'warning',
    //   message: 'Battery low in Living Room sensor',
    //   timestamp: new Date().toISOString(),
    //   duration: 2000,
    // },
    // {
    //   id: 4,
    //   type: 'error',
    //   message: 'Connection lost with Garage Door device',
    //   timestamp: new Date().toISOString(),
    //   duration: 2000,
    // },
  ],
  sidebarOpen: true,
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoader: (state, action) => {
      const { name, active } = action.payload;
      state.loaders[name] = active;
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: 'info', // default type
        duration: 2000, // default duration in ms (2 seconds)
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload
      );
    },
    clearNotifications: state => {
      state.notifications = [];
    },
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileMenu: state => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Handle forgot password notifications
      .addCase(forgotPassword.pending, state => {
        state.loaders.passwordReset = true;
      })
      .addCase(forgotPassword.fulfilled, state => {
        state.loaders.passwordReset = false;
        state.notifications.push({
          id: Date.now(),
          type: 'success',
          message: 'Password reset email sent. Please check your inbox.',
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loaders.passwordReset = false;
        state.notifications.push({
          id: Date.now(),
          type: 'error',
          message: action.payload || 'Failed to send password reset email',
          timestamp: new Date().toISOString(),
        });
      })
      // Handle reset password notifications
      .addCase(resetPassword.pending, state => {
        state.loaders.passwordReset = true;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.loaders.passwordReset = false;
        state.notifications.push({
          id: Date.now(),
          type: 'success',
          message: 'Password has been successfully reset.',
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loaders.passwordReset = false;
        state.notifications.push({
          id: Date.now(),
          type: 'error',
          message: action.payload || 'Failed to reset password',
          timestamp: new Date().toISOString(),
        });
      })
      // Handle feedback submission notifications
      .addCase(submitFeedback.pending, state => {
        state.loaders.feedback = true;
      })
      .addCase(submitFeedback.fulfilled, state => {
        state.loaders.feedback = false;
        state.notifications.push({
          id: Date.now(),
          type: 'success',
          message: 'Feedback sent successfully. Thank you for your input!',
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loaders.feedback = false;
        state.notifications.push({
          id: Date.now(),
          type: 'error',
          message: action.payload || 'Failed to send feedback',
          timestamp: new Date().toISOString(),
        });
      })
      // Обробники для роботи з будинками
      .addCase(createHome.pending, state => {
        state.loaders.saveHome = true;
      })
      .addCase(createHome.fulfilled, state => {
        state.loaders.saveHome = false;
      })
      .addCase(createHome.rejected, state => {
        state.loaders.saveHome = false;
      })
      .addCase(updateHomeDetails.pending, state => {
        state.loaders.saveHome = true;
      })
      .addCase(updateHomeDetails.fulfilled, state => {
        state.loaders.saveHome = false;
      })
      .addCase(updateHomeDetails.rejected, state => {
        state.loaders.saveHome = false;
      })
      .addCase(removeHome.pending, state => {
        state.loaders.removeHome = true;
      })
      .addCase(removeHome.fulfilled, state => {
        state.loaders.removeHome = false;
      })
      .addCase(removeHome.rejected, state => {
        state.loaders.removeHome = false;
      })
      // Admin user management actions
      .addCase(getAllUsers.pending, state => {
        state.loaders.adminUsers = true;
      })
      .addCase(getAllUsers.fulfilled, state => {
        state.loaders.adminUsers = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loaders.adminUsers = false;
        state.notifications.push({
          id: Date.now(),
          type: 'error',
          message: action.payload || 'Failed to load users',
          timestamp: new Date().toISOString(),
        });
      })

      .addCase(updateUserStatus.pending, state => {
        state.loaders.userStatusUpdate = true;
      })
      .addCase(updateUserStatus.fulfilled, state => {
        state.loaders.userStatusUpdate = false;
        state.notifications.push({
          id: Date.now(),
          type: 'success',
          message: 'User status updated successfully',
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loaders.userStatusUpdate = false;
        state.notifications.push({
          id: Date.now(),
          type: 'error',
          message: action.payload || 'Failed to update user status',
          timestamp: new Date().toISOString(),
        });
      });
  },
});

export const {
  setLoader,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
