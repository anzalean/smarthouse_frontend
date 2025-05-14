import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LockResetIcon from '@mui/icons-material/LockReset';
import Paper from '@mui/material/Paper';
import Logo from '../../components/Logo/Logo';
import { fadeIn, floatingEffect } from '../../theme/animations';
import { Button, TextField, InputAdornment, IconButton, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../redux/slices/userSlice';

function ResetPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, resetSuccess, error } = useSelector(state => state.user.passwordReset);
  
  // Отримуємо токен з URL параметрів
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  
  // Якщо токену немає і не було успішного скидання, перенаправляємо на сторінку введення емейлу
  useEffect(() => {
    if (!token && !resetSuccess) {
      navigate('/forgot-password');
    }
  }, [token, resetSuccess, navigate]);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Валідація
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let newErrors = { ...errors };

    switch (fieldName) {
      case 'password':
        if (!value) {
          newErrors.password = t('auth.resetPassword.validation.required.password');
        } else if (value.length < 8) {
          newErrors.password = t('auth.resetPassword.validation.minLength.password');
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
          newErrors.password = t('auth.resetPassword.validation.format.password');
        } else {
          newErrors.password = '';
        }

        // Якщо поле підтвердження паролю вже має значення, перевіряємо співпадіння
        if (formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            newErrors.confirmPassword = t('auth.resetPassword.validation.match');
          } else {
            newErrors.confirmPassword = '';
          }
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = t('auth.resetPassword.validation.required.confirmPassword');
        } else if (value !== formData.password) {
          newErrors.confirmPassword = t('auth.resetPassword.validation.match');
        } else {
          newErrors.confirmPassword = '';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Перевіряємо валідність всіх полів перед відправкою
    validateField('password', formData.password);
    validateField('confirmPassword', formData.confirmPassword);
    
    // Перевіряємо чи немає помилок валідації
    if (errors.password || errors.confirmPassword || 
        !formData.password || !formData.confirmPassword) {
      return;
    }
    
    try {
      // Відправляємо запит на скидання паролю
      await dispatch(resetPassword({ 
        token, 
        password: formData.password 
      })).unwrap();
      
      // Після успішного скидання паролю перенаправляємо на головну сторінку або сторінку логіну
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

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
            {t('auth.resetPassword.title')}
          </Typography>
          
          {resetSuccess && (
            <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
              {t('auth.resetPassword.success')}
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('auth.resetPassword.newPasswordLabel')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading || resetSuccess}
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
                      disabled={loading || resetSuccess}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label={t('auth.resetPassword.confirmPasswordLabel')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading || resetSuccess}
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
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      disabled={loading || resetSuccess}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || resetSuccess}
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
              {loading ? t('auth.resetPassword.resetting') : t('auth.resetPassword.submit')}
            </Button>
            
            <Button
              component={RouterLink}
              to="/login"
              fullWidth
              sx={{ mt: 1, textTransform: 'none' }}
            >
              {t('auth.resetPassword.backToLogin')}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ResetPassword; 