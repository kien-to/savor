export interface Store {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pickUpTime: string;
  distance: string;
  price: number;
  originalPrice?: number;
  backgroundUrl?: string;
  avatarUrl?: string;
  rating?: number;
  reviews?: number;
  address?: string;
  itemsLeft?: number;
  highlights?: string[];
  isSaved?: boolean;
} 