import i18next from 'i18next';

/**
 * Отримує шлях до зображення пристрою на основі його типу
 * @param {string} deviceType - Тип пристрою
 * @returns {string} - Шлях до зображення
 */
export const getDeviceImage = (deviceType) => {
  try {
    const typeToImageMap = {
      smart_light: '/images/devices/SmartLight.webp',
      thermostat: '/images/devices/Thermostat.jpg',
      smart_plug: '/images/devices/SmartPlug.jpg',
      air_purifier: '/images/devices/AirPurifier.jpg',
      ventilation: '/images/devices/Ventilation.jpg',
      smart_lock: '/images/devices/SmartLock.jpg',
      gate: '/images/devices/Gate.jpg',
      irrigation_system: '/images/devices/IrrigationSystem.jpg',
      heating_valve: '/images/devices/HeatingValve.jpg',
      camera: '/images/devices/Camera.webp',
    };
    
    return typeToImageMap[deviceType] || '/images/devices/SmartPlug.jpg';
  } catch (error) {
    console.error('Помилка при отриманні зображення пристрою:', error);
    return '/images/devices/SmartPlug.jpg';
  }
};

/**
 * Отримує назву типу пристрою з перекладом через i18n
 * @param {string} deviceType - Тип пристрою
 * @returns {string} - Перекладена назва типу пристрою
 */
export const getDeviceTypeLabel = (deviceType) => {
  try {
    return i18next.t(`device.deviceTypes.${deviceType}`, deviceType);
  } catch {
    // Якщо i18next не доступний, повертаємо значення за замовчуванням
    console.warn('i18next not available for translation, using fallback values');
    const typeToLabelMap = {
      smart_light: 'Розумне світло',
      thermostat: 'Термостат',
      smart_plug: 'Розумна розетка',
      air_purifier: 'Очищувач повітря',
      ventilation: 'Вентиляція',
      smart_lock: 'Розумний замок',
      gate: 'Ворота',
      irrigation_system: 'Система поливу',
      heating_valve: 'Клапан опалення',
      camera: 'Камера',
    };
    
    return typeToLabelMap[deviceType] || deviceType;
  }
};

/**
 * Отримує список типів пристроїв для використання в селекті з i18n
 * @returns {Array} - Масив об'єктів { value, label }
 */
export const getDeviceTypeOptions = () => {
  try {
    return [
      { value: 'smart_light', label: i18next.t('device.deviceTypes.smart_light') },
      { value: 'thermostat', label: i18next.t('device.deviceTypes.thermostat') },
      { value: 'smart_plug', label: i18next.t('device.deviceTypes.smart_plug') },
      { value: 'air_purifier', label: i18next.t('device.deviceTypes.air_purifier') },
      { value: 'ventilation', label: i18next.t('device.deviceTypes.ventilation') },
      { value: 'smart_lock', label: i18next.t('device.deviceTypes.smart_lock') },
      { value: 'gate', label: i18next.t('device.deviceTypes.gate') },
      { value: 'irrigation_system', label: i18next.t('device.deviceTypes.irrigation_system') },
      { value: 'heating_valve', label: i18next.t('device.deviceTypes.heating_valve') },
      { value: 'camera', label: i18next.t('device.deviceTypes.camera') },
    ];
  } catch {
    // Якщо i18n не доступний, повертаємо значення за замовчуванням
    console.warn('i18next not available for translation, using fallback values');
    return [
      { value: 'smart_light', label: 'Розумне світло' },
      { value: 'thermostat', label: 'Термостат' },
      { value: 'smart_plug', label: 'Розумна розетка' },
      { value: 'air_purifier', label: 'Очищувач повітря' },
      { value: 'ventilation', label: 'Вентиляція' },
      { value: 'smart_lock', label: 'Розумний замок' },
      { value: 'gate', label: 'Ворота' },
      { value: 'irrigation_system', label: 'Система поливу' },
      { value: 'heating_valve', label: 'Клапан опалення' },
      { value: 'camera', label: 'Камера' },
    ];
  }
};

