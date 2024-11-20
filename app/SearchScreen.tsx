import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Sample Data for Results and Default View
  const searchResults = [
    {
      id: '1',
      store: 'Whole Foods - WA - West Seattle',
      item: 'Bakery Bag',
      pickUpTime: 'Pick up today 11:00 PM - 12:00 AM',
      originalPrice: 21.0,
      discountedPrice: 6.99,
      rating: 4.7,
      distance: '4.4 mi',
      image: 'https://via.placeholder.com/150', // Replace with actual store image
      left: 2,
    },
    {
      id: '2',
      store: 'Whole Foods - WA - Kirkland',
      item: 'Bakery Bag',
      pickUpTime: 'Pick up today 11:00 PM - 12:00 AM',
      originalPrice: 21.0,
      discountedPrice: 6.99,
      rating: 4.4,
      distance: '9.8 mi',
      image: 'https://via.placeholder.com/150',
      left: 1,
    },
  ];

  const defaultView = [
    {
      id: '3',
      store: 'Trader Joe’s - Downtown Seattle',
      item: 'Grocery Bag',
      pickUpTime: 'Pick up today 6:00 PM - 7:00 PM',
      originalPrice: 15.0,
      discountedPrice: 4.99,
      rating: 4.8,
      distance: '3.1 mi',
      image: 'https://via.placeholder.com/150', // Replace with actual store image
      left: 4,
    },
  ];

  // Data to Render: Search Results or Default View
  const dataToRender = isSearching && query ? searchResults : defaultView;

  const handleSearch = (text) => {
    setQuery(text);
    setIsSearching(text.length > 0); // Enable search mode if query is not empty
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a store or item"
          value={query}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Options (for Search Mode) */}
      {isSearching && (
        <View style={styles.sortContainer}>
          <Text style={styles.sortText}>Sort by:</Text>
          <TouchableOpacity>
            <Text style={styles.sortOption}>Relevance ▼</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results or Default View */}
      <FlatList
        data={dataToRender}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Image */}
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              {/* Store and Item Details */}
              <Text style={styles.storeName}>{item.store}</Text>
              <Text style={styles.itemName}>{item.item}</Text>
              <Text style={styles.pickUpTime}>{item.pickUpTime}</Text>

              {/* Footer with Price and Rating */}
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

            {/* Left Badge */}
            <View style={styles.leftBadge}>
              <Text style={styles.leftBadgeText}>{item.left} left</Text>
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
    backgroundColor: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButton: {
    marginLeft: 8,
    backgroundColor: '#036B52',
    padding: 12,
    borderRadius: 8,
  },
  filterIcon: {
    color: '#FFF',
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sortText: {
    fontSize: 14,
    color: '#666',
  },
  sortOption: {
    fontSize: 14,
    fontWeight: '600',
    color: '#036B52',
    marginLeft: 4,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemName: {
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
  leftBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  leftBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#036B52',
  },
});

export default SearchPage;
