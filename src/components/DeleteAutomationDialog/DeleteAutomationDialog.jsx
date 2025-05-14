import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import { deleteAutomation } from '../../redux/slices/homesSlice';
import { Warning, Close } from '@mui/icons-material';
import { scaleIn, fadeIn } from '../../theme/animations';
import { useTranslation } from 'react-i18next';

const DeleteAutomationDialog = ({ open, onClose, automation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const handleDelete = async () => {
    try {
      await dispatch(deleteAutomation(automation._id)).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to delete automation:', error);
    }
  };

  if (!automation) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          animation: `${scaleIn} 0.3s ease-out forwards`,
          overflow: 'visible',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          maxWidth: '450px',
          width: { xs: 'calc(100% - 32px)', sm: '100%' },
          m: { xs: 1, sm: 2 },
          p: { xs: 0.5, sm: 1 }
        }
      }}
      fullWidth={isXsScreen}
      maxWidth="xs"
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: { xs: 8, sm: 16 },
          top: { xs: 8, sm: 16 },
          padding: { xs: '4px', sm: '8px' },
          color: 'text.secondary',
          transition: 'all 0.2s',
          '&:hover': {
            color: 'error.main',
            transform: 'rotate(90deg)',
          }
        }}
      >
        <Close fontSize={isXsScreen ? "small" : "medium"} />
      </IconButton>

      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 2, sm: 3 },
          pb: { xs: 1, sm: 2 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Warning 
          sx={{ 
            fontSize: { xs: 50, sm: 70 }, 
            color: 'error.main',
            mb: { xs: 1, sm: 2 },
            animation: `${fadeIn} 0.5s forwards`,
            opacity: 0.9
          }} 
        />
        <DialogTitle sx={{ p: 0, mb: { xs: 1, sm: 2 }, textAlign: 'center' }}>
          <Typography 
            variant="h5" 
            color="error.main" 
            fontWeight={600}
            fontSize={{ xs: '1.25rem', sm: '1.5rem' }}
          >
            {t('automation.deleteTitle')}
          </Typography>
        </DialogTitle>
      </Box>
      
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: 0 }}>
        <Typography
          textAlign="center"
          sx={{ 
            mb: 1,
            animation: `${fadeIn} 0.6s forwards`,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            wordBreak: 'break-word',
          }}
        >
          {t('automation.deleteConfirmationWithName', { name: automation?.name })}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ 
            animation: `${fadeIn} 0.7s forwards`,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        >
          {t('automation.deleteWarning')}
        </Typography>
      </DialogContent>
      
      <DialogActions 
        sx={{ 
          justifyContent: 'center', 
          p: { xs: 2, sm: 3 }, 
          pt: { xs: 1, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Button 
          onClick={onClose}
          variant="outlined"
          fullWidth={isXsScreen}
          sx={{
            borderRadius: 2,
            px: { xs: 2, sm: 3 },
            py: { xs: 0.75, sm: 1 },
            minWidth: { xs: '100%', sm: '120px' },
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            fontWeight: 500,
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.primary,
            transition: 'all 0.2s',
            order: { xs: 2, sm: 1 },
            '&:hover': {
              borderColor: theme.palette.grey[400],
              backgroundColor: theme.palette.grey[100],
            }
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleDelete} 
          color="error" 
          variant="contained"
          fullWidth={isXsScreen}
          sx={{
            borderRadius: 2,
            px: { xs: 2, sm: 3 },
            py: { xs: 0.75, sm: 1 },
            minWidth: { xs: '100%', sm: '120px' },
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
            transition: 'all 0.2s',
            order: { xs: 1, sm: 2 },
            '&:hover': {
              boxShadow: '0 6px 15px rgba(211, 47, 47, 0.4)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAutomationDialog; 