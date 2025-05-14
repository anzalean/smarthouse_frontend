import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { removeRole, fetchHomePermissions } from '../../redux/slices/homesSlice';
import { addNotification } from '../../redux/slices/uiSlice';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';

const RemoveMemberDialog = ({ open, onClose, member }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentHome } = useSelector((state) => state.homes);
  const { roles: rolesLoading } = useSelector((state) => state.ui.loaders);

  const handleConfirm = async () => {
    try {
      await dispatch(removeRole({ 
        homeId: currentHome._id, 
        userId: member._id || member.user?._id
      })).unwrap();
      
      dispatch(fetchHomePermissions(currentHome._id));
      
      dispatch(addNotification({
        type: 'success',
        message: t('home.members.memberRemovedSuccess')
      }));
      
      onClose();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: t('home.members.removeError', { 
          error: error.response?.data?.message || error.message || 'Unknown error' 
        })
      }));
      console.error('Failed to remove member:', error);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {t('home.members.removeMemberTitle')}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <PersonOffOutlinedIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          
          <Typography variant="subtitle1" align="center" gutterBottom>
            {t('home.members.removeMemberConfirmation')}
          </Typography>
          
          <Typography variant="body1" align="center" fontWeight="bold">
            {member.email}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="error"
          disabled={rolesLoading || member.role === 'owner'}
          startIcon={rolesLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {t('home.members.removeButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveMemberDialog; 