import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';

const LocationPickerScreen = () => {
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [searchText, setSearchText] = useState('');
  const [radius, setRadius] = useState(6);

  const handleSearch = () => {
    alert(`Searching for ${searchText}`);
  };

  const handleUseCurrentLocation = () => {
    // Add logic to fetch user's current location
    alert('Using current location...');
  };

  const handleChooseLocation = () => {
    alert('Location chosen!');
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
        <Circle
          center={{ latitude: region.latitude, longitude: region.longitude }}
          radius={radius * 1609.34} // Convert miles to meters
          strokeColor="#036B52"
          fillColor="rgba(3, 107, 82, 0.2)"
        />
      </MapView>

      {/* Search Bar */}
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

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderText}>Select a distance</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={50}
          step={1}
          value={radius}
          onValueChange={(value) => setRadius(value)}
          minimumTrackTintColor="#036B52"
          maximumTrackTintColor="#E0E0E0"
        />
        <Text style={styles.sliderValue}>{radius} mi</Text>
      </View>

      {/* Choose Location Button */}
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
  map: {
    flex: 2,
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
  sliderContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    elevation: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  sliderText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
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
