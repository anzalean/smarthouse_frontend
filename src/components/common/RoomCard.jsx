import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  IconButton, 
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { removeRoom } from '../../redux/slices/homesSlice';

/**
 * Компонент картки окремої кімнати
 * @param {Object} room - Об'єкт кімнати
 * @param {Function} onEdit - Функція редагування кімнати
 * @param {Function} onRoomDeleted - Функція оновлення після видалення
 * @param {string} homeRole - Роль користувача в будинку, до якого належить кімната
 */
const RoomCard = ({ room, onEdit, onRoomDeleted, homeRole }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const menuOpen = Boolean(menuAnchorEl);
  
  // State для відстеження зміни ролі
  const [currentRole, setCurrentRole] = useState(homeRole);
  
  // Перевіряємо чи є користувач власником будинку, використовуючи переданий параметр homeRole
  const isOwner = currentRole === 'owner';
  
  // useEffect для відстеження змін ролі
  useEffect(() => {
    if (homeRole !== currentRole) {
      setCurrentRole(homeRole);
    }
  }, [homeRole, currentRole]);

  // Обробники меню - мемоізовані
  const handleOpenMenu = useCallback((event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback((event) => {
    if (event) event.stopPropagation();
    setMenuAnchorEl(null);
  }, []);

  // Обробник для відкриття діалогу підтвердження видалення
  const handleOpenConfirmDelete = useCallback((event) => {
    if (event) event.stopPropagation();
    handleCloseMenu(event);
    setConfirmDeleteOpen(true);
  }, [handleCloseMenu]);

  // Обробник для закриття діалогу підтвердження
  const handleCloseConfirmDelete = useCallback((event) => {
    if (event) event.stopPropagation();
    setConfirmDeleteOpen(false);
  }, []);

  // Обробник видалення кімнати
  const handleDeleteRoom = useCallback((event) => {
    if (event) event.stopPropagation();
    setConfirmDeleteOpen(false);
    
    dispatch(removeRoom(room._id))
      .unwrap()
      .then(() => {
        if (onRoomDeleted) {
          onRoomDeleted();
        }
      });
  }, [dispatch, room._id, onRoomDeleted]);

  // Обробник редагування кімнати
  const handleEditRoom = useCallback((event) => {
    if (event) event.stopPropagation();
    onEdit(room);
    handleCloseMenu();
  }, [onEdit, room, handleCloseMenu]);

  // Обробник переходу до сторінки кімнати
  const handleCardClick = useCallback(() => {
    navigate(`/room/${room._id}`);
  }, [navigate, room._id]);

  // Обираємо зображення для кімнати на основі її типу
  const roomImageSrc = `/images/rooms/${room.type || 'custom'}.jpg`;

  return (
    <>
      <Card 
        onClick={handleCardClick}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s, box-shadow 0.3s',
          cursor: 'pointer',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="160"
            image={roomImageSrc}
            alt={room.name}
            sx={{ objectFit: 'cover' }}
          />
          {isOwner && (
            <IconButton
              onClick={handleOpenMenu}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 1)',
                },
              }}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, padding: 2 }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {room.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(`roomTypes.${room.type}`)}
          </Typography>
        </CardContent>

        {/* Меню дій */}
        <Menu
          anchorEl={menuAnchorEl}
          open={menuOpen}
          onClose={handleCloseMenu}
          onClick={(e) => e.stopPropagation()}
          PaperProps={{
            elevation: 3,
            sx: { minWidth: 180, borderRadius: 2 },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleEditRoom}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('common.edit')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleOpenConfirmDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>{t('common.delete')}</ListItemText>
          </MenuItem>
        </Menu>
      </Card>

      {/* Діалог підтвердження видалення */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCloseConfirmDelete}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 35px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          color: 'error.main',
          pb: 1
        }}>
          <WarningIcon color="error" />
          {t('room.deleteConfirmTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('room.deleteConfirmText', { roomName: room.name })}
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: 'error.main', fontWeight: 'medium' }}>
            {t('common.deleteWarning')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseConfirmDelete}
            color="inherit"
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleDeleteRoom}
            variant="contained"
            color="error"
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomCard; 