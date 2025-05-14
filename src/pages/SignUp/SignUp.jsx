import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
import { Link as RouterLink } from 'react-router-dom';
import { authApi } from '../../services/api';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';

function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState('');
  const [formModified, setFormModified] = React.useState(false);
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { loginWithGoogle } = useAuth();

  // Оновлена схема валідації з використанням перекладів
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required(t('auth.signup.validation.required.firstName'))
      .min(2, t('auth.signup.validation.minLength.firstName'))
      .max(50, t('auth.signup.validation.maxLength.firstName'))
      .matches(/^[A-Za-z\s-]+$/, t('auth.signup.validation.format.firstName')),

    lastName: Yup.string()
      .required(t('auth.signup.validation.required.lastName'))
      .min(2, t('auth.signup.validation.minLength.lastName'))
      .max(50, t('auth.signup.validation.maxLength.lastName'))
      .matches(/^[A-Za-z\s-]+$/, t('auth.signup.validation.format.lastName')),

    email: Yup.string()
      .required(t('auth.signup.validation.required.email'))
      .email(t('auth.signup.validation.format.email'))
      .max(255, t('auth.signup.validation.maxLength.email')),

    password: Yup.string()
      .required(t('auth.signup.validation.required.password'))
      .min(8, t('auth.signup.validation.minLength.password'))
      .max(50, t('auth.signup.validation.maxLength.password'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        t('auth.signup.validation.format.password')
      ),

    phoneNumber: Yup.string()
      .required(t('auth.signup.validation.required.phone'))
      .test(
        'is-valid-phone',
        t('auth.signup.validation.format.phone'),
        function (value) {
          return /^\+380\d{9}$/.test(value);
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '+380',
    },
    validationSchema,
    validateOnChange: false, // Don't validate on every change
    validateOnBlur: true, // Validate when field loses focus
    onSubmit: async values => {
      setServerError('');
      try {
        await authApi.register(values);
        navigate('/email-verification');
      } catch (error) {
        setServerError(
          error.response?.data?.message || t('auth.signup.registrationFailed')
        );
        console.error('Registration error:', error);
      }
    },
  });

  // Додаємо ефект, щоб переконатися, що номер телефону завжди починається з +380
  useEffect(() => {
    if (
      formik.values.phoneNumber === '' ||
      !formik.values.phoneNumber.startsWith('+380')
    ) {
      formik.setFieldValue('phoneNumber', '+380', false);
    }
  }, [formik.values.phoneNumber, formik.setFieldValue]);

  // Custom handler to track when form is modified
  const handleChange = e => {
    if (!formModified) {
      setFormModified(true);
    }

    // Спеціальна обробка для поля номера телефону
    if (e.target.name === 'phoneNumber') {
      const value = e.target.value;
      // Перевіряємо, щоб завжди був префікс +380
      if (value.startsWith('+380')) {
        formik.handleChange(e);
      } else if (value.length < 4) {
        // Не дозволяємо видалити +380 префікс
        e.preventDefault();
      } else {
        // Якщо користувач видалив префікс, ставимо його знову
        e.target.value = '+380' + value.replace(/^\+380/, '');
        formik.handleChange(e);
      }
    } else {
      formik.handleChange(e);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  // Only show errors if the form has been modified and the field has been touched
  // OR if the submit button has been clicked
  const shouldShowError = fieldName => {
    return (
      (formModified &&
        formik.touched[fieldName] &&
        Boolean(formik.errors[fieldName])) ||
      (submitAttempted && Boolean(formik.errors[fieldName]))
    );
  };

  // Custom submit handler to validate all fields
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitAttempted(true);
    formik.handleSubmit(e);
  };

  // Google login handler
  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setGoogleLoading(true);
      setServerError('');

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

        // Use the same loginWithGoogle function as the login page
        await loginWithGoogle({
          token: tokenResponse.access_token,
          userInfo: userInfo,
        });

        // Navigate is handled by the auth hook already
      } catch (error) {
        setServerError(
          error.response?.data?.message || t('auth.signup.googleSignUpFailed')
        );
        console.error('Google sign up error:', error);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: error => {
      setServerError(t('auth.signup.googleSignUpFailed'));
      console.error('Google sign up error:', error);
    },
  });

  // Прапор України SVG
  const ukraineFlag = (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 800"
      sx={{ width: 24, height: 16, mr: 1 }}
    >
      <rect width="1200" height="400" fill="#005BBB" />
      <rect width="1200" height="400" y="400" fill="#FFD500" />
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overflowX: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
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
        py: 4,
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
            background:
              'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(66, 165, 245, 0.1))',
            borderRadius: '50%',
            animation: `${floatingEffect} 3s infinite ease-in-out`,
          },
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            top: '20%',
            left: '10%',
            animationDelay: '0s',
          }}
        />
        <Box
          sx={{
            width: 150,
            height: 150,
            top: '60%',
            right: '15%',
            animationDelay: '1s',
          }}
        />
        <Box
          sx={{
            width: 80,
            height: 80,
            bottom: '20%',
            left: '20%',
            animationDelay: '2s',
          }}
        />
      </Box>

      <Container component="main" maxWidth="xs" sx={{ zIndex: 2 }}>
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 600, color: 'primary.dark', mb: 2 }}
          >
            {t('auth.signup.title')}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: '100%' }}
          >
            {serverError && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {serverError}
              </Typography>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label={t('auth.signup.nameLabels.firstName')}
                  autoFocus
                  value={formik.values.firstName}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={shouldShowError('firstName')}
                  helperText={
                    shouldShowError('firstName') ? formik.errors.firstName : ''
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label={t('auth.signup.nameLabels.lastName')}
                  name="lastName"
                  autoComplete="family-name"
                  value={formik.values.lastName}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={shouldShowError('lastName')}
                  helperText={
                    shouldShowError('lastName') ? formik.errors.lastName : ''
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label={t('auth.signup.emailLabel')}
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={shouldShowError('email')}
                  helperText={
                    shouldShowError('email') ? formik.errors.email : ''
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label={t('auth.signup.passwordLabel')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={shouldShowError('password')}
                  helperText={
                    shouldShowError('password') ? formik.errors.password : ''
                  }
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label={t('auth.signup.phoneLabel')}
                  type="tel"
                  id="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  error={shouldShowError('phoneNumber')}
                  helperText={
                    shouldShowError('phoneNumber')
                      ? formik.errors.phoneNumber
                      : ''
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {ukraineFlag}
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
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
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting
                ? 'Signing up...'
                : t('auth.signup.registerButton')}
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
              disabled={googleLoading || formik.isSubmitting}
            >
              {googleLoading
                ? t('auth.signup.signingUpWithGoogle')
                : t('auth.signup.googleSignUp')}
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.dark',
                      textDecoration: 'none',
                    },
                  }}
                >
                  {t('auth.signup.alreadyHaveAccount')}{' '}
                  {t('auth.signup.signIn')}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignUp;
