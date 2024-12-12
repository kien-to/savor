import firebase from '@/config/firebase';
import { API_URL } from '../config';
import { Store } from '../types/store';
import * as SecureStore from 'expo-secure-store';
import { getAuth } from 'firebase/auth';

interface ToggleSaveResponse {
  isSaved: boolean;
}

export const storeService = {
  async toggleSave(storeId: string): Promise<boolean> {
    try {
      // Get the current user
      const currentUser = getAuth(firebase).currentUser;
      if (!currentUser) {
        console.log('No user is currently signed in');
        throw new Error('User not authenticated');
      }

      // Wait for ID token with retry logic
      let retries = 3;
      let idToken = null;
      
      while (retries > 0 && !idToken) {
        try {
          idToken = await currentUser.getIdToken(true);  // Force refresh
          console.log('Successfully obtained ID token');
        } catch (error) {
          console.log(`Failed to get ID token, retries left: ${retries - 1}`, error);
          retries--;
          if (retries === 0) throw error;
          // Wait 1 second before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      const response = await fetch(`${API_URL}/api/stores/${storeId}/toggle-save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
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
      // Get the current user
      const currentUser = getAuth(firebase).currentUser;
      if (!currentUser) {
        console.log('No user is currently signed in');
        throw new Error('User not authenticated');
      }

      // Wait for ID token with retry logic
      let retries = 3;
      let idToken = null;
      
      while (retries > 0 && !idToken) {
        try {
          idToken = await currentUser.getIdToken(true);  // Force refresh
          console.log('Successfully obtained ID token');
        } catch (error) {
          console.log(`Failed to get ID token, retries left: ${retries - 1}`, error);
          retries--;
          if (retries === 0) throw error;
          // Wait 1 second before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // console.log('Fetching from:', `${API_URL}/api/stores/favorites`);
      
      const response = await fetch(`${API_URL}/api/stores/favorites`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
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