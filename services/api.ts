import { API_URL } from '../config';
import { getAuth } from 'firebase/auth';
import firebase from '../config/firebase';

export const getStore = async (storeId: string) => {
  try {
    // storeId = "rc002"
    
    // Try to get store details without authentication first (public info)
    let response = await fetch(`${API_URL}/api/stores/${storeId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // If public endpoint doesn't work, try with authentication
    if (!response.ok && response.status === 401) {
      console.log('Public store endpoint requires auth, trying with authentication...');
      
      const currentUser = getAuth(firebase).currentUser;
      if (!currentUser) {
        throw new Error('Store details require authentication, but user is not logged in');
      }

      // Get ID token with retry logic
      let retries = 3;
      let idToken = null;
      
      while (retries > 0 && !idToken) {
        try {
          idToken = await currentUser.getIdToken(true);  // Force refresh
        } catch (error) {
          console.log(`Failed to get ID token, retries left: ${retries - 1}`, error);
          retries--;
          if (retries === 0) throw error;
          // Wait 1 second before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      response = await fetch(`${API_URL}/api/stores/${storeId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
};

// export default getStore; 