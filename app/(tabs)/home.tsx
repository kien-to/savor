import { useEffect, useState } from 'react';
import { homeService } from '../../services/home';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

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
}

const HomeScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Get user's location
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

    fetchHomeData();
  }, []);

  const renderItem = (item: Store) => (
    <TouchableOpacity style={styles.card}>
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.cardImage} 
      />
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
    <View style={styles.container}>
      <View style={styles.header}>
        {!homeData?.emailVerified && (
          <Text style={styles.verifyEmail}>Verify your email address</Text>
        )}
      </View>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
});

export default HomeScreen;
