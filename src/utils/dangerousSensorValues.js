/**
 * Об'єкт, що містить порогові значення небезпечних показників для різних типів сенсорів
 * Значення базуються на середньостатистичних небезпечних рівнях для України
 */
export const dangerousSensorValues = {
  // Структурований за типами сенсорів
  gas_sensor: {
    dangerousMethanLevel: 0.5, // % LEL (Lower Explosive Limit) - метан стає вибухонебезпечним при концентрації 4.4-17% за об'ємом
    dangerousMethanLevelUnit: '% LEL',
    dangerousCarbonMonoxideLevel: 50, // ppm - згідно з ВООЗ, концентрація CO понад 50 ppm може спричинити проблеми зі здоров'ям
    dangerousCarbonMonoxideLevelUnit: 'ppm',
    dangerousCarbonDioxideLevel: 1000, // ppm - згідно з українськими нормами якості повітря
    dangerousCarbonDioxideLevelUnit: 'ppm',
    dangerousPropaneLevel: 0.4, // % LEL - пропан стає вибухонебезпечним при концентрації 2.1-10.1% за об'ємом
    dangerousPropaneLevelUnit: '% LEL',
    dangerousNitrogenDioxideLevel: 200, // мкг/м³ - за нормами ВООЗ
    dangerousNitrogenDioxideLevelUnit: 'мкг/м³',
    dangerousOzoneLevel: 100, // мкг/м³ - за нормами ВООЗ для 8-годинного середнього показника
    dangerousOzoneLevelUnit: 'мкг/м³',
  },

  air_quality_sensor: {
    dangerousAQI: 150, // Індекс якості повітря (AQI) - значення вище 150 вважається шкідливим для здоров'я
    dangerousAQIUnit: '',
    dangerousPM25: 35, // мкг/м³ - за нормами ВООЗ, добовий ліміт для PM2.5
    dangerousPM25Unit: 'мкг/м³',
    dangerousPM10: 50, // мкг/м³ - за нормами ВООЗ, добовий ліміт для PM10
    dangerousPM10Unit: 'мкг/м³',
  },

  smoke_sensor: {
    dangerousSmokeLevel: 20, // % затемнення/м - стандартне порогове значення для побутових детекторів диму
    dangerousSmokeLevelUnit: '%',
  },

  water_leak_sensor: {
    dangerousWaterDetectionIndex: 5, // умовна одиниця - залежить від калібрування сенсора
    dangerousWaterDetectionIndexUnit: '',
  },

  temperature_sensor: {
    dangerousTemperaturePlus: 30, // °C - вважається критично високою для житлових приміщень
    dangerousTemperaturePlusUnit: '°C',
    dangerousTemperatureMinus: -20, // °C - вважається критично низькою для житлових приміщень
    dangerousTemperatureMinusUnit: '°C',
  },

  humidity_sensor: {
    dangerousHumidity: 70, // % - висока вологість сприяє розвитку плісняви
    dangerousHumidityUnit: '%',
  },

  light_sensor: {
    dangerousLux: 10000, // люкс - дуже висока інтенсивність світла може спричинити пошкодження зору
    dangerousLuxUnit: 'люкс',
  },

  motion_sensor: {
    dangerousMotionIntensity: 80, // значення від 0 до 100, де 80+ може вказувати на аномальну активність
    dangerousMotionIntensityUnit: '',
  },

  power_sensor: {
    dangerousPower: 3500, // Вт - перевищення номінальної потужності для стандартної квартири в Україні
    dangerousPowerUnit: 'Вт',
    dangerousVoltage: 250, // В - критично високе значення для мережі 220В
    dangerousVoltageUnit: 'В',
    dangerousCurrent: 16, // А - типовий граничний струм для стандартного автомата
    dangerousCurrentUnit: 'А',
  },

  weather_sensor: {
    dangerousTemperature: 35, // °C - критично висока зовнішня температура
    dangerousTemperatureUnit: '°C',
    dangerousTemperaturePlus: 35, // °C - критично висока зовнішня температура
    dangerousTemperaturePlusUnit: '°C',
    dangerousTemperatureMinus: -20, // °C - критично низька зовнішня температура
    dangerousTemperatureMinusUnit: '°C',
    dangerousWindSpeed: 20, // м/с - шторм, який може спричинити пошкодження
    dangerousWindSpeedUnit: 'м/с',
    dangerousRainIntensity: 15, // мм/год - сильна злива, що може спричинити локальні підтоплення
    dangerousRainIntensityUnit: 'мм/год',
  }
}; 