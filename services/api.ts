import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://10.0.0.147:8080';
// || process.env.EXPO_PUBLIC_API_URL;

export const getStore = async (storeId: string) => {
  try {
    const token = await SecureStore.getItem('authToken');
    // console.log('Actual token value:', token);
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_URL}/api/stores/${storeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
};

// export default getStore; 