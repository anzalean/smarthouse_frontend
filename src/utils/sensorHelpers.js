import i18next from 'i18next';
import { dangerousSensorValues } from './dangerousSensorValues';

/**
 * Отримує шлях до зображення сенсора на основі його типу
 * @param {string} sensorType - Тип сенсора
 * @returns {string} - Шлях до зображення
 */
export const getSensorImage = (sensorType) => {
  try {
    const typeToImageMap = {
      temperature_sensor: '/images/sensors/TemperatureSensor.jpg',
      humidity_sensor: '/images/sensors/HumiditySensor.jpg',
      motion_sensor: '/images/sensors/MotionSensor.jpg',
      smoke_sensor: '/images/sensors/SmokeSensor.jpg',
      gas_sensor: '/images/sensors/GasSensor.jpg',
      water_leak_sensor: '/images/sensors/WaterLeakSensor.png',
      light_sensor: '/images/sensors/LightSensor.jpg',
      air_quality_sensor: '/images/sensors/AirQualitySensor.jpg',
      power_sensor: '/images/sensors/PowerSensor.png',
      weather_sensor: '/images/sensors/WeatherSensor.png',
    };
    
    return typeToImageMap[sensorType] || '/images/sensors/TemperatureSensor.jpg';
  } catch (error) {
    console.error('Помилка при отриманні зображення сенсора:', error);
    return '/images/sensors/TemperatureSensor.jpg';
  }
};

/**
 * Отримує назву типу сенсора з перекладом через i18n
 * @param {string} sensorType - Тип сенсора
 * @returns {string} - Перекладена назва типу сенсора
 */
export const getSensorTypeLabel = (sensorType) => {
  try {
    // Базова мапа перекладів для запасного варіанту
    const typeToLabelMap = {
      temperature_sensor: 'Датчик температури',
      humidity_sensor: 'Датчик вологості',
      motion_sensor: 'Датчик руху',
      smoke_sensor: 'Датчик диму',
      gas_sensor: 'Датчик газу',
      water_leak_sensor: 'Датчик протікання води',
      light_sensor: 'Датчик освітлення',
      air_quality_sensor: 'Датчик якості повітря',
      power_sensor: 'Датчик електроенергії',
      weather_sensor: 'Метеостанція',
    };
    
    // Спочатку спробуємо отримати переклад через i18next
    const translation = i18next.t(`sensor.sensorTypes.${sensorType}`, { defaultValue: '' });
    
    // Якщо переклад порожній або невизначений, використаємо запасний варіант
    if (!translation || translation === sensorType || translation === `sensor.sensorTypes.${sensorType}`) {
      return typeToLabelMap[sensorType] || sensorType;
    }
    
    return translation;
  } catch (error) {
    // Якщо виникла помилка, використаємо запасний варіант
    console.warn('i18next error in translation, using fallback values:', error);
    const typeToLabelMap = {
      temperature_sensor: 'Датчик температури',
      humidity_sensor: 'Датчик вологості',
      motion_sensor: 'Датчик руху',
      smoke_sensor: 'Датчик диму',
      gas_sensor: 'Датчик газу',
      water_leak_sensor: 'Датчик протікання води',
      light_sensor: 'Датчик освітлення',
      air_quality_sensor: 'Датчик якості повітря',
      power_sensor: 'Датчик електроенергії',
      weather_sensor: 'Метеостанція',
    };
    
    return typeToLabelMap[sensorType] || sensorType;
  }
};

/**
 * Отримує список типів сенсорів для використання в селекті з i18n
 * @returns {Array} - Масив об'єктів { value, label }
 */
