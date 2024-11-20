import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';

const HomeScreen = () => {
  const [searchText, setSearchText] = useState('');

  // Sample data for items
  const recommendedItems = [
    {
      id: '1',
      title: 'Homeskillet Redwood City',
      description: 'Surprise Bag',
      pickUpTime: 'Pick up tomorrow 1:00 AM - 5:00 AM',
      distance: '3.8 mi',
      price: '$5.99',
      image: require('../../assets/images/icon.png'), // Replace with your asset
      rating: 4.6,
    },
  ];

  const pickUpTomorrowItems = [
    {
      id: '2',
      title: 'Philz Coffee - Forest Ave',
      description: 'Surprise Bag',
      pickUpTime: 'Pick up tomorrow 7:00 AM - 8:00 AM',
      distance: '1.1 mi',
      price: '$3.99',
      image: require('../../assets/images/icon.png'), // Replace with your asset
      rating: 4.3,
    },
  ];

  const renderItem = (item) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardPickupTime}>{item.pickUpTime}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardDistance}>{item.distance}</Text>
          <Text style={styles.cardPrice}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.verifyEmail}>Verify your email address</Text>
      </View>

      {/* Location Section */}
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>📍 Menlo Park</Text>
        <Text style={styles.distanceText}>within 6 mi</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Recommended for You Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended for you</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={recommendedItems}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.list}
      />

      {/* Pick Up Tomorrow Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pick up tomorrow</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={pickUpTomorrowItems}
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
    padding: 16,
  },
  header: {
    backgroundColor: '#036B52',
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
});

export default HomeScreen;
