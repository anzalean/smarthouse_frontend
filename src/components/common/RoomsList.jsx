import { useState, useCallback, memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Grid, Box, Typography, Paper, useMediaQuery } from '@mui/material';
import RoomCard from './RoomCard';
import AddRoomCard from './AddRoomCard';
import EditRoomDialog from '../EditRoomDialog/EditRoomDialog';

/**
 * Компонент для відображення списку кімнат у вигляді карток
 * @param {Function} onRefreshRooms - Функція для оновлення списку кімнат
 * @param {string} homeRole - Роль користувача в поточному будинку
 */
const RoomsList = ({ onRefreshRooms, homeRole }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width:499px)');
  const isTablet = useMediaQuery('(min-width:500px) and (max-width:799px)');
  const isDesktop = useMediaQuery('(min-width:800px) and (max-width:1199px)');
  const isWideDesktop = useMediaQuery('(min-width:1200px)');

  const currentHome = useSelector((state) => state.homes.currentHome);
  const rooms = currentHome?.rooms || [];
  const [editRoom, setEditRoom] = useState(null);
  
  // Визначаємо роль користувача - пріоритетно з пропсів, якщо немає - з Redux
  const role = homeRole || currentHome?.role;
  
  // Перевірка чи є користувач власником будинку
  const isOwner = role === 'owner';
  
  // State для відстеження зміни ролі
  const [currentRole, setCurrentRole] = useState(role);
  
  // useEffect для відстеження змін ролі
  useEffect(() => {
    if (role !== currentRole) {
      setCurrentRole(role);
    }
  }, [role, currentRole, currentHome]);

  // Визначаємо ширину елемента сітки залежно від розміру екрана
  const getGridSize = () => {
    if (isMobile) return 6; // 2 елементи в ряд (12/6 = 2)
    if (isTablet) return 4; // 3 елементи в ряд (12/4 = 3)
    if (isDesktop) return 3; // 4 елементи в ряд (12/3 = 4)
    if (isWideDesktop) return 2.4; // 5 елементів в ряд (12/2.4 = 5)
    return 3; // За замовчуванням 4 елементи в ряд
  };

  const gridSize = getGridSize();

  // Мемоізований обробник для відкриття діалогу редагування кімнати
  const handleEditRoom = useCallback((room) => {
    setEditRoom(room);
  }, []);

  // Обробник закриття діалогу редагування
  const handleCloseEditDialog = useCallback(() => {
    setEditRoom(null);
  }, []);

  // Обробник успішного оновлення
  const handleRoomUpdated = useCallback(() => {
    setEditRoom(null);
    if (onRefreshRooms) {
      onRefreshRooms();
    }
  }, [onRefreshRooms]);

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        {rooms.map((room) => (
          <Grid item xs={gridSize} key={room._id}>
            <RoomCard 
              room={room} 
              onEdit={handleEditRoom}
              onRoomDeleted={onRefreshRooms}
              homeRole={role}
            />
          </Grid>
        ))}
        
        {/* Кнопка додавання нової кімнати */}
        {isOwner && (
          <Grid item xs={gridSize}>
            <AddRoomCard homeId={currentHome?._id} onRoomAdded={onRefreshRooms} />
          </Grid>
        )}
        
        {/* Показуємо повідомлення, якщо в будинку немає кімнат */}
        {rooms.length === 0 && (
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                border: '1px dashed rgba(0, 0, 0, 0.1)'
              }}
            >
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {t('home.noRooms')}
              </Typography>
              
              {isOwner && (
                <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 500, cursor: 'pointer' }}>
                  {t('home.addFirstRoom')}
                </Typography>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Діалог редагування кімнати */}
      {editRoom && (
        <EditRoomDialog
          open={Boolean(editRoom)}
          room={editRoom}
          homeId={currentHome?._id}
          onClose={handleCloseEditDialog}
          onSuccess={handleRoomUpdated}
        />
      )}
    </Box>
  );
};

// Мемоізуємо компонент для запобігання зайвим рендерам
export default memo(RoomsList); 