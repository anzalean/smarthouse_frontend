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
} from '@mui/material';
import { createDevice } from '../../redux/slices/homesSlice';
import { getDeviceTypeOptions, getDeviceSpecificFields } from '../../utils/deviceHelpers';

// Функція для валідації полів пристрою
const validateDeviceField = (fieldName, value, fieldConfig = {}, deviceType = '', t) => {
  // Валідація назви пристрою
  if (fieldName === 'name') {
    if (!value || !value.trim()) return t('device.validation.required.name');
    if (value.trim().length < 2) return t('device.validation.minLength.name');
    if (value.trim().length > 50) return t('device.validation.maxLength.name');
    return '';
  }
  
  // Валідація типу пристрою
  if (fieldName === 'deviceType') {
    if (!value) return t('device.validation.required.deviceType');
    const validTypes = [
      'smart_plug',
      'thermostat',
      'heating_valve',
      'smart_lock',
      'gate',
      'irrigation_system',
      'ventilation',
      'air_purifier',
      'camera',
      'smart_light',
    ];
    if (!validTypes.includes(value)) return t('device.validation.invalidValue.deviceType');
    return '';
  }
  
  // Валідація відповідно до типу пристрою
  
  // Smart Light (розумне освітлення)
  if (deviceType === 'smart_light') {
    // Яскравість
    if (fieldName === 'brightness') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return t('device.validation.format.brightness');
      if (numValue < 0 || numValue > 100) return t('device.validation.range.brightness');
      return '';
    }
    
    // Колір
    if (fieldName === 'color') {
      if (!value && fieldConfig.required) return t('device.validation.required.color');
      if (!value) return '';
      
      const validColors = [
        'white', 'warm_white', 'daylight', 'soft_white', 'cool_white',
        'candle', 'sunset', 'sunrise', 'deep_blue', 'ocean_blue',
        'sky_blue', 'turquoise', 'mint', 'forest_green', 'lime', 
        'yellow', 'amber', 'orange', 'red', 'pink', 
        'fuchsia', 'purple', 'lavender', 'night_mode', 'reading_mode',
        'movie_mode', 'party_mode', 'relax_mode', 'focus_mode'
      ];
      
      if (!validColors.includes(value)) return t('device.validation.invalidValue.color');
      return '';
    }
  }
  
  // Thermostat (термостат)
  if (deviceType === 'thermostat') {
    // Поточна температура
    if (fieldName === 'currentTemperature') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return t('device.validation.format.temperature');
      return '';
    }
    
    // Режим
    if (fieldName === 'currentMode') {
      if (!value && fieldConfig.required) return t('device.validation.required.mode');
      if (!value) return '';
      
      const validModes = ['heat', 'cool', 'auto', 'eco'];
      if (!validModes.includes(value)) return t('device.validation.invalidValue.mode.thermostat');
      return '';
    }
  }
  
  // SmartPlug (розумна розетка)
  if (deviceType === 'smart_plug') {
    if (fieldName === 'currentLoad') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return t('device.validation.format.currentLoad');
      if (numValue < 0) return t('device.validation.range.negativeValue.currentLoad');
      return '';
    }
  }
  
  // HeatingValve (нагрівальний клапан)
  if (deviceType === 'heating_valve') {
    if (fieldName === 'currentTemperature') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return t('device.validation.format.temperature');
      return '';
    }
  }
  
  // SmartLock (розумний замок)
  if (deviceType === 'smart_lock') {
    if (fieldName === 'currentDoorState') {
      if (!value && fieldConfig.required) return t('device.validation.required.doorState');
      if (!value) return '';
      
      const validStates = ['open', 'closed'];
      if (!validStates.includes(value)) return t('device.validation.invalidValue.doorState');
      return '';
    }
  }
  
  // Gate (ворота)
  if (deviceType === 'gate') {
    if (fieldName === 'currentPosition') {
      if (!value && fieldConfig.required) return t('device.validation.required.position');
      if (!value) return '';
      
      const validPositions = ['open', 'closed'];
      if (!validPositions.includes(value)) return t('device.validation.invalidValue.position');
      return '';
    }
  }
  
  // IrrigationSystem (система зрошення)
  if (deviceType === 'irrigation_system') {
    if (fieldName === 'currentWaterFlow') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return t('device.validation.format.waterFlow');
      if (numValue < 0) return t('device.validation.range.negativeValue.waterFlow');
      return '';
    }
  }
  
  // Ventilation (вентиляція)
  if (deviceType === 'ventilation') {
    // Режим
    if (fieldName === 'currentMode') {
      if (!value && fieldConfig.required) return t('device.validation.required.mode');
      if (!value) return '';
      
      const validModes = ['auto', 'manual', 'boost', 'eco', 'night'];
      if (!validModes.includes(value)) return t('device.validation.invalidValue.mode.ventilation');
      return '';
    }
    
    // Швидкість вентилятора
    if (fieldName === 'currentFanSpeed') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return t('device.validation.format.fanSpeed');
      if (numValue < 0) return t('device.validation.range.negativeValue.fanSpeed');
      return '';
    }
    
    // Повітряний потік
    if (fieldName === 'currentAirflow') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return t('device.validation.format.airflow');
      if (numValue < 0) return t('device.validation.range.negativeValue.airflow');
      return '';
    }
  }
  
  // AirPurifier (очищувач повітря)
  if (deviceType === 'air_purifier') {
    // Режим
    if (fieldName === 'currentMode') {
      if (!value && fieldConfig.required) return t('device.validation.required.mode');
      if (!value) return '';
      
      const validModes = ['auto', 'manual', 'sleep', 'turbo', 'quiet'];
      if (!validModes.includes(value)) return t('device.validation.invalidValue.mode.airPurifier');
      return '';
    }
    
    // Швидкість вентилятора
    if (fieldName === 'currentFanSpeed') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return t('device.validation.format.fanSpeed');
      if (numValue < 0) return t('device.validation.range.negativeValue.fanSpeed');
      return '';
    }
    
    // Якість повітря (об'єкт з полями pm25 та pm10)
    if (fieldName === 'currentAirQuality') {
      if (!value && fieldConfig.required) return t('device.validation.required.airQuality');
      if (!value) return '';
      
      if (typeof value !== 'object') return t('device.validation.format.airQuality');
      return '';
    }
    
    if (fieldName === 'currentAirQuality.pm25') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return t('device.validation.format.pm25');
      if (numValue < 0) return t('device.validation.range.negativeValue.pm25');
      return '';
    }
    
    if (fieldName === 'currentAirQuality.pm10') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return t('device.validation.format.pm10');
      if (numValue < 0) return t('device.validation.range.negativeValue.pm10');
      return '';
    }
  }
  
  // Camera (камера)
  if (deviceType === 'camera') {
    // Роздільна здатність (об'єкт з полями width та height)
    if (fieldName === 'currentResolution') {
      if (!value && fieldConfig.required) return t('device.validation.required.resolution');
      return '';
    }
    
    if (fieldName === 'currentResolution.width') {
      return '';
    }
    
    if (fieldName === 'currentResolution.height') {
      return '';
    }
  }
  
  return '';
};

