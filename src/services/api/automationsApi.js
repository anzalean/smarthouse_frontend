import { api } from './apiClient.js';

const BASE_URL = '/automation';

export const automationsApi = {
  // Get all automations for a home
  getAutomationsByHomeId: async homeId => {
    const response = await api.get(`${BASE_URL}?homeId=${homeId}`);
    return response.data;
  },

  // Get active automations for a home
  getActiveAutomationsByHomeId: async homeId => {
    const response = await api.get(`${BASE_URL}/active?homeId=${homeId}`);
    return response.data;
  },

  // Get automations by trigger type
  getAutomationsByTriggerType: async (homeId, type) => {
    const response = await api.get(
      `${BASE_URL}/trigger/${type}?homeId=${homeId}`
    );
    return response.data;
  },

  // Get a specific automation
  getAutomationById: async id => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Create a new automation
  createAutomation: async automationData => {
    const response = await api.post(BASE_URL, automationData);
    return response.data;
  },

  // Update an automation
  updateAutomation: async (id, automationData) => {
    const response = await api.put(`${BASE_URL}/${id}`, automationData);
    return response.data;
  },

  // Toggle automation status
  toggleAutomationStatus: async id => {
    const response = await api.patch(`${BASE_URL}/${id}/toggle`);
    return response.data;
  },

  // Delete an automation
  deleteAutomation: async id => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
