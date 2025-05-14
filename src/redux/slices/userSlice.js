import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, usersApi, feedbackApi } from '../../services/api';
import { storeRef } from '../storeRef';

const initialState = {
  isAuthenticated: false,
  userData: null,
  error: null,
  isLoading: false,
  passwordReset: {
    emailSent: false,
    resetSuccess: false,
    loading: false,
    error: null,
  },
  admin: {
    users: [],
    isLoading: false,
    error: null,
  },
};

// Async thunks for auth operations
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);
      const userData = data.user ? data.user : data;
      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const verifyAuth = createAsyncThunk(
  'user/verify',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.verify();
      const userData = response.user ? response.user : response;
      return userData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Authentication verification failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send password reset email'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(token, password);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reset password'
      );
    }
  }
);

// Google authentication thunk
export const loginWithGoogle = createAsyncThunk(
  'user/googleLogin',
  async (googleData, { rejectWithValue }) => {
    try {
      const data = await authApi.googleLogin(googleData);
      const userData = data.user ? data.user : data;
      return userData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Google login failed'
      );
    }
  }
);

// User operations thunks
export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await usersApi.getCurrentUser();
      return userData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get current user'
      );
    }
  }
);

export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (id, { rejectWithValue }) => {
    try {
      const userData = await usersApi.getById(id);
      return userData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get user'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const updatedUser = await usersApi.update(id, userData);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user'
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await usersApi.changePassword(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to change password'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await usersApi.delete(id);
      // If deleting the current user, dispatch logout
      if (id === storeRef.getState().user.userData?.id) {
        dispatch(logoutUser());
      }
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  }
);

export const submitFeedback = createAsyncThunk(
  'user/submitFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await feedbackApi.submitFeedback(feedbackData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit feedback'
      );
    }
  }
);

// Admin-related thunks
export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await usersApi.getAllUsers();
      return users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get all users'
      );
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'user/updateUserStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await usersApi.updateUserStatus(id, status);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user status'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserProfile: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    resetPasswordState: state => {
      state.passwordReset = {
        emailSent: false,
        resetSuccess: false,
        loading: false,
        error: null,
      };
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.userData = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Google Login
      .addCase(loginWithGoogle.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.userData = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify
      .addCase(verifyAuth.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.userData = action.payload;
      })
      .addCase(verifyAuth.rejected, state => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.userData = null;
      })
      // Logout
      .addCase(logoutUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.userData = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, state => {
        state.passwordReset.loading = true;
        state.passwordReset.error = null;
        state.passwordReset.emailSent = false;
      })
      .addCase(forgotPassword.fulfilled, state => {
        state.passwordReset.loading = false;
        state.passwordReset.emailSent = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.passwordReset.loading = false;
        state.passwordReset.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, state => {
        state.passwordReset.loading = true;
        state.passwordReset.error = null;
        state.passwordReset.resetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.passwordReset.loading = false;
        state.passwordReset.resetSuccess = true;
        // If the response includes user data and tokens, set the authenticated state
        if (action.payload.user) {
          state.isAuthenticated = true;
          state.userData = action.payload.user;
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordReset.loading = false;
        state.passwordReset.error = action.payload;
      })
      // getCurrentUser
      .addCase(getCurrentUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // getUserById
      .addCase(getUserById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, state => {
        state.isLoading = false;
        // We don't update userData here since this might be for viewing another user
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // updateUser
      .addCase(updateUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update userData only if it's the current user
        if (state.userData && state.userData.id === action.payload.id) {
          state.userData = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // changePassword
      .addCase(changePassword.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // deleteUser
      .addCase(deleteUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, state => {
        state.isLoading = false;
        // If deleting the current user, log them out
        state.isAuthenticated = false;
        state.userData = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get all users (admin)
      .addCase(getAllUsers.pending, state => {
        state.admin.isLoading = true;
        state.admin.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.admin.isLoading = false;
        state.admin.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.admin.isLoading = false;
        state.admin.error = action.payload;
      })
      // Update user status (admin)
      .addCase(updateUserStatus.pending, state => {
        state.admin.isLoading = true;
        state.admin.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.admin.isLoading = false;
        // Update the user in users array
        const updatedUser = action.payload.user;
        const index = state.admin.users.findIndex(
          user => user.id === updatedUser.id
        );
        if (index !== -1) {
          state.admin.users[index] = updatedUser;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.admin.isLoading = false;
        state.admin.error = action.payload;
      });
  },
});

export const { updateUserProfile, setError, clearError, resetPasswordState } =
  userSlice.actions;

export default userSlice.reducer;
