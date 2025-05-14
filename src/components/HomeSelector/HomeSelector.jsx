import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchHomeById, removeHome } from '../../redux/slices/homesSlice';
import { formatAddress } from '../../utils/formatters';
import { useMediaQuery, useTheme } from '@mui/material';

const HomeSelector = ({ onAddHomeClick }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { list: homes = [], currentHome } = useSelector((state) => state.homes || { list: [] });
  const { homes: isLoading, removeHome: isDeleting } = useSelector(state => state.ui.loaders);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedHomeId, setSelectedHomeId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [homeToDelete, setHomeToDelete] = useState(null);
  
  const open = Boolean(anchorEl);
  const menuOpen = Boolean(menuAnchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHomeSelect = (homeId) => {
    dispatch(fetchHomeById(homeId))
      .unwrap()
      .then(() => {
        // Після успішного отримання даних про будинок, закриваємо меню і переходимо на сторінку
        handleClose();
        
        // Перенаправляємо на сторінку будинку з повним перезавантаженням даних
        const url = `/home/${homeId}`;
        if (window.location.pathname.includes('/home/')) {
          // Якщо вже на сторінці будинку, перезавантажуємо
          window.location.href = url;
        } else {
          // Якщо на іншій сторінці, використовуємо навігацію React
          navigate(url);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch home:', error);
      });
  };

  const handleAddHome = () => {
    handleClose();
    onAddHomeClick();
  };
  
  // Обробник відкриття контекстного меню будинку
  const handleHomeMenuOpen = (event, homeId) => {
    event.stopPropagation(); // Зупиняємо всплиття події, щоб не вибирався будинок
    setMenuAnchorEl(event.currentTarget);
    setSelectedHomeId(homeId);
  };
  
  // Обробник закриття контекстного меню будинку
  const handleHomeMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Обробник відкриття діалогу видалення
  const handleDeleteDialogOpen = () => {
    // Знаходимо будинок за ID
    const home = homes.find(h => h._id === selectedHomeId);
    setHomeToDelete(home);
    setDeleteDialogOpen(true);
    handleHomeMenuClose();
  };
  
  // Обробник закриття діалогу видалення
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setHomeToDelete(null);
  };
  
  // Обробник видалення будинку
  const handleDeleteHome = () => {
    if (homeToDelete && homeToDelete._id) {
      dispatch(removeHome(homeToDelete._id));
      handleDeleteDialogClose();
    }
  };

  // Новий обробник для переходу на сторінку редагування будинку
  const handleEditHome = () => {
    navigate(`/home/${selectedHomeId}/edit`);
    handleHomeMenuClose();
  };

  // Функція для перевірки чи є користувач власником будинку
  const isHomeOwner = (home) => {
    return home.role === 'owner';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        onClick={handleClick}
        color="primary"
        variant="outlined"
        size={isMobile ? "small" : "medium"}
        startIcon={<HomeIcon sx={{ fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem', lg: '1.4rem' }}} />}
        endIcon={
          isLoading ? (
            <CircularProgress size={isMobile ? 10 : 16} color="inherit" />
          ) : (
            <Box
              component="span"
              sx={{
                width: 0,
                height: 0,
                borderLeft: { xs: '3px solid transparent', md: '4px solid transparent' },
                borderRight: { xs: '3px solid transparent', md: '4px solid transparent' },
                borderTop: { xs: '3px solid currentColor', md: '4px solid currentColor' },
                transition: 'transform 0.3s',
                transform: open ? 'rotate(180deg)' : 'rotate(0)',
              }}
            />
          )
        }
        sx={{
          borderRadius: 2,
          px: { xs: 0.3, sm: 0.75, md: 1.5, lg: 2 },
          py: { xs: 0.2, sm: 0.3, md: 0.5, lg: 0.75 },
          textTransform: 'none',
          minWidth: { xs: 60, sm: 100, md: 150, lg: 180 },
          maxWidth: { xs: 80, sm: 120, md: 200, lg: 250 },
          '& .MuiButton-startIcon': {
            mr: { xs: 0.2, sm: 0.5, md: 0.75, lg: 1 },
            '& svg': {
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem', lg: '1.2rem' }
            }
          },
          whiteSpace: 'nowrap',
          fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.8rem', lg: '0.9rem' }
        }}
      >
        <Typography
          component="span"
          sx={{
            overflow: (currentHome && currentHome.name && currentHome.name.length <= 12) ? 'visible' : 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
            textAlign: 'left',
            maxWidth: { xs: 40, sm: 60, md: 120, lg: 180 },
            fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.8rem', lg: '0.9rem' }
          }}
        >
          {isLoading ? t('common.loading') : (currentHome ? currentHome.name : t('addHome.title'))}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 5,
          sx: {
            minWidth: { xs: 150, sm: 300, md: 350 },
            maxWidth: { xs: 250, sm: 400, md: 450 },
            mt: 1,
            borderRadius: 2,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.15))',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: { xs: 14, sm: 24 },
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {homes?.length > 0 ? (
          <>
            {homes.map((home) => (
              <MenuItem
                key={home._id}
                onClick={() => handleHomeSelect(home._id)}
                selected={currentHome?._id === home._id}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  pr: { xs: 4, sm: 5 },
                  pl: { xs: 1.5, sm: 2 },
                  borderRadius: 1,
                  m: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.12)',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  },
                  position: 'relative',
                }}
              >
                <ListItemIcon sx={{ minWidth: { xs: 30, sm: 36 } }}>
                  <HomeIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: { xs: '80%', sm: '85%', md: '90%' },
                        fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                      }}
                    >
                      {home.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                        mt: 0.5,
                        maxWidth: { xs: '100%', sm: '250px', md: '300px' },
                        fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }
                      }}
                    >
                      {formatAddress(home, t)}
                    </Typography>
                  }
                />
                {isHomeOwner(home) && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleHomeMenuOpen(e, home._id)}
                    sx={{ 
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      opacity: 0.7,
                      p: 0.5,
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                      '&:hover': {
                        opacity: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.08)',
                      },
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                )}
              </MenuItem>
            ))}
            <Divider sx={{ my: 0.5 }} />
          </>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('home.noHomes')}
            </Typography>
          </Box>
        )}
        <MenuItem
          onClick={handleAddHome}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            m: 0.5,
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'rgba(25, 118, 210, 0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <AddIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" color="primary">
                {t('addHome.title')}
              </Typography>
            }
          />
        </MenuItem>
      </Menu>
      
      {/* Контекстне меню для будинку (з кнопками Редагувати/Видалити) */}
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleHomeMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 150,
            borderRadius: 2,
            mt: 0.5,
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)'
          },
        }}
      >
        <MenuItem onClick={handleEditHome}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('common.edit')} />
        </MenuItem>
        <MenuItem onClick={handleDeleteDialogOpen}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary={t('common.delete')}
            primaryTypographyProps={{ sx: { color: 'error.main' } }}
          />
        </MenuItem>
      </Menu>
      
      {/* Діалог підтвердження видалення будинку */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 400,
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          fontWeight: 'medium',
          color: 'error.main'
        }}>
          {t('home.deleteHome.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('home.deleteHome.confirmation')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteDialogClose} variant="outlined">
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleDeleteHome} 
            variant="contained" 
            color="error"
            disableElevation
            disabled={isDeleting}
            endIcon={isDeleting && <CircularProgress size={16} color="inherit" />}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomeSelector; 