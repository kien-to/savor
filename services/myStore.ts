import { API_URL } from '../config';
import { getAuth } from 'firebase/auth';
import firebase from '../config/firebase';

export interface StoreInfo {
  id: string;
  name: string;
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
  async getStoreInfo(): Promise<StoreInfo> {
    try {
      const currentUser = getAuth(firebase).currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const idToken = await currentUser.getIdToken();
      
      const response = await fetch(`${API_URL}/api/store-management/my-store`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch store info');
      }

      console.log("my store response", response);
      const data = await response.json();
      console.log("my store data", data);
      return await response.json();
    } catch (error) {
      console.error('Error fetching store info:', error);
      throw error;
    }
  },

  async updateStoreInfo(storeInfo: Partial<StoreInfo>): Promise<StoreInfo> {
    try {
      const currentUser = getAuth(firebase).currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const idToken = await currentUser.getIdToken();
      
      const response = await fetch(`${API_URL}/api/store-management/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
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
      const currentUser = getAuth(firebase).currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const idToken = await currentUser.getIdToken();
      
      const response = await fetch(`${API_URL}/api/store-management/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
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