import { API_URL } from '../config';
import { getAuth } from 'firebase/auth';
import firebase from '../config/firebase';

interface BagDetails {
  category: string;
  name: string;
  description: string;
  size: string;
  dailyCount: number;
}

interface PickupSchedule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export const storeDetailsService = {
  async updateBagDetails(details: BagDetails): Promise<void> {
    const currentUser = getAuth(firebase).currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const idToken = await currentUser.getIdToken();
    const response = await fetch(`${API_URL}/api/store-management/bag-details`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update bag details');
    }
  },

  async updatePickupSchedule(schedule: PickupSchedule[]): Promise<void> {
    const currentUser = getAuth(firebase).currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const idToken = await currentUser.getIdToken();
    const response = await fetch(`${API_URL}/api/store-management/pickup-schedule`, {
      method: 'POST',
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
  }
}; 