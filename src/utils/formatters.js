/**
 * Форматує адресу у вигляді "місто, вулиця, номер будинку, номер квартири (якщо є)"
 * 
 * @param {Object} home - Об'єкт з даними будинку
 * @param {Function} t - Функція перекладу i18n
 * @returns {string} - Форматована адреса
 */
export const formatAddress = (home, t) => {
  if (!home) {
    return '';
  }
  
  // Перевіряємо різні можливі структури даних
  let address = null;
  
  // Варіант 1: Адреса в полі addressId
  if (home.addressId) {
    address = home.addressId;
  }
  // Варіант 2: Адреса в полі address
  else if (home.address) {
    address = home.address;
  }
  // Варіант 3: Адресні поля безпосередньо в об'єкті home
  else {
    address = home;
  }
  
  // Якщо адреса відсутня, повертаємо пустий рядок
  if (!address) return '';
  
  let formattedAddress = '';
  
  // Формат: місто, вулиця, номер будинку, [кв. номер квартири]
  if (address.city) {
    formattedAddress += t('addHome.address.cityShort') + ' ' + address.city;
  }
  
  if (address.street) {
    if (formattedAddress) formattedAddress += ', ';
    formattedAddress += t('addHome.address.streetShort') + ' ' + address.street;
  }
  
  // Номер будинку
  if (address.buildingNumber) {
    if (formattedAddress) formattedAddress += ', ';
    formattedAddress += address.buildingNumber;
  }
  
  // Номер квартири
  if (address.apartmentNumber) {
    if (formattedAddress) formattedAddress += ', ' + t('addHome.address.apartmentShort') + ' ';
    formattedAddress += address.apartmentNumber;
  }
  
  return formattedAddress;
}; 

/**
 * Форматує дату у локалізований рядок
 * 
 * @param {Date|string} date - Дата для форматування
 * @param {string} [format='dd.MM.yyyy'] - Формат (за замовчуванням dd.MM.yyyy)
 * @returns {string} - Відформатована дата
 */
export const formatDate = (date, format = 'dd.MM.yyyy') => {
  if (!date) return '';
  
  const d = new Date(date);
  
  // Перевірка на валідність дати
  if (isNaN(d.getTime())) {
    return '';
  }
  
  // Отримуємо компоненти дати
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  // Форматуємо дату відповідно до заданого формату
  let formattedDate = format;
  formattedDate = formattedDate.replace('dd', day);
  formattedDate = formattedDate.replace('MM', month);
  formattedDate = formattedDate.replace('yyyy', year);
  
  return formattedDate;
}; 