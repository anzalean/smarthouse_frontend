import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { deleteUser } from '../../redux/slices/userSlice';
import { useTranslation } from 'react-i18next';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const DeleteAccountModal = ({ open, onClose, userId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Викликаємо Redux Action для видалення облікового запису
      await dispatch(deleteUser(userId)).unwrap();
      // Закриваємо модальне вікно після успішного видалення
      onClose();
    } catch (error) {
      setError(error.message || t('settings.deleteAccount.error'));
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 1
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
          <DeleteForeverIcon color="error" sx={{ fontSize: 48 }} />
          <Typography variant="h5" component="span" fontWeight={600} color="error.main">
            {t('settings.deleteAccount.title')}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, pb: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <DialogContentText textAlign="center">
          {t('settings.deleteAccount.warning')}
        </DialogContentText>
        <DialogContentText textAlign="center" sx={{ mt: 2, fontWeight: 500 }}>
          {t('settings.deleteAccount.confirmation')}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3, px: 3 }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          disabled={loading}
          fullWidth
        >
          {t('settings.cancel')}
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleDeleteAccount}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          fullWidth
        >
          {loading ? t('settings.deleteAccount.deleting') : t('settings.deleteAccount.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountModal; 