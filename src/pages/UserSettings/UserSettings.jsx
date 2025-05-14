import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/Header/Header';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { updateUser, changePassword } from '../../redux/slices/userSlice';
import DeleteAccountModal from '../../components/DeleteAccountModal/DeleteAccountModal';

function UserSettings({ onOpenSidebar, isSidebarOpen }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Заповнення даних користувача
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Очищення повідомлень при зміні вкладки
    setMessage({ type: '', text: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handlePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Повернення до початкових даних
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
    setIsEditing(false);
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('settings.validation.required.firstName');
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('settings.validation.required.lastName');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('settings.validation.required.email');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('settings.validation.format.email');
    }
    
    if (formData.phoneNumber && !/^\+?[0-9\s-()]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = t('settings.validation.format.phoneNumber');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = t('settings.validation.required.currentPassword');
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = t('settings.validation.required.newPassword');
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = t('settings.validation.minLength.password');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(passwordData.newPassword)) {
      newErrors.newPassword = t('settings.validation.format.password');
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = t('settings.validation.required.confirmPassword');
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = t('settings.validation.match');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async () => {
    if (!validateProfileForm()) return;
    
    setLoading(true);
    try {
      // Відправляємо тільки дозволені для зміни поля
      const updatedData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber
        // email не передаємо, бо бекенд не дозволяє це поле оновлювати
      };
      
      // Переконуємося, що ID має рядковий тип як очікує сервер
      const userId = String(user.id);
      
      await dispatch(updateUser({ 
        id: userId, 
        userData: updatedData 
      })).unwrap();
      
      setIsEditing(false);
      setMessage({ 
        type: 'success', 
        text: t('settings.updateSuccess') 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || t('settings.updateError') 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!validatePasswordForm()) return;
    
    setLoading(true);
    try {
      // Переконуємося, що ID має рядковий тип як очікує сервер
      const userId = String(user.id);
      
      await dispatch(changePassword({
        id: userId,
        data: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        }
      })).unwrap();
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMessage({ 
        type: 'success', 
        text: t('settings.passwordUpdateSuccess') 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || t('settings.passwordUpdateError')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  // Генерація ініціалів користувача для аватару
  const getUserInitials = () => {
    if (!user) return '';
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <Box 
      sx={{ 
        display: "flex",
        flexDirection: "column",
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(240, 245, 255, 0.8) 100%)',
      }}
    >
      <Header onOpenSidebar={onOpenSidebar} isSidebarOpen={isSidebarOpen} />
      <Container 
        maxWidth="lg" 
        sx={{ 
          pt: 0,
          px: { xs: 1, sm: 2, md: 0 },
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          mb: { xs: 2, sm: 4, lg: 6 }
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            overflow: "hidden",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "5px",
              background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
            }
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              background: 'rgba(255, 255, 255, 0.8)',
              '& .MuiTab-root': { 
                color: 'text.primary',
                opacity: 0.7,
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                padding: { xs: 1, sm: 2, lg: 3 },
                minHeight: { xs: '48px', sm: 'auto', lg: '64px' },
                '&.Mui-selected': { 
                  color: 'primary.main',
                  opacity: 1,
                  fontWeight: 'bold'
                }
              }
            }}
          >
            <Tab 
              icon={<PersonIcon sx={{ 
                fontSize: { xs: '1.2rem', sm: '1.5rem', lg: '1.8rem' },
                color: activeTab === 0 ? 'primary.main' : 'text.secondary'
              }} />} 
              label={t('settings.tabs.profile')} 
              iconPosition="start"
            />
            <Tab 
              icon={<LockIcon sx={{ 
                fontSize: { xs: '1.2rem', sm: '1.5rem', lg: '1.8rem' },
                color: activeTab === 1 ? 'primary.main' : 'text.secondary'
              }} />} 
              label={t('settings.tabs.security')} 
              iconPosition="start"
            />
          </Tabs>

          {/* Вкладка профілю */}
          {activeTab === 0 && (
            <Box sx={{ p: { xs: 3, sm: 4 } }}>
              {message.text && (
                <Alert 
                  severity={message.type} 
                  sx={{ 
                    mb: 3,
                    fontSize: { lg: '1.1rem' },
                    py: { lg: 1.5 },
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onClose={() => setMessage({ type: '', text: '' })}
                >
                  {message.text}
                </Alert>
              )}
              
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                mb={3}
                flexDirection={{ xs: 'column', sm: 'row' }}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main'
                }}
              >
                <Box display="flex" alignItems="center" mb={{ xs: 2, sm: 0 }} width="100%">
                  <Avatar
                    sx={{ 
                      width: { xs: 70, sm: 85, lg: 110 }, 
                      height: { xs: 70, sm: 85, lg: 110 }, 
                      bgcolor: 'primary.main',
                      fontSize: { xs: '1.5rem', sm: '2rem', lg: '2.5rem' },
                      mr: { xs: 3, lg: 4 },
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                    }}
                  >
                    {getUserInitials()}
                  </Avatar>
                  
                  <Box sx={{ overflow: 'hidden', width: '100%' }}>
                    <Typography 
                      variant="h5" 
                      fontWeight="bold"
                      sx={{ 
                        fontSize: { xs: '1.3rem', sm: '1.6rem', lg: '1.9rem' },
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'primary.dark'
                      }}
                    >
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1.1rem', lg: '1.3rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mt: 0.5
                      }}
                    >
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
                
                {!isEditing && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.2rem', lg: '1.3rem' } }} />}
                    onClick={handleEdit}
                    sx={{
                      mt: { xs: 1, sm: 0 },
                      width: { xs: '100%', sm: 'auto' },
                      fontSize: { xs: '0.9rem', sm: '1rem', lg: '1.1rem' },
                      py: { xs: 1, sm: 1.2, lg: 1.5 },
                      px: { xs: 2, sm: 3, lg: 4 },
                      borderRadius: 2,
                      borderWidth: '1.5px',
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                        borderWidth: '1.5px',
                        borderColor: 'primary.dark',
                        background: 'rgba(25, 118, 210, 0.04)'
                      }
                    }}
                  >
                    {t('settings.editProfile')}
                  </Button>
                )}
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('settings.form.firstName')}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    size={window.innerWidth >= 1200 ? "medium" : "small"}
                    sx={{ 
                      mb: { xs: 1, sm: 0 },
                      '.MuiInputBase-input': {
                        fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' },
                        padding: { xs: '12px 14px', md: '14px 16px', lg: '16px 18px' }
                      },
                      '.MuiInputLabel-root': {
                        fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' }
                      },
                      '.MuiFormHelperText-root': {
                        fontSize: { xs: '0.8rem', md: '0.85rem', lg: '0.9rem' }
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '& fieldset': {
                          borderWidth: '1px',
                        },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('settings.form.lastName')}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    size={window.innerWidth >= 1200 ? "medium" : "small"}
                    sx={{ 
                      mb: { xs: 1, sm: 0 },
                      '.MuiInputBase-input': {
                        fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' },
                        padding: { xs: '12px 14px', md: '14px 16px', lg: '16px 18px' }
                      },
                      '.MuiInputLabel-root': {
                        fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' }
                      },
                      '.MuiFormHelperText-root': {
                        fontSize: { xs: '0.8rem', md: '0.85rem', lg: '0.9rem' }
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '& fieldset': {
                          borderWidth: '1px',
                        },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('settings.form.email')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={true}
                    error={!!errors.email}
                    helperText={isEditing ? t('settings.emailCannotBeChanged') : errors.email}
                    size={window.innerWidth >= 1200 ? "medium" : "small"}
                    sx={{ 
                      mb: { xs: 1, sm: 0 },
                      '.MuiInputBase-input': {
                        fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' },
                        padding: { xs: '12px 14px', md: '14px 16px', lg: '16px 18px' }
                      },
                      '.MuiInputLabel-root': {
                        fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' }
                      },
                      '.MuiFormHelperText-root': {
                        fontSize: { xs: '0.8rem', md: '0.85rem', lg: '0.9rem' }
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '& fieldset': {
                          borderWidth: '1px',
                        },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('settings.form.phoneNumber')}
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                    size={window.innerWidth >= 1200 ? "medium" : "small"}
                    sx={{ 
                      mb: { xs: 1, sm: 0 },
                      '.MuiInputBase-input': {
                        fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' },
                        padding: { xs: '12px 14px', md: '14px 16px', lg: '16px 18px' }
                      },
                      '.MuiInputLabel-root': {
                        fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' }
                      },
                      '.MuiFormHelperText-root': {
                        fontSize: { xs: '0.8rem', md: '0.85rem', lg: '0.9rem' }
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '& fieldset': {
                          borderWidth: '1px',
                        },
                      }
                    }}
                  />
                </Grid>
              </Grid>
              
              {isEditing && (
                <Box 
                  display="flex" 
                  justifyContent="flex-end" 
                  mt={4}
                  gap={2}
                  flexDirection={{ xs: 'column', sm: 'row' }}
                >
                  <Button 
                    variant="outlined" 
                    onClick={handleCancel}
                    disabled={loading}
                    fullWidth={!!(window.innerWidth < 600)}
                    sx={{ 
                      mb: { xs: 1, sm: 0 },
                      fontSize: { xs: '0.9rem', sm: '1rem', lg: '1.1rem' },
                      py: { xs: 1, sm: 1.2, lg: 1.5 },
                      px: { xs: 2, sm: 3, lg: 4 },
                      borderRadius: 2,
                      borderWidth: '1.5px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: '1.5px',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    {t('settings.cancel')}
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleProfileUpdate}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={window.innerWidth >= 1200 ? 24 : 20} color="inherit" /> : null}
                    fullWidth={!!(window.innerWidth < 600)}
                    sx={{ 
                      fontSize: { xs: '0.9rem', sm: '1rem', lg: '1.1rem' },
                      py: { xs: 1, sm: 1.2, lg: 1.5 },
                      px: { xs: 2, sm: 3, lg: 4 },
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 15px rgba(25, 118, 210, 0.3)',
                        background: 'linear-gradient(45deg, #1565c0, #1976d2)'
                      }
                    }}
                  >
                    {loading ? t('settings.saving') : t('settings.saveChanges')}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Вкладка безпеки (зміна паролю) */}
          {activeTab === 1 && (
            <Box sx={{ p: { xs: 3, sm: 4 } }}>
              {message.text && (
                <Alert 
                  severity={message.type} 
                  sx={{ 
                    mb: 3,
                    fontSize: { lg: '1.1rem' },
                    py: { lg: 1.5 },
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onClose={() => setMessage({ type: '', text: '' })}
                >
                  {message.text}
                </Alert>
              )}
              
              <Box sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                mb: 4,
                borderLeft: '4px solid',
                borderColor: 'primary.main'
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem', lg: '1.5rem' },
                    color: 'primary.dark'
                  }}
                >
                  {t('settings.changePassword')}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  paragraph
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', lg: '1rem' }, mb: 3 }}
                >
                  {t('settings.passwordDescription')}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('settings.form.currentPassword')}
                      name="currentPassword"
                      type={showPassword.currentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword}
                      size={window.innerWidth >= 1200 ? "medium" : "small"}
                      sx={{ 
                        mb: { xs: 1, sm: 0 },
                        '.MuiInputBase-input': {
                          fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' },
                          padding: { xs: '12px 14px', md: '14px 16px', lg: '16px 18px' }
                        },
                        '.MuiInputLabel-root': {
                          fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' }
                        },
                        '.MuiFormHelperText-root': {
                          fontSize: { xs: '0.8rem', md: '0.85rem', lg: '0.9rem' }
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '& fieldset': {
                            borderWidth: '1px',
                          },
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => handlePasswordVisibility('currentPassword')}
                              edge="end"
                              size={window.innerWidth >= 1200 ? "medium" : "small"}
                              sx={{ color: 'primary.main' }}
                            >
                              {showPassword.currentPassword ? <VisibilityIcon sx={{ fontSize: { lg: '1.3rem' } }} /> : <VisibilityOffIcon sx={{ fontSize: { lg: '1.3rem' } }} />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('settings.form.newPassword')}
                      name="newPassword"
                      type={showPassword.newPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword}
                      size={window.innerWidth >= 1200 ? "medium" : "small"}
                      sx={{ 
                        mb: { xs: 1, sm: 0 },
                        '.MuiInputBase-input': {
                          fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' },
                          padding: { xs: '12px 14px', md: '14px 16px', lg: '16px 18px' }
                        },
                        '.MuiInputLabel-root': {
                          fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' }
                        },
                        '.MuiFormHelperText-root': {
                          fontSize: { xs: '0.8rem', md: '0.85rem', lg: '0.9rem' }
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '& fieldset': {
                            borderWidth: '1px',
                          },
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => handlePasswordVisibility('newPassword')}
                              edge="end"
                              size={window.innerWidth >= 1200 ? "medium" : "small"}
                              sx={{ color: 'primary.main' }}
                            >
                              {showPassword.newPassword ? <VisibilityIcon sx={{ fontSize: { lg: '1.3rem' } }} /> : <VisibilityOffIcon sx={{ fontSize: { lg: '1.3rem' } }} />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('settings.form.confirmPassword')}
                      name="confirmPassword"
                      type={showPassword.confirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      size={window.innerWidth >= 1200 ? "medium" : "small"}
                      sx={{ 
                        mb: { xs: 1, sm: 0 },
                        '.MuiInputBase-input': {
                          fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' },
                          padding: { xs: '12px 14px', md: '14px 16px', lg: '16px 18px' }
                        },
                        '.MuiInputLabel-root': {
                          fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' }
                        },
                        '.MuiFormHelperText-root': {
                          fontSize: { xs: '0.8rem', md: '0.85rem', lg: '0.9rem' }
                        },
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '& fieldset': {
                            borderWidth: '1px',
                          },
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => handlePasswordVisibility('confirmPassword')}
                              edge="end"
                              size={window.innerWidth >= 1200 ? "medium" : "small"}
                              sx={{ color: 'primary.main' }}
                            >
                              {showPassword.confirmPassword ? <VisibilityIcon sx={{ fontSize: { lg: '1.3rem' } }} /> : <VisibilityOffIcon sx={{ fontSize: { lg: '1.3rem' } }} />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
              
                <Box 
                  display="flex" 
                  justifyContent="flex-end" 
                  mt={4}
                >
                  <Button 
                    variant="contained" 
                    onClick={handlePasswordUpdate}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={window.innerWidth >= 1200 ? 24 : 20} color="inherit" /> : null}
                    fullWidth={!!(window.innerWidth < 600)}
                    sx={{ 
                      fontSize: { xs: '0.9rem', sm: '1rem', lg: '1.1rem' },
                      py: { xs: 1, sm: 1.2, lg: 1.5 },
                      px: { xs: 2, sm: 3, lg: 4 },
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 15px rgba(25, 118, 210, 0.3)',
                        background: 'linear-gradient(45deg, #1565c0, #1976d2)'
                      }
                    }}
                  >
                    {loading ? t('settings.updating') : t('settings.updatePassword')}
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'rgba(255, 245, 245, 0.9)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                borderLeft: '4px solid',
                borderColor: 'error.main'
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight={500}
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '1.1rem', sm: '1.25rem', lg: '1.5rem' },
                    color: 'error.main'
                  }}
                >
                  {t('settings.deleteAccount.title')}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    mb: 3,
                    fontSize: { xs: '0.8rem', sm: '0.9rem', lg: '1rem' } 
                  }}
                >
                  {t('settings.deleteAccount.warning')}
                </Typography>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleOpenDeleteModal}
                  startIcon={<DeleteIcon />}
                  sx={{ 
                    fontSize: { xs: '0.9rem', sm: '1rem', lg: '1.1rem' },
                    py: { xs: 1, sm: 1.2, lg: 1.5 },
                    px: { xs: 2, sm: 3, lg: 4 },
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)'
                    }
                  }}
                >
                  {t('settings.deleteAccount.button')}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
      
      {user && (
        <DeleteAccountModal
          open={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          userId={user.id}
        />
      )}
    </Box>
  );
}

export default UserSettings; 