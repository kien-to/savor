// import { GOOGLE_MAPS_API_KEY } from '../type/s/env';
interface GeocodingResult {
  latitude: number;
  longitude: number;
}

export const geocodingService = {
  async getCoordinates(
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  ): Promise<GeocodingResult> {
    try {
      const address = `${street}, ${city}, ${state}, ${zipCode}, ${country}`;
      const encodedAddress = encodeURIComponent(address);
      const GOOGLE_MAPS_API_KEY = "AIzaSyAvS7vyOpBGvCisds2DIWugoiYL7f6oaHE";

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`
      );

      
      const data = await response.json();

      if (data.status !== 'OK') {
        console.log(data);
        throw new Error('Geocoding failed');
      }

      const { lat, lng } = data.results[0].geometry.location;
      
      return {
        latitude: lat,
        longitude: lng
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  },

  async searchCity(searchText: string): Promise<{
    latitude: number;
    longitude: number;
  }> {
    try {
      const encodedAddress = encodeURIComponent(searchText);
      const GOOGLE_MAPS_API_KEY = "AIzaSyAvS7vyOpBGvCisds2DIWugoiYL7f6oaHE";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error('City search failed');
      }

      const { lat, lng } = data.results[0].geometry.location;
      return {
        latitude: lat,
        longitude: lng
      };
    } catch (error) {
      console.error('City search error:', error);
      throw error;
    }
  },

  async getPlaceSuggestions(input: string): Promise<Array<{description: string, place_id: string}>> {
    try {
      const GOOGLE_MAPS_API_KEY = "AIzaSyAvS7vyOpBGvCisds2DIWugoiYL7f6oaHE";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=address&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.status !== 'OK') {
        console.log(data);
        throw new Error('Places API request failed');
      }

      return data.predictions.map((prediction: any) => ({
        description: prediction.description,
        place_id: prediction.place_id
      }));
    } catch (error) {
      console.error('Places API error:', error);
      throw error;
    }
  },

  async getPlaceDetails(placeId: string): Promise<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }> {
    try {
      const GOOGLE_MAPS_API_KEY = "AIzaSyAvS7vyOpBGvCisds2DIWugoiYL7f6oaHE";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}&fields=address_component`
      );

      const data = await response.json();

      if (data.status !== 'OK') {
        console.log('Place Details API Error:', data);
        throw new Error('Place details request failed');
      }

      const addressComponents = data.result.address_components;
      const details = {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      };

      // Parse address components
      addressComponents.forEach((component: any) => {
        const types = component.types;
        
        if (types.includes('street_number')) {
          details.street = component.long_name + ' ';
        }
        if (types.includes('route')) {
          details.street += component.long_name;
        }
        if (types.includes('locality')) {
          details.city = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          details.state = component.short_name;
        }
        if (types.includes('postal_code')) {
          details.zipCode = component.long_name;
        }
        if (types.includes('country')) {
          details.country = component.short_name;
        }
      });

      return details;
    } catch (error) {
      console.error('Place details error:', error);
      throw error;
    }
  },
}; 