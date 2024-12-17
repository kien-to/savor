import { API_URL } from '../config';
import { getAuth } from 'firebase/auth';
import firebase from '../config/firebase';

export interface Reservation {
    id: string;
    storeId: string;
    storeName: string;
    storeImage: string;
    quantity: number;
    totalAmount: number;
    status: string;
    paymentId: string;
    pickupTime: string;
    createdAt: string;
}

export const reservationService = {
    async getUserReservations(): Promise<Reservation[]> {
        const currentUser = getAuth(firebase).currentUser;
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        const idToken = await currentUser.getIdToken();
        
        const response = await fetch(`${API_URL}/api/reservations`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Reservation fetch error:', errorData);
            throw new Error('Failed to fetch reservations');
        }

        const data = await response.json();
        console.log('Reservation data:', data);
        
        // If data is null or undefined, return empty array
        if (!data) {
            return [];
        }

        // If data is already an array, return it
        if (Array.isArray(data)) {
            return data;
        }

        // If data has a reservations property that's an array, return it
        if (data.reservations && Array.isArray(data.reservations)) {
            return data.reservations;
        }

        // If we get here, return empty array as fallback
        return [];
    }
}; 