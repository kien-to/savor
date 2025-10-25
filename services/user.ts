import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import firebase from '../config/firebase';

export interface UserProfile {
    user_id: string;
    email?: string;
    name?: string;
    display_name?: string;
    photo_url?: string;
    phone?: string;
}

export const userService = {
    async getUserProfile(): Promise<UserProfile> {
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

            console.log('Fetching user profile with auth header:', authHeader.substring(0, 20) + '...');

            const response = await fetch(`${API_URL}/api/settings/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Profile response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Profile fetch error:', errorText);
                throw new Error('Failed to fetch user profile');
            }

            const data = await response.json();
            console.log('User profile data:', data);
            
            return data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },

    async updateUserProfile(input: { name?: string; phone?: string; email?: string }): Promise<UserProfile> {
        try {
            console.log('userService.updateUserProfile called with:', input);
            
            // Try Firebase auth first (for social login users)
            const currentUser = getAuth(firebase).currentUser;
            let authHeader = '';
            
            if (currentUser) {
                const idToken = await currentUser.getIdToken(true); // Force refresh token
                authHeader = `Bearer ${idToken}`;
                console.log('Using Firebase auth for profile update');
            } else {
                // Try JWT token auth (for email login users)
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    throw new Error('User not authenticated');
                }
                authHeader = `Bearer ${token}`;
                console.log('Using JWT token for profile update');
            }

            console.log('Calling PUT /api/settings/profile...');
            const response = await fetch(`${API_URL}/api/settings/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            });

            console.log('Profile update response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Profile update error response:', errorText);
                throw new Error(`Failed to update profile: ${errorText}`);
            }

            const data = await response.json();
            console.log('Profile updated successfully, response data:', data);
            
            // Persist basic fields locally for display
            if (data?.email) await AsyncStorage.setItem('userEmail', data.email);
            if (data?.name) await AsyncStorage.setItem('userName', data.name);
            if (data?.phone) await AsyncStorage.setItem('userPhoneNumber', data.phone);
            
            return data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },

    async getCurrentUserInfo(): Promise<UserProfile | null> {
        try {
            // Try to get from Firebase first
            const currentUser = getAuth(firebase).currentUser;
            if (currentUser) {
                return {
                    user_id: currentUser.uid,
                    email: currentUser.email || undefined,
                    name: currentUser.displayName || undefined,
                    display_name: currentUser.displayName || undefined,
                    photo_url: currentUser.photoURL || undefined,
                };
            }

            // For email login users, try to get from server
            const token = await AsyncStorage.getItem('token');
            const userId = await AsyncStorage.getItem('userId');
            
            if (token && userId) {
                try {
                    return await this.getUserProfile();
                } catch (error) {
                    console.log('Failed to fetch profile from server, using stored info');
                    // Fall back to stored user info
                    const email = await AsyncStorage.getItem('userEmail');
                    const name = await AsyncStorage.getItem('userName');
                    
                    return {
                        user_id: userId,
                        email: email || undefined,
                        name: name || undefined,
                        display_name: name || undefined,
                    };
                }
            }

            return null;
        } catch (error) {
            console.error('Error getting current user info:', error);
            return null;
        }
    },

    async storeUserInfo(userId: string, email?: string, name?: string): Promise<void> {
        try {
            await AsyncStorage.setItem('userId', userId);
            if (email) {
                await AsyncStorage.setItem('userEmail', email);
            }
            if (name) {
                await AsyncStorage.setItem('userName', name);
            }
        } catch (error) {
            console.error('Error storing user info:', error);
        }
    },

    async clearUserInfo(): Promise<void> {
        try {
            await AsyncStorage.removeItem('userId');
            await AsyncStorage.removeItem('userEmail');
            await AsyncStorage.removeItem('userName');
        } catch (error) {
            console.error('Error clearing user info:', error);
        }
    }
};
