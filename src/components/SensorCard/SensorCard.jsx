import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Switch,
  Divider,
  Stack,
  Tooltip,
  Chip,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { updateSensor } from '../../redux/slices/homesSlice';
import { getSensorImage, getSensorTypeLabel } from '../../utils/sensorHelpers';

/**
 * Компонент картки сенсора
 * @param {Object} sensor - Об'єкт сенсора
 * @param {Function} onEdit - Функція для редагування сенсора
 * @param {Function} onDelete - Функція для видалення сенсора
 * @param {string} userRole - Роль користувача в будинку, до якого належить сенсор
 */
const SensorCard = ({ sensor, onEdit, onDelete, userRole }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // Отримуємо стан лоадера для зміни статусу сенсора з Redux
  const isStatusToggling = useSelector((state) => state.ui.loaders.sensorStatusToggle);
  
  // State для відстеження зміни ролі
  const [currentRole, setCurrentRole] = useState(userRole);
  
  // Визначаємо чи є користувач власником, використовуючи переданий параметр userRole
  const isOwner = currentRole === 'owner';
  
  // Визначаємо чи є користувач гостем
  const isGuest = currentRole === 'guest';
  
  // useEffect для відстеження змін ролі
  useEffect(() => {
    if (userRole !== currentRole) {
      setCurrentRole(userRole);
    }
  }, [userRole, currentRole]);
  
  const sensorImage = getSensorImage(sensor.sensorType);
  const sensorTypeLabel = getSensorTypeLabel(sensor.sensorType);
  
  // Визначаємо, чи є поточні показники сенсора небезпечними
  const isDangerous = () => {
    if (!sensor) return false;
    
    switch (sensor.sensorType) {
      case 'temperature_sensor':
        return (
          sensor.currentTemperature !== undefined && 
          (sensor.currentTemperature > sensor.dangerousTemperaturePlus || 
          sensor.currentTemperature < sensor.dangerousTemperatureMinus)
        );
      case 'humidity_sensor':
        return (
          sensor.currentHumidity !== undefined && 
          sensor.currentHumidity > sensor.dangerousHumidity
        );
      case 'motion_sensor':
        return (
          sensor.currentMotionIntensity !== undefined && 
          sensor.currentMotionIntensity > sensor.dangerousMotionIntensity
        );
      case 'smoke_sensor':
        return (
          sensor.currentSmokeLevel !== undefined && 
          sensor.currentSmokeLevel > sensor.dangerousSmokeLevel
        );
      case 'gas_sensor':
        return (
          (sensor.currentMethanLevel !== undefined && 
            sensor.currentMethanLevel > sensor.dangerousMethanLevel) ||
          (sensor.currentCarbonMonoxideLevel !== undefined && 
            sensor.currentCarbonMonoxideLevel > sensor.dangerousCarbonMonoxideLevel) ||
          (sensor.currentCarbonDioxideLevel !== undefined && 
            sensor.currentCarbonDioxideLevel > sensor.dangerousCarbonDioxideLevel) ||
          (sensor.currentPropaneLevel !== undefined && 
            sensor.currentPropaneLevel > sensor.dangerousPropaneLevel) ||
          (sensor.currentNitrogenDioxideLevel !== undefined && 
            sensor.currentNitrogenDioxideLevel > sensor.dangerousNitrogenDioxideLevel) ||
          (sensor.currentOzoneLevel !== undefined && 
            sensor.currentOzoneLevel > sensor.dangerousOzoneLevel)
        );
      case 'water_leak_sensor':
        return (
          sensor.currentWaterDetectionIndex !== undefined && 
          sensor.currentWaterDetectionIndex > sensor.dangerousWaterDetectionIndex
        );
      case 'light_sensor':
        return (
          sensor.currentLux !== undefined && 
          sensor.currentLux > sensor.dangerousLux
        );
      case 'air_quality_sensor':
        return (
          (sensor.currentAQI !== undefined && 
            sensor.currentAQI > sensor.dangerousAQI) ||
          (sensor.currentPM25 !== undefined && 
            sensor.currentPM25 > sensor.dangerousPM25) ||
          (sensor.currentPM10 !== undefined && 
            sensor.currentPM10 > sensor.dangerousPM10)
        );
      case 'power_sensor':
        return (
          (sensor.currentPower !== undefined && 
            sensor.currentPower > sensor.dangerousPower) ||
          (sensor.currentVoltage !== undefined && 
            sensor.currentVoltage > sensor.dangerousVoltage) ||
          (sensor.currentCurrent !== undefined && 
            sensor.currentCurrent > sensor.dangerousCurrent)
        );
      case 'weather_sensor':
        return (
          (sensor.currentTemperature !== undefined && 
            (sensor.currentTemperature > sensor.dangerousTemperaturePlus || 
             sensor.currentTemperature < sensor.dangerousTemperatureMinus)) ||
          (sensor.currentWindSpeed !== undefined && 
            sensor.currentWindSpeed > sensor.dangerousWindSpeed) ||
          (sensor.currentRainIntensity !== undefined && 
            sensor.currentRainIntensity > sensor.dangerousRainIntensity)
        );
      default:
        return false;
    }
  };
  
  const handleToggleActive = () => {
    // Якщо вже йде процес перемикання або користувач гість, не робимо нічого
    if (isStatusToggling || isGuest) return;
    
    const newState = !sensor.isActive;
    
    // Відправляємо дані в Redux з флагом isStatusToggle
    dispatch(updateSensor({
      id: sensor._id,
      data: { 
        isActive: newState,
        name: sensor.name,
        roomId: sensor.roomId
      },
      isStatusToggle: true // Використовуємо окремий лоадер для перемикання статусу
    }));
  };
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(sensor);
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(sensor);
    }
  };
  
  const dangerLevel = isDangerous();
  
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        position: 'relative',
        border: dangerLevel ? '2px solid red' : 'none',
        bgcolor: 'white',
      }}
    >
      {/* Зображення сенсора зверху картки */}
      <Box
        sx={{
          width: '100%',
          height: 150,
          bgcolor: 'white',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={sensorImage}
          alt={sensor.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: sensor.isActive ? 1 : 0.7,
            transition: 'opacity 0.5s',
          }}
        />
      </Box>
      
      {/* Тип сенсора */}
      <Chip
        label={sensorTypeLabel}
        size="small"
        color="primary"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          fontWeight: 'medium',
          zIndex: 2,
        }}
      />
      
      {/* Небезпечний стан сенсора */}
      {dangerLevel && (
        <Chip
          icon={<WarningIcon />}
          label={t('sensor.dangerState', 'Небезпечно!')}
          size="small"
          color="error"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontWeight: 'bold',
            zIndex: 2,
          }}
        />
      )}
      
      {/* Інформація про сенсор */}
      <Box 
        sx={{ 
          p: 2, 
          flexGrow: 1,
          width: '100%',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="h3" fontWeight="bold" noWrap>
            {sensor.name}
          </Typography>
        </Box>
        
        {!isGuest && (
          <Box 
            mt={1} 
            mb={1} 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.03)',
              borderRadius: 1,
              py: 1,
              position: 'relative',
              cursor: isStatusToggling ? 'wait' : 'pointer',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.07)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={!isStatusToggling ? handleToggleActive : undefined}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={sensor.isActive || false}
                  onChange={handleToggleActive}
                  disabled={isStatusToggling}
                  color="success"
                  size="medium"
                  sx={{
                    '& .MuiSwitch-switchBase': {
                      margin: 1,
                      padding: 0,
                      transform: 'translateX(6px)',
                      transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&.Mui-checked': {
                        transform: 'translateX(22px)',
                        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        '& + .MuiSwitch-track': {
                          opacity: 1,
                          transition: 'opacity 0.8s',
                        },
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      width: 18,
                      height: 18,
                      transition: 'all 0.8s',
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 26 / 2,
                      transition: 'all 0.8s',
                    },
                  }}
                />
              }
              label={sensor.isActive ? t('sensor.on', 'Увімкнено') : t('sensor.off', 'Вимкнено')}
              labelPlacement="end"
              sx={{ 
                fontWeight: 'medium',
                color: sensor.isActive ? 'success.main' : 'text.secondary',
                m: 0,
                transition: 'color 0.8s',
              }}
            />
          </Box>
        )}
        
        <Divider sx={{ my: 1, backgroundColor: 'rgba(0, 0, 0, 0.05)' }} />
        
        {/* Властивості сенсора */}
        <Box mt={1.5}>
          {sensor.isActive ? (
            (() => {
              const groupedProperties = [];
              
              try {
                // Додаємо властивості на основі типу сенсора
                switch (sensor.sensorType) {
                  case 'temperature_sensor':
                    groupedProperties.push({
                      label: t('sensor.properties.currentTemperature', 'Temperature').charAt(0).toUpperCase() + t('sensor.properties.currentTemperature', 'Temperature').slice(1),
                      currentValue: sensor.currentTemperature !== undefined ? sensor.currentTemperature : '0',
                      dangerousValue: sensor.dangerousTemperaturePlus !== undefined ? sensor.dangerousTemperaturePlus : '0',
                      unit: '°C',
                      isDangerous: sensor.currentTemperature !== undefined && 
                                  (sensor.currentTemperature > sensor.dangerousTemperaturePlus || 
                                   sensor.currentTemperature < sensor.dangerousTemperatureMinus)
                    });
                    break;
                  
                  case 'humidity_sensor':
                    groupedProperties.push({
                      label: t('sensor.properties.currentHumidity', 'Humidity').charAt(0).toUpperCase() + t('sensor.properties.currentHumidity', 'Humidity').slice(1),
                      currentValue: sensor.currentHumidity !== undefined ? sensor.currentHumidity : '0',
                      dangerousValue: sensor.dangerousHumidity !== undefined ? sensor.dangerousHumidity : '0',
                      unit: '%',
                      isDangerous: sensor.currentHumidity !== undefined && 
                                   sensor.currentHumidity > sensor.dangerousHumidity
                    });
                    break;
                  
                  case 'motion_sensor':
                    groupedProperties.push({
                      label: t('sensor.properties.currentMotionIntensity', 'Motion Intensity').charAt(0).toUpperCase() + t('sensor.properties.currentMotionIntensity', 'Motion Intensity').slice(1),
                      currentValue: sensor.currentMotionIntensity !== undefined ? sensor.currentMotionIntensity : '0',
                      dangerousValue: sensor.dangerousMotionIntensity !== undefined ? sensor.dangerousMotionIntensity : '0',
                      unit: '',
                      isDangerous: sensor.currentMotionIntensity !== undefined && 
                                   sensor.currentMotionIntensity > sensor.dangerousMotionIntensity
                    });
                    break;
                  
                  case 'smoke_sensor':
                    groupedProperties.push({
                      label: t('sensor.properties.currentSmokeLevel', 'Smoke Level').charAt(0).toUpperCase() + t('sensor.properties.currentSmokeLevel', 'Smoke Level').slice(1),
                      currentValue: sensor.currentSmokeLevel !== undefined ? sensor.currentSmokeLevel : '0',
                      dangerousValue: sensor.dangerousSmokeLevel !== undefined ? sensor.dangerousSmokeLevel : '0',
                      unit: '%',
                      isDangerous: sensor.currentSmokeLevel !== undefined && 
                                   sensor.currentSmokeLevel > sensor.dangerousSmokeLevel
                    });
                    break;
                  
                  case 'gas_sensor':
                    // Додаємо всі типи газів, які можуть бути в сенсорі газу
                    if (sensor.currentMethanLevel !== undefined || sensor.dangerousMethanLevel !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentMethanLevel', 'Methane').charAt(0).toUpperCase() + t('sensor.properties.currentMethanLevel', 'Methane').slice(1),
                        currentValue: sensor.currentMethanLevel !== undefined ? sensor.currentMethanLevel : '0',
                        dangerousValue: sensor.dangerousMethanLevel !== undefined ? sensor.dangerousMethanLevel : '0',
                        unit: '% LEL',
                        isDangerous: sensor.currentMethanLevel !== undefined && 
                                    sensor.currentMethanLevel > sensor.dangerousMethanLevel
                      });
                    }
                    
                    if (sensor.currentCarbonMonoxideLevel !== undefined || sensor.dangerousCarbonMonoxideLevel !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentCarbonMonoxideLevel', 'CO').charAt(0).toUpperCase() + t('sensor.properties.currentCarbonMonoxideLevel', 'CO').slice(1),
                        currentValue: sensor.currentCarbonMonoxideLevel !== undefined ? sensor.currentCarbonMonoxideLevel : '0',
                        dangerousValue: sensor.dangerousCarbonMonoxideLevel !== undefined ? sensor.dangerousCarbonMonoxideLevel : '0',
                        unit: 'ppm',
                        isDangerous: sensor.currentCarbonMonoxideLevel !== undefined && 
                                    sensor.currentCarbonMonoxideLevel > sensor.dangerousCarbonMonoxideLevel
                      });
                    }
                    
                    if (sensor.currentCarbonDioxideLevel !== undefined || sensor.dangerousCarbonDioxideLevel !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentCarbonDioxideLevel', 'CO2').charAt(0).toUpperCase() + t('sensor.properties.currentCarbonDioxideLevel', 'CO2').slice(1),
                        currentValue: sensor.currentCarbonDioxideLevel !== undefined ? sensor.currentCarbonDioxideLevel : '0',
                        dangerousValue: sensor.dangerousCarbonDioxideLevel !== undefined ? sensor.dangerousCarbonDioxideLevel : '0',
                        unit: 'ppm',
                        isDangerous: sensor.currentCarbonDioxideLevel !== undefined && 
                                    sensor.currentCarbonDioxideLevel > sensor.dangerousCarbonDioxideLevel
                      });
                    }
                    
                    if (sensor.currentPropaneLevel !== undefined || sensor.dangerousPropaneLevel !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentPropaneLevel', 'Propane').charAt(0).toUpperCase() + t('sensor.properties.currentPropaneLevel', 'Propane').slice(1),
                        currentValue: sensor.currentPropaneLevel !== undefined ? sensor.currentPropaneLevel : '0',
                        dangerousValue: sensor.dangerousPropaneLevel !== undefined ? sensor.dangerousPropaneLevel : '0',
                        unit: '% LEL',
                        isDangerous: sensor.currentPropaneLevel !== undefined && 
                                    sensor.currentPropaneLevel > sensor.dangerousPropaneLevel
                      });
                    }
                    
                    if (sensor.currentNitrogenDioxideLevel !== undefined || sensor.dangerousNitrogenDioxideLevel !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentNitrogenDioxideLevel', 'NO2').charAt(0).toUpperCase() + t('sensor.properties.currentNitrogenDioxideLevel', 'NO2').slice(1),
                        currentValue: sensor.currentNitrogenDioxideLevel !== undefined ? sensor.currentNitrogenDioxideLevel : '0',
                        dangerousValue: sensor.dangerousNitrogenDioxideLevel !== undefined ? sensor.dangerousNitrogenDioxideLevel : '0',
                        unit: 'мкг/м³',
                        isDangerous: sensor.currentNitrogenDioxideLevel !== undefined && 
                                    sensor.currentNitrogenDioxideLevel > sensor.dangerousNitrogenDioxideLevel
                      });
                    }
                    
                    if (sensor.currentOzoneLevel !== undefined || sensor.dangerousOzoneLevel !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentOzoneLevel', 'Ozone').charAt(0).toUpperCase() + t('sensor.properties.currentOzoneLevel', 'Ozone').slice(1),
                        currentValue: sensor.currentOzoneLevel !== undefined ? sensor.currentOzoneLevel : '0',
                        dangerousValue: sensor.dangerousOzoneLevel !== undefined ? sensor.dangerousOzoneLevel : '0',
                        unit: 'мкг/м³',
                        isDangerous: sensor.currentOzoneLevel !== undefined && 
                                    sensor.currentOzoneLevel > sensor.dangerousOzoneLevel
                      });
                    }
                    
                    // Якщо взагалі немає жодних показів, додаємо заглушку
                    if (groupedProperties.length === 0) {
                      groupedProperties.push({
                        label: t('sensor.noData', 'No Data'),
                        currentValue: '0',
                        dangerousValue: '0',
                        unit: '',
                        isDangerous: false
                      });
                    }
                    break;
                  
                  case 'water_leak_sensor':
                    groupedProperties.push({
                      label: t('sensor.properties.currentWaterDetectionIndex', 'Water Detection').charAt(0).toUpperCase() + t('sensor.properties.currentWaterDetectionIndex', 'Water Detection').slice(1),
                      currentValue: sensor.currentWaterDetectionIndex !== undefined ? sensor.currentWaterDetectionIndex : '0',
                      dangerousValue: sensor.dangerousWaterDetectionIndex !== undefined ? sensor.dangerousWaterDetectionIndex : '0',
                      unit: '',
                      isDangerous: sensor.currentWaterDetectionIndex !== undefined && 
                                   sensor.currentWaterDetectionIndex > sensor.dangerousWaterDetectionIndex
                    });
                    break;
                  
                  case 'light_sensor':
                    groupedProperties.push({
                      label: t('sensor.properties.currentLux', 'Light Level').charAt(0).toUpperCase() + t('sensor.properties.currentLux', 'Light Level').slice(1),
                      currentValue: sensor.currentLux !== undefined ? sensor.currentLux : '0',
                      dangerousValue: sensor.dangerousLux !== undefined ? sensor.dangerousLux : '0',
                      unit: 'lx',
                      isDangerous: sensor.currentLux !== undefined && 
                                   sensor.currentLux > sensor.dangerousLux
                    });
                    break;
                  
                  case 'air_quality_sensor':
                    if (sensor.currentAQI !== undefined || sensor.dangerousAQI !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentAQI', 'Air Quality Index').charAt(0).toUpperCase() + t('sensor.properties.currentAQI', 'Air Quality Index').slice(1),
                        currentValue: sensor.currentAQI !== undefined ? sensor.currentAQI : '0',
                        dangerousValue: sensor.dangerousAQI !== undefined ? sensor.dangerousAQI : '0',
                        unit: '',
                        isDangerous: sensor.currentAQI !== undefined && 
                                    sensor.currentAQI > sensor.dangerousAQI
                      });
                    }
                    
                    if (sensor.currentPM25 !== undefined || sensor.dangerousPM25 !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentPM25', 'PM2.5').charAt(0).toUpperCase() + t('sensor.properties.currentPM25', 'PM2.5').slice(1),
                        currentValue: sensor.currentPM25 !== undefined ? sensor.currentPM25 : '0',
                        dangerousValue: sensor.dangerousPM25 !== undefined ? sensor.dangerousPM25 : '0',
                        unit: 'мкг/м³',
                        isDangerous: sensor.currentPM25 !== undefined && 
                                    sensor.currentPM25 > sensor.dangerousPM25
                      });
                    }
                    
                    if (sensor.currentPM10 !== undefined || sensor.dangerousPM10 !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentPM10', 'PM10').charAt(0).toUpperCase() + t('sensor.properties.currentPM10', 'PM10').slice(1),
                        currentValue: sensor.currentPM10 !== undefined ? sensor.currentPM10 : '0',
                        dangerousValue: sensor.dangerousPM10 !== undefined ? sensor.dangerousPM10 : '0',
                        unit: 'мкг/м³',
                        isDangerous: sensor.currentPM10 !== undefined && 
                                    sensor.currentPM10 > sensor.dangerousPM10
                      });
                    }
                    
                    if (groupedProperties.length === 0) {
                      groupedProperties.push({
                        label: t('sensor.noData', 'No Data'),
                        currentValue: '0',
                        dangerousValue: '0',
                        unit: '',
                        isDangerous: false
                      });
                    }
                    break;
                  
                  case 'power_sensor':
                    if (sensor.currentPower !== undefined || sensor.dangerousPower !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentPower', 'Power').charAt(0).toUpperCase() + t('sensor.properties.currentPower', 'Power').slice(1),
                        currentValue: sensor.currentPower !== undefined ? sensor.currentPower : '0',
                        dangerousValue: sensor.dangerousPower !== undefined ? sensor.dangerousPower : '0',
                        unit: 'Вт',
                        isDangerous: sensor.currentPower !== undefined && 
                                    sensor.currentPower > sensor.dangerousPower
                      });
                    }
                    
                    if (sensor.currentVoltage !== undefined || sensor.dangerousVoltage !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentVoltage', 'Voltage').charAt(0).toUpperCase() + t('sensor.properties.currentVoltage', 'Voltage').slice(1),
                        currentValue: sensor.currentVoltage !== undefined ? sensor.currentVoltage : '0',
                        dangerousValue: sensor.dangerousVoltage !== undefined ? sensor.dangerousVoltage : '0',
                        unit: 'В',
                        isDangerous: sensor.currentVoltage !== undefined && 
                                    sensor.currentVoltage > sensor.dangerousVoltage
                      });
                    }
                    
                    if (sensor.currentCurrent !== undefined || sensor.dangerousCurrent !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentCurrent', 'Current').charAt(0).toUpperCase() + t('sensor.properties.currentCurrent', 'Current').slice(1),
                        currentValue: sensor.currentCurrent !== undefined ? sensor.currentCurrent : '0',
                        dangerousValue: sensor.dangerousCurrent !== undefined ? sensor.dangerousCurrent : '0',
                        unit: 'А',
                        isDangerous: sensor.currentCurrent !== undefined && 
                                    sensor.currentCurrent > sensor.dangerousCurrent
                      });
                    }
                    
                    if (groupedProperties.length === 0) {
                      groupedProperties.push({
                        label: t('sensor.noData', 'No Data'),
                        currentValue: '0',
                        dangerousValue: '0',
                        unit: '',
                        isDangerous: false
                      });
                    }
                    break;
                  
                  case 'weather_sensor':
                    if (sensor.currentTemperature !== undefined || sensor.dangerousTemperaturePlus !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentTemperature', 'Temperature').charAt(0).toUpperCase() + t('sensor.properties.currentTemperature', 'Temperature').slice(1),
                        currentValue: sensor.currentTemperature !== undefined ? sensor.currentTemperature : '0',
                        dangerousValue: sensor.dangerousTemperaturePlus !== undefined ? sensor.dangerousTemperaturePlus : '0',
                        unit: '°C',
                        isDangerous: sensor.currentTemperature !== undefined && 
                                    (sensor.currentTemperature > sensor.dangerousTemperaturePlus || 
                                     sensor.currentTemperature < sensor.dangerousTemperatureMinus)
                      });
                    }
                    
                    if (sensor.currentWindSpeed !== undefined || sensor.dangerousWindSpeed !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentWindSpeed', 'Wind Speed').charAt(0).toUpperCase() + t('sensor.properties.currentWindSpeed', 'Wind Speed').slice(1),
                        currentValue: sensor.currentWindSpeed !== undefined ? sensor.currentWindSpeed : '0',
                        dangerousValue: sensor.dangerousWindSpeed !== undefined ? sensor.dangerousWindSpeed : '0',
                        unit: 'м/с',
                        isDangerous: sensor.currentWindSpeed !== undefined && 
                                    sensor.currentWindSpeed > sensor.dangerousWindSpeed
                      });
                    }
                    
                    if (sensor.currentRainIntensity !== undefined || sensor.dangerousRainIntensity !== undefined) {
                      groupedProperties.push({
                        label: t('sensor.properties.currentRainIntensity', 'Rain Intensity').charAt(0).toUpperCase() + t('sensor.properties.currentRainIntensity', 'Rain Intensity').slice(1),
                        currentValue: sensor.currentRainIntensity !== undefined ? sensor.currentRainIntensity : '0',
                        dangerousValue: sensor.dangerousRainIntensity !== undefined ? sensor.dangerousRainIntensity : '0',
                        unit: 'мм/год',
                        isDangerous: sensor.currentRainIntensity !== undefined && 
                                    sensor.currentRainIntensity > sensor.dangerousRainIntensity
                      });
                    }
                    
                    if (groupedProperties.length === 0) {
                      groupedProperties.push({
                        label: t('sensor.noData', 'No Data'),
                        currentValue: '0',
                        dangerousValue: '0',
                        unit: '',
                        isDangerous: false
                      });
                    }
                    break;
                  
                  default:
                    // Для нерозпізнаних типів сенсорів
                    groupedProperties.push({
                      label: t('sensor.noData', 'No Data'),
                      currentValue: '0',
                      dangerousValue: '0',
                      unit: '',
                      isDangerous: false
                    });
                }
                
                // Сортуємо властивості за назвою
                groupedProperties.sort((a, b) => a.label.localeCompare(b.label));
              } catch (error) {
                console.error('Помилка при обробці властивостей сенсора:', error);
                // У випадку помилки додаємо базову інформацію
                groupedProperties.push({
                  label: t('sensor.noData', 'No Data'),
                  currentValue: '0',
                  dangerousValue: '0',
                  unit: '',
                  isDangerous: false
                });
              }
              
              return groupedProperties.map((prop, index) => (
                <Box key={index} mb={1} display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {prop.label}:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium" 
                    sx={{ 
                      color: prop.isDangerous ? 'error.main' : 'inherit'
                    }}
                  >
                    {`${prop.currentValue}/${prop.dangerousValue} ${prop.unit}`}
                  </Typography>
                </Box>
              ));
            })()
          ) : (
            <Box sx={{ py: 2, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                fontStyle="italic"
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 1,
                  px: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.03)',
                  borderRadius: 1,
                  fontSize: '0.9rem',
                  border: '1px dashed rgba(0, 0, 0, 0.1)'
                }}
              >
                {t('sensor.turnOnForReadings', 'Turn on to see current readings')}
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Кнопки управління */}
        <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: 'rgba(0, 0, 0, 0.05)' }}>
          <Stack direction="row" justifyContent="space-between">
            {isOwner && (
              <Box>
                <Tooltip title={t('common.edit', 'Редагувати')}>
                  <IconButton size="small" onClick={handleEdit} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('common.delete', 'Видалити')}>
                  <IconButton size="small" onClick={handleDelete} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            <Chip
              size="small"
              label={sensor.isActive ? t('sensor.on', 'Увімкнено') : t('sensor.off', 'Вимкнено')}
              color={sensor.isActive ? 'success' : 'default'}
              variant="outlined"
              sx={{ 
                transition: 'all 0.5s',
                backgroundColor: sensor.isActive 
                  ? 'rgba(46, 125, 50, 0.1)' 
                  : 'rgba(0, 0, 0, 0.04)',
              }}
            />
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default SensorCard; 