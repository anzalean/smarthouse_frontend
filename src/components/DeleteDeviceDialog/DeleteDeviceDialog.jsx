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
import { removeDevice } from '../../redux/slices/homesSlice';

const DeleteDeviceDialog = ({ open, onClose, device }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!device) return;
    
    setIsDeleting(true);
    try {
      await dispatch(removeDevice(device._id)).unwrap();
      onClose();
    } catch (error) {
      console.error('Помилка при видаленні пристрою:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Якщо немає пристрою для видалення, не відображаємо діалог
  if (!device) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
        <WarningIcon color="error" />
        {t('device.deleteDevice', 'Видалення пристрою')}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t('device.deleteConfirmation', 'Ви впевнені, що хочете видалити пристрій?')}
          </Typography>
          
          <Typography variant="body1" fontWeight="medium">
            {device.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" mt={1}>
            {t('device.deleteWarning', 'Ця дія не може бути скасована. Всі дані пристрою будуть втрачені.')}
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

export default DeleteDeviceDialog; 