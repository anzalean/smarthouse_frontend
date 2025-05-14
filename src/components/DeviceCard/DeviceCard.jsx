import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Switch,
  Divider,
  Stack,
  Tooltip,
  Chip,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateDevice } from '../../redux/slices/homesSlice';
import { getDeviceImage, getDeviceTypeLabel, formatDeviceProperties } from '../../utils/deviceHelpers';

/**
 * Компонент картки пристрою
 * @param {Object} device - Об'єкт пристрою
 * @param {Function} onEdit - Функція для редагування пристрою
 * @param {Function} onDelete - Функція для видалення пристрою
 * @param {string} userRole - Роль користувача в будинку, до якого належить пристрій
 */
const DeviceCard = ({ device, onEdit, onDelete, userRole }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // Отримуємо стан лоадера для зміни статусу девайсу з Redux
  const isStatusToggling = useSelector((state) => state.ui.loaders.deviceStatusToggle);
  
  // State для відстеження зміни ролі
  const [currentRole, setCurrentRole] = useState(userRole);
  
  // Визначаємо чи є користувач власником, використовуючи переданий параметр userRole
  const isOwner = currentRole === 'owner';
  
  // Визначаємо чи є користувач гостем
  const isGuest = currentRole === 'guest';
  
  // useEffect для відстеження змін ролі
  useEffect(() => {
    if (userRole !== currentRole) {
      setCurrentRole(userRole);
    }
  }, [userRole, currentRole]);
  
  const deviceImage = getDeviceImage(device.deviceType);
  const deviceTypeLabel = getDeviceTypeLabel(device.deviceType);
  const deviceProperties = formatDeviceProperties(device);
  
  const handleToggleActive = () => {
    // Якщо вже йде процес перемикання або користувач гість, не робимо нічого
    if (isStatusToggling || isGuest) return;
    
    const newState = !device.isActive;
    
    // Відправляємо дані в Redux з флагом isStatusToggle
    dispatch(updateDevice({
      id: device._id,
      data: { 
        isActive: newState,
        name: device.name,
        roomId: device.roomId
      },
      isStatusToggle: true // Використовуємо окремий лоадер для перемикання статусу
    }));
  };
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(device);
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(device);
    }
  };
  
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        position: 'relative',
      }}
    >
      {/* Зображення пристрою на всю картку (фоном) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <img
          src={deviceImage}
          alt={device.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: device.isActive ? 1 : 0.7,
            transition: 'opacity 0.5s',
          }}
        />
      </Box>
      
      {/* Тип пристрою */}
      <Chip
        label={deviceTypeLabel}
        size="small"
        color="primary"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          fontWeight: 'medium',
          zIndex: 2,
          backdropFilter: 'blur(3px)',
          backgroundColor: 'rgba(25, 118, 210, 0.65)',
        }}
      />
      
      {/* Блок для збереження верхньої області порожньою (як була висота зображення) */}
      <Box sx={{ height: 140, flexShrink: 0 }} />
      
      {/* Інформація про пристрій з ледь помітним фоном */}
      <Box 
        sx={{ 
          p: 2, 
          flexGrow: 1,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(2px)',
          width: '100%',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="h3" fontWeight="bold" noWrap sx={{ textShadow: '0px 0px 2px rgba(255, 255, 255, 0.8)' }}>
            {device.name}
          </Typography>
        </Box>
        
        {!isGuest && (
          <Box 
            mt={1} 
            mb={1} 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.03)',
              borderRadius: 1,
              py: 1,
              position: 'relative',
              cursor: isStatusToggling ? 'wait' : 'pointer',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.07)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={!isStatusToggling ? handleToggleActive : undefined}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={device.isActive || false}
                  onChange={handleToggleActive}
                  disabled={isStatusToggling}
                  color="success"
                  size="medium"
                  sx={{
                    '& .MuiSwitch-switchBase': {
                      margin: 1,
                      padding: 0,
                      transform: 'translateX(6px)',
                      transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&.Mui-checked': {
                        transform: 'translateX(22px)',
                        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        '& + .MuiSwitch-track': {
                          opacity: 1,
                          transition: 'opacity 0.8s',
                        },
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      width: 18,
                      height: 18,
                      transition: 'all 0.8s',
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 26 / 2,
                      transition: 'all 0.8s',
                    },
                  }}
                />
              }
              label={device.isActive ? t('device.on') : t('device.off')}
              labelPlacement="end"
              sx={{ 
                fontWeight: 'medium',
                color: device.isActive ? 'success.main' : 'text.secondary',
                m: 0,
                transition: 'color 0.8s',
                textShadow: '0px 0px 1px rgba(255, 255, 255, 0.6)',
              }}
            />
          </Box>
        )}
        
        <Divider sx={{ my: 1, backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
        
        {/* Властивості пристрою */}
        <Box mt={1.5}>
          {deviceProperties.length > 0 ? (
            deviceProperties.map((prop, index) => (
              <Box key={index} mb={1} display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary" sx={{ textShadow: '0px 0px 1px rgba(255, 255, 255, 0.8)' }}>
                  {prop.label}:
                </Typography>
                <Typography variant="body2" fontWeight="medium" sx={{ textShadow: '0px 0px 1px rgba(255, 255, 255, 0.8)' }}>
                  {prop.value}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ textShadow: '0px 0px 1px rgba(255, 255, 255, 0.8)' }}>
              {t('device.noProperties')}
            </Typography>
          )}
        </Box>
        
        {/* Кнопки управління */}
        <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: 'rgba(0, 0, 0, 0.05)' }}>
          <Stack direction="row" justifyContent="space-between">
            {isOwner && (
              <Box>
                <Tooltip title={t('common.edit')}>
                  <IconButton size="small" onClick={handleEdit} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('common.delete')}>
                  <IconButton size="small" onClick={handleDelete} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            <Chip
              size="small"
              label={device.isActive ? t('device.on') : t('device.off')}
              color={device.isActive ? 'success' : 'default'}
              variant="outlined"
              sx={{ 
                transition: 'all 0.5s',
                backgroundColor: device.isActive 
                  ? 'rgba(46, 125, 50, 0.1)' 
                  : 'rgba(0, 0, 0, 0.04)',
                ml: isOwner ? 0 : 'auto'
              }}
            />
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default DeviceCard; 