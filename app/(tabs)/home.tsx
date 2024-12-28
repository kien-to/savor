import { useEffect, useState, useCallback } from 'react';
import { homeService } from '../../services/home';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { storeService } from '../../services/store';

interface HomePageData {
  emailVerified: boolean;
  userLocation: {
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
  isSaved?: boolean;
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
      let favorites = [];  // Initialize empty array for favorites

      try {
        // Get home data
        homeDataResponse = await homeService.getHomePageData(
          location.coords.latitude,
          location.coords.longitude
        );

        // Get favorites - handle the response structure correctly
        const favoritesResponse = await storeService.getFavorites();
        console.log('Favorites response:', favoritesResponse);
        favorites = favoritesResponse || [];  // Extract favorites array or use empty array
      } catch (error) {
        console.error('Error fetching data:', error);
        // Continue with empty favorites if the call fails
      }

      // Create a Set of favorite store IDs for quick lookup
      const favoriteStoreIds = new Set(
        favorites.map(store => store.id)
      );

      // Ensure recommendedStores and pickUpTomorrow are arrays before mapping
      const recommendedStores = homeDataResponse?.recommendedStores || [];
      const pickUpTomorrow = homeDataResponse?.pickUpTomorrow || [];

      // Update the isSaved property for all stores
      const updatedHomeData = {
        ...homeDataResponse,
        recommendedStores: recommendedStores.map(store => ({
          ...store,
          isSaved: favoriteStoreIds.has(store.id)
        })),
        pickUpTomorrow: pickUpTomorrow.map(store => ({
          ...store,
          isSaved: favoriteStoreIds.has(store.id)
        }))
      };

      setHomeData(updatedHomeData);
      console.log('Home data:', updatedHomeData);
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
          onPress: () => router.push("/login"),
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
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleSave(item.id);
          }}
        >
          <Text style={styles.saveIcon}>
            {item.isSaved ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardPickupTime}>{item.pickUpTime}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardDistance}>{item.distance}</Text>
          <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
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
        <ActivityIndicator size="large" color="#036B52" />
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
          colors={['#036B52']}
          tintColor="#036B52"
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
    backgroundColor: '#FFF',
  },
  content: {
    padding: 20,
    marginTop: 10,
  },
  header: {
    backgroundColor: '#036B52',
    marginTop: 40,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  verifyEmail: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  locationContainer: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  searchInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#036B52',
  },
  list: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    width: 200,
    height: 240,
    // width: showAllRecommended || showAllTomorrow ? '48%' : 200,
    // marginRight: showAllRecommended || showAllTomorrow ? 0 : 16,
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardPickupTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDistance: {
    fontSize: 12,
    color: '#666',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#036B52',
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
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIcon: {
    fontSize: 16,
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
