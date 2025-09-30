import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
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
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [radius, setRadius] = useState(6);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          "Cần quyền truy cập",
          "Vui lòng cho phép truy cập vị trí để sử dụng tính năng này"
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
        "Lỗi vị trí",
        "Không thể lấy vị trí hiện tại của bạn. Vui lòng kiểm tra cài đặt thiết bị."
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
      }).map((store) => ({
        ...store,
        is_selling: true, // Default to true for stores from home service
      }));

      setStores(allStores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách cửa hàng");
    } finally {
      setLoading(false);
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
        onRegionChangeComplete={(newRegion) => {
          // Only update longitude and latitude deltas to prevent pin movement
          setRegion({
            ...region,
            latitudeDelta: newRegion.latitudeDelta,
            longitudeDelta: newRegion.longitudeDelta,
          });
        }}
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
        <TouchableOpacity 
          style={styles.useLocationButton} 
          onPress={handleUseCurrentLocation}
        >
          <Text style={styles.useLocationText}>Sử dụng vị trí hiện tại</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderText}>Chọn khoảng cách</Text>
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
        <Text style={styles.chooseLocationText}>Chọn vị trí này</Text>
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
