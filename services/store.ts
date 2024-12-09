import { API_URL } from '../config';
import { Store } from '../types/store';
import * as SecureStore from 'expo-secure-store';

interface ToggleSaveResponse {
  isSaved: boolean;
}

export const storeService = {
  async toggleSave(storeId: string): Promise<boolean> {
    try {
      const token = await SecureStore.getItem('authToken');
      
      const response = await fetch(`${API_URL}/api/stores/${storeId}/toggle-save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle save status');
      }

      const data: ToggleSaveResponse = await response.json();
      return data.isSaved;
    } catch (error) {
      console.error('Error toggling save:', error);
      throw error;
    }
  },

  async getFavorites(): Promise<Store[]> {
    try {
      const token = await SecureStore.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/api/home/stores/favorites`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch favorites');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }
}; 