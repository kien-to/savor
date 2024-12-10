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
      console.log('Token:', token ? 'exists' : 'missing');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('Fetching from:', `${API_URL}/api/home/stores/favorites`);
      
      const response = await fetch(`${API_URL}/api/home/stores/favorites`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      return data;
      
    } catch (error: any) {
      console.error('Detailed error:', {
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      throw new Error(`Failed to fetch favorites: ${error.message}`);
    }
  }
}; 