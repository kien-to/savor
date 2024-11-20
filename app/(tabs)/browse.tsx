import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const BrowseScreen = () => {
  const [viewMode, setViewMode] = useState('Map'); // "List" or "Map"
  const [searchText, setSearchText] = useState('');

  // Sample Data for List and Map
  const stores = [
    {
      id: '1',
      name: 'Theo Chocolate',
      latitude: 47.6097,
      longitude: -122.3331,
      image: 'https://via.placeholder.com/50', // Replace with your store image URL
    },
    {
      id: '2',
      name: 'Starbucks',
      latitude: 47.6101,
      longitude: -122.3344,
      image: 'https://via.placeholder.com/50',
    },
    {
      id: '3',
      name: 'Trader Joe’s',
      latitude: 47.6111,
      longitude: -122.3361,
      image: 'https://via.placeholder.com/50',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle Between List and Map Views */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'List' && styles.activeButton]}
          onPress={() => setViewMode('List')}
        >
          <Text style={[styles.toggleText, viewMode === 'List' && styles.activeText]}>
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'Map' && styles.activeButton]}
          onPress={() => setViewMode('Map')}
        >
          <Text style={[styles.toggleText, viewMode === 'Map' && styles.activeText]}>
            Map
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {viewMode === 'List' ? (
        <FlatList
          data={stores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Image source={{ uri: item.image }} style={styles.listImage} />
              <View>
                <Text style={styles.listTitle}>{item.name}</Text>
                <Text style={styles.listSubtitle}>Open Now</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 47.6097,
            longitude: -122.3331,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {stores.map((store) => (
            <Marker
              key={store.id}
              coordinate={{ latitude: store.latitude, longitude: store.longitude }}
              title={store.name}
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 60,
    backgroundColor: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButton: {
    marginLeft: 8,
    backgroundColor: '#036B52',
    borderRadius: 8,
    padding: 10,
  },
  filterIcon: {
    color: '#FFF',
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeButton: {
    borderColor: '#036B52',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
  },
  activeText: {
    color: '#036B52',
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  listImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  map: {
    flex: 1,
  },
});

export default BrowseScreen;