const AddDeviceDialog = ({ open, onClose, roomId, homeId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({
    name: '',
    deviceType: '',
    isActive: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specificFields, setSpecificFields] = useState([]);
  
  const deviceTypes = getDeviceTypeOptions();

  // Ефект для оновлення специфічних полів при зміні типу пристрою
  useEffect(() => {
    if (formValues.deviceType) {
      const fields = getDeviceSpecificFields(formValues.deviceType);
      setSpecificFields(fields);
      
      // Встановлюємо значення за замовчуванням для специфічних полів
      const defaultValues = {};
      fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          defaultValues[field.name] = field.defaultValue;
        } else if (field.type === 'select' && field.options && field.options.length > 0) {
          defaultValues[field.name] = field.options[0].value;
        }
      });
      
      setFormValues(prev => ({
        ...prev,
        ...defaultValues
      }));
      
      // Очищаємо помилки для полів, які вже не є частиною форми
      const updatedErrors = { ...formErrors };
      Object.keys(updatedErrors).forEach(key => {
        if (key !== 'name' && key !== 'deviceType' && !fields.some(field => field.name === key)) {
          delete updatedErrors[key];
        }
      });
      setFormErrors(updatedErrors);
    }
  }, [formValues.deviceType]);

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      // Валідація назви і типу пристрою
      const nameError = validateDeviceField('name', formValues.name, {}, formValues.deviceType, t);
      if (nameError) errors.name = nameError;
      
      const typeError = validateDeviceField('deviceType', formValues.deviceType, {}, formValues.deviceType, t);
      if (typeError) errors.deviceType = typeError;
    } else if (step === 1 && specificFields.length > 0) {
      // Валідація специфічних полів для поточного типу пристрою
      specificFields.forEach(field => {
        const fieldError = validateDeviceField(field.name, formValues[field.name], field, formValues.deviceType, t);
        if (fieldError) {
          errors[field.name] = fieldError;
        }
      });
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Перевіряємо, чи потрібно трансформувати значення (для камери та інших спеціальних полів)
    const field = specificFields.find(f => f.name === name);
    if (field && field.useObjectValue && field.transformInput) {
      // Використовуємо transformInput для конвертації значення у правильний формат
      const transformedValue = field.transformInput(value, field.options);
      setFormValues({
        ...formValues,
        [name]: transformedValue,
      });
    } else {
      // Звичайна обробка для інших полів
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
    
    // Валідуємо поле в реальному часі при зміні
    const fieldConfig = specificFields.find(f => f.name === name);
    const fieldError = validateDeviceField(name, value, fieldConfig, formValues.deviceType, t);
    
    setFormErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      setIsSubmitting(true);
      
      try {
        const deviceData = {
          ...formValues,
          homeId,
          roomId,
        };
        
        // Додаємо дефолтні значення для Smart Lock та Gate
        if (deviceData.deviceType === 'smart_lock') {
          deviceData.currentDoorState = 'open';
        }
        
        if (deviceData.deviceType === 'gate') {
          deviceData.currentPosition = 'open';
        }
        
        await dispatch(createDevice(deviceData)).unwrap();
        // Очищаємо стан форми після успішного створення пристрою
        setActiveStep(0);
        setFormValues({
          name: '',
          deviceType: '',
          isActive: false,
        });
        setFormErrors({});
        setSpecificFields([]);
        onClose();
      } catch (error) {
        console.error('Помилка при створенні пристрою:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setFormValues({
      name: '',
      deviceType: '',
      isActive: false,
    });
    setFormErrors({});
    onClose();
  };

  const steps = [
    t('device.basicInfo', 'Основна інформація'),
    specificFields.length > 0 ? t('device.specificSettings', 'Специфічні налаштування') : t('device.completion', 'Завершення'),
  ];

  const isLastStep = (
    activeStep === steps.length - 1 || 
    (activeStep === 0 && specificFields.length === 0)
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        {t('device.addNewDevice')}
      </DialogTitle>
      
      <DialogContent sx={{ pb: 1 }}>
        <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              {t('device.fillBasicInfo')}
            </Typography>
            
            <TextField
              margin="normal"
              fullWidth
              label={t('device.name')}
              name="name"
              value={formValues.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              autoFocus
              required
            />
            
            <FormControl 
              fullWidth 
              margin="normal" 
              error={!!formErrors.deviceType}
              required
            >
              <InputLabel>{t('device.type')}</InputLabel>
              <Select
                name="deviceType"
                value={formValues.deviceType}
                onChange={handleChange}
                label={t('device.type')}
              >
                {deviceTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.deviceType && (
                <FormHelperText>{formErrors.deviceType}</FormHelperText>
              )}
            </FormControl>
          </Box>
        )}

        {activeStep === 1 && specificFields.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              {t('device.specificSettings')}: {deviceTypes.find(t => t.value === formValues.deviceType)?.label}
            </Typography>
            
            {specificFields.map((field) => (
              field.type === 'select' ? (
                <FormControl 
                  key={field.name}
                  fullWidth 
                  margin="normal" 
                  error={!!formErrors[field.name]}
                  required={field.required}
                >
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    name={field.name}
                    value={field.useObjectValue && field.transformOutput ? 
                      field.transformOutput(formValues[field.name]) : 
                      (formValues[field.name] || '')}
                    onChange={handleChange}
                    label={field.label}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors[field.name] && (
                    <FormHelperText>{formErrors[field.name]}</FormHelperText>
                  )}
                </FormControl>
              ) : (
                <TextField
                  key={field.name}
                  margin="normal"
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={formValues[field.name] || ''}
                  onChange={handleChange}
                  error={!!formErrors[field.name]}
                  helperText={formErrors[field.name]}
                  required={field.required}
                  inputProps={
                    field.type === 'number' ? {
                      min: field.name === 'brightness' ? 0 : 
                           field.name === 'currentTemperature' ? 0 : 
                           field.name === 'currentFanSpeed' ? 0 : 
                           field.name === 'currentLoad' ? 0 :
                           field.name === 'currentWaterFlow' ? 0 :
                           field.name === 'currentAirflow' ? 0 :
                           field.name === 'currentResolution.width' ? 1 :
                           field.name === 'currentResolution.height' ? 1 : 0,
                      max: field.name === 'brightness' ? 100 : undefined,
                      step: field.name === 'currentTemperature' ? 0.5 : 1
                    } : {}
                  }
                />
              )
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          {t('common.cancel')}
        </Button>
        
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            {t('common.back')}
          </Button>
        )}
        
        {isLastStep ? (
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : t('common.create')}
          </Button>
        ) : (
          <Button 
            onClick={handleNext} 
            variant="contained" 
            color="primary"
          >
            {t('common.next')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddDeviceDialog; 