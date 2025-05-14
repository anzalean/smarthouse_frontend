import { useState, useEffect } from 'react';
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
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  FormControlLabel,
  Checkbox,
  ListItemText,
  Divider,
  OutlinedInput,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createAutomation } from '../../redux/slices/homesSlice';
import { getSensorTypeLabel } from '../../utils/sensorHelpers';
import { dangerousSensorValues } from '../../utils/dangerousSensorValues';
import { useTranslation } from 'react-i18next';

// Функція для отримання поточного часу у форматі HH:MM
const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

// Функція для отримання часу через годину у форматі HH:MM
const getTimeInOneHour = () => {
  const oneHourLater = new Date();
  oneHourLater.setHours(oneHourLater.getHours() + 1);
  return `${String(oneHourLater.getHours()).padStart(2, '0')}:${String(oneHourLater.getMinutes()).padStart(2, '0')}`;
};

const AddAutomationDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentHome } = useSelector(state => state.homes);
  const [activeStep, setActiveStep] = useState(0);
  const [availableDevices, setAvailableDevices] = useState([]);

  // Дні тижня у форматі, який очікує API
  const daysTranslationKeys = {
    monday: t('common.days.monday_short'),
    tuesday: t('common.days.tuesday_short'),
    wednesday: t('common.days.wednesday_short'),
    thursday: t('common.days.thursday_short'),
    friday: t('common.days.friday_short'),
    saturday: t('common.days.saturday_short'),
    sunday: t('common.days.sunday_short')
  };
  
  const DAYS_OF_WEEK = [
    { value: 'monday', label: daysTranslationKeys.monday },
    { value: 'tuesday', label: daysTranslationKeys.tuesday },
    { value: 'wednesday', label: daysTranslationKeys.wednesday },
    { value: 'thursday', label: daysTranslationKeys.thursday },
    { value: 'friday', label: daysTranslationKeys.friday },
    { value: 'saturday', label: daysTranslationKeys.saturday },
    { value: 'sunday', label: daysTranslationKeys.sunday },
  ];

  // Типи пристроїв
  const DEVICE_TYPES = [
    { value: 'smart_plug', label: t('device.deviceTypes.smart_plug') },
    { value: 'thermostat', label: t('device.deviceTypes.thermostat') },
    { value: 'heating_valve', label: t('device.deviceTypes.heating_valve') },
    { value: 'smart_lock', label: t('device.deviceTypes.smart_lock') },
    { value: 'gate', label: t('device.deviceTypes.gate') },
    {
      value: 'irrigation_system',
      label: t('device.deviceTypes.irrigation_system'),
    },
    { value: 'ventilation', label: t('device.deviceTypes.ventilation') },
    { value: 'air_purifier', label: t('device.deviceTypes.air_purifier') },
    { value: 'camera', label: t('device.deviceTypes.camera') },
    { value: 'smart_light', label: t('device.deviceTypes.smart_light') },
  ];

  // Отримуємо сенсори з redux-стану
  const getAllSensors = useSelector(state => {
    if (!state.homes.currentHome || !state.homes.currentHome.rooms) return [];

    const sensors = [];
    state.homes.currentHome.rooms.forEach(room => {
      if (room.sensors && room.sensors.length > 0) {
        sensors.push(
          ...room.sensors.map(sensor => ({
            ...sensor,
            roomName: room.name,
            roomType: room.type,
          }))
        );
      }
    });
    return sensors;
  });

  const steps = [
    t('automation.steps.name'),
    t('automation.steps.triggerType'),
    t('automation.steps.triggerSettings'),
    t('automation.steps.deviceActions'),
    t('automation.steps.confirmation'),
  ];

  const [formData, setFormData] = useState({
    name: '',
    triggerType: 'time',
    timeTrigger: {
      startTime: getCurrentTime(),
      endTime: getTimeInOneHour(),
      isRecurring: false,
      daysOfWeek: [],
    },
    sensorTrigger: {
      sensorId: '',
      sensorType: '',
      condition: {
        property: '',
        triggerValue: '',
      },
    },
    deviceAction: {
      deviceType: '',
      deviceIds: [],
      settings: {},
    },
  });

  // Отримуємо пристрої для кожної кімнати поточного будинку
  useEffect(() => {
    if (currentHome?.rooms) {
      const devices = [];
      currentHome.rooms.forEach(room => {
        if (room.devices && room.devices.length > 0) {
          room.devices.forEach(device => {
            devices.push({
              ...device,
              roomName: room.name,
              roomType: room.type,
            });
          });
        }
      });
      setAvailableDevices(devices);
    }
  }, [currentHome]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimeTriggerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      timeTrigger: {
        ...prev.timeTrigger,
        [field]: value,
      },
    }));
  };

  const handleSensorTriggerChange = (field, value) => {
    if (field === 'sensorId') {
      const selectedSensor = getAllSensors.find(s => s._id === value);

      // Отримуємо тип сенсора
      const sensorType = selectedSensor?.sensorType || '';

      // Визначаємо відповідну властивість та одиницю виміру для типу сенсора
      let sensorProperty = '';
      let sensorUnit = '';
      let defaultTriggerValue = '';

      switch (sensorType) {
        case 'temperature_sensor':
          sensorProperty = 'currentTemperature';
          sensorUnit = '°C';
          defaultTriggerValue =
            dangerousSensorValues.temperature_sensor.dangerousTemperaturePlus.toString();
          break;
        case 'humidity_sensor':
          sensorProperty = 'currentHumidity';
          sensorUnit = '%';
          defaultTriggerValue =
            dangerousSensorValues.humidity_sensor.dangerousHumidity.toString();
          break;
        case 'motion_sensor':
          sensorProperty = 'currentMotionIntensity';
          sensorUnit = 'рівень';
          defaultTriggerValue =
            dangerousSensorValues.motion_sensor.dangerousMotionIntensity.toString();
          break;
        case 'smoke_sensor':
          sensorProperty = 'currentSmokeLevel';
          sensorUnit = '%';
          defaultTriggerValue =
            dangerousSensorValues.smoke_sensor.dangerousSmokeLevel.toString();
          break;
        case 'water_leak_sensor':
          sensorProperty = 'currentWaterDetectionIndex';
          sensorUnit = 'індекс';
          defaultTriggerValue =
            dangerousSensorValues.water_leak_sensor.dangerousWaterDetectionIndex.toString();
          break;
        case 'light_sensor':
          sensorProperty = 'currentLux';
          sensorUnit = 'лк';
          defaultTriggerValue =
            dangerousSensorValues.light_sensor.dangerousLux.toString();
          break;
        case 'air_quality_sensor':
          sensorProperty = 'currentAQI';
          sensorUnit = 'AQI';
          defaultTriggerValue =
            dangerousSensorValues.air_quality_sensor.dangerousAQI.toString();
          break;
        case 'gas_sensor':
          sensorProperty = 'currentMethanLevel';
          sensorUnit = '% LEL';
          defaultTriggerValue =
            dangerousSensorValues.gas_sensor.dangerousMethanLevel.toString();
          break;
        case 'power_sensor':
          sensorProperty = 'currentPower';
          sensorUnit = 'Вт';
          defaultTriggerValue =
            dangerousSensorValues.power_sensor.dangerousPower.toString();
          break;
        case 'weather_sensor':
          sensorProperty = 'currentTemperature';
          sensorUnit = '°C';
          defaultTriggerValue =
            dangerousSensorValues.weather_sensor.dangerousTemperaturePlus.toString();
          break;
        default:
          break;
      }

      setFormData(prev => ({
        ...prev,
        sensorTrigger: {
          ...prev.sensorTrigger,
          sensorId: value,
          sensorType: sensorType,
          condition: {
            property: sensorProperty,
            triggerValue: defaultTriggerValue,
            unit: sensorUnit,
          },
        },
      }));
    } else if (field === 'condition' && typeof value === 'object') {
      // Визначаємо дефолтне порогове значення для обраної властивості
      if (
        value.property &&
        value.property !== formData.sensorTrigger.condition?.property
      ) {
        const sensorType = formData.sensorTrigger.sensorType;
        let defaultValue = '';
        let unit = '';

        switch (sensorType) {
          case 'temperature_sensor':
            if (value.property === 'currentTemperature') {
              defaultValue =
                dangerousSensorValues.temperature_sensor.dangerousTemperaturePlus.toString();
              unit = '°C';
            }
            break;
          case 'humidity_sensor':
            if (value.property === 'currentHumidity') {
              defaultValue =
                dangerousSensorValues.humidity_sensor.dangerousHumidity.toString();
              unit = '%';
            }
            break;
          case 'motion_sensor':
            if (value.property === 'currentMotionIntensity') {
              defaultValue =
                dangerousSensorValues.motion_sensor.dangerousMotionIntensity.toString();
              unit = 'рівень';
            }
            break;
          case 'smoke_sensor':
            if (value.property === 'currentSmokeLevel') {
              defaultValue =
                dangerousSensorValues.smoke_sensor.dangerousSmokeLevel.toString();
              unit = '%';
            }
            break;
          case 'water_leak_sensor':
            if (value.property === 'currentWaterDetectionIndex') {
              defaultValue =
                dangerousSensorValues.water_leak_sensor.dangerousWaterDetectionIndex.toString();
              unit = 'індекс';
            }
            break;
          case 'light_sensor':
            if (value.property === 'currentLux') {
              defaultValue =
                dangerousSensorValues.light_sensor.dangerousLux.toString();
              unit = 'лк';
            }
            break;
          case 'air_quality_sensor':
            if (value.property === 'currentAQI') {
              defaultValue =
                dangerousSensorValues.air_quality_sensor.dangerousAQI.toString();
              unit = 'AQI';
            } else if (value.property === 'currentPM25') {
              defaultValue =
                dangerousSensorValues.air_quality_sensor.dangerousPM25.toString();
              unit = 'мкг/м³';
            } else if (value.property === 'currentPM10') {
              defaultValue =
                dangerousSensorValues.air_quality_sensor.dangerousPM10.toString();
              unit = 'мкг/м³';
            }
            break;
          case 'gas_sensor':
            if (value.property === 'currentMethanLevel') {
              defaultValue =
                dangerousSensorValues.gas_sensor.dangerousMethanLevel.toString();
              unit = '% LEL';
            } else if (value.property === 'currentCarbonMonoxideLevel') {
              defaultValue =
                dangerousSensorValues.gas_sensor.dangerousCarbonMonoxideLevel.toString();
              unit = 'ppm';
            } else if (value.property === 'currentCarbonDioxideLevel') {
              defaultValue =
                dangerousSensorValues.gas_sensor.dangerousCarbonDioxideLevel.toString();
              unit = 'ppm';
            } else if (value.property === 'currentPropaneLevel') {
              defaultValue =
                dangerousSensorValues.gas_sensor.dangerousPropaneLevel.toString();
              unit = '% LEL';
            } else if (value.property === 'currentNitrogenDioxideLevel') {
              defaultValue =
                dangerousSensorValues.gas_sensor.dangerousNitrogenDioxideLevel.toString();
              unit = 'мкг/м³';
            } else if (value.property === 'currentOzoneLevel') {
              defaultValue =
                dangerousSensorValues.gas_sensor.dangerousOzoneLevel.toString();
              unit = 'мкг/м³';
            }
            break;
          case 'power_sensor':
            if (value.property === 'currentPower') {
              defaultValue =
                dangerousSensorValues.power_sensor.dangerousPower.toString();
              unit = 'Вт';
            } else if (value.property === 'currentVoltage') {
              defaultValue =
                dangerousSensorValues.power_sensor.dangerousVoltage.toString();
              unit = 'В';
            } else if (value.property === 'currentCurrent') {
              defaultValue =
                dangerousSensorValues.power_sensor.dangerousCurrent.toString();
              unit = 'А';
            }
            break;
          case 'weather_sensor':
            if (value.property === 'currentTemperature') {
              defaultValue =
                dangerousSensorValues.weather_sensor.dangerousTemperaturePlus.toString();
              unit = '°C';
            } else if (value.property === 'currentHumidity') {
              defaultValue = '80'; // Високе значення вологості для погоди
              unit = '%';
            } else if (value.property === 'currentWindSpeed') {
              defaultValue =
                dangerousSensorValues.weather_sensor.dangerousWindSpeed.toString();
              unit = 'м/с';
            } else if (value.property === 'currentRainIntensity') {
              defaultValue =
                dangerousSensorValues.weather_sensor.dangerousRainIntensity.toString();
              unit = 'мм/год';
            } else if (value.property === 'currentPressure') {
              defaultValue = '750'; // Низький тиск, що може впливати на самопочуття
              unit = 'мм рт.ст.';
            }
            break;
          default:
            break;
        }

        setFormData(prev => ({
          ...prev,
          sensorTrigger: {
            ...prev.sensorTrigger,
            condition: {
              property: value.property,
              triggerValue: defaultValue || '',
              unit: unit,
            },
          },
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          sensorTrigger: {
            ...prev.sensorTrigger,
            condition: {
              ...prev.sensorTrigger.condition,
              ...value,
            },
          },
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        sensorTrigger: {
          ...prev.sensorTrigger,
          [field]: value,
        },
      }));
    }
  };

  const handleDeviceActionChange = (field, value) => {
    if (field === 'deviceType') {
      // Якщо змінюється тип пристрою, скидаємо список обраних пристроїв
      setFormData(prev => ({
        ...prev,
        deviceAction: {
          ...prev.deviceAction,
          deviceType: value,
          deviceIds: [], // Скидаємо список обраних пристроїв
          settings: {}, // Скидаємо налаштування
        },
      }));
    } else {
    setFormData(prev => ({
      ...prev,
      deviceAction: {
        ...prev.deviceAction,
        [field]: value,
      },
    }));
    }
  };

  const handleDeviceSettingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      deviceAction: {
        ...prev.deviceAction,
        settings: {
          ...prev.deviceAction.settings,
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // Базова структура об'єкта автоматизації
      const automationData = {
        name: formData.name,
        homeId: currentHome._id,
        triggerType: formData.triggerType,
        deviceAction: {
          deviceType: formData.deviceAction.deviceType,
          deviceIds: formData.deviceAction.deviceIds,
          settings: {}
        }
      };
      
      // Додавання налаштувань залежно від типу пристрою
      switch (formData.deviceAction.deviceType) {
        case 'smart_light':
          // Для розумного освітлення - працює правильно, використовуємо як зразок
          automationData.deviceAction.settings = {
            isActive: true,
            brightness: formData.deviceAction.settings.brightness || 70,
            color: formData.deviceAction.settings.color || 'white'
          };
          break;
          
        case 'thermostat':
          automationData.deviceAction.settings = {
            isActive: true,
            currentTemperature: formData.deviceAction.settings.currentTemperature || 22,
            currentMode: formData.deviceAction.settings.currentMode || 'heat'
          };
          break;
          
        case 'heating_valve':
          automationData.deviceAction.settings = {
            isActive: true,
            currentTemperature: formData.deviceAction.settings.currentTemperature || 22
          };
          break;
          
        case 'smart_lock':
          automationData.deviceAction.settings = {
            isActive: true,
            currentDoorState: formData.deviceAction.settings.currentDoorState || 'closed'
          };
          break;
          
        case 'gate':
          automationData.deviceAction.settings = {
            isActive: true,
            currentPosition: formData.deviceAction.settings.currentPosition || 'closed'
          };
          break;
          
        case 'irrigation_system':
          automationData.deviceAction.settings = {
            isActive: true,
            currentWaterFlow: formData.deviceAction.settings.currentWaterFlow || 50,
            duration: formData.deviceAction.settings.duration || 30
          };
          break;
          
        case 'ventilation':
          automationData.deviceAction.settings = {
            isActive: true,
            currentFanSpeed: formData.deviceAction.settings.currentFanSpeed || 50,
            currentMode: formData.deviceAction.settings.currentMode || 'auto'
          };
          break;
          
        case 'air_purifier':
          automationData.deviceAction.settings = {
            isActive: true,
            currentFanSpeed: formData.deviceAction.settings.currentFanSpeed || 50,
            currentMode: formData.deviceAction.settings.currentMode || 'auto'
          };
          break;
          
        case 'camera':
          automationData.deviceAction.settings = {
            isActive: true,
            currentResolution: formData.deviceAction.settings.currentResolution || { width: 1280, height: 720 }
          };
          break;
          
        case 'smart_plug':
          automationData.deviceAction.settings = {
            isActive: true
          };
          break;
          
        default:
          // Для невідомих типів - просто передаємо базові налаштування
          automationData.deviceAction.settings = {
            isActive: true
          };
      }

      // Додаємо налаштування тригера в залежності від типу
      if (formData.triggerType === 'time') {
        automationData.timeTrigger = {
          startTime: formData.timeTrigger.startTime,
          endTime: formData.timeTrigger.endTime,
          isRecurring: formData.timeTrigger.isRecurring,
          daysOfWeek: formData.timeTrigger.isRecurring ? formData.timeTrigger.daysOfWeek : []
        };
      } else if (formData.triggerType === 'sensor') {
        automationData.sensorTrigger = {
          sensorId: formData.sensorTrigger.sensorId,
          sensorType: formData.sensorTrigger.sensorType,
          condition: {
            property: formData.sensorTrigger.condition.property,
            triggerValue: formData.sensorTrigger.condition.triggerValue,
          }
        };
        
        if (formData.sensorTrigger.condition.unit) {
          automationData.sensorTrigger.condition.unit = formData.sensorTrigger.condition.unit;
        }
      }

      
      const result = await dispatch(createAutomation(automationData)).unwrap();
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Помилка створення автоматизації:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      triggerType: 'time',
      timeTrigger: {
        startTime: getCurrentTime(),
        endTime: getTimeInOneHour(),
        isRecurring: false,
        daysOfWeek: [],
      },
      sensorTrigger: {
        sensorId: '',
        sensorType: '',
        condition: {
          property: '',
          triggerValue: '',
        },
      },
      deviceAction: {
        deviceType: '',
        deviceIds: [],
        settings: {},
      },
    });
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleDayOfWeekChange = day => {
    const daysOfWeek = [...formData.timeTrigger.daysOfWeek];

    if (daysOfWeek.includes(day)) {
      const index = daysOfWeek.indexOf(day);
      daysOfWeek.splice(index, 1);
    } else {
      daysOfWeek.push(day);
    }

    handleTimeTriggerChange('daysOfWeek', daysOfWeek);
  };

  const handleDialogClose = () => {
    resetForm();
    onClose();
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.name.trim() !== '';
      case 1:
        return (
          formData.triggerType === 'time' || formData.triggerType === 'sensor'
        );
      case 2:
        if (formData.triggerType === 'time') {
          return formData.timeTrigger.startTime !== '';
        } else {
          return (
            formData.sensorTrigger.sensorId !== '' &&
            formData.sensorTrigger.condition.triggerValue !== ''
          );
        }
      case 3:
        return (
          formData.deviceAction.deviceType !== '' &&
          formData.deviceAction.deviceIds.length > 0
        );
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              label={t('automation.form.name')}
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              error={formData.name === '' && activeStep > 0}
              helperText={
                formData.name === '' && activeStep > 0
                  ? t('validation.required')
                  : ''
              }
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 1 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>{t('automation.form.triggerType')}</InputLabel>
              <Select
                value={formData.triggerType}
                onChange={e => handleChange('triggerType', e.target.value)}
                label={t('automation.form.triggerType')}
              >
                <MenuItem value="time">
                  {t('automation.triggerTypes.time')}
                </MenuItem>
                <MenuItem value="sensor">
                  {t('automation.triggerTypes.sensor')}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 1 }}>
            {formData.triggerType === 'time' ? (
              // Налаштування за часом
              <>
                <Typography variant="h6" gutterBottom>
                  {t('automation.form.startTime')}
                </Typography>
                <TextField
                  fullWidth
                  type="time"
                  value={formData.timeTrigger.startTime}
                  onChange={e =>
                    handleTimeTriggerChange('startTime', e.target.value)
                  }
                  inputProps={{
                    step: 300,
                  }}
                  sx={{ mb: 2 }}
                />

                <Typography variant="h6" gutterBottom>
                  {t('automation.form.endTime')}
                </Typography>
                <TextField
                  fullWidth
                  type="time"
                  value={formData.timeTrigger.endTime}
                  onChange={e =>
                    handleTimeTriggerChange('endTime', e.target.value)
                  }
                  inputProps={{
                    step: 300,
                  }}
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.timeTrigger.isRecurring}
                      onChange={e =>
                        handleTimeTriggerChange('isRecurring', e.target.checked)
                      }
                    />
                  }
                  label={t('automation.form.isRecurring')}
                  sx={{ mb: 2 }}
                />

                {formData.timeTrigger.isRecurring && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      {t('automation.form.daysOfWeek')}
                    </Typography>
                    <Box
                      sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}
                    >
                      {DAYS_OF_WEEK.map(day => (
                        <Button
                          key={day.value}
                          variant={
                            formData.timeTrigger.daysOfWeek.includes(day.value)
                              ? 'contained'
                              : 'outlined'
                          }
                          onClick={() => handleDayOfWeekChange(day.value)}
                          sx={{ minWidth: 40 }}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </Box>
                  </>
                )}
              </>
            ) : (
              // Налаштування за сенсором
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{t('automation.form.sensor')}</InputLabel>
                  <Select
                    value={formData.sensorTrigger.sensorId}
                    onChange={e =>
                      handleSensorTriggerChange('sensorId', e.target.value)
                    }
                    label={t('automation.form.sensor')}
                  >
                    {getAllSensors.length === 0 ? (
                      <MenuItem disabled>
                        {t('automation.form.noSensorsAvailable')}
                      </MenuItem>
                    ) : (
                      getAllSensors.map(sensor => (
                        <MenuItem key={sensor._id} value={sensor._id}>
                          <ListItemText
                            primary={sensor.name}
                            secondary={`${t('automation.form.sensor')}: ${getSensorTypeLabel(sensor.sensorType)}, ${t('room.name')}: ${sensor.roomName}, ${t('room.type')}: ${t(`roomTypes.${sensor.roomType}`)}`}
                          />
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                {formData.sensorTrigger.sensorId && (
                  <>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>
                        {t('automation.form.sensorProperty')}
                      </InputLabel>
                      <Select
                        value={formData.sensorTrigger.condition?.property || ''}
                        onChange={e =>
                          handleSensorTriggerChange('condition', {
                            ...formData.sensorTrigger.condition,
                            property: e.target.value,
                          })
                        }
                        label={t('automation.form.sensorProperty')}
                      >
                        {formData.sensorTrigger.sensorType ===
                          'temperature_sensor' && (
                          <MenuItem value="currentTemperature">
                            {t('automation.sensorProperties.temperature')}
                          </MenuItem>
                        )}
                        {formData.sensorTrigger.sensorType ===
                          'humidity_sensor' && (
                          <MenuItem value="currentHumidity">
                            {t('automation.sensorProperties.humidity')}
                          </MenuItem>
                        )}
                        {formData.sensorTrigger.sensorType ===
                          'motion_sensor' && (
                          <MenuItem value="currentMotionIntensity">
                            {t('automation.sensorProperties.motion')}
                          </MenuItem>
                        )}
                        {formData.sensorTrigger.sensorType ===
                          'smoke_sensor' && (
                          <MenuItem value="currentSmokeLevel">
                            {t('automation.sensorProperties.smoke')}
                          </MenuItem>
                        )}
                        {formData.sensorTrigger.sensorType ===
                          'water_leak_sensor' && (
                          <MenuItem value="currentWaterDetectionIndex">
                            {t('automation.sensorProperties.waterLeak')}
                          </MenuItem>
                        )}
                        {formData.sensorTrigger.sensorType ===
                          'light_sensor' && (
                          <MenuItem value="currentLux">
                            {t('automation.sensorProperties.light')}
                          </MenuItem>
                        )}
                        {formData.sensorTrigger.sensorType ===
                          'air_quality_sensor' && [
                          <MenuItem key="aqi" value="currentAQI">
                            {t('automation.sensorProperties.airQuality')}
                          </MenuItem>,
                          <MenuItem key="pm25" value="currentPM25">
                            {t('automation.sensorProperties.pm25')}
                          </MenuItem>,
                          <MenuItem key="pm10" value="currentPM10">
                            {t('automation.sensorProperties.pm10')}
                          </MenuItem>,
                        ]}
                        {formData.sensorTrigger.sensorType === 'gas_sensor' && [
                          <MenuItem key="methane" value="currentMethanLevel">
                            {t('automation.sensorProperties.methane')}
                          </MenuItem>,
                          <MenuItem key="co" value="currentCarbonMonoxideLevel">
                            {t('automation.sensorProperties.carbonMonoxide')}
                          </MenuItem>,
                          <MenuItem key="co2" value="currentCarbonDioxideLevel">
                            {t('automation.sensorProperties.carbonDioxide')}
                          </MenuItem>,
                          <MenuItem key="propane" value="currentPropaneLevel">
                            {t('automation.sensorProperties.propane')}
                          </MenuItem>,
                          <MenuItem key="no2" value="currentNitrogenDioxideLevel">
                            {t('automation.sensorProperties.nitrogenDioxide')}
                          </MenuItem>,
                          <MenuItem key="ozone" value="currentOzoneLevel">
                            {t('automation.sensorProperties.ozone')}
                          </MenuItem>
                        ]}
                        {formData.sensorTrigger.sensorType ===
                          'power_sensor' && [
                          <MenuItem key="power" value="currentPower">
                            {t('automation.sensorProperties.power')}
                          </MenuItem>,
                          <MenuItem key="voltage" value="currentVoltage">
                            {t('automation.sensorProperties.voltage')}
                          </MenuItem>,
                          <MenuItem key="amperage" value="currentAmperage">
                            {t('automation.sensorProperties.current')}
                          </MenuItem>,
                        ]}
                        {formData.sensorTrigger.sensorType ===
                          'weather_sensor' && [
                          <MenuItem
                            key="temperature"
                            value="currentTemperature"
                          >
                            {t('automation.sensorProperties.temperature')}
                          </MenuItem>,
                          <MenuItem key="humidity" value="currentHumidity">
                            {t('automation.sensorProperties.humidity')}
                          </MenuItem>,
                          <MenuItem key="windSpeed" value="currentWindSpeed">
                            {t('automation.sensorProperties.windSpeed')}
                          </MenuItem>,
                          <MenuItem
                            key="rainIntensity"
                            value="currentRainIntensity"
                          >
                            {t('automation.sensorProperties.rainIntensity')}
                          </MenuItem>,
                          <MenuItem key="pressure" value="currentPressure">
                            {t('automation.sensorProperties.pressure')}
                          </MenuItem>,
                        ]}
                      </Select>
                    </FormControl>

                    {formData.sensorTrigger.condition?.property && (
                      <TextField
                        fullWidth
                        label={t('automation.form.thresholdValue')}
                        type="number"
                        value={
                          formData.sensorTrigger.condition.triggerValue || ''
                        }
                        onChange={e =>
                          handleSensorTriggerChange('condition', {
                            ...formData.sensorTrigger.condition,
                            triggerValue: e.target.value,
                          })
                        }
                        InputProps={{
                          endAdornment: (
                            <Typography variant="body2" color="textSecondary">
                              {formData.sensorTrigger.condition.unit}
                            </Typography>
                          ),
                        }}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ p: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('automation.form.deviceType')}</InputLabel>
              <Select
                value={formData.deviceAction.deviceType}
                onChange={e =>
                  handleDeviceActionChange('deviceType', e.target.value)
                }
                label={t('automation.form.deviceType')}
              >
                {DEVICE_TYPES.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.deviceAction.deviceType && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('automation.form.devices')}</InputLabel>
                <Select
                  multiple
                  value={formData.deviceAction.deviceIds}
                  onChange={e =>
                    handleDeviceActionChange('deviceIds', e.target.value)
                  }
                  input={<OutlinedInput label={t('automation.form.devices')} />}
                  renderValue={selected => {
                    const selectedDevices = availableDevices.filter(device =>
                      selected.includes(device._id)
                    );
                    return selectedDevices
                      .map(device => device.name)
                      .join(', ');
                  }}
                >
                  {availableDevices.filter(
                    device =>
                      device.deviceType === formData.deviceAction.deviceType
                  ).length === 0 ? (
                    <MenuItem disabled>
                      {t('automation.form.noDevicesAvailable')}
                    </MenuItem>
                  ) : (
                    availableDevices
                      .filter(
                        device =>
                          device.deviceType === formData.deviceAction.deviceType
                      )
                      .map(device => (
                        <MenuItem key={device._id} value={device._id}>
                          <Checkbox
                            checked={
                              formData.deviceAction.deviceIds.indexOf(
                                device._id
                              ) > -1
                            }
                          />
                          <ListItemText
                            primary={device.name}
                            secondary={`${t('room.name')}: ${device.roomName}, ${t('room.type')}: ${t(`roomTypes.${device.roomType}`)}`}
                          />
                        </MenuItem>
                      ))
                  )}
                </Select>
              </FormControl>
            )}

            {/* Налаштування для конкретного типу пристрою */}
            {formData.deviceAction.deviceType === 'smart_plug' && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('automation.form.noSpecificSettings')}
              </Typography>
            )}

            {formData.deviceAction.deviceType === 'smart_light' && (
              <>
                <TextField
                  fullWidth
                  label={t('automation.deviceSettings.brightness')}
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  value={formData.deviceAction.settings.brightness || ''}
                  onChange={e =>
                    handleDeviceSettingChange(
                      'brightness',
                      Number(e.target.value)
                    )
                  }
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>
                    {t('automation.deviceSettings.color')}
                  </InputLabel>
                  <Select
                    value={formData.deviceAction.settings.color || 'white'}
                    onChange={e =>
                      handleDeviceSettingChange('color', e.target.value)
                    }
                    label={t('automation.deviceSettings.color')}
                  >
                    <MenuItem value="white">
                      {t('automation.deviceSettings.lightColors.white')}
                    </MenuItem>
                    <MenuItem value="warm_white">
                      {t('automation.deviceSettings.lightColors.warm_white')}
                    </MenuItem>
                    <MenuItem value="daylight">
                      {t('automation.deviceSettings.lightColors.daylight')}
                    </MenuItem>
                    <MenuItem value="soft_white">
                      {t('automation.deviceSettings.lightColors.soft_white')}
                    </MenuItem>
                    <MenuItem value="cool_white">
                      {t('automation.deviceSettings.lightColors.cool_white')}
                    </MenuItem>
                    <MenuItem value="candle">
                      {t('automation.deviceSettings.lightColors.candle')}
                    </MenuItem>
                    <MenuItem value="sunset">
                      {t('automation.deviceSettings.lightColors.sunset')}
                    </MenuItem>
                    <MenuItem value="sunrise">
                      {t('automation.deviceSettings.lightColors.sunrise')}
                    </MenuItem>
                    <MenuItem value="night_mode">
                      {t('automation.deviceSettings.lightColors.night_mode')}
                    </MenuItem>
                    <MenuItem value="reading_mode">
                      {t('automation.deviceSettings.lightColors.reading_mode')}
                    </MenuItem>
                    <MenuItem value="relax_mode">
                      {t('automation.deviceSettings.lightColors.relax_mode')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {formData.deviceAction.deviceType === 'thermostat' && (
              <>
                <TextField
                  fullWidth
                  label={t('automation.deviceSettings.temperature')}
                  type="number"
                  inputProps={{ min: 5, max: 35 }}
                  value={formData.deviceAction.settings.currentTemperature || ''}
                  onChange={e =>
                    handleDeviceSettingChange(
                      'currentTemperature',
                      Number(e.target.value)
                    )
                  }
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth>
                  <InputLabel>{t('automation.deviceSettings.mode')}</InputLabel>
                  <Select
                    value={formData.deviceAction.settings.currentMode || 'heat'}
                    onChange={e =>
                      handleDeviceSettingChange('currentMode', e.target.value)
                    }
                    label={t('automation.deviceSettings.mode')}
                  >
                    <MenuItem value="heat">
                      {t('automation.deviceSettings.thermostatModes.heat')}
                    </MenuItem>
                    <MenuItem value="cool">
                      {t('automation.deviceSettings.thermostatModes.cool')}
                    </MenuItem>
                    <MenuItem value="auto">
                      {t('automation.deviceSettings.thermostatModes.auto')}
                    </MenuItem>
                    <MenuItem value="eco">
                      {t('automation.deviceSettings.thermostatModes.eco')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {formData.deviceAction.deviceType === 'heating_valve' && (
              <TextField
                fullWidth
                label={t('automation.deviceSettings.temperature')}
                type="number"
                inputProps={{ min: 5, max: 35 }}
                value={formData.deviceAction.settings.currentTemperature || ''}
                onChange={e =>
                  handleDeviceSettingChange(
                    'currentTemperature',
                    Number(e.target.value)
                  )
                }
              />
            )}

            {formData.deviceAction.deviceType === 'smart_lock' && (
              <FormControl fullWidth>
                <InputLabel>
                  {t('automation.deviceSettings.doorState')}
                </InputLabel>
                <Select
                  value={formData.deviceAction.settings.currentDoorState || 'closed'}
                  onChange={e =>
                    handleDeviceSettingChange('currentDoorState', e.target.value)
                  }
                  label={t('automation.deviceSettings.doorState')}
                >
                  <MenuItem value="open">
                    {t('automation.deviceSettings.doorStates.open')}
                  </MenuItem>
                  <MenuItem value="closed">
                    {t('automation.deviceSettings.doorStates.closed')}
                  </MenuItem>
                </Select>
              </FormControl>
            )}

            {formData.deviceAction.deviceType === 'gate' && (
              <FormControl fullWidth>
                <InputLabel>
                  {t('automation.deviceSettings.position')}
                </InputLabel>
                <Select
                  value={formData.deviceAction.settings.currentPosition || 'closed'}
                  onChange={e =>
                    handleDeviceSettingChange('currentPosition', e.target.value)
                  }
                  label={t('automation.deviceSettings.position')}
                >
                  <MenuItem value="open">
                    {t('automation.deviceSettings.doorStates.open')}
                  </MenuItem>
                  <MenuItem value="closed">
                    {t('automation.deviceSettings.doorStates.closed')}
                  </MenuItem>
                </Select>
              </FormControl>
            )}

            {formData.deviceAction.deviceType === 'irrigation_system' && (
              <>
                <TextField
                  fullWidth
                  label={t('automation.deviceSettings.waterFlow')}
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  value={formData.deviceAction.settings.currentWaterFlow || ''}
                  onChange={e =>
                    handleDeviceSettingChange(
                      'currentWaterFlow',
                      Number(e.target.value)
                    )
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label={t('automation.deviceSettings.duration')}
                  type="number"
                  inputProps={{ min: 1, max: 120 }}
                  value={formData.deviceAction.settings.duration || ''}
                  onChange={e =>
                    handleDeviceSettingChange(
                      'duration',
                      Number(e.target.value)
                    )
                  }
                  sx={{ mb: 2 }}
                />
              </>
            )}

            {formData.deviceAction.deviceType === 'ventilation' && (
              <>
                <TextField
                  fullWidth
                  label={t('automation.deviceSettings.fanSpeed')}
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  value={formData.deviceAction.settings.currentFanSpeed || ''}
                  onChange={e =>
                    handleDeviceSettingChange(
                      'currentFanSpeed',
                      Number(e.target.value)
                    )
                  }
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>
                    {t('automation.deviceSettings.mode')}
                  </InputLabel>
                  <Select
                    value={formData.deviceAction.settings.currentMode || 'auto'}
                    onChange={e =>
                      handleDeviceSettingChange('currentMode', e.target.value)
                    }
                    label={t('automation.deviceSettings.mode')}
                  >
                    <MenuItem value="auto">
                      {t('automation.deviceSettings.ventilationModes.auto')}
                    </MenuItem>
                    <MenuItem value="manual">
                      {t('automation.deviceSettings.ventilationModes.manual')}
                    </MenuItem>
                    <MenuItem value="boost">
                      {t('automation.deviceSettings.ventilationModes.boost')}
                    </MenuItem>
                    <MenuItem value="eco">
                      {t('automation.deviceSettings.ventilationModes.eco')}
                    </MenuItem>
                    <MenuItem value="night">
                      {t('automation.deviceSettings.ventilationModes.night')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {formData.deviceAction.deviceType === 'air_purifier' && (
              <>
                <TextField
                  fullWidth
                  label={t('automation.deviceSettings.fanSpeed')}
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  value={formData.deviceAction.settings.currentFanSpeed || ''}
                  onChange={e =>
                    handleDeviceSettingChange(
                      'currentFanSpeed',
                      Number(e.target.value)
                    )
                  }
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>
                    {t('automation.deviceSettings.mode')}
                  </InputLabel>
                  <Select
                    value={formData.deviceAction.settings.currentMode || 'auto'}
                    onChange={e =>
                      handleDeviceSettingChange('currentMode', e.target.value)
                    }
                    label={t('automation.deviceSettings.mode')}
                  >
                    <MenuItem value="auto">
                      {t('automation.deviceSettings.purifierModes.auto')}
                    </MenuItem>
                    <MenuItem value="manual">
                      {t('automation.deviceSettings.purifierModes.manual')}
                    </MenuItem>
                    <MenuItem value="sleep">
                      {t('automation.deviceSettings.purifierModes.sleep')}
                    </MenuItem>
                    <MenuItem value="turbo">
                      {t('automation.deviceSettings.purifierModes.turbo')}
                    </MenuItem>
                    <MenuItem value="quiet">
                      {t('automation.deviceSettings.purifierModes.quiet')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {formData.deviceAction.deviceType === 'camera' && (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>
                    {t('automation.deviceSettings.resolution')}
                  </InputLabel>
                  <Select
                    value={
                      formData.deviceAction.settings.currentResolution?.width
                        ? `${formData.deviceAction.settings.currentResolution.width}x${formData.deviceAction.settings.currentResolution.height}`
                        : '1280x720'
                    }
                    onChange={e => {
                      const [width, height] = e.target.value.split('x').map(Number);
                      handleDeviceSettingChange('currentResolution', { width, height });
                    }}
                    label={t('automation.deviceSettings.resolution')}
                  >
                    <MenuItem value="640x480">
                      640 x 480 (VGA)
                    </MenuItem>
                    <MenuItem value="1280x720">
                      1280 x 720 (HD)
                    </MenuItem>
                    <MenuItem value="1920x1080">
                      1920 x 1080 (Full HD)
                    </MenuItem>
                    <MenuItem value="2560x1440">
                      2560 x 1440 (2K)
                    </MenuItem>
                    <MenuItem value="3840x2160">
                      3840 x 2160 (4K)
                    </MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </Box>
        );
      case 4:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t('automation.review.title')}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body1">
              <strong>{t('automation.review.name')}:</strong> {formData.name}
            </Typography>
            <Typography variant="body1">
              <strong>{t('automation.review.triggerType')}:</strong>{' '}
              {formData.triggerType === 'time' ? t('automation.triggerTypes.time') : t('automation.triggerTypes.sensor')}
            </Typography>

            {formData.triggerType === 'time' ? (
              <>
                <Typography variant="body1">
                  <strong>{t('automation.review.time')}:</strong> {formData.timeTrigger.startTime}
                  {formData.timeTrigger.endTime &&
                    ` - ${formData.timeTrigger.endTime}`}
                </Typography>
                {formData.timeTrigger.isRecurring && (
                  <Typography variant="body1">
                    <strong>{t('automation.review.repeatDays')}:</strong>{' '}
                    {formData.timeTrigger.daysOfWeek.length > 0
                      ? formData.timeTrigger.daysOfWeek
                          .map(day => t(`common.days.${day}_short`))
                          .join(', ')
                      : t('automation.review.everyday')}
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body1">
                <strong>{t('automation.review.sensor')}:</strong>{' '}
                {getAllSensors.find(
                  s => s._id === formData.sensorTrigger.sensorId
                )?.name || ''}
                <br />
                <strong>{t('automation.review.property')}:</strong>{' '}
                {t(`automation.sensorProperties.${formData.sensorTrigger.condition.property}`, formData.sensorTrigger.condition.property)}
                <br />
                <strong>{t('automation.review.thresholdValue')}:</strong>{' '}
                {formData.sensorTrigger.condition.triggerValue}{' '}
                {formData.sensorTrigger.condition.unit || ''}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              {t('automation.review.deviceActions')}:
            </Typography>

            <Typography variant="body1">
              <strong>{t('automation.review.deviceType')}:</strong>{' '}
              {DEVICE_TYPES.find(
                t => t.value === formData.deviceAction.deviceType
              )?.label || ''}
            </Typography>

            <Typography variant="body1">
              <strong>{t('automation.review.selectedDevices')}:</strong>{' '}
              {formData.deviceAction.deviceIds
                .map(deviceId => {
                  const device = availableDevices.find(d => d._id === deviceId);
                  return device ? device.name : '';
                })
                .join(', ')}
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('automation.addAutomation')}</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3, mt: 1 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2 }}>
          {renderStepContent()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>{t('common.cancel')}</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>{t('common.back')}</Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            {t('common.next')}
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {t('common.create')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddAutomationDialog;