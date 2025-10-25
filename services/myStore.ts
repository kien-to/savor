import { API_URL } from '../config';
import { getAuth } from 'firebase/auth';
import firebase from '../config/firebase';

export interface StoreInfo {
  id: string;
  title: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface BusinessDetails {
  businessName: string;
  storeType: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export const myStoreService = {
  async getAuthTokenWithRetry(maxRetries: number = 3, delayMs: number = 500): Promise<string | null> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        
        // Try Firebase auth first (for social login users)
        const auth = getAuth(firebase);
        const user = auth.currentUser;
        if (user) {
          const idToken = await user.getIdToken();
          return idToken;
        }
        
        // Try JWT token auth (for email login users)
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const token = await AsyncStorage.getItem('token');
        if (token) {
          return token;
        }
        
        
        // If this isn't the last attempt, wait before retrying
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.error(`MyStore Auth attempt ${attempt} failed:`, error);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    return null;
  },

  async getStoreInfo(): Promise<StoreInfo> {
    try {
      const token = await this.getAuthTokenWithRetry();
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch(`${API_URL}/api/store-management/my-store`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch store info');
      }

    //   console.log("my store response", response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching store info:', error);
      throw error;
    }
  },

  async updateStoreInfo(storeInfo: Partial<StoreInfo>): Promise<StoreInfo> {
    try {
      const token = await this.getAuthTokenWithRetry();
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch(`${API_URL}/api/store-management/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeInfo),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update store info');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating store info:', error);
      throw error;
    }
  },

  async createStore(details: BusinessDetails): Promise<{ id: string }> {
    try {
      const token = await this.getAuthTokenWithRetry();
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch(`${API_URL}/api/store-management/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create store');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  }
};