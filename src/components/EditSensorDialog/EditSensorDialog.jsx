import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  Chip,
  Alert,
  AlertTitle,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { updateSensor } from '../../redux/slices/homesSlice';
import { getSensorTypeLabel, getSensorSpecificFields } from '../../utils/sensorHelpers';
import { dangerousSensorValues } from '../../utils/dangerousSensorValues';

// Функція для валідації полів сенсора
const validateSensorField = (fieldName, value, fieldConfig = {}, t) => {
  // Валідація назви сенсора
  if (fieldName === 'name') {
    if (!value || !value.trim()) return t('sensor.validation.required.name', 'Назва обов\'язкова');
    if (value.trim().length < 2) return t('sensor.validation.minLength.name', 'Назва повинна бути не менше 2 символів');
    if (value.trim().length > 50) return t('sensor.validation.maxLength.name', 'Назва повинна бути не більше 50 символів');
    return '';
  }
  
  // Валідація значень порогу температури
  if (fieldName === 'dangerousTemperaturePlus' || fieldName === 'dangerousTemperatureMinus' || 
      fieldName === 'currentTemperature') {
    if (value === undefined || value === '') {
      if (fieldConfig.required) {
        return t('sensor.validation.required.temperature', 'Температура обов\'язкова');
      }
      return '';
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return t('sensor.validation.format.temperature', 'Температура повинна бути числом');
    }
    
    if (fieldName === 'dangerousTemperaturePlus' && numValue <= 0) {
      return t('sensor.validation.range.temperaturePlus', 'Небезпечна температура повинна бути більше 0');
    }
    
    if (fieldName === 'dangerousTemperatureMinus' && numValue >= 0) {
      return t('sensor.validation.range.temperatureMinus', 'Небезпечна температура повинна бути менше 0');
    }
    
    return '';
  }
  
  // Валідація значень вологості
  if (fieldName === 'dangerousHumidity' || fieldName === 'currentHumidity') {
    if (value === undefined || value === '') {
      if (fieldConfig.required) {
        return t('sensor.validation.required.humidity', 'Вологість обов\'язкова');
      }
      return '';
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return t('sensor.validation.format.humidity', 'Вологість повинна бути числом');
    }
    
    if (numValue < 0 || numValue > 100) {
      return t('sensor.validation.range.humidity', 'Вологість повинна бути в діапазоні від 0 до 100');
    }
    
    return '';
  }
  
  // Валідація значень руху
  if (fieldName === 'dangerousMotionIntensity' || fieldName === 'currentMotionIntensity') {
    if (value === undefined || value === '') {
      if (fieldConfig.required) {
        return t('sensor.validation.required.motionIntensity', 'Інтенсивність руху обов\'язкова');
      }
      return '';
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return t('sensor.validation.format.motionIntensity', 'Інтенсивність руху повинна бути числом');
    }
    
    if (numValue < 0 || numValue > 100) {
      return t('sensor.validation.range.motionIntensity', 'Інтенсивність руху повинна бути в діапазоні від 0 до 100');
    }
    
    return '';
  }
  
  // Валідація значень диму
  if (fieldName === 'dangerousSmokeLevel' || fieldName === 'currentSmokeLevel') {
    if (value === undefined || value === '') {
      if (fieldConfig.required) {
        return t('sensor.validation.required.smokeLevel', 'Рівень диму обов\'язковий');
      }
      return '';
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return t('sensor.validation.format.smokeLevel', 'Рівень диму повинен бути числом');
    }
    
    if (numValue < 0) {
      return t('sensor.validation.range.smokeLevel', 'Рівень диму не може бути від\'ємним');
    }
    
    return '';
  }
  
  // Валідація значень газу
  if (fieldName.includes('dangerousMethanLevel') || fieldName.includes('currentMethanLevel') ||
      fieldName.includes('dangerousCarbonMonoxideLevel') || fieldName.includes('currentCarbonMonoxideLevel') ||
      fieldName.includes('dangerousCarbonDioxideLevel') || fieldName.includes('currentCarbonDioxideLevel') ||
      fieldName.includes('dangerousPropaneLevel') || fieldName.includes('currentPropaneLevel') ||
      fieldName.includes('dangerousNitrogenDioxideLevel') || fieldName.includes('currentNitrogenDioxideLevel') ||
      fieldName.includes('dangerousOzoneLevel') || fieldName.includes('currentOzoneLevel')) {
    if (value === undefined || value === '') {
      if (fieldConfig.required) {
        return t('sensor.validation.required.gasLevel', 'Рівень газу обов\'язковий');
      }
      return '';
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return t('sensor.validation.format.gasLevel', 'Рівень газу повинен бути числом');
    }
    
    if (numValue < 0) {
      return t('sensor.validation.range.gasLevel', 'Рівень газу не може бути від\'ємним');
    }
    
    return '';
  }
  
  // Валідація значень водовиявлення
  if (fieldName === 'dangerousWaterDetectionIndex' || fieldName === 'currentWaterDetectionIndex') {
    if (value === undefined || value === '') {
      if (fieldConfig.required) {
        return t('sensor.validation.required.waterDetection', 'Індекс виявлення води обов\'язковий');
      }
      return '';
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return t('sensor.validation.format.waterDetection', 'Індекс виявлення води повинен бути числом');
    }
    
    if (numValue < 0 || numValue > 10) {
      return t('sensor.validation.range.waterDetection', 'Індекс виявлення води повинен бути в діапазоні від 0 до 10');
    }
    
    return '';
  }
  
  // Валідація значень освітлення
  if (fieldName === 'dangerousLux' || fieldName === 'currentLux') {
    if (value === undefined || value === '') {
      if (fieldConfig.required) {
        return t('sensor.validation.required.lux', 'Рівень освітлення обов\'язковий');
      }
      return '';
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return t('sensor.validation.format.lux', 'Рівень освітлення повинен бути числом');
    }
    
    if (numValue < 0) {
      return t('sensor.validation.range.lux', 'Рівень освітлення не може бути від\'ємним');
    }
    
    return '';
  }
  
  // Валідація значень якості повітря
  if (fieldName === 'dangerousAQI' || fieldName === 'currentAQI' ||
      fieldName === 'dangerousPM25' || fieldName === 'currentPM25' ||
      fieldName === 'dangerousPM10' || fieldName === 'currentPM10') {
    if (value === undefined || value === '') {
      if (fieldConfig.required) {
        return t('sensor.validation.required.airQuality', 'Значення якості повітря обов\'язкове');
      }
      return '';
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return t('sensor.validation.format.airQuality', 'Значення якості повітря повинно бути числом');
    }
    
    if (numValue < 0) {
      return t('sensor.validation.range.airQuality', 'Значення якості повітря не може бути від\'ємним');
    }
    
    return '';
  }
  
  // Валідація значень потужності
  if (fieldName === 'dangerousPower' || fieldName === 'currentPower' ||
      fieldName === 'dangerousVoltage' || fieldName === 'currentVoltage' ||
      fieldName === 'dangerousCurrent' || fieldName === 'currentCurrent') {
    if (value === undefined || value === '') {
      if (fieldConfig.required) {
        return t('sensor.validation.required.power', 'Значення потужності обов\'язкове');
      }
      return '';
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return t('sensor.validation.format.power', 'Значення потужності повинно бути числом');
    }
    
    if (numValue < 0) {
      return t('sensor.validation.range.power', 'Значення потужності не може бути від\'ємним');
    }
    
    return '';
  }
  
  // Валідація значень погоди
  if (fieldName === 'dangerousWindSpeed' || fieldName === 'currentWindSpeed' ||
      fieldName === 'dangerousRainIntensity' || fieldName === 'currentRainIntensity') {
    if (value === undefined || value === '') {
      if (fieldConfig.required) {
        return t('sensor.validation.required.weather', 'Погодне значення обов\'язкове');
      }
      return '';
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return t('sensor.validation.format.weather', 'Погодне значення повинно бути числом');
    }
    
    if (numValue < 0) {
      return t('sensor.validation.range.weather', 'Погодне значення не може бути від\'ємним');
    }
    
    return '';
  }
  
  return '';
};

