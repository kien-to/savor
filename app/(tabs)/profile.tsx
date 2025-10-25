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
  Alert,
} from "react-native";
import { reservationService, Reservation } from "../../services/reservations";
import { useRouter, useFocusEffect } from "expo-router";
import { Colors } from "../../constants/Colors";
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
// import { format } from "date-fns";

const ProfileScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentReservations, setCurrentReservations] = useState<Reservation[]>([]);
  const [pastReservations, setPastReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPastReservations, setShowPastReservations] = useState(false);
  const router = useRouter();
  const { logout, token, isGuest, isAuthenticated, userEmail, userName, refreshUserProfile } = useAuth();

  // Debug function to clear all storage
  const clearAllStorage = useCallback(async () => {
    Alert.alert(
      'Clear Storage (Debug)',
      'This will clear ALL stored data. Use for testing only.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              const AsyncStorage = require('@react-native-async-storage/async-storage').default;
              await AsyncStorage.clear();
              console.log('All AsyncStorage cleared');
              Alert.alert('Success', 'All storage cleared. Restart the app to test.');
            } catch (error) {
              console.error('Error clearing storage:', error);
            }
          },
        },
      ]
    );
  }, []);

  const fetchReservations = async () => {
    try {
      
      const data = await reservationService.getReservations(isGuest);
      
      
      // Handle new format with currentReservations and pastReservations
      if (data && typeof data === 'object' && 'currentReservations' in data && 'pastReservations' in data) {
        const typedData = data as unknown as { currentReservations: Reservation[]; pastReservations: Reservation[]; currentCount: number; pastCount: number };
        setCurrentReservations(typedData.currentReservations || []);
        setPastReservations(typedData.pastReservations || []);
        // For backward compatibility, also set the combined list
        setReservations([...typedData.currentReservations, ...typedData.pastReservations]);
      } else {
        // Handle old format (array)
        const reservationsArray = Array.isArray(data) ? data : [];
        setReservations(reservationsArray);
        setCurrentReservations(reservationsArray);
        setPastReservations([]);
      }
      
      setError(null);
    } catch (err) {
      setError("Failed to load reservations");
      console.error("=== ERROR fetching reservations ===", err);
      setReservations([]);
      setCurrentReservations([]);
      setPastReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchReservations(),
        refreshUserProfile(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshUserProfile]);

  // Initial fetch - refetch when auth state changes
  React.useEffect(() => {
    console.log('Profile: Auth state changed - isGuest:', isGuest, 'isAuthenticated:', isAuthenticated);
    // Small delay to ensure auth tokens are ready
    const timer = setTimeout(() => {
      fetchReservations();
      refreshUserProfile();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isGuest, isAuthenticated]);

  // Refetch reservations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Profile screen focused, fetching reservations...');
      fetchReservations();
      return () => {
        // Cleanup if needed
      };
    }, [isGuest, isAuthenticated])
  );

  const handleRemoveReservation = useCallback((reservationId: string, storeName: string) => {
    Alert.alert(
      'Xóa đặt chỗ',
      `Bạn có chắc chắn muốn xóa đặt chỗ tại ${storeName}?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove from local state immediately for better UX
              setReservations(prev => prev.filter(r => r.id !== reservationId));
              
              // Call backend to actually delete the reservation
              await reservationService.deleteReservation(reservationId, isGuest);
              
              Alert.alert('Thành công', 'Đã xóa đặt chỗ thành công');
            } catch (error) {
              console.error('Error removing reservation:', error);
              // Restore the reservation if the API call fails
              fetchReservations();
              Alert.alert('Lỗi', 'Không thể xóa đặt chỗ. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  }, [fetchReservations]);

  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Navigate directly to login screen
            router.replace('/LoginScreen');
          },
        },
      ]
    );
  }, [logout]);

  const renderReservationCard = (reservation: Reservation) => (
    <View key={reservation.id} style={styles.reservationCardContainer}>
      <TouchableOpacity
        style={styles.reservationCard}
        onPress={() => {
          router.push({
            pathname: "/ReservationDetailScreen",
            params: {
              reservationId: reservation.id,
              storeName: reservation.storeName,
              storeImage: reservation.storeImage,
              storeAddress: reservation.storeAddress,
              customerName: userName || reservation.customerName || 'Guest User',
              customerEmail: userEmail || reservation.customerEmail || '',
              phoneNumber: reservation.phoneNumber || '',
              quantity: reservation.quantity.toString(),
              totalAmount: reservation.totalAmount.toString(),
              status: reservation.status,
              pickupTime: reservation.pickupTime || 'Chưa lên lịch',
              createdAt: reservation.createdAt,
              paymentType: reservation.paymentType || 'Trả tiền tại cửa hàng',
            },
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
            Số lượng: {reservation.quantity} • $
            {reservation.totalAmount.toFixed(2)}
          </Text>
          <Text style={styles.pickupTime}>
            {reservation.pickupTime ? reservation.pickupTime : 'Chưa lên lịch'}
          </Text>
          <Text
            style={[
              styles.status,
              { color: reservation.status === "confirmed" ? "#425e57" : "#666" },
            ]}
          >
            {reservation.status === "confirmed" ? "Đã xác nhận" : 
             reservation.status === "pending" ? "Đang chờ" : 
             reservation.status === "picked_up" ? "Đã lấy hàng" :
             reservation.status === "completed" ? "Đã hoàn thành" :
             reservation.status === "cancelled" ? "Đã hủy" :
             reservation.status === "expired" ? "Hết hạn" :
             reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButtonCorner}
          onPress={async (e) => {
            e.stopPropagation();
            handleRemoveReservation(reservation.id, reservation.storeName);
          }}
        >
          <MaterialIcons name="close" size={20} color="#FF4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.light.primary]}
          tintColor={Colors.light.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View>
            <Text style={styles.userName}>
              {isGuest ? "Khách" : (userName || userEmail || "Người dùng")}
            </Text>
            {!isGuest && userEmail && userName !== userEmail && (
              <Text style={styles.userEmail}>{userEmail}</Text>
            )}
            {isGuest && (
              <Text style={styles.guestLabel}>Đang duyệt với tư cách khách</Text>
            )}
          </View>
        </View>
        <View style={styles.headerButtons}>
          {(isAuthenticated || isGuest) && (
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={20} color={Colors.light.accent} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.clearStorageButton}
            onPress={clearAllStorage}
          >
            <Text style={styles.clearStorageText}>🗑️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/SettingsScreen')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Orders Section */}
      <View style={styles.ordersSection}>
        {loading ? (
          <ActivityIndicator color={Colors.light.primary} size="large" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (currentReservations?.length ?? 0) === 0 && (pastReservations?.length ?? 0) === 0 ? (
          <>
            <Text style={styles.ordersText}>
              Bạn chưa có đơn hàng nào.
            </Text>
            <TouchableOpacity
              style={styles.findButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.findButtonText}>Tìm túi bất ngờ</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.reservationsList}>
            {/* Current Reservations */}
            {currentReservations && currentReservations.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Đơn hàng hiện tại ({currentReservations.length})</Text>
                {currentReservations.map(renderReservationCard)}
              </>
            )}
            
            {/* Past Reservations */}
            {pastReservations && pastReservations.length > 0 && (
              <>
                <TouchableOpacity 
                  style={styles.pastReservationsHeader}
                  onPress={() => setShowPastReservations(!showPastReservations)}
                >
                  <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 0 }]}>
                    Đơn hàng đã qua ({pastReservations.length})
                  </Text>
                  <MaterialIcons 
                    name={showPastReservations ? "expand-less" : "expand-more"} 
                    size={24} 
                    color={Colors.light.primary} 
                  />
                </TouchableOpacity>
                {showPastReservations && pastReservations.map((reservation) => (
                  <View key={reservation.id} style={[styles.reservationCardContainer, { opacity: 0.7 }]}>
                    {renderReservationCard(reservation)}
                  </View>
                ))}
              </>
            )}
          </View>
        )}
      </View>

      {/* Statistics Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {reservations?.reduce((sum, res) => sum + res.quantity, 0) ?? 0}
          </Text>
          <Text style={styles.statLabel}>Đơn hàng đã đặt</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            $
            {(
              reservations?.reduce((sum, res) => sum + res.totalAmount, 0) ?? 0
            ).toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Tiền đã tiết kiệm</Text>
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
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingVertical: 60,
    padding: 16,
    paddingBottom: 120, // Extra padding for tab bar and safe scrolling
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.accent,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.light.accent,
    opacity: 0.85,
    marginTop: 2,
  },
  guestLabel: {
    fontSize: 13,
    color: Colors.light.accent,
    opacity: 0.85,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearStorageButton: {
    backgroundColor: '#FFA500',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearStorageText: {
    fontSize: 16,
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 20,
    color: Colors.light.accent,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  findButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  findButtonText: {
    color: Colors.light.accent,
    fontSize: 16,
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
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.primary,
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
  reservationCardContainer: {
    marginBottom: 12,
  },
  reservationCard: {
    position: "relative",
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  removeButtonCorner: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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
  pastReservationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
    paddingVertical: 8,
  },
});

export default ProfileScreen;