/**
 * Повертає список специфічних полів для типу пристрою
 * @param {string} deviceType - Тип пристрою
 * @returns {Array} - Масив полів для форми
 */
export const getDeviceSpecificFields = (deviceType) => {
  try {
    switch (deviceType) {
      case 'smart_light':
        return [
          { 
            name: 'brightness', 
            label: i18next.t('device.properties.brightness', 'Яскравість'), 
            type: 'number', 
            required: true, 
            defaultValue: 100 
          },
          { 
            name: 'color', 
            label: i18next.t('device.properties.color', 'Колір'), 
            type: 'select', 
            required: true,
            options: [
              { value: 'white', label: i18next.t('device.modes.white', 'Білий') },
              { value: 'warm_white', label: i18next.t('device.modes.warm_white', 'Тепле біле') },
              { value: 'daylight', label: i18next.t('device.modes.daylight', 'Денне світло') },
              { value: 'soft_white', label: i18next.t('device.modes.soft_white', 'М\'яке біле') },
              { value: 'cool_white', label: i18next.t('device.modes.cool_white', 'Холодне біле') },
              { value: 'candle', label: i18next.t('device.modes.candle', 'Свічка') },
              { value: 'sunset', label: i18next.t('device.modes.sunset', 'Захід сонця') },
              { value: 'sunrise', label: i18next.t('device.modes.sunrise', 'Схід сонця') },
              { value: 'deep_blue', label: i18next.t('device.modes.deep_blue', 'Глибокий синій') },
              { value: 'ocean_blue', label: i18next.t('device.modes.ocean_blue', 'Океанський синій') },
              { value: 'sky_blue', label: i18next.t('device.modes.sky_blue', 'Небесно-синій') },
              { value: 'turquoise', label: i18next.t('device.modes.turquoise', 'Бірюзовий') },
              { value: 'mint', label: i18next.t('device.modes.mint', 'М\'ятний') },
              { value: 'forest_green', label: i18next.t('device.modes.forest_green', 'Лісовий зелений') },
              { value: 'lime', label: i18next.t('device.modes.lime', 'Лаймовий') },
              { value: 'yellow', label: i18next.t('device.modes.yellow', 'Жовтий') },
              { value: 'amber', label: i18next.t('device.modes.amber', 'Бурштиновий') },
              { value: 'orange', label: i18next.t('device.modes.orange', 'Помаранчевий') },
              { value: 'red', label: i18next.t('device.modes.red', 'Червоний') },
              { value: 'pink', label: i18next.t('device.modes.pink', 'Рожевий') },
              { value: 'fuchsia', label: i18next.t('device.modes.fuchsia', 'Фуксія') },
              { value: 'purple', label: i18next.t('device.modes.purple', 'Фіолетовий') },
              { value: 'lavender', label: i18next.t('device.modes.lavender', 'Лавандовий') },
              { value: 'night_mode', label: i18next.t('device.modes.night_mode', 'Нічний режим') },
              { value: 'reading_mode', label: i18next.t('device.modes.reading_mode', 'Режим читання') },
              { value: 'movie_mode', label: i18next.t('device.modes.movie_mode', 'Режим кіно') },
              { value: 'party_mode', label: i18next.t('device.modes.party_mode', 'Режим вечірки') },
              { value: 'relax_mode', label: i18next.t('device.modes.relax_mode', 'Режим релаксації') },
              { value: 'focus_mode', label: i18next.t('device.modes.focus_mode', 'Режим фокусування') },
            ]
          },
        ];
      case 'thermostat':
        return [
          { 
            name: 'currentMode', 
            label: i18next.t('device.properties.currentMode', 'Поточний режим'), 
            type: 'select', 
            required: true,
            options: [
              { value: 'heat', label: i18next.t('device.modes.heat', 'Нагрівання') },
              { value: 'cool', label: i18next.t('device.modes.cool', 'Охолодження') },
              { value: 'auto', label: i18next.t('device.modes.auto', 'Авто') },
              { value: 'eco', label: i18next.t('device.modes.eco', 'Еко') },
            ]
          },
          { 
            name: 'currentTemperature', 
            label: i18next.t('device.properties.currentTemperature', 'Поточна температура'), 
            type: 'number', 
            required: true, 
            defaultValue: 21 
          },
        ];
      case 'smart_plug':
        return [];
      case 'air_purifier':
        return [
          { 
            name: 'currentMode', 
            label: i18next.t('device.properties.currentMode', 'Поточний режим'), 
            type: 'select', 
            required: true,
            options: [
              { value: 'auto', label: i18next.t('device.modes.auto', 'Авто') },
              { value: 'manual', label: i18next.t('device.modes.manual', 'Ручний') },
              { value: 'sleep', label: i18next.t('device.modes.sleep', 'Нічний') },
              { value: 'turbo', label: i18next.t('device.modes.turbo', 'Турбо') },
              { value: 'quiet', label: i18next.t('device.modes.quiet', 'Тихий') },
            ]
          },
          { 
            name: 'currentFanSpeed', 
            label: i18next.t('device.properties.currentFanSpeed', 'Швидкість вентилятора'), 
            type: 'number', 
            required: true, 
            defaultValue: 1 
          },
        ];
      case 'ventilation':
        return [
          { 
            name: 'currentMode', 
            label: i18next.t('device.properties.currentMode', 'Поточний режим'), 
            type: 'select', 
            required: true,
            options: [
              { value: 'auto', label: i18next.t('device.modes.auto', 'Авто') },
              { value: 'manual', label: i18next.t('device.modes.manual', 'Ручний') },
              { value: 'boost', label: i18next.t('device.modes.boost', 'Підсилений') },
              { value: 'eco', label: i18next.t('device.modes.eco', 'Еко') },
              { value: 'night', label: i18next.t('device.modes.night', 'Нічний') },
            ]
          },
          { 
            name: 'currentFanSpeed', 
            label: i18next.t('device.properties.currentFanSpeed', 'Швидкість'), 
            type: 'number', 
            required: true, 
            defaultValue: 1 
          },
          { 
            name: 'currentAirflow', 
            label: i18next.t('device.properties.currentAirflow', 'Потік повітря'), 
            type: 'number', 
            required: false, 
            defaultValue: 1 
          },
        ];
      case 'smart_lock':
        return [];
      case 'gate':
        return [];
      case 'irrigation_system':
        return [
          { 
            name: 'currentWaterFlow', 
            label: i18next.t('device.properties.currentWaterFlow', 'Потік води'), 
            type: 'number', 
            required: false, 
            defaultValue: 1 
          },
        ];
      case 'heating_valve':
        return [
          { 
            name: 'currentTemperature', 
            label: i18next.t('device.properties.currentTemperature', 'Поточна температура'), 
            type: 'number', 
            required: true, 
            defaultValue: 21 
          },
        ];
      case 'camera':
        return [
          { 
            name: 'currentResolution', 
            label: i18next.t('device.properties.currentResolution', 'Роздільна здатність'), 
            type: 'select', 
            required: true,
            options: [
              { 
                value: 'vga', 
                label: i18next.t('device.units.resolution.vga', 'VGA (640x480)'), 
                data: { width: 640, height: 480 } 
              },
              { 
                value: 'hd', 
                label: i18next.t('device.units.resolution.hd', 'HD (1280x720)'), 
                data: { width: 1280, height: 720 } 
              },
              { 
                value: 'fullhd', 
                label: i18next.t('device.units.resolution.fullhd', 'Full HD (1920x1080)'), 
                data: { width: 1920, height: 1080 } 
              },
              { 
                value: '2k', 
                label: i18next.t('device.units.resolution.2k', '2K (2560x1440)'), 
                data: { width: 2560, height: 1440 } 
              },
              { 
                value: '4k', 
                label: i18next.t('device.units.resolution.4k', '4K (3840x2160)'), 
                data: { width: 3840, height: 2160 } 
              },
            ],
            useObjectValue: true,
            transformInput: (value, options) => {
              // Якщо значення вже є об'єктом з width і height, повертаємо його як є
              if (value && typeof value === 'object' && value.width && value.height) {
                return value;
              }
              
              // Інакше шукаємо відповідний пресет
              const option = options.find(opt => opt.value === value);
              return option ? option.data : { width: 1280, height: 720 };
            },
            transformOutput: (value) => {
              if (!value || typeof value !== 'object') return 'hd';
              
              const { width, height } = value;
              if (width === 640 && height === 480) return 'vga';
              if (width === 1280 && height === 720) return 'hd';
              if (width === 1920 && height === 1080) return 'fullhd';
              if (width === 2560 && height === 1440) return '2k';
              if (width === 3840 && height === 2160) return '4k';
              
              return 'hd';
            }
          },
        ];
      default:
        return [];
    }
  } catch (error) {
    console.warn('Error getting device specific fields:', error);
    // Якщо i18n не доступний, повертаємо поля без перекладу
    return getDeviceSpecificFieldsFallback(deviceType);
  }
};

