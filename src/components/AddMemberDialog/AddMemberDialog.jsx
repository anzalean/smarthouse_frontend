import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { assignRole, fetchHomePermissions } from '../../redux/slices/homesSlice';
import { addNotification } from '../../redux/slices/uiSlice';

const AddMemberDialog = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentHome } = useSelector(state => state.homes);
  const { roles: loading } = useSelector(state => state.ui.loaders);
  
  // Стани для форми
  const [formData, setFormData] = useState({
    email: '',
    role: 'user',
    accessType: 'unlimited',
    startDate: null,
    endDate: null
  });
  
  // Стани для помилок валідації
  const [errors, setErrors] = useState({
    email: '',
    startDate: '',
    endDate: ''
  });
  
  // Обробник зміни полів форми
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Скидаємо помилку для зміненого поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Скидаємо дати якщо тип доступу змінено на "необмежений"
    if (name === 'accessType' && value === 'unlimited') {
      setFormData(prev => ({ ...prev, startDate: null, endDate: null }));
      setErrors(prev => ({ ...prev, startDate: '', endDate: '' }));
    }
  };
  
  // Обробник зміни дати
  const handleDateChange = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
    
    // Скидаємо помилку для зміненого поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  // Валідація форми
  const validateForm = () => {
    const newErrors = {};
    
    // Валідація email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired');
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t('validation.emailInvalid');
    }
    
    // Валідація дат якщо тип доступу обмежений
    if (formData.accessType === 'limited') {
      if (!formData.startDate) {
        newErrors.startDate = t('validation.startDateRequired');
      }
      
      if (!formData.endDate) {
        newErrors.endDate = t('validation.endDateRequired');
      }
      
      // Перевірка, що кінцева дата пізніше початкової
      if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
        newErrors.endDate = t('validation.endDateAfterStart');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Обробник відправки форми
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    // Відображення між ролями в UI та API
    const roleMapping = {
      user: 'member',
      guest: 'guest'
    };
    
    // Визначаємо дані для API залежно від типу доступу
    const payload = {
      homeId: currentHome._id,
      email: formData.email,
      roleName: roleMapping[formData.role]
    };
    
    // Додаємо дату закінчення доступу, якщо обрано обмежений доступ
    if (formData.accessType === 'limited' && formData.endDate) {
      payload.expiresAt = formData.endDate.toISOString();
    }
    
    try {
      const resultAction = await dispatch(assignRole(payload));
      
      if (assignRole.fulfilled.match(resultAction)) {
        // Оновлюємо список учасників після успішного додавання
        dispatch(fetchHomePermissions(currentHome._id));
        
        dispatch(addNotification({
          message: t('home.members.addSuccess'),
          type: 'success'
        }));
        handleClose();
      } else if (assignRole.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload || resultAction.error.message;
        dispatch(addNotification({
          message: t('home.members.addError', { error: errorMessage }),
          type: 'error'
        }));
      }
    } catch (error) {
      dispatch(addNotification({
        message: t('home.members.addError', { error: error.message }),
        type: 'error'
      }));
    }
  };
  
  // Очищення форми при закритті
  const handleClose = () => {
    setFormData({
      email: '',
      role: 'user',
      accessType: 'unlimited',
      startDate: null,
      endDate: null
    });
    setErrors({
      email: '',
      startDate: '',
      endDate: ''
    });
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('home.members.addMember')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            name="email"
            label={t('home.members.email')}
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="role-label">{t('home.members.role')}</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              label={t('home.members.role')}
              onChange={handleChange}
            >
              <MenuItem value="user">{t('home.members.roles.user')}</MenuItem>
              <MenuItem value="guest">{t('home.members.roles.guest')}</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel id="access-type-label">{t('home.members.accessType')}</InputLabel>
            <Select
              labelId="access-type-label"
              id="accessType"
              name="accessType"
              value={formData.accessType}
              label={t('home.members.accessType')}
              onChange={handleChange}
            >
              <MenuItem value="unlimited">{t('home.members.unlimited')}</MenuItem>
              <MenuItem value="limited">{t('home.members.limited')}</MenuItem>
            </Select>
          </FormControl>
          
          {formData.accessType === 'limited' && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <DatePicker
                  label={t('home.members.startDate')}
                  value={formData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "dense",
                      error: !!errors.startDate,
                      helperText: errors.startDate
                    }
                  }}
                />
                
                <DatePicker
                  label={t('home.members.endDate')}
                  value={formData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "dense",
                      error: !!errors.endDate,
                      helperText: errors.endDate
                    }
                  }}
                />
              </Box>
            </LocalizationProvider>
          )}
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {formData.role === 'user' 
              ? t('home.members.userDescription')
              : t('home.members.guestDescription')
            }
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? t('common.adding') : t('common.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberDialog; 