export const getSensorTypeOptions = () => {
  try {
    // Базові мітки для сенсорів
    const fallbackLabels = {
      temperature_sensor: 'Датчик температури',
      humidity_sensor: 'Датчик вологості',
      motion_sensor: 'Датчик руху',
      smoke_sensor: 'Датчик диму',
      gas_sensor: 'Датчик газу',
      water_leak_sensor: 'Датчик протікання води',
      light_sensor: 'Датчик освітлення',
      air_quality_sensor: 'Датчик якості повітря',
      power_sensor: 'Датчик електроенергії',
      weather_sensor: 'Метеостанція',
    };
    
    // Створюємо масив з запасними мітками
    return Object.entries(fallbackLabels).map(([value, fallbackLabel]) => {
      let label = i18next.t(`sensor.sensorTypes.${value}`, { defaultValue: '' });
      
      // Якщо переклад не доступний, використовуємо запасну мітку
      if (!label || label === value || label === `sensor.sensorTypes.${value}`) {
        label = fallbackLabel;
      }
      
      return { value, label };
    });
  } catch (error) {
    console.warn('i18next error in sensor options, using fallback values:', error);
    return [
      { value: 'temperature_sensor', label: 'Датчик температури' },
      { value: 'humidity_sensor', label: 'Датчик вологості' },
      { value: 'motion_sensor', label: 'Датчик руху' },
      { value: 'smoke_sensor', label: 'Датчик диму' },
      { value: 'gas_sensor', label: 'Датчик газу' },
      { value: 'water_leak_sensor', label: 'Датчик протікання води' },
      { value: 'light_sensor', label: 'Датчик освітлення' },
      { value: 'air_quality_sensor', label: 'Датчик якості повітря' },
      { value: 'power_sensor', label: 'Датчик електроенергії' },
      { value: 'weather_sensor', label: 'Метеостанція' },
    ];
  }
};

/**
 * Повертає список специфічних полів для типу сенсора
 * @param {string} sensorType - Тип сенсора
 * @returns {Array} - Масив полів для форми
 */