// Резервна функція без перекладів для випадку, коли i18n не доступний
const getDeviceSpecificFieldsFallback = (deviceType) => {
  switch (deviceType) {
    case 'smart_light':
      return [
        { name: 'brightness', label: 'Яскравість', type: 'number', required: true, defaultValue: 100 },
        { 
          name: 'color', 
          label: 'Колір', 
          type: 'select', 
          required: true,
          options: [
            { value: 'white', label: 'Білий' },
            { value: 'warm_white', label: 'Тепле біле' },
            // ... інші кольори
          ]
        },
      ];
    case 'thermostat':
      return [
        { 
          name: 'currentMode', 
          label: 'Поточний режим', 
          type: 'select', 
          required: true,
          options: [
            { value: 'heat', label: 'Нагрівання' },
            { value: 'cool', label: 'Охолодження' },
            { value: 'auto', label: 'Авто' },
            { value: 'eco', label: 'Еко' },
          ]
        },
        { name: 'currentTemperature', label: 'Поточна температура', type: 'number', required: true, defaultValue: 21 },
      ];
    case 'smart_lock':
      return [];
    case 'gate':
      return [];
    // ... інші типи пристроїв
    default:
      return [];
  }
};

/**
 * Форматує специфічні властивості пристрою для відображення з i18n
 * @param {Object} device - Об'єкт пристрою
 * @returns {Array} - Масив властивостей для відображення
 */
