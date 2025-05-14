import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LockResetIcon from '@mui/icons-material/LockReset';
import Paper from '@mui/material/Paper';
import Logo from '../../components/Logo/Logo';
import { fadeIn, floatingEffect } from '../../theme/animations';
import { Button, TextField, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../redux/slices/userSlice';

function ForgotPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, emailSent, error } = useSelector(state => state.user.passwordReset);
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валідація
    if (!email) {
      setEmailError(t('auth.forgotPassword.validation.required.email'));
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(t('auth.forgotPassword.validation.format.email'));
      return;
    }

    try {
      await dispatch(forgotPassword(email)).unwrap();
      // Очищаємо форму після успішного надсилання
      setEmail('');
      setEmailError('');
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  // Очищаємо стан emailSent при монтуванні компонента
  useEffect(() => {
    return () => {
      dispatch({ type: 'user/clearPasswordResetState' });
    };
  }, [dispatch]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowX: 'hidden',
        background: `
          linear-gradient(
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0.9)
          ),
          url('/hero-house-bg.svg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      {/* Декоративні елементи */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          '& > div': {
            position: 'absolute',
            background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(66, 165, 245, 0.1))',
            borderRadius: '50%',
            animation: `${floatingEffect} 3s infinite ease-in-out`,
          },
        }}
      >
        <Box sx={{ width: 100, height: 100, top: '20%', left: '10%', animationDelay: '0s' }} />
        <Box sx={{ width: 150, height: 150, top: '60%', right: '15%', animationDelay: '1s' }} />
        <Box sx={{ width: 80, height: 80, bottom: '20%', left: '20%', animationDelay: '2s' }} />
      </Box>

      <Container 
        maxWidth="xs"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100vh',
          pt: 0,
          px: { xs: 1, sm: 2 }
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            animation: `${fadeIn} 0.6s ease-out`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Logo />
          </Box>

          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockResetIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 600, color: 'primary.dark', mb: 3 }}>
            {t('auth.forgotPassword.title')}
          </Typography>
          
          {emailSent ? (
            <>
              <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
                {t('auth.forgotPassword.emailSent')}
              </Alert>
              <Button
                component={RouterLink}
                to="/login"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.2,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  borderRadius: 2,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                }}
              >
                {t('auth.forgotPassword.backToLogin')}
              </Button>
            </>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('auth.forgotPassword.instruction')}
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('auth.forgotPassword.emailLabel')}
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleChange}
                error={!!emailError}
                helperText={emailError}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.2,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  borderRadius: 2,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(120deg, transparent 0%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s ease-in-out',
                  },
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    '&::before': {
                      transform: 'translateX(100%)',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                  },
                }}
              >
                {loading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.submit')}
              </Button>
              
              <Button
                component={RouterLink}
                to="/login"
                fullWidth
                sx={{ mt: 1, textTransform: 'none' }}
              >
                {t('auth.forgotPassword.backToLogin')}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default ForgotPassword; 