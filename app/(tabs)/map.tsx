import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import Slider from "@react-native-community/slider";
import { homeService } from "../../services/home";
import { geocodingService } from "../../services/geocoding";
import { Store } from "../../types/store";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

const LocationPickerScreen = () => {
  const router = useRouter();
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [searchText, setSearchText] = useState("");
  const [radius, setRadius] = useState(6);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{description: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          "Permission Required",
          "Please enable location services to use this feature"
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

      setRegion(newRegion);
      await fetchStores();
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Location Error",
        "Could not get your current location. Please check your device settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    getCurrentLocation();
  };

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await homeService.getHomePageData(
        region.latitude,
        region.longitude
      );
      
      const allStores = [
        ...data.recommendedStores,
        ...data.pickUpTomorrow,
      ].filter((store) => {
        return (
          typeof store.latitude === "number" &&
          typeof store.longitude === "number"
        );
      });

      setStores(allStores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      Alert.alert("Error", "Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    try {
      setSearchLoading(true);
      const coordinates = await geocodingService.searchCity(searchText);
      
      const newRegion = {
        ...region,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };
      
      setRegion(newRegion);
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Could not find the specified location");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleChooseLocation = () => {
    // Save the selected location and radius
    router.back();
  };

  const handleSearchInputChange = async (text: string) => {
    setSearchText(text);
    if (text.length > 2) {
      try {
        const results = await geocodingService.getPlaceSuggestions(text);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = async (suggestion: string) => {
    setSearchText(suggestion);
    setShowSuggestions(false);
    try {
      const coordinates = await geocodingService.searchCity(suggestion);
      setRegion({
        ...region,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    } catch (error) {
      console.error('Error selecting suggestion:', error);
      Alert.alert('Error', 'Could not find the specified location');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          pinColor="red"
        />
        {stores.map((store) => {
          console.log("id", store.id);
          console.log("imageUrl", store.imageUrl);
          return (
            <Marker
              key={store.id}
              coordinate={{
                latitude:
                  typeof store.latitude === "string"
                    ? parseFloat(store.latitude)
                    : store.latitude,
                longitude:
                  typeof store.longitude === "string"
                    ? parseFloat(store.longitude)
                    : store.longitude,
              }}
              onPress={() =>
                router.push({
                  pathname: "/StoreScreen",
                  params: { storeId: store.id },
                })
              }
            >
              <View style={styles.markerContainer}>
                <Image
                  source={{ uri: store.imageUrl }}
                  style={styles.markerImage}
                  defaultSource={require("../../assets/images/icon.png")}
                />
                <Text style={styles.markerPrice}>
                ${store.price.toFixed(2)}
              </Text>
              </View>
            </Marker>
          );
        })}
        <Circle
          center={{ latitude: region.latitude, longitude: region.longitude }}
          radius={radius * 1609.34} // Convert miles to meters
          strokeColor="#036B52"
          fillColor="rgba(3, 107, 82, 0.2)"
        />
      </MapView>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a city"
          value={searchText}
          onChangeText={handleSearchInputChange}
        />
        {searchLoading ? (
          <ActivityIndicator style={styles.searchIcon} color="#036B52" />
        ) : (
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionSelect(suggestion.description)}
              >
                <Text style={styles.suggestionText}>{suggestion.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity 
          style={styles.useLocationButton} 
          onPress={handleUseCurrentLocation}
        >
          <Text style={styles.useLocationText}>Use Current Location</Text>
        </TouchableOpacity>
      </View>

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

      <TouchableOpacity
        style={styles.chooseLocationButton}
        onPress={handleChooseLocation}
      >
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
    position: "absolute",
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchInput: {
    backgroundColor: "#F8F8F8",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  useLocationButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  useLocationText: {
    color: "#036B52",
    fontSize: 16,
  },
  sliderContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    elevation: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sliderText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderValue: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
  chooseLocationButton: {
    backgroundColor: "#036B52",
    margin: 16,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  chooseLocationText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  markerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: "#036B52",
    alignItems: "center",
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  markerPrice: {
    color: "#036B52",
    fontWeight: "600",
    fontSize: 12,
    marginTop: 2,
  },
  searchButton: {
    backgroundColor: "#036B52",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  searchIcon: {
    marginLeft: 10,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginTop: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default LocationPickerScreen;
