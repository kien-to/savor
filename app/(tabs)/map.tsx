import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import Slider from "@react-native-community/slider";
import { homeService } from "../../services/home";
import { Store } from "../../types/store";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

const LocationPickerScreen = () => {
  const router = useRouter();
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [searchText, setSearchText] = useState("");
  const [radius, setRadius] = useState(6);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [region, radius]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await homeService.getHomePageData(
        region.latitude,
        region.longitude
      );
      console.log("API Response:", data);

      const allStores = [
        ...data.recommendedStores,
        ...data.pickUpTomorrow,
      ].filter((store) => {
        console.log(
          "Store:",
          store.title,
          "Lat:",
          store.latitude,
          "Long:",
          store.longitude
        );
        return (
          typeof store.latitude === "number" &&
          typeof store.longitude === "number"
        );
      });

      console.log("Filtered stores:", allStores);
      setStores(allStores);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
      setRegion(newRegion);
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Error getting current location");
    }
  };

  const handleChooseLocation = () => {
    // Save the selected location and radius
    router.back();
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
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
          onChangeText={setSearchText}
          onSubmitEditing={() => {
            /* Implement geocoding */
            console.log("Search text:", searchText);
            fetchStores();
            router.push({
              pathname: "/StoreScreen",
              params: { storeId: store.id },
            });
          }}
        />
        <TouchableOpacity
          style={styles.useLocationButton}
          onPress={handleUseCurrentLocation}
        >
          <Text style={styles.useLocationText}>Use my current location</Text>
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
});

export default LocationPickerScreen;
