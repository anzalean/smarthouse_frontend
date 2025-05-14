import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  FormHelperText,
  CircularProgress,
  Alert,
  AlertTitle,
  InputAdornment,
} from '@mui/material';
import { createSensor } from '../../redux/slices/homesSlice';
import { getSensorTypeOptions, getSensorSpecificFields } from '../../utils/sensorHelpers';

// Функція для валідації полів сенсора
const validateSensorField = (fieldName, value, fieldConfig = {}, t) => {
  // Валідація назви сенсора
  if (fieldName === 'name') {
    if (!value || !value.trim()) return t('sensor.validation.required.name', 'Назва обов\'язкова');
    if (value.trim().length < 2) return t('sensor.validation.minLength.name', 'Назва повинна бути не менше 2 символів');
    if (value.trim().length > 50) return t('sensor.validation.maxLength.name', 'Назва повинна бути не більше 50 символів');
    return '';
  }
  
  // Валідація типу сенсора
  if (fieldName === 'sensorType') {
    if (!value) return t('sensor.validation.required.sensorType', 'Тип сенсора обов\'язковий');
    const validTypes = [
      'temperature_sensor',
      'humidity_sensor',
      'motion_sensor',
      'smoke_sensor',
      'gas_sensor',
      'water_leak_sensor',
      'light_sensor',
      'air_quality_sensor',
      'power_sensor',
      'weather_sensor',
    ];
    if (!validTypes.includes(value)) return t('sensor.validation.invalidValue.sensorType', 'Недійсний тип сенсора');
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
  
  // Валідація специфічних полів сенсора
  if (fieldConfig.type === 'number') {
    if (value === undefined || value === '') {
      if (fieldConfig.required) {
        return t('sensor.validation.required.number', 'Значення обов\'язкове');
      }
      return '';
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return t('sensor.validation.format.number', 'Значення повинно бути числовим');
    }
    
    return '';
  }

  return '';
};

const AddSensorDialog = ({ open, onClose, roomId, homeId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sensorType: '',
    roomId: roomId || '',
    homeId: homeId || '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [specificFields, setSpecificFields] = useState([]);
  
  // Для відображення тексту про стандартні значення на кроці 2
  const [showStandardValuesInfo, setShowStandardValuesInfo] = useState(false);
  
  // Кроки для степера
  const steps = [
    { label: t('sensor.steps.basicInfo', 'Основна інформація') },
    { label: t('sensor.steps.specificSettings', 'Специфічні налаштування') },
  ];
  
  // Ефект для оновлення полів специфічних для типу сенсора
  useEffect(() => {
    if (formData.sensorType) {
      const fields = getSensorSpecificFields(formData.sensorType);
      setSpecificFields(fields);
      
      // Додаємо дефолтні значення полів до formData
      const newFormData = { ...formData };
      fields.forEach(field => {
        if (field.defaultValue !== undefined && !formData[field.name]) {
          newFormData[field.name] = field.defaultValue;
        }
      });
      setFormData(newFormData);
      
      // Показуємо інформацію про стандартні значення, якщо є дефолтні значення
      setShowStandardValuesInfo(fields.length > 0);
      
      // Очищаємо помилки для полів, які вже не є частиною форми
      const updatedErrors = { ...errors };
      Object.keys(updatedErrors).forEach(key => {
        if (key !== 'name' && key !== 'sensorType' && !fields.some(field => field.name === key)) {
          delete updatedErrors[key];
        }
      });
      setErrors(updatedErrors);
    } else {
      setSpecificFields([]);
      setShowStandardValuesInfo(false);
    }
  }, [formData.sensorType]);
  
  // Опції типів сенсорів для селекта
  const sensorTypeOptions = getSensorTypeOptions();
  
  // Валідація поточного кроку
  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;
    
    if (step === 0) {
      // Валідація першого кроку (основна інформація)
      const nameError = validateSensorField('name', formData.name, { required: true }, t);
      if (nameError) {
        newErrors.name = nameError;
        isValid = false;
      }
      
      const typeError = validateSensorField('sensorType', formData.sensorType, { required: true }, t);
      if (typeError) {
        newErrors.sensorType = typeError;
        isValid = false;
      }
    } else if (step === 1) {
      // Валідація другого кроку (специфічні налаштування)
      specificFields.forEach(field => {
        const error = validateSensorField(field.name, formData[field.name], field, t);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      });
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Перехід до наступного кроку
  const handleNext = () => {
    const isValid = validateStep(activeStep);
    if (isValid) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  // Повернення до попереднього кроку
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
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
    
    // Очищення помилки при зміні поля
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };
  
  // Відправка форми
  const handleSubmit = async () => {
    const isValid = validateStep(activeStep);
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(createSensor(formData)).unwrap();
      onClose();
      
      // Очищаємо форму
      setFormData({
        name: '',
        sensorType: '',
        roomId: roomId || '',
        homeId: homeId || '',
        isActive: true,
      });
      setActiveStep(0);
    } catch (error) {
      console.error('Error creating sensor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Закриття діалога
  const handleClose = () => {
    if (isSubmitting) return;
    
    onClose();
    
    // Очищаємо форму і повертаємось до першого кроку
    setTimeout(() => {
      setFormData({
        name: '',
        sensorType: '',
        roomId: roomId || '',
        homeId: homeId || '',
        isActive: true,
      });
      setActiveStep(0);
      setErrors({});
    }, 300);
  };
  
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
        {t('sensor.addSensor', 'Додати сенсор')}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 0 }}>
        <Stepper activeStep={activeStep} sx={{ my: 3 }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('sensor.steps.basicInfo', 'Основна інформація')}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <TextField
                label={t('sensor.fields.name', 'Назва сенсора')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name}
                autoFocus
              />
              
              <FormControl 
                fullWidth 
                margin="normal" 
                error={!!errors.sensorType}
              >
                <InputLabel id="sensor-type-label">
                  {t('sensor.fields.sensorType', 'Тип сенсора')}
                </InputLabel>
                <Select
                  labelId="sensor-type-label"
                  label={t('sensor.fields.sensorType', 'Тип сенсора')}
                  name="sensorType"
                  value={formData.sensorType}
                  onChange={handleChange}
                >
                  {sensorTypeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.sensorType && (
                  <FormHelperText>{errors.sensorType}</FormHelperText>
                )}
              </FormControl>
            </Box>
          </Box>
        )}
        
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('sensor.steps.specificSettings', 'Специфічні налаштування')}
            </Typography>
            
            {showStandardValuesInfo && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>{t('sensor.standardValuesInfo.title', 'Стандартні значення')}</AlertTitle>
                <Typography variant="body2">
                  {t('sensor.standardValuesInfo.description', 'Нижче вказані рекомендовані небезпечні значення для вибраного типу сенсора згідно з українськими нормами безпеки. Ви можете змінити ці значення відповідно до ваших потреб.')}
                </Typography>
              </Alert>
            )}
            
            <Box sx={{ mt: 2 }}>
              {specificFields.length > 0 ? (
                specificFields.map((field, index) => (
                  <TextField
                    key={index}
                    label={field.label}
                    name={field.name}
                    type={field.type}
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
            </Box>
          </Box>
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
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0 || isSubmitting}
          sx={{ mr: 1 }}
        >
          {t('common.back', 'Назад')}
        </Button>
        
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {t('common.next', 'Далі')}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('common.create', 'Створити')
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddSensorDialog; 