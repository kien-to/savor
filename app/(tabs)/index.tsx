import { useEffect, useState, useCallback } from 'react';
import { homeService } from '../../services/home';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView, RefreshControl, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { storeService } from '../../services/store';
import { Colors } from '../../constants/Colors';

interface HomePageData {
  emailVerified?: boolean;
  userLocation?: {
    city: string;
    distance: number;
  };
  recommendedStores: Store[];
  pickUpTomorrow: Store[];
}

interface Store {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pickUpTime: string;
  distance: string;
  price: number;
  originalPrice?: number;
  discountedPrice?: number;
  isSaved?: boolean;
  itemsLeft?: number;
}

const HomeScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [filteredHomeData, setFilteredHomeData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAllRecommended, setShowAllRecommended] = useState(false);
  const [showAllTomorrow, setShowAllTomorrow] = useState(false);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      let homeDataResponse;
      // let favorites = [];  // Initialize empty array for favorites

      try {
        // Get home data
        homeDataResponse = await homeService.getHomePageData(
          location.coords.latitude,
          location.coords.longitude
        );

        // Get favorites - handle the response structure correctly
        // const favoritesResponse = await storeService.getFavorites();
        // console.log('Favorites response:', favoritesResponse);
        // favorites = favoritesResponse || [];  // Extract favorites array or use empty array
      } catch (error) {
        console.error('Error fetching data:', error);
        // console.log('Error fetching data 2:', error);
        // Continue with empty favorites if the call fails
      }

      // Create a Set of favorite store IDs for quick lookup
      // const favoriteStoreIds = new Set(
      //   favorites.map(store => store.id)
      // );

      // Ensure recommendedStores and pickUpTomorrow are arrays before mapping
      const recommendedStores = homeDataResponse?.recommendedStores || [];
      const pickUpTomorrow = homeDataResponse?.pickUpTomorrow || [];

      // Update the isSaved property for all stores
      const updatedHomeData = {
        ...homeDataResponse,
        recommendedStores: recommendedStores.map(store => ({
          ...store,
          // isSaved: favoriteStoreIds.has(store.id)
        })),
        pickUpTomorrow: pickUpTomorrow.map(store => ({
          ...store,
          // isSaved: favoriteStoreIds.has(store.id)
        }))
      };

      setHomeData(updatedHomeData);
      // console.log('Home data:', updatedHomeData);
    } catch (err) {
      setError('Failed to fetch home data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  // Refresh data when screen comes into focus (e.g., after creating a reservation)
  useFocusEffect(
    useCallback(() => {
      fetchHomeData();
    }, [])
  );

  useEffect(() => {
    if (!homeData) {
      setFilteredHomeData(null);
      return;
    }

    if (!searchText.trim()) {
      setFilteredHomeData(homeData);
      return;
    }

    const searchLower = searchText.toLowerCase().trim();
    
    const filteredRecommended = homeData.recommendedStores.filter(store =>
      store.title.toLowerCase().includes(searchLower) ||
      store.description.toLowerCase().includes(searchLower)
    );

    const filteredPickUpTomorrow = homeData.pickUpTomorrow.filter(store =>
      store.title.toLowerCase().includes(searchLower) ||
      store.description.toLowerCase().includes(searchLower)
    );

    setFilteredHomeData({
      ...homeData,
      recommendedStores: filteredRecommended,
      pickUpTomorrow: filteredPickUpTomorrow,
    });
  }, [searchText, homeData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchHomeData();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleUnauthenticated = () => {
    Alert.alert(
      "Chưa đăng nhập",
      "Vui lòng đăng nhập để lưu cửa hàng",
      [
        {
          text: "Đăng nhập",
          onPress: () => router.push("/LoginScreen"),
        },
        {
          text: "Hủy",
          style: "cancel"
        },
      ]
    );
  };

  const toggleSave = async (storeId: string) => {
    try {
      const newSavedState = await storeService.toggleSave(storeId);
      
      setHomeData(prevData => {
        if (!prevData) return prevData;

        const updateStores = (stores: Store[]) =>
          stores.map(store =>
            store.id === storeId
              ? { ...store, isSaved: newSavedState }
              : store
          );

        return {
          ...prevData,
          recommendedStores: updateStores(prevData.recommendedStores),
          pickUpTomorrow: updateStores(prevData.pickUpTomorrow),
        };
      });
    } catch (error: any) {
      if (error.message.includes('User not authenticated')) {
        handleUnauthenticated();
      } else {
        Alert.alert('Lỗi', 'Không thể lưu cửa hàng');
      }
    }
  };

  const renderItem = (item: Store) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({
        pathname: '/StoreScreen',
        params: { storeId: item.id }
      })}
    >
      <View style={styles.cardHeader}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.cardImage} 
        />
        <View style={styles.cardBadges}>
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityText}>Còn {item.itemsLeft || 0} túi</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
          <Text style={styles.cardPickupTime} numberOfLines={1} ellipsizeMode="tail">{item.pickUpTime}</Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardDistance}>{item.distance}</Text>
          <View style={styles.priceContainer}>
            {item.originalPrice && item.discountedPrice && item.originalPrice > item.discountedPrice ? (
              <>
                <Text style={styles.originalPrice}>
                  {(item.originalPrice * 1000).toLocaleString('vi-VN')}đ
                </Text>
                <Text style={styles.cardPrice}>
                  {(item.discountedPrice * 1000).toLocaleString('vi-VN')}đ
                </Text>
              </>
            ) : (
              <Text style={styles.cardPrice}>
                {((item.discountedPrice || item.price) * 1000).toLocaleString('vi-VN')}đ
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const searchInputSection = (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm cửa hàng..."
        value={searchText}
        onChangeText={setSearchText}
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchText.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => setSearchText('')}
        >
          {/* <Text>✕</Text> */}
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error === 'Location permission denied' 
            ? 'Vui lòng cho phép truy cập vị trí'
            : 'Đã có lỗi xảy ra'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.light.primary]}
          tintColor={Colors.light.primary}
        />
      }
    >
      <View style={styles.content}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            📍 {homeData?.userLocation?.city || 'Loading location...'}
          </Text>
          <Text style={styles.distanceText}>
            within {homeData?.userLocation?.distance || 0} mi
          </Text>
        </View>

        {searchInputSection}

        {searchText.trim().length > 0 && 
         filteredHomeData?.recommendedStores.length === 0 && 
         filteredHomeData?.pickUpTomorrow.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              Không tìm thấy cửa hàng nào phù hợp với "{searchText}"
            </Text>
          </View>
        )}

        {(!searchText.trim() || filteredHomeData?.recommendedStores.length! > 0) && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
              <TouchableOpacity 
                onPress={() => router.push({
                  pathname: '/StoreListScreen',
                  params: { 
                    stores: encodeURIComponent(JSON.stringify(filteredHomeData?.recommendedStores)),
                    title: 'Gợi ý cho bạn'
                  }
                })}
              >
                <Text style={styles.seeAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <FlatList    
              horizontal={!showAllRecommended}
              data={filteredHomeData?.recommendedStores}
              renderItem={({ item }) => renderItem(item)}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={showAllRecommended && styles.verticalContainer}
              style={styles.list}
              numColumns={showAllRecommended ? 2 : 1}
              key={showAllRecommended ? 'vertical' : 'horizontal'}
            />
          </>
        )}

        {(!searchText.trim() || filteredHomeData?.pickUpTomorrow.length! > 0) && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Lấy hàng ngày mai</Text>
              <TouchableOpacity 
                onPress={() => router.push({
                  pathname: '/StoreListScreen',
                  params: { 
                    stores: encodeURIComponent(JSON.stringify(filteredHomeData?.pickUpTomorrow)),
                    title: 'Lấy hàng ngày mai'
                  }
                })}
              >
                <Text style={styles.seeAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal={!showAllTomorrow}
              data={filteredHomeData?.pickUpTomorrow}
              renderItem={({ item }) => renderItem(item)}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={showAllTomorrow && styles.verticalContainer}
              style={styles.list}
              numColumns={showAllTomorrow ? 2 : 1}
              key={showAllTomorrow ? 'vertical' : 'horizontal'}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 20,
    marginTop: 10,
    paddingBottom: 100, // Extra padding for tab bar and safe scrolling
  },
  header: {
    backgroundColor: Colors.light.primary,
    marginTop: 40,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verifyEmail: {
    color: Colors.light.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  locationContainer: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  distanceText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 8,
  },
  searchInput: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderColor: Colors.light.border,
    borderWidth: 1,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  list: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    width: 280,
    height: 340, // Increased height for better bottom padding
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardInfo: {
    height: 100, // Fixed height for consistent card layout
    marginBottom: 12,
    justifyContent: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
    height: 36, // Fixed height for exactly 2 lines (18 * 2)
    textAlignVertical: 'top',
  },
  cardPickupTime: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 0,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDistance: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
  cardHeader: {
    position: 'relative',
  },
  cardBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'column',
    gap: 8,
  },
  quantityBadge: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityText: {
    color: Colors.light.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#666',
    fontSize: 16,
  },
  verticalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
});

export default HomeScreen;
