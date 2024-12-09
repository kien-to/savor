import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { storeService } from '../../services/store';
import { useRouter } from 'expo-router';
import { Store } from '../../types/store';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await storeService.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError('Failed to load favorites');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

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
      <Text style={styles.header}>Favorites</Text>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>Save some stores to see them here!</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({
                pathname: '/StoreScreen',
                params: { storeId: item.id }
              })}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.description}</Text>
                <Text style={styles.pickUpTime}>{item.pickUpTime}</Text>
                <View style={styles.cardFooter}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>{item.rating}</Text>
                    <Text style={styles.distanceText}>{item.distance}</Text>
                  </View>
                  <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 60,
    backgroundColor: '#FFF',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  pickUpTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 16,
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default FavoritesScreen;
