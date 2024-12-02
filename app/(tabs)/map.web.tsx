import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LocationPickerScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [radius, setRadius] = useState(6);

  const handleSearch = () => {
    alert(`Searching for ${searchText}`);
  };

  const handleUseCurrentLocation = () => {
    alert('Using current location...');
  };

  const handleChooseLocation = () => {
    alert('Location chosen!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>
          Maps are not supported in web version.
          Please use our mobile app for full functionality.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a city"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.useLocationButton} onPress={handleUseCurrentLocation}>
          <Text style={styles.useLocationText}>Use my current location</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.chooseLocationButton} onPress={handleChooseLocation}>
        <Text style={styles.chooseLocationText}>Choose this location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 2,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  searchInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  useLocationButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  useLocationText: {
    color: '#036B52',
    fontSize: 16,
  },
  chooseLocationButton: {
    backgroundColor: '#036B52',
    margin: 16,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  chooseLocationText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LocationPickerScreen; 