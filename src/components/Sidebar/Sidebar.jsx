import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography, 
  useTheme,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // eslint-disable-next-line no-unused-vars
  const { logout, user } = useAuth();
  const [activeItem, setActiveItem] = useState('home');

  // Отримуємо поточний дім з Redux
  const { currentHome } = useSelector(state => state.homes);
  
  // Оновлюємо активний елемент на основі поточного шляху
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/help')) {
      setActiveItem('help');
    } else if (path.includes('/feedback')) {
      setActiveItem('feedback');
    } else if (path.includes('/about')) {
      setActiveItem('about');
    } else if (path.includes('/settings')) {
      setActiveItem('settings');
    } else if (path.includes('/automations')) {
      setActiveItem('automations');
    } else if (path.includes('/admin')) {
      setActiveItem('admin');
    } else if (path.includes('/home') || path.includes('/main')) {
      setActiveItem('home');
    }
  }, [location.pathname]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Визначаємо меню-елементи
  const menuItems = [
    { 
      id: 'home', 
      icon: <HomeIcon />, 
      text: t('sidebar.home'), 
      path: currentHome ? `/home/${currentHome.id}` : '/main',
      divider: true
    },
    // { 
    //   id: 'automations', 
    //   icon: <AutoAwesomeIcon />, 
    //   text: t('sidebar.automations'), 
    //   path: '/automations',
    //   divider: true 
    // },
    ...(user?.isAdmin ? [
      { 
        id: 'admin', 
        icon: <AdminPanelSettingsIcon />, 
        text: t('sidebar.admin'), 
        path: '/admin',
        divider: true 
      }
    ] : []),
    { 
      id: 'help', 
      icon: <HelpIcon />, 
      text: t('sidebar.help'), 
      path: '/help',
      divider: false 
    },
    { 
      id: 'feedback', 
      icon: <EmailIcon />, 
      text: t('sidebar.feedback'), 
      path: '/feedback',
      divider: false 
    },
    { 
      id: 'about', 
      icon: <InfoIcon />, 
      text: t('sidebar.about'), 
      path: '/about',
      divider: false 
    },
    { 
      id: 'settings', 
      icon: <SettingsIcon />, 
      text: t('sidebar.settings'), 
      path: '/settings',
      divider: true 
    }
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: 'linear-gradient(180deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
      borderRight: '1px solid rgba(25, 118, 210, 0.1)'
    }}>
      {/* Основний вміст бічної панелі */}
      <List sx={{ 
        width: '100%', 
        flexGrow: 1,
        py: { xs: 1, md: 2 },
        px: { xs: 1, md: 0 }
      }}>
        {menuItems.map((item) => (
          <Box key={item.id}>
            <Tooltip title={item.text} placement="right" arrow>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => handleNavigate(item.path)}
                  selected={activeItem === item.id}
                  sx={{ 
                    borderRadius: { xs: '12px', md: '0 24px 24px 0' },
                    mx: { xs: 1, md: 0 },
                    transition: 'all 0.3s ease',
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: `${theme.palette.primary.main}20`,
                      '&:hover': {
                        backgroundColor: `${theme.palette.primary.main}30`,
                      },
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                      '& .MuiTypography-root': {
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: activeItem === item.id ? 'primary.main' : 'text.secondary',
                    minWidth: 40,
                    transition: 'color 0.3s ease'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: activeItem === item.id ? '600' : '400',
                      color: activeItem === item.id ? 'primary.main' : 'text.primary',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
            {item.divider && <Divider sx={{ my: 1.5, mx: 2, opacity: 0.2, borderColor: 'primary.main' }} />}
          </Box>
        ))}
      </List>
      
      <Box sx={{ 
        mt: 'auto', 
        py: 2,
        px: { xs: 2, md: 0 },
        borderTop: '1px solid rgba(25, 118, 210, 0.1)',
        backgroundColor: 'rgba(25, 118, 210, 0.03)'
      }}>
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'center',
            color: 'text.secondary',
            fontWeight: 500
          }}
        >
          SmartHouse © {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar; 