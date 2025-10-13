import { getAuth } from 'firebase/auth';

const API_BASE_URL = 'https://savor-server-production.up.railway.app/api';

interface StoreOwnerReservation {
  id: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  totalAmount: number;
  status: 'active' | 'picked_up';
  pickupTime?: string;
  pickupTimestamp?: string;
  createdAt: string;
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
    try {
      const auth = getAuth(firebase);
      const user = auth.currentUser;
      if (!user) {
        return null;
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
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
    }>('/store-owner/reservations');
  }

  // Update reservation status
  async updateReservationStatus(reservationId: string, status: 'active' | 'picked_up'): Promise<{ message: string; status: string }> {
    return this.makeRequest<{ message: string; status: string }>(`/store-owner/reservations/${reservationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Get store owner settings
  async getSettings(): Promise<StoreOwnerSettings> {
    return this.makeRequest<StoreOwnerSettings>('/store-owner/settings');
  }

  // Update store owner settings
  async updateSettings(settings: Partial<StoreOwnerSettings>): Promise<{ message: string; settings: StoreOwnerSettings }> {
    return this.makeRequest<{ message: string; settings: StoreOwnerSettings }>('/store-owner/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Get store owner statistics
  async getStats(): Promise<StoreOwnerStats> {
    return this.makeRequest<StoreOwnerStats>('/store-owner/stats');
  }

  // Get store info (from existing store management API)
  async getStoreInfo(): Promise<any> {
    return this.makeRequest<any>('/store-management/my-store');
  }
}

export const storeOwnerApiService = new StoreOwnerApiService();
export type { StoreOwnerReservation, StoreOwnerSettings, StoreOwnerStats };
