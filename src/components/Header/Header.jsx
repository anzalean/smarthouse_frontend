import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../Logo/Logo';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import HomeSelector from '../HomeSelector/HomeSelector';
import AddHomeDialog from '../AddHomeDialog/AddHomeDialog';

const Header = ({ onOpenSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isExtraSmallScreen = useMediaQuery('(max-width:360px)');
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  
  // Визначаємо, чи знаходимося ми на привітальній сторінці
  const isWelcomePage = location.pathname === '/';
  
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [openAddHomeDialog, setOpenAddHomeDialog] = useState(false);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);
  const isLanguageMenuOpen = Boolean(languageMenuAnchorEl);
  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);
  
  // Відлагоджувальна інформація
  useEffect(() => {
    
  }, [location.pathname, isWelcomePage, onOpenSidebar, isMobileOrTablet, isSidebarOpen]);
  
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };
  
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
  
  const handleNavigate = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  const handleLogout = async () => {
    await logout();
    handleProfileMenuClose();
  };

  const handleUserSettings = () => {
    navigate('/settings');
    handleProfileMenuClose();
  };

  const handleOpenAddHomeDialog = () => {
    setOpenAddHomeDialog(true);
  };

  const handleCloseAddHomeDialog = () => {
    setOpenAddHomeDialog(false);
  };
  
  const handleSidebarToggle = () => {
    
    if (typeof onOpenSidebar === 'function') {
      onOpenSidebar();
    } else {
      console.error('onOpenSidebar is not a function', onOpenSidebar);
    }
  };

  // Генеруємо ініціали користувача для аватару
  const getUserInitials = () => {
    if (!user) return '';
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };
  
  // Перевіряємо, чи треба показувати кнопку меню
  const shouldShowMenuButton = !isWelcomePage && !!onOpenSidebar && isMobileOrTablet;

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
          {/* Ліва частина - Логотип та кнопка меню (якщо не на привітальній сторінці) */}
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
            {shouldShowMenuButton && (
              <IconButton 
                color={isSidebarOpen ? "error" : "primary"} 
                onClick={handleSidebarToggle}
                disableRipple
                aria-label={isSidebarOpen ? "Закрити меню" : "Відкрити меню"}
                sx={{ 
                  mr: 0.5,
                  width: '40px',
                  height: '40px',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: isSidebarOpen 
                      ? 'rgba(211, 47, 47, 0.08)' 
                      : 'rgba(25, 118, 210, 0.08)',
                  },
                  '&:focus': {
                    outline: 'none',
                  }
                }}
              >
                {isSidebarOpen ? (
                  <CloseIcon sx={{ 
                    transition: 'all 0.2s ease',
                    transform: 'rotate(0deg)',
                    animation: 'rotateAnimation 0.3s ease'
                  }} />
                ) : (
                  <MenuIcon sx={{ 
                    transition: 'all 0.2s ease'
                  }} />
                )}
              </IconButton>
            )}
            
            <Logo />
          </Box>
          
          {/* Права частина - селектор будинків, мова та меню профілю */}
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
            {/* Селектор будинків для авторизованих користувачів */}
            {user && (
              <HomeSelector onAddHomeClick={handleOpenAddHomeDialog} />
            )}
            
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
            
            {/* Користувач/Авторизація */}
            {user ? (
              <>
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
              </>
            ) : (
              <>
                {isMobileOrTablet ? (
                  <>
                    <IconButton
                      color="primary"
                      aria-label="menu"
                      onClick={handleMobileMenuOpen}
                      size="small"
                      sx={{ 
                        ml: isExtraSmallScreen ? 0 : 0.5,
                        width: isExtraSmallScreen ? 32 : 'auto',
                        height: isExtraSmallScreen ? 32 : 'auto',
                      }}
                    >
                      <MenuIcon fontSize={isExtraSmallScreen ? "small" : "small"} />
                    </IconButton>
                    
                    <Menu
                      anchorEl={mobileMenuAnchorEl}
                      open={isMobileMenuOpen}
                      onClose={handleMobileMenuClose}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem onClick={() => handleNavigate('/login')}>
                        <ListItemIcon>
                          <LoginIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t('header.login')} />
                      </MenuItem>
                      <MenuItem onClick={() => handleNavigate('/signup')}>
                        <ListItemIcon>
                          <PersonAddIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={t('header.signUp')} />
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleNavigate('/login')}
                      startIcon={<LoginIcon />}
                      sx={{ 
                        mr: 0.5,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.95rem', lg: '1rem' },
                        py: { xs: 0.5, sm: 1, md: 1.25, lg: 1.5 },
                        px: { xs: 1, sm: 1.5, md: 2, lg: 2.5 }
                      }}
                      size={isMobileOrTablet ? "small" : "medium"}
                    >
                      {t('header.login')}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleNavigate('/signup')}
                      startIcon={<PersonAddIcon />}
                      sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.95rem', lg: '1rem' },
                        py: { xs: 0.5, sm: 1, md: 1.25, lg: 1.5 },
                        px: { xs: 1, sm: 1.5, md: 2, lg: 2.5 }
                      }}
                      size={isMobileOrTablet ? "small" : "medium"}
                    >
                      {t('header.signUp')}
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Діалог додавання будинку */}
      <AddHomeDialog 
        open={openAddHomeDialog} 
        onClose={handleCloseAddHomeDialog} 
      />
    </AppBar>
  );
};

export default Header; 