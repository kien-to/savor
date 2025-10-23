import { API_URL } from '../config';
import { getAuth } from 'firebase/auth';
import firebase from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Reservation {
    id: string;
    storeId: string;
    storeName: string;
    storeImage: string;
    storeAddress?: string;
    storeLatitude?: number;
    storeLongitude?: number;
    quantity: number;
    totalAmount: number;
    originalPrice?: number;
    discountedPrice?: number;
    status: string;
    paymentId?: string;
    paymentType?: string;
    pickupTime: string;
    createdAt: string;
    name?: string;
    email?: string;
    phone?: string;
    customerName?: string;
    customerEmail?: string;
    phoneNumber?: string;
}

export interface ReservationRequest {
    storeId: string;
    storeName: string;
    storeImage: string;
    storeAddress: string;
    storeLatitude: number;
    storeLongitude: number;
    quantity: number;
    totalAmount: number;
    originalPrice: number;
    discountedPrice: number;
    pickupTime: string;
    name: string;
    email?: string;
    phone?: string;
    paymentType: string;
}

export const reservationService = {
    async getAuthHeader(): Promise<string | null> {
        try {
            const currentUser = getAuth(firebase).currentUser;
            if (currentUser) {
                const idToken = await currentUser.getIdToken();
                return `Bearer ${idToken}`;
            }
            const token = await AsyncStorage.getItem('token');
            if (token) return `Bearer ${token}`;
            return null;
        } catch {
            return null;
        }
    },
    async getUserReservations(): Promise<Reservation[] | { currentReservations: Reservation[]; pastReservations: Reservation[]; currentCount: number; pastCount: number }> {
        // Try Firebase auth first (for social login users)
        const currentUser = getAuth(firebase).currentUser;
        if (currentUser) {
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
                return [];
            }

            const data = await response.json();
            console.log('=== RESERVATION DATA RECEIVED (Firebase Auth) ===');
            console.log('Full data object:', JSON.stringify(data, null, 2));
            console.log('Has currentReservations?', 'currentReservations' in data);
            console.log('Has pastReservations?', 'pastReservations' in data);
            console.log('currentReservations length:', data.currentReservations?.length);
            console.log('pastReservations length:', data.pastReservations?.length);
            
            // If data is null or undefined, return empty array
            if (!data) {
                console.log('Data is null or undefined, returning empty array');
                return [];
            }

            // Handle new format with currentReservations and pastReservations
            if (data.currentReservations !== undefined || data.pastReservations !== undefined) {
                console.log('Returning full object with current and past reservations');
                // Ensure arrays are never null/undefined
                const result = {
                    currentReservations: Array.isArray(data.currentReservations) ? data.currentReservations : [],
                    pastReservations: Array.isArray(data.pastReservations) ? data.pastReservations : [],
                    currentCount: data.currentCount || 0,
                    pastCount: data.pastCount || 0,
                };
                console.log('Normalized result:', JSON.stringify(result, null, 2));
                return result;
            }

            // If data is already an array, return it (backward compatibility)
            if (Array.isArray(data)) {
                return data;
            }

            // If data has a reservations property that's an array, return it (backward compatibility)
            if (data.reservations && Array.isArray(data.reservations)) {
                return data.reservations;
            }

            // If we get here, return empty array as fallback
            return [];
        }

        // Try JWT token auth (for email login users)
        const authHeader = await this.getAuthHeader();
        if (!authHeader) return [];

        const response = await fetch(`${API_URL}/api/reservations`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Reservation fetch error:', errorData);
            return [];
        }

        const data = await response.json();
        console.log('=== RESERVATION DATA RECEIVED (JWT Auth) ===');
        console.log('Full data object:', JSON.stringify(data, null, 2));
        console.log('Has currentReservations?', 'currentReservations' in data);
        console.log('Has pastReservations?', 'pastReservations' in data);
        console.log('currentReservations length:', data.currentReservations?.length);
        console.log('pastReservations length:', data.pastReservations?.length);
        
        // If data is null or undefined, return empty array
        if (!data) {
            console.log('Data is null or undefined, returning empty array');
            return [];
        }

        // Handle new format with currentReservations and pastReservations
        if (data.currentReservations !== undefined || data.pastReservations !== undefined) {
            console.log('Returning full object with current and past reservations');
            // Ensure arrays are never null/undefined
            const result = {
                currentReservations: Array.isArray(data.currentReservations) ? data.currentReservations : [],
                pastReservations: Array.isArray(data.pastReservations) ? data.pastReservations : [],
                currentCount: data.currentCount || 0,
                pastCount: data.pastCount || 0,
            };
            console.log('Normalized result:', JSON.stringify(result, null, 2));
            return result;
        }

        // If data is already an array, return it (backward compatibility)
        if (Array.isArray(data)) {
            return data;
        }

        // If data has a reservations property that's an array, return it (backward compatibility)
        if (data.reservations && Array.isArray(data.reservations)) {
            return data.reservations;
        }

        // If we get here, return empty
        return [];
    },

    async getGuestReservations(): Promise<Reservation[]> {
        try {
            // First try to get from server
            const response = await fetch(`${API_URL}/api/reservations/guest`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for session cookies
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Guest reservation fetch error:', errorData);
                // Fall back to local storage
                return this.getLocalGuestReservations();
            }

            const data = await response.json();
            console.log('=== GUEST RESERVATION DATA RECEIVED ===');
            console.log('Full data object:', JSON.stringify(data, null, 2));
            console.log('Is array?', Array.isArray(data));
            console.log('Array length:', Array.isArray(data) ? data.length : 'N/A');
            
            // If data is null or undefined, return empty array
            if (!data) {
                console.log('Data is null or undefined, falling back to local');
                return this.getLocalGuestReservations();
            }

            // If data is already an array, return it
            if (Array.isArray(data)) {
                console.log('Returning array of', data.length, 'guest reservations');
                return data;
            }

            // If data has a reservations property that's an array, return it
            if (data.reservations && Array.isArray(data.reservations)) {
                console.log('Returning data.reservations array of', data.reservations.length, 'reservations');
                return data.reservations;
            }

            // If we get here, return local fallback
            return this.getLocalGuestReservations();
        } catch (error) {
            console.error('Error fetching guest reservations:', error);
            // Fall back to local storage
            return this.getLocalGuestReservations();
        }
    },

    async getLocalGuestReservations(): Promise<Reservation[]> {
        try {
            const localReservations = await AsyncStorage.getItem('localGuestReservations');
            if (localReservations) {
                return JSON.parse(localReservations);
            }
            return [];
        } catch (error) {
            console.error('Error getting local guest reservations:', error);
            return [];
        }
    },

    async saveLocalGuestReservation(reservation: Reservation): Promise<void> {
        try {
            const existingReservations = await this.getLocalGuestReservations();
            const updatedReservations = [...existingReservations, reservation];
            await AsyncStorage.setItem('localGuestReservations', JSON.stringify(updatedReservations));
        } catch (error) {
            console.error('Error saving local guest reservation:', error);
        }
    },

    async getLocalAuthenticatedReservations(): Promise<Reservation[]> {
        try {
            const localReservations = await AsyncStorage.getItem('localAuthenticatedReservations');
            if (localReservations) {
                return JSON.parse(localReservations);
            }
            return [];
        } catch (error) {
            console.error('Error getting local authenticated reservations:', error);
            return [];
        }
    },

    async saveLocalAuthenticatedReservation(reservation: Reservation): Promise<void> {
        try {
            const existingReservations = await this.getLocalAuthenticatedReservations();
            const updatedReservations = [...existingReservations, reservation];
            await AsyncStorage.setItem('localAuthenticatedReservations', JSON.stringify(updatedReservations));
        } catch (error) {
            console.error('Error saving local authenticated reservation:', error);
        }
    },

    async createGuestReservation(reservationData: ReservationRequest): Promise<Reservation> {
        try {
            const response = await fetch(`${API_URL}/api/reservations/guest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for session cookies
                body: JSON.stringify(reservationData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Guest reservation creation error:', errorData);
                throw new Error(errorData.error || 'Failed to create guest reservation');
            }

            const data = await response.json();
            console.log('Guest reservation created:', data);
            
            // Also save locally as backup
            await this.saveLocalGuestReservation(data);
            
            return data;
        } catch (error) {
            console.error('Error creating guest reservation:', error);
            // If server fails, create a local reservation
            const localReservation: Reservation = {
                id: `local_${Date.now()}`,
                storeId: reservationData.storeId,
                storeName: reservationData.storeName,
                storeImage: reservationData.storeImage,
                storeAddress: reservationData.storeAddress,
                storeLatitude: reservationData.storeLatitude,
                storeLongitude: reservationData.storeLongitude,
                quantity: reservationData.quantity,
                totalAmount: reservationData.totalAmount,
                originalPrice: reservationData.originalPrice,
                discountedPrice: reservationData.discountedPrice,
                status: 'pending',
                paymentType: reservationData.paymentType,
                pickupTime: reservationData.pickupTime,
                createdAt: new Date().toISOString(),
                name: reservationData.name,
                email: reservationData.email,
                phone: reservationData.phone,
            };
            
            await this.saveLocalGuestReservation(localReservation);
            return localReservation;
        }
    },

    async createAuthenticatedReservation(reservationData: ReservationRequest): Promise<Reservation> {
        try {
            // Try Firebase auth first (for social login users)
            const currentUser = getAuth(firebase).currentUser;
            let authHeader = '';
            
            if (currentUser) {
                const idToken = await currentUser.getIdToken();
                authHeader = `Bearer ${idToken}`;
            } else {
                // Try JWT token auth (for email login users)
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    throw new Error('User not authenticated');
                }
                authHeader = `Bearer ${token}`;
            }

            console.log('Creating authenticated reservation with auth header:', authHeader.substring(0, 20) + '...');
            console.log('Reservation data:', reservationData);
            console.log('Making POST request to:', `${API_URL}/api/reservations`);

            const response = await fetch(`${API_URL}/api/reservations`, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                // Try to get error text first
                const errorText = await response.text();
                console.error('Authenticated reservation creation error - raw response:', errorText);
                
                // Try to parse as JSON, but fall back to text if it fails
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (parseError) {
                    console.error('Failed to parse error response as JSON:', parseError);
                    throw new Error(`Server error: ${errorText}`);
                }
                
                throw new Error(errorData.error || 'Failed to create reservation');
            }

            // Try to parse response as JSON
            const responseText = await response.text();
            console.log('Raw response text:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response as JSON:', parseError);
                console.error('Response text:', responseText);
                throw new Error('Invalid response format from server');
            }
            
            console.log('Authenticated reservation created:', data);
            return data;
        } catch (error) {
            console.error('Error creating authenticated reservation:', error);
            throw error;
        }
    },

    async getReservations(isGuest: boolean = false): Promise<Reservation[] | { currentReservations: Reservation[]; pastReservations: Reservation[]; currentCount: number; pastCount: number }> {
        console.log('=== getReservations called with isGuest:', isGuest, '===');
        const result = isGuest ? await this.getGuestReservations() : await this.getUserReservations();
        console.log('=== getReservations returning ===');
        console.log('Type:', typeof result);
        console.log('Is array:', Array.isArray(result));
        console.log('Has currentReservations:', result && typeof result === 'object' && 'currentReservations' in result);
        console.log('Result:', JSON.stringify(result, null, 2));
        return result;
    },

    async deleteReservation(reservationId: string, isGuest: boolean = false): Promise<void> {
        if (isGuest) {
            // For guest users, use the guest endpoint
            const response = await fetch(`${API_URL}/api/reservations/guest/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for session cookies
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to delete guest reservation');
            }
        } else {
            // For authenticated users, use the authenticated endpoint
            const authHeader = await this.getAuthHeader();
            if (!authHeader) throw new Error('User not authenticated');

            const response = await fetch(`${API_URL}/api/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to delete reservation');
            }
        }
    },

    async getCombinedReservations(isGuest: boolean = false): Promise<Reservation[]> {
        try {
            if (isGuest) {
                // For guests, get both server and local reservations
                const serverReservations = await this.getGuestReservations();
                const localReservations = await this.getLocalGuestReservations();
                
                // Combine and deduplicate by ID
                const combined = [...serverReservations, ...localReservations];
                const uniqueReservations = combined.filter((reservation, index, self) => 
                    index === self.findIndex(r => r.id === reservation.id)
                );
                
                return uniqueReservations;
            } else {
                // For authenticated users, get both server and local reservations
                const serverReservations = await this.getUserReservations();
                const localReservations = await this.getLocalAuthenticatedReservations();
                
                // Combine and deduplicate by ID
                const combined = [...serverReservations, ...localReservations];
                const uniqueReservations = combined.filter((reservation, index, self) => 
                    index === self.findIndex(r => r.id === reservation.id)
                );
                
                return uniqueReservations;
            }
        } catch (error) {
            console.error('Error getting combined reservations:', error);
            // Fall back to local only
            if (isGuest) {
                return this.getLocalGuestReservations();
            } else {
                return this.getLocalAuthenticatedReservations();
            }
        }
    }
}; 