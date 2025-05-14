import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { removeSensor } from '../../redux/slices/homesSlice';

const DeleteSensorDialog = ({ open, onClose, sensor }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!sensor) return;
    
    setIsDeleting(true);
    try {
      await dispatch(removeSensor(sensor._id)).unwrap();
      onClose();
    } catch (error) {
      console.error('Помилка при видаленні сенсора:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Якщо немає сенсора для видалення, не відображаємо діалог
  if (!sensor) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
        <WarningIcon color="error" />
        {t('sensor.deleteSensor', 'Видалення сенсора')}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t('sensor.deleteConfirmation', 'Ви впевнені, що хочете видалити сенсор?')}
          </Typography>
          
          <Typography variant="body1" fontWeight="medium">
            {sensor.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" mt={1}>
            {t('sensor.deleteWarning', 'Ця дія не може бути скасована. Всі дані сенсора будуть втрачені.')}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit" 
          disabled={isDeleting}
        >
          {t('common.cancel', 'Скасувати')}
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t('common.delete', 'Видалити')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSensorDialog; 