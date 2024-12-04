// import { getToken } from '../services/auth';  // Adjust the path as needed

interface Store {
  id: string;
  title: string;
  description: string;
  pickUpTime: string;
  distance: string;
  price: number;
  imageUrl: string;
  rating: number;
}

interface HomePageData {
  userLocation: {
    city: string;
    distance: number;
  };
  recommendedStores: Store[];
  pickUpTomorrow: Store[];
  emailVerified: boolean;
}

const API_URL = 'http://localhost:8080';

export const homeService = {
  async getHomePageData(latitude: number, longitude: number): Promise<HomePageData> {
    try {
      const response = await fetch(
        `${API_URL}/api/home?latitude=${latitude}&longitude=${longitude}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch home data');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }
}; 