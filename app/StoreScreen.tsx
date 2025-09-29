import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { getStore } from '../services/api';
import { Colors } from '../constants/Colors';
// import { storeService } from '../services/store';

// Add interface for store data
interface StoreData {
  id: string;
  title: string;
  description: string;
  pickUpTime: string;
  price: number;
  originalPrice: number;
  backgroundUrl: string;
  avatarUrl: string;
  rating: number;
  reviews: number;
  address: string;
  itemsLeft: number;
  highlights: string[];
  isSaved: boolean;
}

const StoreDetailScreen = () => {
  const { storeId } = useLocalSearchParams();
  const router = useRouter();
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("StoreScreen - storeId received:", storeId);
        console.log("StoreScreen - storeId type:", typeof storeId);
        
        if (!storeId) {
          throw new Error('No store ID provided');
        }
        // Fetch both store data and favorites simultaneously
        const [storeData] = await Promise.all([
          getStore(storeId.toString()),
          // storeService.getFavorites().catch(() => [])
        ]);

        // Check if this store is in favorites
        // const isFavorite = (favorites || []).some(favorite => favorite.id === storeData.id);
        
        // Update store data with correct saved status
        const updatedStoreData = {
          ...storeData,
          // isSaved: isFavorite
        };

        setStoreData(updatedStoreData);
        // setIsSaved(isFavorite);
      } catch (error) {
        setError('Failed to load store details. Please try again later.');
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  // const toggleSave = useCallback(async () => {
  //   try {
  //     if (!storeData?.id) return;
      
  //     const newSavedState = await storeService.toggleSave(storeData.id);
  //     setIsSaved(newSavedState);
  //   } catch (error) {
  //     console.error('Failed to toggle save:', error);
  //     // Optionally show an error message to the user
  //   }
  // }, [storeData?.id]);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.light.primary} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không thể tải thông tin cửa hàng. Vui lòng thử lại sau.</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButtonOverlay}
        onPress={() => router.back()}
      >
        <Text style={styles.backIconOverlay}>←</Text>
      </TouchableOpacity>
      
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: storeData?.backgroundUrl }}
          style={styles.backgroundImage}
        />
        {/* <TouchableOpacity 
          style={styles.saveButton}
          onPress={toggleSave}
        >
          <Text style={styles.saveIcon}>
            {isSaved ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity> */}

        <View style={styles.avaContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Còn {storeData?.itemsLeft}+ phần</Text>
          </View>

          <Image
            source={{ uri: storeData?.avatarUrl }}
            style={styles.storeLogo}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" // Ensures taps are handled properly
      >
        {/* Store Info */}
        <View style={styles.storeInfoContainer}>
          <Text style={styles.storeTitle}>{storeData?.title}</Text>
          <Text style={styles.storeSubtitle}>Túi bất ngờ</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>
              ⭐ {storeData?.rating} ({storeData?.reviews} đánh giá)
            </Text>
          </View>
          <Text style={styles.pickUpTime}>
            🕐 Nhận hàng: {storeData?.pickUpTime}
          </Text>
          <TouchableOpacity style={styles.todayBadge}>
            <Text style={styles.todayText}>Hôm nay</Text>
          </TouchableOpacity>
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>
              ${storeData?.originalPrice.toFixed(2)}
            </Text>
            <Text style={styles.currentPrice}>
              ${storeData?.price.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Address */}
        <TouchableOpacity style={styles.addressContainer}>
          <Text style={styles.addressText}>📍 {storeData?.address}</Text>
          <Text style={styles.moreInfoText}>Thêm thông tin về cửa hàng</Text>
        </TouchableOpacity>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Bạn có thể nhận được</Text>
          <Text style={styles.description}>{storeData?.description}</Text>
        </View>

        {/* Ingredients & Allergens */}
        <TouchableOpacity style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsText}>Thành phần & dị ứng</Text>
        </TouchableOpacity>

        {/* Customer Reviews */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.sectionTitle}>Mọi người nói gì</Text>
          <View style={styles.ratingOverallContainer}>
            <Text style={styles.ratingOverall}>
              {storeData?.rating} / 5.0
            </Text>
            <Text style={styles.reviewsNote}>
              Dựa trên {storeData?.reviews} đánh giá
            </Text>
          </View>
          <View style={styles.highlightsContainer}>
            {storeData?.highlights?.map((highlight, index) => (
              <View key={index} style={styles.highlightItem}>
                <Text style={styles.highlightEmoji}>
                  {getEmojiForHighlight(highlight)}
                </Text>
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.reserveButtonContainer}>
        <TouchableOpacity 
          style={styles.reserveButton} 
          onPress={() => router.push({
            pathname: '/PaymentScreen',
            params: {
              storeId: storeData?.id,
              storeTitle: storeData?.title,
              price: storeData?.price,
              pickUpTime: storeData?.pickUpTime,
              itemsLeft: storeData?.itemsLeft
            }
          })}
        >
          <Text style={styles.reserveButtonText}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Helper function to map highlights to emojis
const getEmojiForHighlight = (highlight: string): string => {
  const emojiMap: { [key: string]: string } = {
    'Nhân viên thân thiện': '😊',
    'Lấy hàng nhanh': '⚡',
    'Giá trị tốt': '💰',
    'Mới nướng': '🥖',
    'Yêu thích địa phương': '⭐',
    'Thân thiện môi trường': '🌱',
  };
  return emojiMap[highlight] || '✨';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // Prevents content from being blocked by the Reserve Button
  },
  storeInfoContainer: {
    marginBottom: 16,
  },
  storeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  storeSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  pickUpTime: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  todayBadge: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  todayText: {
    color: Colors.light.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  addressContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 16,
  },
  addressText: {
    fontSize: 14,
    color: '#036B52',
    marginBottom: 4,
  },
  moreInfoText: {
    fontSize: 12,
    color: '#666',
  },
  descriptionContainer: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  ingredientsContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 16,
  },
  ingredientsText: {
    fontSize: 14,
    color: '#036B52',
  },
  reviewsContainer: {
    marginVertical: 16,
  },
  ratingOverallContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingOverall: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  highlightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  highlightItem: {
    alignItems: 'center',
  },
  highlightEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 12,
    color: '#666',
  },
  reviewsNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  reserveButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: 'transparent',
  },
  reserveButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  reserveButtonText: {
    color: Colors.light.accent,
    fontSize: 18,
    fontWeight: '700',
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIconOverlay: {
    fontSize: 20,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  headerContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayContainer: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
  },
  backText: {
    color: '#FFF',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
    marginLeft: 8,
  },
  actionIcon: {
    color: '#FFF',
    fontSize: 16,
  },
  avaContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 0,
  },
  badge: {
    backgroundColor: '#FFCC00',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    position: 'absolute',
    top: -25,
    left: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  storeLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFF',
    // marginBottom: ,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#036B52',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveIcon: {
    fontSize: 20,
  },
});

export default StoreDetailScreen;
