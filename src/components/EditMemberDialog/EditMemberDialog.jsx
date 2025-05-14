import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Box,
  FormControlLabel,
  Switch,
  Grid,
  Tooltip,
  IconButton,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@mui/icons-material/Info';
import { assignRole, fetchHomePermissions } from '../../redux/slices/homesSlice';
import { addNotification } from '../../redux/slices/uiSlice';

const EditMemberDialog = ({ open, onClose, member }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentHome } = useSelector((state) => state.homes);
  const { roles: rolesLoading } = useSelector((state) => state.ui.loaders);
  
  const [formData, setFormData] = useState({
    role: 'guest',
    unlimited: true,
    accessPeriodStart: new Date(),
    accessPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1))
  });

  // Initialize form data when member changes
  useEffect(() => {
    if (member) {
      setFormData({
        role: member.role === 'member' ? 'user' : member.role === 'owner' ? 'owner' : 'guest',
        unlimited: member.unlimited !== false,
        accessPeriodStart: member.accessPeriodStart ? new Date(member.accessPeriodStart) : new Date(),
        accessPeriodEnd: member.accessPeriodEnd ? new Date(member.accessPeriodEnd) : new Date(new Date().setMonth(new Date().getMonth() + 1))
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'unlimited') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (fieldName, newValue) => {
    setFormData(prev => ({ ...prev, [fieldName]: newValue }));
  };

  const handleSubmit = async () => {
    try {
      // Підготовка даних для API
      const assignmentData = {
        homeId: currentHome._id,
        email: member.email || member.user?.email,
        // Маппінг ролей з UI до API
        roleName: formData.role === 'user' ? 'member' : 'guest',
      };

      // Додавання даних про термін доступу, якщо не необмежений
      if (!formData.unlimited && formData.accessPeriodEnd) {
        assignmentData.expiresAt = formData.accessPeriodEnd.toISOString();
      }

      // Виклик Redux action для оновлення ролі учасника
      await dispatch(assignRole(assignmentData)).unwrap();
      
      // Оновлюємо список учасників після успішного редагування
      dispatch(fetchHomePermissions(currentHome._id));
      
      // Показуємо повідомлення про успіх
      dispatch(addNotification({
        type: 'success',
        message: t('home.members.memberUpdatedSuccess')
      }));
      
      // Закриваємо діалог після успішного оновлення
      onClose();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: t('home.members.updateError', { 
          error: error.response?.data?.message || error.message || 'Unknown error' 
        })
      }));
      console.error('Failed to update member:', error);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('home.members.editMemberTitle')}
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          {member.email}
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>{t('home.members.roleLabel')}</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            label={t('home.members.roleLabel')}
            disabled={member.role === 'owner'}
          >
            <MenuItem value="user">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {t('home.members.roles.user')}
                <Tooltip title={t('home.members.rolesTooltip.user')}>
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </MenuItem>
            <MenuItem value="guest">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {t('home.members.roles.guest')}
                <Tooltip title={t('home.members.rolesTooltip.guest')}>
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('home.members.accessPeriodLabel')}
          </Typography>
          
          <FormControlLabel
            control={
              <Switch 
                checked={formData.unlimited} 
                onChange={handleChange} 
                name="unlimited" 
                disabled={member.role === 'owner'}
              />
            }
            label={t('home.members.unlimited')}
          />
        </Box>
        
        {!formData.unlimited && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label={t('home.members.accessPeriodStart')}
                  value={formData.accessPeriodStart}
                  onChange={(newValue) => handleDateChange('accessPeriodStart', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  disabled={member.role === 'owner'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label={t('home.members.accessPeriodEnd')}
                  value={formData.accessPeriodEnd}
                  onChange={(newValue) => handleDateChange('accessPeriodEnd', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  minDate={formData.accessPeriodStart}
                  disabled={member.role === 'owner'}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          {t('home.members.cancelButton')}
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={rolesLoading || member.role === 'owner'}
          startIcon={rolesLoading ? <CircularProgress size={20} /> : null}
        >
          {t('home.members.updateButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMemberDialog; 