export const formatDeviceProperties = (device) => {
  const properties = [];
  
  try {
    switch (device.deviceType) {
      case 'smart_light':
        if (device.brightness !== undefined) {
          properties.push({ 
            label: i18next.t('device.properties.brightness', 'Яскравість'), 
            value: `${device.brightness}${i18next.t('device.units.percent', '%')}` 
          });
        }
        if (device.color) {
          const colorKey = `device.properties.color`;
          properties.push({ 
            label: i18next.t(colorKey, 'Колір'), 
            value: i18next.t(`device.modes.${device.color}`, device.color) 
          });
        }
        break;
      case 'thermostat':
        if (device.currentMode) {
          properties.push({ 
            label: i18next.t('device.properties.mode', 'Режим'), 
            value: i18next.t(`device.modes.${device.currentMode}`, device.currentMode) 
          });
        }
        if (device.currentTemperature !== undefined) {
          properties.push({ 
            label: i18next.t('device.properties.temperature', 'Температура'), 
            value: `${device.currentTemperature}${i18next.t('device.units.celsius', '°C')}` 
          });
        }
        break;
      case 'smart_plug':
        if (device.currentLoad !== undefined) {
          properties.push({ 
            label: i18next.t('device.properties.currentLoad', 'Навантаження'), 
            value: `${device.currentLoad} ${i18next.t('device.units.watt', 'Вт')}` 
          });
        }
        break;
      case 'air_purifier':
        if (device.currentMode) {
          properties.push({ 
            label: i18next.t('device.properties.mode', 'Режим'), 
            value: i18next.t(`device.modes.${device.currentMode}`, device.currentMode) 
          });
        }
        if (device.currentFanSpeed !== undefined) {
          properties.push({ 
            label: i18next.t('device.properties.fanSpeed', 'Швидкість'), 
            value: device.currentFanSpeed 
          });
        }
        if (device.currentAirQuality) {
          if (device.currentAirQuality.pm25 !== undefined) {
            properties.push({ 
              label: i18next.t('device.properties.pm25', 'PM2.5'), 
              value: `${device.currentAirQuality.pm25} ${i18next.t('device.units.microgramsPerCubicMeter', 'мкг/м³')}` 
            });
          }
          if (device.currentAirQuality.pm10 !== undefined) {
            properties.push({ 
              label: i18next.t('device.properties.pm10', 'PM10'), 
              value: `${device.currentAirQuality.pm10} ${i18next.t('device.units.microgramsPerCubicMeter', 'мкг/м³')}` 
            });
          }
        }
        break;
      case 'ventilation':
        if (device.currentMode) {
          properties.push({ 
            label: i18next.t('device.properties.mode', 'Режим'), 
            value: i18next.t(`device.modes.${device.currentMode}`, device.currentMode) 
          });
        }
        if (device.currentFanSpeed !== undefined) {
          properties.push({ 
            label: i18next.t('device.properties.fanSpeed', 'Швидкість'), 
            value: device.currentFanSpeed 
          });
        }
        if (device.currentAirflow !== undefined) {
          properties.push({ 
            label: i18next.t('device.properties.airflow', 'Потік повітря'), 
            value: `${device.currentAirflow} ${i18next.t('device.units.cubicMeterPerHour', 'м³/год')}` 
          });
        }
        break;
      case 'smart_lock':
        if (device.currentDoorState) {
          properties.push({ 
            label: i18next.t('device.properties.doorState', 'Стан дверей'), 
            value: i18next.t(`device.states.${device.currentDoorState}`, device.currentDoorState) 
          });
        }
        break;
      case 'gate':
        if (device.currentPosition) {
          properties.push({ 
            label: i18next.t('device.properties.position', 'Позиція'), 
            value: i18next.t(`device.states.${device.currentPosition}`, device.currentPosition) 
          });
        }
        break;
      case 'irrigation_system':
        if (device.currentWaterFlow !== undefined) {
          properties.push({ 
            label: i18next.t('device.properties.waterFlow', 'Потік води'), 
            value: `${device.currentWaterFlow} ${i18next.t('device.units.literPerMinute', 'л/хв')}` 
          });
        }
        break;
      case 'heating_valve':
        if (device.currentTemperature !== undefined) {
          properties.push({ 
            label: i18next.t('device.properties.temperature', 'Температура'), 
            value: `${device.currentTemperature}${i18next.t('device.units.celsius', '°C')}` 
          });
        }
        break;
      case 'camera':
        if (device.currentResolution) {
          // Перевіряємо, чи є роздільна здатність об'єктом із width і height
          if (device.currentResolution.width && device.currentResolution.height) {
            properties.push({ 
              label: i18next.t('device.properties.resolution', 'Роздільна здатність'), 
              value: `${device.currentResolution.width}x${device.currentResolution.height}` 
            });
          } else {
            // Якщо немає width або height, спробуємо використати значення value
            let resolutionValue = device.currentResolution.value ?? 'hd';
            properties.push({ 
              label: i18next.t('device.properties.resolution', 'Роздільна здатність'), 
              value: i18next.t(`device.units.resolution.${resolutionValue}`, resolutionValue) 
            });
          }
        }
        break;
      default:
        // Без властивостей для невідомих типів
    }
  } catch (error) {
    console.warn('Error formatting device properties:', error);
    // Якщо i18n не доступний, повертаємо властивості без перекладу
  }
  
  return properties;
}; 