export interface Store {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  pickUpTime: string | null;
  distance: string;
  price: number;
  originalPrice?: number;
  backgroundUrl?: string;
  avatarUrl?: string | null;
  rating?: number;
  reviews?: number;
  address?: string;
  itemsLeft?: number;
  highlights?: string[];
  isSaved?: boolean;
  latitude: number;
  longitude: number;
} 