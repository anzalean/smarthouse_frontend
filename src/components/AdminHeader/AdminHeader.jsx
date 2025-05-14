import {
  AppBar,
  Toolbar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

const AdminHeader = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isExtraSmallScreen = useMediaQuery('(max-width:360px)');
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  
  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const isLanguageMenuOpen = Boolean(languageMenuAnchorEl);
  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);
  
  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchorEl(event.currentTarget);
  };
  
  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchorEl(null);
  };
  
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };
  
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    handleLanguageMenuClose();
  };

  const handleLogout = async () => {
    await logout();
    handleProfileMenuClose();
  };

  const handleUserSettings = () => {
    navigate('/settings');
    handleProfileMenuClose();
  };

  // Генеруємо ініціали користувача для аватару
  const getUserInitials = () => {
    if (!user) return '';
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: '#fff', 
        boxShadow: 'none', 
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
          minWidth: '320px'
        }}
      >
        <Toolbar 
          disableGutters 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            minHeight: { xs: '48px', sm: '56px', md: '64px', lg: '72px' },
            px: { xs: 1, sm: 2 }
          }}
        >
          {/* Ліва частина - Логотип та заголовок адмінки */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              transform: { 
                xs: isExtraSmallScreen ? 'scale(0.7)' : 'scale(0.8)', 
                sm: 'scale(0.9)', 
                md: 'scale(1)', 
                lg: 'scale(1.1)' 
              },
              transformOrigin: 'left center'
            }}
          >
            <Logo />
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              ml: { xs: 1, sm: 2, md: 3 },
              pl: { xs: 1, sm: 2 },
              borderLeft: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <AdminPanelSettingsIcon 
                color="primary" 
                sx={{ mr: 1, fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' } }} 
              />
              <Typography 
                variant="h6" 
                color="primary"
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {t('admin.adminPanel')}
              </Typography>
            </Box>
          </Box>
          
          {/* Права частина - мова та меню профілю */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { 
              xs: isExtraSmallScreen ? 0.1 : 0.25, 
              sm: 1, 
              md: 1.5, 
              lg: 2 
            }
          }}>
            {/* Мова */}
            <IconButton
              color="primary"
              aria-label="language"
              onClick={handleLanguageMenuOpen}
              size={isMobileOrTablet ? "small" : "medium"}
              sx={{ 
                ml: isExtraSmallScreen ? 0 : 0.5,
                width: isExtraSmallScreen ? 32 : 'auto',
                height: isExtraSmallScreen ? 32 : 'auto',
              }}
            >
              <LanguageIcon fontSize={isExtraSmallScreen ? "small" : (isMobileOrTablet ? "small" : "medium")} />
            </IconButton>
            
            <Menu
              anchorEl={languageMenuAnchorEl}
              open={isLanguageMenuOpen}
              onClose={handleLanguageMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => changeLanguage('uk')}>
                Українська
              </MenuItem>
              <MenuItem onClick={() => changeLanguage('en')}>
                English
              </MenuItem>
            </Menu>
            
            {/* Користувач */}
            <IconButton
              onClick={handleProfileMenuOpen}
              color="primary"
              size={isMobileOrTablet ? "small" : "medium"}
              sx={{ 
                ml: isExtraSmallScreen ? 0 : 0.5,
                width: isExtraSmallScreen ? 32 : 'auto',
                height: isExtraSmallScreen ? 32 : 'auto',
              }}
            >
              <Avatar sx={{ 
                bgcolor: 'primary.main', 
                width: { 
                  xs: isExtraSmallScreen ? 24 : 28, 
                  sm: 32, 
                  md: 36, 
                  lg: 40 
                }, 
                height: { 
                  xs: isExtraSmallScreen ? 24 : 28, 
                  sm: 32, 
                  md: 36, 
                  lg: 40 
                },
                fontSize: { 
                  xs: isExtraSmallScreen ? '0.7rem' : '0.8rem', 
                  sm: '0.9rem', 
                  md: '1rem', 
                  lg: '1.1rem' 
                }
              }}>
                {getUserInitials()}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={profileMenuAnchorEl}
              open={isProfileMenuOpen}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleUserSettings}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t('header.userSettings')} />
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t('header.logout')} />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AdminHeader; 