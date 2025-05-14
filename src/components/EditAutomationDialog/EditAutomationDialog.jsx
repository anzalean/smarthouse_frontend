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
  Grid,
  ListItemText,
  Divider,
  OutlinedInput,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateAutomation } from '../../redux/slices/homesSlice';
import { getSensorTypeLabel } from '../../utils/sensorHelpers';
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

const EditAutomationDialog = ({ open, onClose, automation }) => {
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
    { value: 'irrigation_system', label: t('device.deviceTypes.irrigation_system') },
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
        sensors.push(...room.sensors.map(sensor => ({
          ...sensor,
          roomName: room.name
        })));
      }
    });
    return sensors;
  });

  // Змінюємо кроки для форми редагування
  const steps = [
    t('automation.steps.name'),
    t('automation.steps.triggerSettings'),
    t('automation.steps.deviceActions'),
    t('automation.steps.confirmation')
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
        unit: '',
      },
    },
    deviceAction: {
      deviceType: '',
      deviceIds: [],
      settings: {},
    }
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
              roomName: room.name
            });
          });
        }
      });
      setAvailableDevices(devices);
    }
  }, [currentHome]);

  useEffect(() => {
    if (automation) {
      setFormData({
        name: automation.name || '',
        triggerType: automation.triggerType || 'time',
        timeTrigger: {
          startTime: automation.timeTrigger?.startTime || getCurrentTime(),
          endTime: automation.timeTrigger?.endTime || getTimeInOneHour(),
          isRecurring: automation.timeTrigger?.isRecurring || false,
          daysOfWeek: automation.timeTrigger?.daysOfWeek || [],
        },
        sensorTrigger: {
          sensorId: automation.sensorTrigger?.sensorId || '',
          sensorType: automation.sensorTrigger?.sensorType || '',
          condition: {
            property: automation.sensorTrigger?.condition?.property || '',
            triggerValue: automation.sensorTrigger?.condition?.triggerValue || '',
            unit: automation.sensorTrigger?.condition?.unit || '',
          },
        },
        deviceAction: {
          deviceType: automation.deviceAction?.deviceType || '',
          deviceIds: automation.deviceAction?.deviceIds || [],
          settings: automation.deviceAction?.settings || {},
        }
      });
    }
  }, [automation]);

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
    if (field === 'condition') {
      // Дозволяємо змінювати лише triggerValue, зберігаючи інші поля
      setFormData(prev => ({
        ...prev,
        sensorTrigger: {
          ...prev.sensorTrigger,
          condition: {
            ...prev.sensorTrigger.condition,
            triggerValue: value.triggerValue,
          },
        },
      }));
    } else {
      // Для інших полів (яким в інтерфейсі вже не можна вносити зміни)
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

  const handleSubmit = async () => {
    try {
      // Створюємо об'єкт з оновленими даними в залежності від типу автоматизації
      const updatedData = {
        name: formData.name,
      };

      // Якщо тип тригера - час, додаємо налаштування часу
      if (formData.triggerType === 'time') {
        updatedData.timeTrigger = {
          startTime: formData.timeTrigger.startTime,
          endTime: formData.timeTrigger.endTime,
          isRecurring: formData.timeTrigger.isRecurring,
          daysOfWeek: formData.timeTrigger.daysOfWeek
        };
      } 
      // Якщо тип тригера - сенсор, додаємо лише оновлене порогове значення
      else if (formData.triggerType === 'sensor') {
        updatedData.sensorTrigger = {
          sensorId: formData.sensorTrigger.sensorId,
          sensorType: formData.sensorTrigger.sensorType,
          condition: {
            property: formData.sensorTrigger.condition.property,
            triggerValue: formData.sensorTrigger.condition.triggerValue,
            unit: formData.sensorTrigger.condition.unit
          }
        };
      }

      // Додаємо лише обрані пристрої, без зміни типу і налаштувань
      updatedData.deviceAction = {
        deviceType: formData.deviceAction.deviceType,
        deviceIds: formData.deviceAction.deviceIds,
        settings: formData.deviceAction.settings
      };

      await dispatch(updateAutomation({
        id: automation._id,
        data: updatedData
      })).unwrap();
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to update automation:', error);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleDayOfWeekChange = (day) => {
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

  // Фільтруємо пристрої за типом пристрою в автоматизації (тип не можна змінювати)
  const filteredDevices = availableDevices.filter(
    device => device.deviceType === formData.deviceAction.deviceType
  );

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.name.trim() !== '';
      case 1:
        if (formData.triggerType === 'time') {
          return formData.timeTrigger.startTime !== '';
        } else {
          return formData.sensorTrigger.condition.triggerValue !== '';
        }
      case 2:
        return formData.deviceAction.deviceIds.length > 0;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    // Для пошуку вибраного сенсора
    const selectedSensor = getAllSensors.find(s => s._id === formData.sensorTrigger.sensorId);
    
    // Для пошуку обраних пристроїв
    const selectedDevices = availableDevices.filter(device => 
      formData.deviceAction.deviceIds.includes(device._id)
    );
    
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('automation.form.name')}
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              autoFocus
              required
            />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              {t('automation.form.triggerTypeFixed')}: {formData.triggerType === 'time' ? t('automation.triggerTypes.time') : t('automation.triggerTypes.sensor')}
              ({t('automation.form.cannotChange')})
            </Typography>
          </Box>
        );
      case 1:
        if (formData.triggerType === 'time') {
          return (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label={t('automation.form.startTime')}
                type="time"
                value={formData.timeTrigger.startTime}
                onChange={e => handleTimeTriggerChange('startTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label={t('automation.form.endTime')}
                type="time"
                value={formData.timeTrigger.endTime}
                onChange={e => handleTimeTriggerChange('endTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.timeTrigger.isRecurring}
                    onChange={(e) => handleTimeTriggerChange('isRecurring', e.target.checked)}
                  />
                }
                label={t('automation.form.isRecurring')}
                sx={{ mb: 1 }}
              />
              
              {formData.timeTrigger.isRecurring && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t('automation.form.daysOfWeek')}:
                  </Typography>
                  <Grid container spacing={1}>
                    {DAYS_OF_WEEK.map((day) => (
                      <Grid item key={day.value}>
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={formData.timeTrigger.daysOfWeek.includes(day.value)}
                              onChange={() => handleDayOfWeekChange(day.value)}
                              size="small"
                            />
                          }
                          label={day.label}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          );
        } else {
          // Сенсорний тригер - показуємо інформацію про сенсор та дозволяємо змінити лише порогове значення
          return (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>{t('automation.form.sensor')}:</strong> {selectedSensor?.name || t('common.unknown')}
                <br />
                <strong>{t('automation.form.sensorType')}:</strong> {getSensorTypeLabel(selectedSensor?.sensorType) || t('common.unknown')}
                <br />
                <strong>{t('automation.form.sensorProperty')}:</strong> {
                  formData.sensorTrigger.condition.property === 'currentTemperature' ? t('automation.sensorProperties.temperature') :
                  formData.sensorTrigger.condition.property === 'currentHumidity' ? t('automation.sensorProperties.humidity') :
                  formData.sensorTrigger.condition.property === 'currentLux' ? t('automation.sensorProperties.light') :
                  formData.sensorTrigger.condition.property === 'currentMotionIntensity' ? t('automation.sensorProperties.motion') :
                  formData.sensorTrigger.condition.property === 'currentCO2Level' ? t('automation.sensorProperties.carbonDioxide') :
                  formData.sensorTrigger.condition.property === 'currentPressure' ? t('automation.sensorProperties.pressure') :
                  formData.sensorTrigger.condition.property || t('common.unknown')
                }
              </Typography>

              <TextField
                fullWidth
                label={t('automation.form.thresholdValue') + (formData.sensorTrigger.condition.unit ? ` (${formData.sensorTrigger.condition.unit})` : '')}
                type="number"
                value={formData.sensorTrigger.condition.triggerValue}
                onChange={e =>
                  handleSensorTriggerChange('condition', {
                    ...formData.sensorTrigger.condition,
                    triggerValue: e.target.value,
                  })
                }
                required
              />
            </Box>
          );
        }
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>{t('automation.form.deviceType')}:</strong> {DEVICE_TYPES.find(t => t.value === formData.deviceAction.deviceType)?.label || formData.deviceAction.deviceType}
              <span style={{ color: 'text.secondary' }}> ({t('automation.form.cannotChange')})</span>
            </Typography>

            {formData.deviceAction.deviceType && (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{t('automation.form.devices')}</InputLabel>
                  <Select
                    multiple
                    value={formData.deviceAction.deviceIds}
                    onChange={e => handleDeviceActionChange('deviceIds', e.target.value)}
                    input={<OutlinedInput label={t('automation.form.devices')} />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map(deviceId => {
                          const device = availableDevices.find(d => d._id === deviceId);
                          return device ? device.name : '';
                        }).join(', ')}
                      </Box>
                    )}
                    required
                  >
                    {filteredDevices.length === 0 ? (
                      <MenuItem disabled>
                        {t('automation.form.noDevicesAvailable')}
                      </MenuItem>
                    ) : (
                      filteredDevices.map(device => (
                        <MenuItem key={device._id} value={device._id}>
                          <Checkbox checked={formData.deviceAction.deviceIds.includes(device._id)} />
                          <ListItemText 
                            primary={device.name} 
                            secondary={`${t('automation.form.deviceType')}: ${DEVICE_TYPES.find(t => t.value === device.deviceType)?.label || device.deviceType}, ${t('room.name')}: ${device.roomName || t('common.unknown')}, ${t('room.type')}: ${t(`roomTypes.${device.roomType}`) || t('common.unknown')}`} 
                          />
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                {/* Показуємо налаштування пристроїв, але не дозволяємо їх редагувати */}
                {(formData.deviceAction.deviceType === 'smart_light' && 
                  formData.deviceAction.settings.brightness !== undefined) && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('automation.deviceSettings.brightness')}: {formData.deviceAction.settings.brightness}%
                  </Typography>
                )}

                {(formData.deviceAction.deviceType === 'smart_light' && 
                  formData.deviceAction.settings.color) && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('automation.deviceSettings.color')}: {
                      t(`automation.deviceSettings.lightColors.${formData.deviceAction.settings.color}`) || formData.deviceAction.settings.color
                    }
                  </Typography>
                )}

                {(formData.deviceAction.deviceType === 'thermostat' && 
                  formData.deviceAction.settings.temperature !== undefined) && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('automation.deviceSettings.temperature')}: {formData.deviceAction.settings.temperature}°C
                  </Typography>
                )}

                {(formData.deviceAction.deviceType === 'thermostat' && 
                  formData.deviceAction.settings.mode) && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('automation.deviceSettings.mode')}: {
                      t(`automation.deviceSettings.thermostatModes.${formData.deviceAction.settings.mode}`) || formData.deviceAction.settings.mode
                    }
                  </Typography>
                )}

                {(formData.deviceAction.deviceType === 'ventilation' && 
                  formData.deviceAction.settings.currentFanSpeed !== undefined) && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('automation.deviceSettings.fanSpeed')}: {formData.deviceAction.settings.currentFanSpeed}%
                  </Typography>
                )}

                {(formData.deviceAction.deviceType === 'ventilation' && 
                  formData.deviceAction.settings.currentMode) && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('automation.deviceSettings.mode')}: {
                      t(`automation.deviceSettings.ventilationModes.${formData.deviceAction.settings.currentMode}`) || formData.deviceAction.settings.currentMode
                    }
                  </Typography>
                )}
                
                {(formData.deviceAction.deviceType === 'air_purifier' && 
                  formData.deviceAction.settings.currentFanSpeed !== undefined) && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('automation.deviceSettings.fanSpeed')}: {formData.deviceAction.settings.currentFanSpeed}%
                  </Typography>
                )}

                {(formData.deviceAction.deviceType === 'air_purifier' && 
                  formData.deviceAction.settings.currentMode) && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('automation.deviceSettings.mode')}: {
                      t(`automation.deviceSettings.purifierModes.${formData.deviceAction.settings.currentMode}`) || formData.deviceAction.settings.currentMode
                    }
                  </Typography>
                )}

                {(formData.deviceAction.deviceType === 'irrigation_system' && 
                  formData.deviceAction.settings.currentWaterFlow !== undefined) && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('automation.deviceSettings.waterFlow')}: {formData.deviceAction.settings.currentWaterFlow}%
                  </Typography>
                )}

                {(formData.deviceAction.deviceType === 'irrigation_system' && 
                  formData.deviceAction.settings.duration !== undefined) && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('automation.deviceSettings.duration')}: {formData.deviceAction.settings.duration} {t('common.minutes')}
                  </Typography>
                )}

                {(formData.deviceAction.deviceType === 'camera' && 
                  formData.deviceAction.settings.currentResolution) && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {t('automation.deviceSettings.resolution')}: {formData.deviceAction.settings.currentResolution.width}x{formData.deviceAction.settings.currentResolution.height}
                  </Typography>
                )}

                {/* Інші налаштування для інших типів пристроїв */}
              </>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('automation.review.title')}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              <strong>{t('automation.review.name')}:</strong> {formData.name}
            </Typography>
            
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              <strong>{t('automation.review.triggerType')}:</strong> {formData.triggerType === 'time' ? 
                t('automation.triggerTypes.time') : 
                t('automation.triggerTypes.sensor')}
            </Typography>
            
            {formData.triggerType === 'time' ? (
              <>
                <Typography variant="body1">
                  <strong>{t('automation.review.time')}:</strong> {formData.timeTrigger.startTime}
                  <br />
                  {formData.timeTrigger.isRecurring && (
                    <>
                      <strong>{t('automation.review.repeatDays')}:</strong>
                      {' '}
                      {formData.timeTrigger.daysOfWeek.length === 7 
                        ? t('automation.review.everyday')
                        : formData.timeTrigger.daysOfWeek.map(day => 
                            t(`common.days.${day}_short`)
                          ).join(', ')}
                    </>
                  )}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body1">
                  <strong>{t('automation.review.sensor')}:</strong> {selectedSensor?.name || t('common.unknown')}
                  <br />
                  <strong>{t('automation.review.property')}:</strong> {getSensorTypeLabel(selectedSensor?.sensorType) || t('common.unknown')}
                  <br />
                  <strong>{t('automation.review.thresholdValue')}:</strong> {formData.sensorTrigger.condition?.triggerValue || '-'} {formData.sensorTrigger.condition?.unit || ''}
                </Typography>
              </>
            )}
            
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              {t('automation.review.deviceActions')}:
            </Typography>
            
            <Typography variant="body1">
              <strong>{t('automation.review.deviceType')}:</strong> {
                DEVICE_TYPES.find(t => t.value === formData.deviceAction.deviceType)?.label || ''
              }
            </Typography>
            
            <Typography variant="body1">
              <strong>{t('automation.review.selectedDevices')}:</strong>{' '}
              {selectedDevices.map(device => device.name).join(', ')}
            </Typography>
            
            {/* Інші деталі налаштувань пристроїв залишаємо незмінними */}
          </Box>
        );
      default:
        return null;
    }
  };

  if (!automation) return null;

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('automation.editAutomation')}</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3, mt: 1 }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent()}
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            {t('common.save')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditAutomationDialog; 