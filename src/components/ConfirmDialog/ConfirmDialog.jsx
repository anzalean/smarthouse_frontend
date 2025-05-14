import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  CircularProgress 
} from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Універсальний компонент діалогу підтвердження дій
 * @param {Object} props - Властивості компонента
 * @param {boolean} props.open - Чи відкритий діалог
 * @param {Function} props.onClose - Функція закриття діалогу
 * @param {Function} props.onConfirm - Функція, що викликається при підтвердженні
 * @param {string} props.title - Заголовок діалогу
 * @param {string} props.content - Текст вмісту діалогу
 * @param {string} props.confirmText - Текст кнопки підтвердження
 * @param {string} props.cancelText - Текст кнопки скасування
 * @param {string} props.confirmColor - Колір кнопки підтвердження (primary, error, warning, тощо)
 * @param {boolean} props.loading - Чи відображати індикатор завантаження
 * @param {React.ReactNode} props.icon - Іконка для відображення
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmText,
  cancelText,
  confirmColor = 'primary',
  loading = false,
  icon
}) => {
  const { t } = useTranslation();

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
          {icon && icon}
          <Typography variant="h5" component="span" fontWeight={600} color={`${confirmColor}.main`}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, pb: 2 }}>
        <DialogContentText textAlign="center">
          {content}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3, px: 3 }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          disabled={loading}
          fullWidth
        >
          {cancelText || t('common.cancel')}
        </Button>
        <Button 
          variant="contained" 
          color={confirmColor}
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          fullWidth
        >
          {loading ? t('common.processing') : confirmText || t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 