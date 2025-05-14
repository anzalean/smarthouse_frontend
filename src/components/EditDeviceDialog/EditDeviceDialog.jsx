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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Chip,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { updateDevice } from '../../redux/slices/homesSlice';
import { getDeviceSpecificFields, getDeviceTypeLabel } from '../../utils/deviceHelpers';

// Функція для валідації полів пристрою
const validateDeviceField = (fieldName, value, fieldConfig = {}, deviceType = '') => {
  // Валідація назви пристрою
  if (fieldName === 'name') {
    if (!value || !value.trim()) return "Назва пристрою обов'язкова";
    if (value.trim().length < 2) return "Назва пристрою має містити щонайменше 2 символи";
    if (value.trim().length > 50) return "Назва пристрою не повинна перевищувати 50 символів";
    return '';
  }
  
  // Валідація відповідно до типу пристрою
  
  // Smart Light (розумне освітлення)
  if (deviceType === 'smart_light') {
    // Яскравість
    if (fieldName === 'brightness') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return "Яскравість має бути числом";
      if (numValue < 0 || numValue > 100) return "Яскравість повинна бути від 0 до 100";
      return '';
    }
    
    // Колір
    if (fieldName === 'color') {
      if (!value && fieldConfig.required) return `Колір обов'язковий`;
      if (!value) return '';
      
      const validColors = [
        'white', 'warm_white', 'daylight', 'soft_white', 'cool_white',
        'candle', 'sunset', 'sunrise', 'deep_blue', 'ocean_blue',
        'sky_blue', 'turquoise', 'mint', 'forest_green', 'lime', 
        'yellow', 'amber', 'orange', 'red', 'pink', 
        'fuchsia', 'purple', 'lavender', 'night_mode', 'reading_mode',
        'movie_mode', 'party_mode', 'relax_mode', 'focus_mode'
      ];
      
      if (!validColors.includes(value)) return "Недійсне значення кольору";
      return '';
    }
  }
  
  // Thermostat (термостат)
  if (deviceType === 'thermostat') {
    // Поточна температура
    if (fieldName === 'currentTemperature') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return "Температура має бути числом";
      return '';
    }
    
    // Режим
    if (fieldName === 'currentMode') {
      if (!value && fieldConfig.required) return `Режим обов'язковий`;
      if (!value) return '';
      
      const validModes = ['heat', 'cool', 'auto', 'eco'];
      if (!validModes.includes(value)) return "Режим повинен бути одним з: heat, cool, auto, eco";
      return '';
    }
  }
  
  // SmartPlug (розумна розетка)
  if (deviceType === 'smart_plug') {
    if (fieldName === 'currentLoad') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return "Навантаження має бути числом";
      if (numValue < 0) return "Навантаження не може бути від'ємним";
      return '';
    }
  }
  
  // HeatingValve (нагрівальний клапан)
  if (deviceType === 'heating_valve') {
    if (fieldName === 'currentTemperature') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return "Температура має бути числом";
      return '';
    }
  }
  
  // SmartLock (розумний замок)
  if (deviceType === 'smart_lock') {
    if (fieldName === 'currentDoorState') {
      if (!value && fieldConfig.required) return `Стан дверей обов'язковий`;
      if (!value) return '';
      
      const validStates = ['open', 'closed'];
      if (!validStates.includes(value)) return "Стан дверей повинен бути одним з: open, closed";
      return '';
    }
  }
  
  // Gate (ворота)
  if (deviceType === 'gate') {
    if (fieldName === 'currentPosition') {
      if (!value && fieldConfig.required) return `Положення обов'язкове`;
      if (!value) return '';
      
      const validPositions = ['open', 'closed'];
      if (!validPositions.includes(value)) return "Положення повинно бути одним з: open, closed";
      return '';
    }
  }
  
  // IrrigationSystem (система зрошення)
  if (deviceType === 'irrigation_system') {
    if (fieldName === 'currentWaterFlow') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return "Потік води має бути числом";
      if (numValue < 0) return "Потік води не може бути від'ємним";
      return '';
    }
  }
  
  // Ventilation (вентиляція)
  if (deviceType === 'ventilation') {
    // Режим
    if (fieldName === 'currentMode') {
      if (!value && fieldConfig.required) return `Режим обов'язковий`;
      if (!value) return '';
      
      const validModes = ['auto', 'manual', 'boost', 'eco', 'night'];
      if (!validModes.includes(value)) return "Режим повинен бути одним з: auto, manual, boost, eco, night";
      return '';
    }
    
    // Швидкість вентилятора
    if (fieldName === 'currentFanSpeed') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return "Швидкість вентилятора має бути числом";
      if (numValue < 0) return "Швидкість вентилятора не може бути від'ємною";
      return '';
    }
    
    // Повітряний потік
    if (fieldName === 'currentAirflow') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return "Повітряний потік має бути числом";
      if (numValue < 0) return "Повітряний потік не може бути від'ємним";
      return '';
    }
  }
  
  // AirPurifier (очищувач повітря)
  if (deviceType === 'air_purifier') {
    // Режим
    if (fieldName === 'currentMode') {
      if (!value && fieldConfig.required) return `Режим обов'язковий`;
      if (!value) return '';
      
      const validModes = ['auto', 'manual', 'sleep', 'turbo', 'quiet'];
      if (!validModes.includes(value)) return "Режим повинен бути одним з: auto, manual, sleep, turbo, quiet";
      return '';
    }
    
    // Швидкість вентилятора
    if (fieldName === 'currentFanSpeed') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return "Швидкість вентилятора має бути числом";
      if (numValue < 0) return "Швидкість вентилятора не може бути від'ємною";
      return '';
    }
    
    // Якість повітря (об'єкт з полями pm25 та pm10)
    if (fieldName === 'currentAirQuality') {
      if (!value && fieldConfig.required) return `Якість повітря обов'язкова`;
      if (!value) return '';
      
      if (typeof value !== 'object') return "Якість повітря повинна бути об'єктом";
      return '';
    }
    
    if (fieldName === 'currentAirQuality.pm25') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return "PM2.5 має бути числом";
      if (numValue < 0) return "PM2.5 не може бути від'ємним";
      return '';
    }
    
    if (fieldName === 'currentAirQuality.pm10') {
      if (value === undefined || value === '') return '';
      
      const numValue = Number(value);
      if (isNaN(numValue)) return "PM10 має бути числом";
      if (numValue < 0) return "PM10 не може бути від'ємним";
      return '';
    }
  }
  
  // Camera (камера)
  if (deviceType === 'camera') {
    // Роздільна здатність (об'єкт з полями width та height)
    if (fieldName === 'currentResolution') {
      if (!value && fieldConfig.required) return `Роздільна здатність обов'язкова`;
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

const EditDeviceDialog = ({ open, onClose, device }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specificFields, setSpecificFields] = useState([]);

  useEffect(() => {
    if (device) {
      // Копіюємо дані пристрою для редагування
      setFormValues({
        ...device,
      });
      
      // Отримуємо специфічні поля для типу пристрою
      if (device.deviceType) {
        const fieldsFromHelper = getDeviceSpecificFields(device.deviceType);
        
        // Додаємо поля для Smart Lock, якщо їх немає
        if (device.deviceType === 'smart_lock') {
          const doorStateField = {
            name: 'currentDoorState',
            label: t('device.properties.currentDoorState', 'Поточний стан дверей'),
            type: 'select',
            required: true,
            options: [
              { value: 'open', label: t('device.states.open', 'Відчинено') },
              { value: 'closed', label: t('device.states.closed', 'Зачинено') },
            ]
          };
          
          // Перевіряємо, чи вже є таке поле
          if (!fieldsFromHelper.some(field => field.name === 'currentDoorState')) {
            fieldsFromHelper.push(doorStateField);
          }
        }
        
        // Додаємо поля для Gate, якщо їх немає
        if (device.deviceType === 'gate') {
          const positionField = {
            name: 'currentPosition',
            label: t('device.properties.currentPosition', 'Поточна позиція'),
            type: 'select',
            required: true,
            options: [
              { value: 'open', label: t('device.states.open', 'Відчинено') },
              { value: 'closed', label: t('device.states.closed', 'Зачинено') },
            ]
          };
          
          // Перевіряємо, чи вже є таке поле
          if (!fieldsFromHelper.some(field => field.name === 'currentPosition')) {
            fieldsFromHelper.push(positionField);
          }
        }
        
        setSpecificFields(fieldsFromHelper);
      }
      
      // Очищаємо помилки при зміні пристрою
      setFormErrors({});
    }
  }, [device, t]);

  const validateForm = () => {
    const errors = {};
    
    // Валідація назви пристрою
    const nameError = validateDeviceField('name', formValues.name, {}, formValues.deviceType);
    if (nameError) errors.name = nameError;
    
    // Валідація специфічних полів
    specificFields.forEach(field => {
      const fieldError = validateDeviceField(field.name, formValues[field.name], field, formValues.deviceType);
      if (fieldError) {
        errors[field.name] = fieldError;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
    const fieldError = validateDeviceField(name, value, fieldConfig, formValues.deviceType);
    
    setFormErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };
  
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Створюємо новий об'єкт без службових полів
        const updateData = {};
        
        // Копіюємо всі поля крім тих, які не потрібно оновлювати
        Object.keys(formValues).forEach(key => {
          if (!['_id', 'homeId', 'deviceType', 'createdAt', 'updatedAt'].includes(key)) {
            updateData[key] = formValues[key];
          }
        });
        
        await dispatch(updateDevice({
          id: device._id,
          data: updateData,
        })).unwrap();
        
        // Очищаємо стан форми після успішного оновлення
        setFormValues({});
        setFormErrors({});
        setSpecificFields([]);
        onClose();
      } catch (error) {
        console.error('Помилка при оновленні пристрою:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleClose = () => {
    setFormValues({});
    setFormErrors({});
    onClose();
  };

  // Якщо немає пристрою для редагування, не відображаємо діалог
  if (!device) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {t('device.editDevice', 'Редагування пристрою')}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 2, mt: 1 }}>
          <Chip 
            label={getDeviceTypeLabel(device.deviceType)} 
            color="primary" 
            size="small" 
            sx={{ fontWeight: 'medium' }}
          />
          <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
            {t('device.typeCannotBeChanged', 'Тип пристрою не може бути змінений')}
          </Typography>
        </Box>
        
        <TextField
          margin="normal"
          fullWidth
          label={t('device.name', 'Назва пристрою')}
          name="name"
          value={formValues.name || ''}
          onChange={handleChange}
          error={!!formErrors.name}
          helperText={formErrors.name}
          autoFocus
          required
        />
        
        {/* Відображення специфічних полів в залежності від типу пристрою */}
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
              value={formValues[field.name] !== undefined ? formValues[field.name] : ''}
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
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          {t('common.cancel', 'Скасувати')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : t('common.save', 'Зберегти')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDeviceDialog; 