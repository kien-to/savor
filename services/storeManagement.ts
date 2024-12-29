import { API_URL } from '../config';
import { getAuth } from 'firebase/auth';
import firebase from '../config/firebase';

interface BusinessDetails {
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

interface StoreSchedule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface StoreResponse {
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
  schedule: StoreSchedule[];
  bagType: string;
  dailyBags: number;
}

export const storeManagementService = {
  async createStore(storeDetails: BusinessDetails): Promise<StoreResponse> {
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
        body: JSON.stringify(storeDetails),
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
  },

  async getMyStore(): Promise<StoreResponse> {
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
        throw new Error(error.error || 'Failed to fetch store');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching store:', error);
      throw error;
    }
  },

  async updateStore(storeDetails: Partial<BusinessDetails>): Promise<StoreResponse> {
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
        body: JSON.stringify(storeDetails),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update store');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating store:', error);
      throw error;
    }
  },

  async updateSchedule(schedule: StoreSchedule[]): Promise<StoreResponse> {
    try {
      const currentUser = getAuth(firebase).currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const idToken = await currentUser.getIdToken();
      
      const response = await fetch(`${API_URL}/api/store-management/update-schedule`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schedule }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update schedule');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  async toggleSelling(isSelling: boolean): Promise<void> {
    try {
      const currentUser = getAuth(firebase).currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const idToken = await currentUser.getIdToken();
      
      const response = await fetch(`${API_URL}/api/store-management/toggle-selling`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_selling: isSelling }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update selling status');
      }
    } catch (error) {
      console.error('Error toggling selling status:', error);
      throw error;
    }
  }
}; 