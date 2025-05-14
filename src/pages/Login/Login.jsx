import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Paper from '@mui/material/Paper';
import Logo from '../../components/Logo/Logo';
import { fadeIn, floatingEffect } from '../../theme/animations';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

function Login() {
  const { t } = useTranslation();
  const { login, loginWithGoogle, isLoading } = useAuth();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [error, setError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');

    try {
      await login(formData);
    } catch (error) {
      setError(t('auth.login.invalidCredentials'));
      console.error('Login error:', error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setGoogleLoading(true);
      setError('');

      try {
        // Get user profile with the access token
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        if (!userInfoResponse.ok) {
          throw new Error('Failed to get user info from Google');
        }

        const userInfo = await userInfoResponse.json();

        // Send the access token and user info to backend
        // The backend will need to verify this info differently
        await loginWithGoogle({
          token: tokenResponse.access_token,
          userInfo: userInfo,
        });
      } catch (error) {
        setError(t('auth.login.googleLoginFailed'));
        console.error('Google login error:', error);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: error => {
      setError(t('auth.login.googleLoginFailed'));
      console.error('Google login error:', error);
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
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
      {/* Background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '15vw',
          height: '15vw',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 119, 182, 0.1)',
          animation: `${floatingEffect} 12s infinite ease-in-out`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '15%',
          width: '10vw',
          height: '10vw',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 191, 114, 0.1)',
          animation: `${floatingEffect} 10s infinite ease-in-out 1s`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '20%',
          width: '12vw',
          height: '12vw',
          borderRadius: '50%',
          backgroundColor: 'rgba(168, 235, 18, 0.1)',
          animation: `${floatingEffect} 14s infinite ease-in-out 2s`,
        }}
      />

      <Container
        component="main"
        maxWidth="xs"
        sx={{
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          py: 4,
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
            width: '100%',
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 600, color: 'primary.dark' }}
          >
            {t('auth.login.title')}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: '100%' }}
          >
            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <TextField
              margin="normal"
              variant="outlined"
              required
              fullWidth
              id="email"
              label={t('auth.login.emailLabel')}
              name="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              variant="outlined"
              required
              fullWidth
              name="password"
              label={t('auth.login.passwordLabel')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Grid container>
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{ color: 'primary.main' }}
                >
                  {t('auth.login.forgotPassword')}
                </Link>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
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
                  background:
                    'linear-gradient(120deg, transparent 0%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
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
              disabled={isLoading}
            >
              {isLoading
                ? t('auth.login.signingIn')
                : t('auth.login.loginButton')}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="24px"
                  height="24px"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
              }
              sx={{
                mt: 1,
                mb: 2,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(66, 133, 244, 0.04)',
                },
              }}
              onClick={() => googleLogin()}
              disabled={googleLoading || isLoading}
            >
              {googleLoading
                ? t('auth.login.signingInWithGoogle')
                : t('auth.login.googleLogin')}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('auth.login.newToSmartHouse')}{' '}
                <Link
                  component={RouterLink}
                  to="/signup"
                  variant="body2"
                  sx={{ fontWeight: 600, color: 'primary.main' }}
                >
                  {t('auth.login.createAccount')}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
