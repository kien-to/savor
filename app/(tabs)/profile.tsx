import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { reservationService, Reservation } from "../../services/reservations";
import { useRouter } from "expo-router";
// import { format } from "date-fns";

const ProfileScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchReservations = async () => {
    try {
      const data = await reservationService.getUserReservations();
      setReservations(data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load reservations");
      console.error("Error fetching reservations:", err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchReservations();
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Initial fetch
  React.useEffect(() => {
    fetchReservations();
  }, []);

  const renderReservationCard = (reservation: Reservation) => (
    <TouchableOpacity
      key={reservation.id}
      style={styles.reservationCard}
      onPress={() => {
        router.push({
          pathname: "/StoreScreen",
          params: { storeId: reservation.storeId },
        });
      }}
    >
      <Image
        source={{ uri: reservation.storeImage }}
        style={styles.storeImage}
      />
      <View style={styles.reservationInfo}>
        <Text style={styles.storeName}>{reservation.storeName}</Text>
        <Text style={styles.reservationDetails}>
          Quantity: {reservation.quantity} • $
          {reservation.totalAmount.toFixed(2)}
        </Text>
        <Text style={styles.pickupTime}>
          {reservation.pickupTime ? reservation.pickupTime : 'Not scheduled'}
        </Text>
        <Text
          style={[
            styles.status,
            { color: reservation.status === "confirmed" ? "#425e57" : "#666" },
          ]}
        >
          {reservation.status.charAt(0).toUpperCase() +
            reservation.status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#036B52"]}
          tintColor="#036B52"
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: "https://via.placeholder.com/80" }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>Kiên Tô</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/SettingsScreen')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Orders Section */}
      <View style={styles.ordersSection}>
        {loading ? (
          <ActivityIndicator color="#036B52" size="large" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (reservations?.length ?? 0) === 0 ? (
          <>
            <Text style={styles.ordersText}>
              You don't have any orders yet.
            </Text>
            <TouchableOpacity
              style={styles.findButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.findButtonText}>Find a Surprise Bag</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.reservationsList}>
            {reservations?.map(renderReservationCard)}
          </View>
        )}
      </View>

      {/* Statistics Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {reservations?.reduce((sum, res) => sum + res.quantity, 0) ?? 0}
          </Text>
          <Text style={styles.statLabel}>Orders made</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            $
            {(
              reservations?.reduce((sum, res) => sum + res.totalAmount, 0) ?? 0
            ).toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Money saved</Text>
        </View>
      </View>

      {/* Version Info */}
      <Text style={styles.versionText}>Version 24.11.0 (33015)</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 60,
    backgroundColor: "#FFF",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#036B52",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 18,
    color: "#FFF",
  },
  ordersSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  ordersText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  findButton: {
    backgroundColor: "#036B52",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  findButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#036B52",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 12,
    color: "#666",
  },
  versionText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  reservationsList: {
    width: "100%",
  },
  reservationCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  storeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  reservationInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  reservationDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  pickupTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: "#FF4444",
    textAlign: "center",
    marginVertical: 16,
  },
});

export default ProfileScreen;