export const getSensorSpecificFields = (sensorType) => {
  try {
    // Функція для обробки перекладу з запасним значенням
    const getTranslation = (key, defaultValue) => {
      const translation = i18next.t(key, { defaultValue: '' });
      if (!translation || translation === key) {
        return defaultValue;
      }
      return translation;
    };
    
    switch (sensorType) {
      case 'temperature_sensor':
        return [
          {
            name: 'dangerousTemperaturePlus',
            label: getTranslation('sensor.properties.dangerousTemperaturePlus', 'Небезпечно висока температура'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.temperature_sensor.dangerousTemperaturePlus,
            unit: dangerousSensorValues.temperature_sensor.dangerousTemperaturePlusUnit,
          },
          {
            name: 'dangerousTemperatureMinus',
            label: getTranslation('sensor.properties.dangerousTemperatureMinus', 'Небезпечно низька температура'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.temperature_sensor.dangerousTemperatureMinus,
            unit: dangerousSensorValues.temperature_sensor.dangerousTemperatureMinusUnit,
          },
        ];
      case 'humidity_sensor':
        return [
          {
            name: 'dangerousHumidity',
            label: getTranslation('sensor.properties.dangerousHumidity', 'Небезпечний рівень вологості'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.humidity_sensor.dangerousHumidity,
            unit: dangerousSensorValues.humidity_sensor.dangerousHumidityUnit,
          },
        ];
      case 'motion_sensor':
        return [
          {
            name: 'dangerousMotionIntensity',
            label: getTranslation('sensor.properties.dangerousMotionIntensity', 'Небезпечний рівень інтенсивності руху'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.motion_sensor.dangerousMotionIntensity,
            unit: dangerousSensorValues.motion_sensor.dangerousMotionIntensityUnit,
          },
        ];
      case 'smoke_sensor':
        return [
          {
            name: 'dangerousSmokeLevel',
            label: getTranslation('sensor.properties.dangerousSmokeLevel', 'Небезпечний рівень диму'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.smoke_sensor.dangerousSmokeLevel,
            unit: dangerousSensorValues.smoke_sensor.dangerousSmokeLevelUnit,
          },
        ];
      case 'gas_sensor':
        return [
          {
            name: 'dangerousMethanLevel',
            label: getTranslation('sensor.properties.dangerousMethanLevel', 'Небезпечний рівень метану'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.gas_sensor.dangerousMethanLevel,
            unit: dangerousSensorValues.gas_sensor.dangerousMethanLevelUnit,
          },
          {
            name: 'dangerousCarbonMonoxideLevel',
            label: getTranslation('sensor.properties.dangerousCarbonMonoxideLevel', 'Небезпечний рівень CO'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.gas_sensor.dangerousCarbonMonoxideLevel,
            unit: dangerousSensorValues.gas_sensor.dangerousCarbonMonoxideLevelUnit,
          },
          {
            name: 'dangerousCarbonDioxideLevel',
            label: getTranslation('sensor.properties.dangerousCarbonDioxideLevel', 'Небезпечний рівень CO2'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.gas_sensor.dangerousCarbonDioxideLevel,
            unit: dangerousSensorValues.gas_sensor.dangerousCarbonDioxideLevelUnit,
          },
          {
            name: 'dangerousPropaneLevel',
            label: getTranslation('sensor.properties.dangerousPropaneLevel', 'Небезпечний рівень пропану'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.gas_sensor.dangerousPropaneLevel,
            unit: dangerousSensorValues.gas_sensor.dangerousPropaneLevelUnit,
          },
          {
            name: 'dangerousNitrogenDioxideLevel',
            label: getTranslation('sensor.properties.dangerousNitrogenDioxideLevel', 'Небезпечний рівень NO2'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.gas_sensor.dangerousNitrogenDioxideLevel,
            unit: dangerousSensorValues.gas_sensor.dangerousNitrogenDioxideLevelUnit,
          },
          {
            name: 'dangerousOzoneLevel',
            label: getTranslation('sensor.properties.dangerousOzoneLevel', 'Небезпечний рівень озону'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.gas_sensor.dangerousOzoneLevel,
            unit: dangerousSensorValues.gas_sensor.dangerousOzoneLevelUnit,
          },
        ];
      case 'water_leak_sensor':
        return [
          {
            name: 'dangerousWaterDetectionIndex',
            label: getTranslation('sensor.properties.dangerousWaterDetectionIndex', 'Небезпечний індекс виявлення води'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.water_leak_sensor.dangerousWaterDetectionIndex,
            unit: dangerousSensorValues.water_leak_sensor.dangerousWaterDetectionIndexUnit,
          },
        ];
      case 'light_sensor':
        return [
          {
            name: 'dangerousLux',
            label: getTranslation('sensor.properties.dangerousLux', 'Небезпечний рівень освітлення'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.light_sensor.dangerousLux,
            unit: dangerousSensorValues.light_sensor.dangerousLuxUnit,
          },
        ];
      case 'air_quality_sensor':
        return [
          {
            name: 'dangerousAQI',
            label: getTranslation('sensor.properties.dangerousAQI', 'Небезпечний індекс якості повітря'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.air_quality_sensor.dangerousAQI,
            unit: dangerousSensorValues.air_quality_sensor.dangerousAQIUnit,
          },
          {
            name: 'dangerousPM25',
            label: getTranslation('sensor.properties.dangerousPM25', 'Небезпечний рівень PM2.5'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.air_quality_sensor.dangerousPM25,
            unit: dangerousSensorValues.air_quality_sensor.dangerousPM25Unit,
          },
          {
            name: 'dangerousPM10',
            label: getTranslation('sensor.properties.dangerousPM10', 'Небезпечний рівень PM10'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.air_quality_sensor.dangerousPM10,
            unit: dangerousSensorValues.air_quality_sensor.dangerousPM10Unit,
          },
        ];
      case 'power_sensor':
        return [
          {
            name: 'dangerousPower',
            label: getTranslation('sensor.properties.dangerousPower', 'Небезпечний рівень потужності'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.power_sensor.dangerousPower,
            unit: dangerousSensorValues.power_sensor.dangerousPowerUnit,
          },
          {
            name: 'dangerousVoltage',
            label: getTranslation('sensor.properties.dangerousVoltage', 'Небезпечний рівень напруги'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.power_sensor.dangerousVoltage,
            unit: dangerousSensorValues.power_sensor.dangerousVoltageUnit,
          },
          {
            name: 'dangerousCurrent',
            label: getTranslation('sensor.properties.dangerousCurrent', 'Небезпечний рівень струму'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.power_sensor.dangerousCurrent,
            unit: dangerousSensorValues.power_sensor.dangerousCurrentUnit,
          },
        ];
      case 'weather_sensor':
        return [
          {
            name: 'dangerousTemperaturePlus',
            label: getTranslation('sensor.properties.dangerousTemperaturePlus', 'Небезпечно висока температура'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.weather_sensor.dangerousTemperaturePlus,
            unit: dangerousSensorValues.weather_sensor.dangerousTemperaturePlusUnit,
          },
          {
            name: 'dangerousTemperatureMinus',
            label: getTranslation('sensor.properties.dangerousTemperatureMinus', 'Небезпечно низька температура'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.weather_sensor.dangerousTemperatureMinus,
            unit: dangerousSensorValues.weather_sensor.dangerousTemperatureMinusUnit,
          },
          {
            name: 'dangerousWindSpeed',
            label: getTranslation('sensor.properties.dangerousWindSpeed', 'Небезпечна швидкість вітру'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.weather_sensor.dangerousWindSpeed,
            unit: dangerousSensorValues.weather_sensor.dangerousWindSpeedUnit,
          },
          {
            name: 'dangerousRainIntensity',
            label: getTranslation('sensor.properties.dangerousRainIntensity', 'Небезпечна інтенсивність опадів'),
            type: 'number',
            required: true,
            defaultValue: dangerousSensorValues.weather_sensor.dangerousRainIntensity,
            unit: dangerousSensorValues.weather_sensor.dangerousRainIntensityUnit,
          },
        ];
      default:
        return [];
    }
  } catch (error) {
    console.error('Помилка при отриманні специфічних полів для датчика:', error);
    return getSensorSpecificFieldsFallback(sensorType);
  }
};

/**
 * Резервна функція для отримання полів у разі помилки i18n
 */
const getSensorSpecificFieldsFallback = (sensorType) => {
  // Резервні функції без i18n
  switch (sensorType) {
    case 'temperature_sensor':
      return [
        {
          name: 'dangerousTemperaturePlus',
          label: 'Небезпечно висока температура',
          type: 'number',
          required: true,
          defaultValue: dangerousSensorValues.temperature_sensor.dangerousTemperaturePlus,
          unit: dangerousSensorValues.temperature_sensor.dangerousTemperaturePlusUnit,
        },
        {
          name: 'dangerousTemperatureMinus',
          label: 'Небезпечно низька температура',
          type: 'number',
          required: true,
          defaultValue: dangerousSensorValues.temperature_sensor.dangerousTemperatureMinus,
          unit: dangerousSensorValues.temperature_sensor.dangerousTemperatureMinusUnit,
        },
      ];
    case 'humidity_sensor':
      return [
        {
          name: 'dangerousHumidity',
          label: 'Небезпечний рівень вологості',
          type: 'number',
          required: true,
          defaultValue: dangerousSensorValues.humidity_sensor.dangerousHumidity,
          unit: dangerousSensorValues.humidity_sensor.dangerousHumidityUnit,
        },
      ];
    // Додаткові випадки опущені для стислості
    default:
      return [];
  }
};

/**
 * Форматує властивості сенсора для відображення
 * @param {Object} sensor - Об'єкт сенсора
 * @returns {Array} - Масив об'єктів { label, value }
 */
export const formatSensorProperties = (sensor) => {
  if (!sensor) return [];
  
  const properties = [];
  
  // Додавання специфічних властивостей в залежності від типу сенсора
  try {
    switch (sensor.sensorType) {
      case 'temperature_sensor':
        if (sensor.currentTemperature !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentTemperature', 'Поточна температура'),
            value: `${sensor.currentTemperature} °C`,
            isDangerous: sensor.currentTemperature > sensor.dangerousTemperaturePlus || 
                        sensor.currentTemperature < sensor.dangerousTemperatureMinus
          });
        }
        if (sensor.dangerousTemperaturePlus !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousTemperaturePlus', 'Небезпечно висока температура'),
            value: `${sensor.dangerousTemperaturePlus} °C`,
          });
        }
        if (sensor.dangerousTemperatureMinus !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousTemperatureMinus', 'Небезпечно низька температура'),
            value: `${sensor.dangerousTemperatureMinus} °C`,
          });
        }
        break;
      
      case 'humidity_sensor':
        if (sensor.currentHumidity !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentHumidity', 'Поточна вологість'),
            value: `${sensor.currentHumidity} %`,
            isDangerous: sensor.currentHumidity > sensor.dangerousHumidity
          });
        }
        if (sensor.dangerousHumidity !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousHumidity', 'Небезпечний рівень вологості'),
            value: `${sensor.dangerousHumidity} %`,
          });
        }
        break;
      
      case 'motion_sensor':
        if (sensor.currentMotionIntensity !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentMotionIntensity', 'Поточна інтенсивність руху'),
            value: sensor.currentMotionIntensity,
            isDangerous: sensor.currentMotionIntensity > sensor.dangerousMotionIntensity
          });
        }
        if (sensor.dangerousMotionIntensity !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousMotionIntensity', 'Небезпечний рівень інтенсивності руху'),
            value: sensor.dangerousMotionIntensity,
          });
        }
        break;
      
      case 'smoke_sensor':
        if (sensor.currentSmokeLevel !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentSmokeLevel', 'Поточний рівень диму'),
            value: `${sensor.currentSmokeLevel} %`,
            isDangerous: sensor.currentSmokeLevel > sensor.dangerousSmokeLevel
          });
        }
        if (sensor.dangerousSmokeLevel !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousSmokeLevel', 'Небезпечний рівень диму'),
            value: `${sensor.dangerousSmokeLevel} %`,
          });
        }
        break;
      
      case 'gas_sensor': {
        // Додаємо всі газові показники, якщо вони є
        const gasParameters = [
          { current: 'currentMethanLevel', dangerous: 'dangerousMethanLevel', label: 'Метан', unit: '% LEL' },
          { current: 'currentCarbonMonoxideLevel', dangerous: 'dangerousCarbonMonoxideLevel', label: 'CO', unit: 'ppm' },
          { current: 'currentCarbonDioxideLevel', dangerous: 'dangerousCarbonDioxideLevel', label: 'CO2', unit: 'ppm' },
          { current: 'currentPropaneLevel', dangerous: 'dangerousPropaneLevel', label: 'Пропан', unit: '% LEL' },
          { current: 'currentNitrogenDioxideLevel', dangerous: 'dangerousNitrogenDioxideLevel', label: 'NO2', unit: 'мкг/м³' },
          { current: 'currentOzoneLevel', dangerous: 'dangerousOzoneLevel', label: 'Озон', unit: 'мкг/м³' }
        ];
        
        gasParameters.forEach(param => {
          if (sensor[param.current] !== undefined) {
            properties.push({
              label: i18next.t(`sensor.properties.${param.current}`, `Поточний рівень: ${param.label}`),
              value: `${sensor[param.current]} ${param.unit}`,
              isDangerous: sensor[param.current] > sensor[param.dangerous]
            });
          }
          if (sensor[param.dangerous] !== undefined) {
            properties.push({
              label: i18next.t(`sensor.properties.${param.dangerous}`, `Небезпечний рівень: ${param.label}`),
              value: `${sensor[param.dangerous]} ${param.unit}`,
            });
          }
        });
        break;
      }
      
      case 'water_leak_sensor':
        if (sensor.currentWaterDetectionIndex !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentWaterDetectionIndex', 'Поточний індекс виявлення води'),
            value: sensor.currentWaterDetectionIndex,
            isDangerous: sensor.currentWaterDetectionIndex > sensor.dangerousWaterDetectionIndex
          });
        }
        if (sensor.dangerousWaterDetectionIndex !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousWaterDetectionIndex', 'Небезпечний індекс виявлення води'),
            value: sensor.dangerousWaterDetectionIndex,
          });
        }
        break;
      
      case 'light_sensor':
        if (sensor.currentLux !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentLux', 'Поточний рівень освітлення'),
            value: `${sensor.currentLux} lx`,
            isDangerous: sensor.currentLux > sensor.dangerousLux
          });
        }
        if (sensor.dangerousLux !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousLux', 'Небезпечний рівень освітлення'),
            value: `${sensor.dangerousLux} lx`,
          });
        }
        break;
      
      case 'air_quality_sensor':
        if (sensor.currentAQI !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentAQI', 'Поточний індекс якості повітря'),
            value: sensor.currentAQI,
            isDangerous: sensor.currentAQI > sensor.dangerousAQI
          });
        }
        if (sensor.dangerousAQI !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousAQI', 'Небезпечний індекс якості повітря'),
            value: sensor.dangerousAQI,
          });
        }
        if (sensor.currentPM25 !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentPM25', 'Поточний рівень PM2.5'),
            value: `${sensor.currentPM25} мкг/м³`,
            isDangerous: sensor.currentPM25 > sensor.dangerousPM25
          });
        }
        if (sensor.dangerousPM25 !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousPM25', 'Небезпечний рівень PM2.5'),
            value: `${sensor.dangerousPM25} мкг/м³`,
          });
        }
        if (sensor.currentPM10 !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentPM10', 'Поточний рівень PM10'),
            value: `${sensor.currentPM10} мкг/м³`,
            isDangerous: sensor.currentPM10 > sensor.dangerousPM10
          });
        }
        if (sensor.dangerousPM10 !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousPM10', 'Небезпечний рівень PM10'),
            value: `${sensor.dangerousPM10} мкг/м³`,
          });
        }
        break;
      
      case 'power_sensor':
        if (sensor.currentPower !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentPower', 'Поточна потужність'),
            value: `${sensor.currentPower} Вт`,
            isDangerous: sensor.currentPower > sensor.dangerousPower
          });
        }
        if (sensor.dangerousPower !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousPower', 'Небезпечний рівень потужності'),
            value: `${sensor.dangerousPower} Вт`,
          });
        }
        if (sensor.currentVoltage !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentVoltage', 'Поточна напруга'),
            value: `${sensor.currentVoltage} В`,
            isDangerous: sensor.currentVoltage > sensor.dangerousVoltage
          });
        }
        if (sensor.dangerousVoltage !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousVoltage', 'Небезпечний рівень напруги'),
            value: `${sensor.dangerousVoltage} В`,
          });
        }
        if (sensor.currentCurrent !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentCurrent', 'Поточна сила струму'),
            value: `${sensor.currentCurrent} А`,
            isDangerous: sensor.currentCurrent > sensor.dangerousCurrent
          });
        }
        if (sensor.dangerousCurrent !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousCurrent', 'Небезпечний рівень струму'),
            value: `${sensor.dangerousCurrent} А`,
          });
        }
        break;
      
      case 'weather_sensor':
        if (sensor.currentTemperature !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentTemperature', 'Поточна температура'),
            value: `${sensor.currentTemperature} °C`,
            isDangerous: sensor.currentTemperature > sensor.dangerousTemperaturePlus || 
                        sensor.currentTemperature < sensor.dangerousTemperatureMinus
          });
        }
        if (sensor.dangerousTemperaturePlus !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousTemperaturePlus', 'Небезпечно висока температура'),
            value: `${sensor.dangerousTemperaturePlus} °C`,
          });
        }
        if (sensor.dangerousTemperatureMinus !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousTemperatureMinus', 'Небезпечно низька температура'),
            value: `${sensor.dangerousTemperatureMinus} °C`,
          });
        }
        if (sensor.currentWindSpeed !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentWindSpeed', 'Поточна швидкість вітру'),
            value: `${sensor.currentWindSpeed} м/с`,
            isDangerous: sensor.currentWindSpeed > sensor.dangerousWindSpeed
          });
        }
        if (sensor.dangerousWindSpeed !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousWindSpeed', 'Небезпечна швидкість вітру'),
            value: `${sensor.dangerousWindSpeed} м/с`,
          });
        }
        if (sensor.currentRainIntensity !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.currentRainIntensity', 'Поточна інтенсивність опадів'),
            value: `${sensor.currentRainIntensity} мм/год`,
            isDangerous: sensor.currentRainIntensity > sensor.dangerousRainIntensity
          });
        }
        if (sensor.dangerousRainIntensity !== undefined) {
          properties.push({
            label: i18next.t('sensor.properties.dangerousRainIntensity', 'Небезпечна інтенсивність опадів'),
            value: `${sensor.dangerousRainIntensity} мм/год`,
          });
        }
        break;
      
      default:
        // Для невідомих типів сенсорів додаємо базові властивості
        properties.push({
          label: i18next.t('sensor.properties.sensorType', 'Тип сенсора'),
          value: getSensorTypeLabel(sensor.sensorType) || sensor.sensorType,
        });
        
        // Додаємо всі поля, що починаються з current* або dangerous*
        Object.keys(sensor).forEach(key => {
          if (key.startsWith('current') && sensor[key] !== undefined) {
            properties.push({
              label: i18next.t(`sensor.properties.${key}`, `Поточне значення: ${key.replace('current', '')}`),
              value: sensor[key],
            });
          } else if (key.startsWith('dangerous') && sensor[key] !== undefined) {
            properties.push({
              label: i18next.t(`sensor.properties.${key}`, `Небезпечне значення: ${key.replace('dangerous', '')}`),
              value: sensor[key],
            });
          }
        });
        break;
    }
  } catch (error) {
    console.error('Помилка при форматуванні властивостей сенсора:', error);
    
    // Навіть якщо сталася помилка, додаємо базову інформацію
    properties.push({
      label: i18next.t('sensor.properties.sensorType', 'Тип сенсора'),
      value: getSensorTypeLabel(sensor.sensorType) || sensor.sensorType,
    });
  }
  
  // Якщо після всіх перевірок немає властивостей, додаємо базові дані про сенсор
  if (properties.length === 0) {
    properties.push({
      label: i18next.t('sensor.properties.sensorType', 'Тип сенсора'),
      value: getSensorTypeLabel(sensor.sensorType) || sensor.sensorType,
    });
    
    if (sensor.isActive !== undefined) {
      properties.push({
        label: i18next.t('sensor.properties.status', 'Статус'),
        value: sensor.isActive 
          ? i18next.t('sensor.on', 'Увімкнено') 
          : i18next.t('sensor.off', 'Вимкнено'),
      });
    }
  }
  
  return properties;
}; 