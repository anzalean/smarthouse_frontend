/**
 * Утиліти для роботи з localStorage для вибраного будинку
 */

// Ключ для збереження ID поточного будинку
const SELECTED_HOME_KEY = 'selectedHomeId';

/**
 * Отримати ID збереженого будинку з localStorage
 * @returns {string|null} ID збереженого будинку або null
 */
export const getSavedHomeId = () => {
  try {
    return localStorage.getItem(SELECTED_HOME_KEY);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Зберегти ID поточного будинку в localStorage
 * @param {string} homeId - ID будинку для збереження
 */
export const saveHomeId = (homeId) => {
  try {
    if (homeId) {
      localStorage.setItem(SELECTED_HOME_KEY, homeId);
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Видалити ID збереженого будинку з localStorage
 */
export const clearSavedHomeId = () => {
  try {
    localStorage.removeItem(SELECTED_HOME_KEY);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}; 