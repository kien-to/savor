import { getAuth } from 'firebase/auth';
import firebase from '../config/firebase';
import { API_URL } from '../config';

interface StoreOwnerReservation {
  id: string;
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  quantity: number;
  totalAmount: number;
  status: 'active' | 'picked_up';
  pickupTime?: string;
  pickupTimestamp?: string;
  createdAt: string;
  storeName: string;
  storeImage: string;
  storeAddress: string;
}

interface StoreOwnerSettings {
  surpriseBoxes: number;
  price: number;
  isSelling: boolean;
}

interface StoreOwnerStats {
  current: {
    totalReservations: number;
    activeReservations: number;
    pickedUpReservations: number;
    totalRevenue: number;
  };
  past: {
    totalReservations: number;
    activeReservations: number;
    pickedUpReservations: number;
    totalRevenue: number;
  };
  date: string;
}

class StoreOwnerApiService {
  private async getAuthToken(): Promise<string | null> {
    return this.getAuthTokenWithRetry();
  }

  private async getAuthTokenWithRetry(maxRetries: number = 3, delayMs: number = 500): Promise<string | null> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Store Owner Auth attempt ${attempt}/${maxRetries}`);
        
        // Try Firebase auth first (for social login users)
        const auth = getAuth(firebase);
        const user = auth.currentUser;
        if (user) {
          console.log('Firebase user found, getting ID token...');
          const idToken = await user.getIdToken();
          console.log('Firebase ID token obtained successfully');
          return idToken;
        }
        
        // Try JWT token auth (for email login users)
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const token = await AsyncStorage.getItem('token');
        if (token) {
          console.log('JWT token found in storage');
          return token;
        }
        
        console.log(`No auth token found on attempt ${attempt}`);
        
        // If this isn't the last attempt, wait before retrying
        if (attempt < maxRetries) {
          console.log(`Waiting ${delayMs}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        console.error(`Store Owner Auth attempt ${attempt} failed:`, error);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    console.log('All store owner auth attempts failed');
    return null;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('store owner api error data', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get current and past reservations for the store owner
  async getReservations(): Promise<{ 
    currentReservations: StoreOwnerReservation[]; 
    pastReservations: StoreOwnerReservation[];
    currentCount: number;
    pastCount: number;
  }> {
    return this.makeRequest<{ 
      currentReservations: StoreOwnerReservation[]; 
      pastReservations: StoreOwnerReservation[];
      currentCount: number;
      pastCount: number;
    }>('/api/store-owner/reservations');
  }

  // Update reservation status
  async updateReservationStatus(reservationId: string, status: 'active' | 'picked_up'): Promise<{ message: string; status: string }> {
    return this.makeRequest<{ message: string; status: string }>(`/api/store-owner/reservations/${reservationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Get store owner settings
  async getSettings(): Promise<StoreOwnerSettings> {
    return this.makeRequest<StoreOwnerSettings>('/api/store-owner/settings');
  }

  // Update store owner settings
  async updateSettings(settings: Partial<StoreOwnerSettings>): Promise<{ message: string; settings: StoreOwnerSettings }> {
    return this.makeRequest<{ message: string; settings: StoreOwnerSettings }>('/api/store-owner/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Get store owner statistics
  async getStats(): Promise<StoreOwnerStats> {
    return this.makeRequest<StoreOwnerStats>('/api/store-owner/stats');
  }

  // Get store info (from existing store management API)
  async getStoreInfo(): Promise<any> {
    return this.makeRequest<any>('/api/store-management/my-store');
  }
}

export const storeOwnerApiService = new StoreOwnerApiService();
export type { StoreOwnerReservation, StoreOwnerSettings, StoreOwnerStats };