const EditSensorDialog = ({ open, onClose, sensor }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ...sensor,
  });
  const [errors, setErrors] = useState({});
  const [specificFields, setSpecificFields] = useState([]);
  const [serverError, setServerError] = useState('');
  
  // Оновлення форми при зміні сенсора
  useEffect(() => {
    if (sensor) {
      setFormData({
        ...sensor
      });
    }
  }, [sensor]);
  
  // Ефект для оновлення полів специфічних для типу сенсора
  useEffect(() => {
    if (sensor?.sensorType) {
      const fields = getSensorSpecificFields(sensor.sensorType);
      setSpecificFields(fields);
      
      // Очищаємо помилки для полів, які вже не є частиною форми
      const updatedErrors = { ...errors };
      Object.keys(updatedErrors).forEach(key => {
        if (key !== 'name' && !fields.some(field => field.name === key)) {
          delete updatedErrors[key];
        }
      });
      setErrors(updatedErrors);
    } else {
      setSpecificFields([]);
    }
  }, [sensor]);
  
  // Оновлення даних форми при зміні полів
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    
    // Валідуємо поле в реальному часі при зміні
    const fieldConfig = specificFields.find(f => f.name === name) || {};
    const error = validateSensorField(name, value, fieldConfig, t);
    
    // Оновлюємо помилки
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
    
    // Очищаємо помилку сервера при редагуванні форми
    if (serverError) {
      setServerError('');
    }
  };
  
  // Валідація форми
  const validateForm = () => {
    const validationErrors = {};
    let isValid = true;
    
    // Валідація назви
    const nameError = validateSensorField('name', formData.name, { required: true }, t);
    if (nameError) {
      validationErrors.name = nameError;
      isValid = false;
    }
    
    // Валідація специфічних полів
    specificFields.forEach(field => {
      const error = validateSensorField(field.name, formData[field.name], field, t);
      if (error) {
        validationErrors[field.name] = error;
        isValid = false;
      }
    });
    
    setErrors(validationErrors);
    return isValid;
  };
  
  // Відправка форми
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Перевіряємо обов'язкові поля
      const isValid = validateForm();
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }
      
      // Підготовка даних для відправки (видаляємо homeId та sensorType, які не можна оновлювати)
      const sensorData = { ...formData };
      delete sensorData.homeId;
      delete sensorData.sensorType;
      
      await dispatch(updateSensor({
        id: sensor._id,
        data: sensorData
      }));
      
      handleClose();
    } catch (error) {
      setServerError(error.message || t('common.errorOccurred', 'Сталася помилка'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Закриття діалога
  const handleClose = () => {
    if (isSubmitting) return;
    
    onClose();
    
    // Очищаємо помилки
    setTimeout(() => {
      setErrors({});
    }, 300);
  };
  
  if (!sensor) return null;
  
  const sensorTypeLabel = getSensorTypeLabel(sensor.sensorType);
  const sensorStandardValues = dangerousSensorValues[sensor.sensorType];
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 24,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {t('sensor.editSensor', 'Редагувати сенсор')}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            {t('sensor.type', 'Тип сенсора')}: <strong>{sensorTypeLabel}</strong>
          </Typography>
        </Box>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>{t('sensor.editInfo.title', 'Редагування налаштувань')}</AlertTitle>
          <Typography variant="body2">
            {t('sensor.editInfo.description', 'Ви можете змінити назву сенсора та його тригерні (небезпечні) значення. Ці значення використовуються для визначення потенційно небезпечних ситуацій.')}
          </Typography>
        </Alert>
        
        <TextField
          label={t('sensor.fields.name', 'Назва сенсора')}
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
          autoFocus
        />
        
        <Box sx={{ mt: 3, mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">
              {t('sensor.standardValuesInfo.title', 'Стандартні значення')}
            </Typography>
            <Chip 
              label={t('common.info', 'Інформація')} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('sensor.standardValuesInfo.description', 'Нижче вказані рекомендовані небезпечні значення для вибраного типу сенсора згідно з українськими нормами безпеки. Ви можете змінити ці значення відповідно до ваших потреб.')}
          </Typography>
          
          <Divider sx={{ my: 1 }} />
          
          {specificFields.map((field, index) => {
            const standardValue = sensorStandardValues?.[field.name];
            const standardUnit = sensorStandardValues?.[`${field.name}Unit`];
            
            if (!standardValue) return null;
            
            return (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2">{field.label}:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {standardValue} {standardUnit || ''}
                </Typography>
              </Box>
            );
          })}
        </Box>
        
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          {t('sensor.dangerousThresholds', 'Небезпечні порогові значення')}
        </Typography>
        
        {specificFields.length > 0 ? (
          specificFields.map((field, index) => (
            <TextField
              key={index}
              label={field.label}
              name={field.name}
              type="number"
              value={formData[field.name] !== undefined ? formData[field.name] : field.defaultValue || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors[field.name]}
              helperText={errors[field.name]}
              InputProps={{
                endAdornment: field.unit ? (
                  <InputAdornment position="end">{field.unit}</InputAdornment>
                ) : null
              }}
            />
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ my: 2 }}>
            {t('sensor.noSpecificFields', 'Для цього типу сенсора немає специфічних налаштувань.')}
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose}
          disabled={isSubmitting}
        >
          {t('common.cancel', 'Скасувати')}
        </Button>
        
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isSubmitting}
          color="primary"
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t('common.save', 'Зберегти')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSensorDialog; 