import { useEffect, useState, useCallback } from 'react';
import { homeService } from '../../services/home';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const data = await homeService.getHomePageData(
        location.coords.latitude,
        location.coords.longitude
      );
      setHomeData(data);
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

  const toggleSave = async (storeId: string) => {
    try {
      const newSavedState = await storeService.toggleSave(storeId);
      
      // Update the stores in state
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
    } catch (error) {
      console.error('Failed to toggle save:', error);
      // Optionally show an error message to the user
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
        <Text style={styles.errorText}>{error}</Text>
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
          colors={['#your-primary-color']} // Android
          tintColor="#your-primary-color"  // iOS
        />
      }
    >
      <View style={styles.content}>
        {/* <View style={styles.header}>
          {!homeData?.emailVerified && (
            <Text style={styles.verifyEmail}>Verify your email address</Text>
          )}
        </View> */}

        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>📍 {homeData?.userLocation.city}</Text>
          <Text style={styles.distanceText}>
            within {homeData?.userLocation.distance} mi
          </Text>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList    
          horizontal
          data={homeData?.recommendedStores}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.list}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pick up tomorrow</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={homeData?.pickUpTomorrow}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.list}
        />
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
});

export default HomeScreen;
