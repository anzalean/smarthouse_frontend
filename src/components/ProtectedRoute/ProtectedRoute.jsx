import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { verifyAuth } from '../../redux/slices/userSlice';
import { fetchHomes } from '../../redux/slices/homesSlice';
import { useAuth } from '../../hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ProtectedRoute = ({ children }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isUserLoading = useSelector(state => state.user.isLoading);
  const { homes: isHomesLoading } = useSelector(state => state.ui.loaders);
  const { list: homes } = useSelector(state => state.homes);
  const [isVerifying, setIsVerifying] = useState(!user);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!user) {
        await dispatch(verifyAuth());
      }
      setIsVerifying(false);
    };

    verify();
  }, [user, dispatch]);

  // Завантажуємо будинки при успішній авторизації
  useEffect(() => {
    if (user && !isVerifying) {
      dispatch(fetchHomes());
    }
  }, [user, isVerifying, dispatch]);

  // Ефект для відстеження загального стану завантаження
  useEffect(() => {
    const shouldShowLoader = isUserLoading || isVerifying || (isHomesLoading && isInitialLoad);
    setIsLoading(shouldShowLoader);
  }, [isUserLoading, isVerifying, isHomesLoading, isInitialLoad]);

  // Ефект для відстеження першого завантаження будинків
  useEffect(() => {
    if (!isHomesLoading && homes && homes.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isHomesLoading, homes, isInitialLoad]);

  // Показуємо лоадер під час початкового завантаження або верифікації
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(240, 245, 255, 0.8) 100%)',
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" mt={2}>
          {t('common.loading')}
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
