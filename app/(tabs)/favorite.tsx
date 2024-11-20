import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const FavoritesScreen = () => {
  // Sample Data for Favorites
  const favorites = [
    {
      id: '1',
      name: 'Caffe Ladro - Pine St.',
      subtitle: 'Surprise Bag',
      pickUpTime: 'Pick up today 8:30 PM - 8:55 PM',
      originalPrice: 12.0,
      discountedPrice: 3.99,
      rating: 4.8,
      distance: '0.2 mi',
      image: 'https://via.placeholder.com/150', // Replace with your image URL
      isSoldOut: true,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Favorites</Text>

      {/* Favorites List */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Image Section */}
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            {item.isSoldOut && (
              <View style={styles.soldOutBadge}>
                <Text style={styles.soldOutText}>Sold out</Text>
              </View>
            )}

            {/* Content Section */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              <Text style={styles.pickUpTime}>{item.pickUpTime}</Text>

              {/* Price and Rating Section */}
              <View style={styles.cardFooter}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Text style={styles.distanceText}>{item.distance}</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
                  <Text style={styles.discountedPrice}>${item.discountedPrice.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
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
  soldOutBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  soldOutText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
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
  priceContainer: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#036B52',
  },
});

export default FavoritesScreen;
