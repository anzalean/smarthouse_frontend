import React, { createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  loginUser,
  logoutUser,
  verifyAuth,
  loginWithGoogle,
} from '../redux/slices/userSlice';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  loginWithGoogle: () => {},
  logout: () => {},
  isLoading: false,
  verifyAuth: async () => {},
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(state => state.user.userData);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const isLoading = useSelector(state => state.user.isLoading);

  const login = useCallback(
    async credentials => {
      try {
        await dispatch(loginUser(credentials)).unwrap();
        navigate('/main');
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    [dispatch, navigate]
  );

  const googleLogin = useCallback(
    async idToken => {
      try {
        await dispatch(loginWithGoogle(idToken)).unwrap();
        navigate('/main');
      } catch (error) {
        console.error('Google login error:', error);
        throw error;
      }
    },
    [dispatch, navigate]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [dispatch, navigate]);

  const verify = useCallback(async () => {
    try {
      await dispatch(verifyAuth()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      loginWithGoogle: googleLogin,
      logout,
      isLoading,
      verifyAuth: verify,
    }),
    [user, isAuthenticated, login, googleLogin, logout, isLoading, verify]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
