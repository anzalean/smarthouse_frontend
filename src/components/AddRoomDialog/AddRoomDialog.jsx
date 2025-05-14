import { useState, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import { createRoom } from '../../redux/slices/homesSlice';

/**
 * Компонент діалогу для додавання нової кімнати
 */
const AddRoomDialog = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentHome = useSelector((state) => state.homes.currentHome);
  const isLoading = useSelector((state) => state.ui.loaders.rooms);

  // Початковий стан форми
  const initialFormState = {
    name: '',
    type: 'livingRoom', // Тип за замовчуванням
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Типи кімнат
  const roomTypes = [
    'livingRoom',
    'bedroom',
    'kitchen',
    'bathroom',
    'hall',
    'office',
    'garage',
    'garden',
    'balcony',
    'terrace',
    'attic',
    'basement',
    'utility',
    'diningRoom',
    'playroom',
    'laundryRoom',
    'guestRoom',
    'pantry',
    'closet',
    'storageRoom',
    'gym',
    'library',
    'mediaRoom',
    'conservatory',
    'sunroom',
    'custom',
  ];

  // Мемоізований обробник зміни полів форми
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Очищення помилки при зміні значення
    setErrors(prev => {
      if (prev[name]) {
        return {
          ...prev,
          [name]: '',
        };
      }
      return prev;
    });
  }, []);

  // Валідація форми
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('validation.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name, t]);

  // Обробник подання форми
  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;
    
    dispatch(
      createRoom({
        homeId: currentHome._id,
        name: formData.name.trim(),
        type: formData.type,
      })
    )
      .unwrap()
      .then(() => {
        // Очищаємо форму після успішного створення
        setFormData(initialFormState);
        setErrors({});
        
        if (onSuccess) {
          onSuccess();
        } else {
          handleClose();
        }
      });
  }, [validateForm, dispatch, currentHome?._id, formData, onSuccess, initialFormState]);

  // Закриття діалогу і очищення форми
  const handleClose = useCallback(() => {
    setFormData(initialFormState);
    setErrors({});
    onClose();
  }, [initialFormState, onClose]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 10px 35px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          {t('room.addRoom')}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('room.addRoomDialogDescription')}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label={t('room.name')}
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              error={Boolean(errors.name)}
              helperText={errors.name}
              autoFocus
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="room-type-label">{t('room.type')}</InputLabel>
              <Select
                labelId="room-type-label"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                label={t('room.type')}
              >
                {roomTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`roomTypes.${type}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box 
              sx={{ 
                mt: 1,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src={`/images/rooms/${formData.type}.jpg`}
                alt={t(`roomTypes.${formData.type}`)}
                sx={{
                  width: '100%',
                  height: '160px',
                  objectFit: 'cover',
                }}
              />
              <Box sx={{ p: 1, bgcolor: 'primary.light', color: 'white' }}>
                <Typography variant="body2">
                  {t(`roomTypes.${formData.type}`)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose} 
          color="inherit"
          disabled={isLoading}
        >
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
        >
          {t('common.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Мемоізуємо компонент для запобігання зайвим рендерам
export default memo(AddRoomDialog); 