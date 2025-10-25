import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStoreOwner } from '../context/StoreOwnerContext';
import { useAuth } from '../context/AuthContext';
import { myStoreService, StoreInfo } from '../services/myStore';

interface StoreReservation {
  id: string;
  customerName: string;
  quantity: number;
  totalAmount: number;
  pickupTime: string;
  status: 'active' | 'picked_up';
  createdAt: string;
}

const StoreOwnerScreen = () => {
  const router = useRouter();
  const { isStoreOwnerMode, toggleStoreOwnerMode, hasStore, storeInfo, isLoading } = useStoreOwner();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'reservations' | 'settings'>('reservations');
  const [reservations, setReservations] = useState<StoreReservation[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    surpriseBoxes: 10,
    price: 15.99,
    address: '',
    images: [] as string[],
  });

  useEffect(() => {
    if (hasStore && storeInfo) {
      setStoreSettings(prev => ({
        ...prev,
        address: storeInfo.address,
      }));
    }
  }, [hasStore, storeInfo]);

  const fetchStoreReservations = async () => {
    if (!hasStore) return;
    
    setReservationsLoading(true);
    try {
      // TODO: Implement API call to fetch store reservations
      // For now, using mock data
      const mockReservations: StoreReservation[] = [
        {
          id: '1',
          customerName: 'John Doe',
          quantity: 2,
          totalAmount: 31.98,
          pickupTime: '2024-01-15T14:00:00Z',
          status: 'active',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          customerName: 'Jane Smith',
          quantity: 1,
          totalAmount: 15.99,
          pickupTime: '2024-01-15T16:00:00Z',
          status: 'active',
          createdAt: '2024-01-15T11:30:00Z',
        },
        {
          id: '3',
          customerName: 'Mike Johnson',
          quantity: 3,
          totalAmount: 47.97,
          pickupTime: '2024-01-15T12:00:00Z',
          status: 'picked_up',
          createdAt: '2024-01-15T09:00:00Z',
        },
      ];
      setReservations(mockReservations);
    } catch (error) {
      console.error('Error fetching store reservations:', error);
      Alert.alert('Error', 'Failed to load reservations');
    } finally {
      setReservationsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reservations' && hasStore) {
      fetchStoreReservations();
    }
  }, [activeTab, hasStore]);

  const handleSignUpStore = () => {
    router.push('/SignUpStoreScreen');
  };

  const handleMarkAsPickedUp = (reservationId: string, customerName: string) => {
    Alert.alert(
      'Mark as Picked Up',
      `Mark ${customerName}'s order as picked up?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Mark as Picked Up',
          onPress: () => {
            setReservations(prev => 
              prev.map(res => 
                res.id === reservationId 
                  ? { ...res, status: 'picked_up' as const }
                  : res
              )
            );
            Alert.alert('Success', 'Order marked as picked up');
          },
        },
      ]
    );
  };

  const renderNoStorePrompt = () => (
    <View style={styles.noStoreContainer}>
      <MaterialIcons name="store" size={64} color="#036B52" />
      <Text style={styles.noStoreTitle}>Chưa có cửa hàng</Text>
      <Text style={styles.noStoreDescription}>
        Bạn chưa có cửa hàng nào. Tạo cửa hàng mới để bắt đầu quản lý và bán hàng trên Savor.
      </Text>
      
      <View style={styles.storeActionButtons}>
        <TouchableOpacity 
          style={styles.createStoreButton} 
          onPress={handleSignUpStore}
        >
          <MaterialIcons name="add-business" size={24} color="#FFF" />
          <Text style={styles.createStoreButtonText}>Tạo cửa hàng mới</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReservationsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Today's Reservations</Text>
        <TouchableOpacity onPress={fetchStoreReservations}>
          <MaterialIcons name="refresh" size={24} color="#036B52" />
        </TouchableOpacity>
      </View>
      
      {reservationsLoading ? (
        <ActivityIndicator size="large" color="#036B52" style={styles.loadingIndicator} />
      ) : reservations.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="receipt" size={48} color="#666" />
          <Text style={styles.emptyStateText}>No reservations for today</Text>
        </View>
      ) : (
        <ScrollView style={styles.reservationsList}>
          {reservations.map((reservation) => (
            <View key={reservation.id} style={styles.reservationCard}>
              <View style={styles.reservationHeader}>
                <Text style={styles.customerName}>{reservation.customerName}</Text>
                <View style={[
                  styles.statusBadge,
                  { 
                    backgroundColor: reservation.status === 'active' ? '#4CAF50' : '#2196F3'
                  }
                ]}>
                  <Text style={styles.statusText}>
                    {reservation.status === 'active' ? 'Active' : 'Picked Up'}
                  </Text>
                </View>
              </View>
              <Text style={styles.reservationDetails}>
                Quantity: {reservation.quantity} • ${reservation.totalAmount.toFixed(2)}
              </Text>
              <Text style={styles.pickupTime}>
                Pickup: {new Date(reservation.pickupTime).toLocaleString()}
              </Text>
              {reservation.status === 'active' && (
                <TouchableOpacity
                  style={styles.pickupButton}
                  onPress={() => handleMarkAsPickedUp(reservation.id, reservation.customerName)}
                >
                  <MaterialIcons name="check-circle" size={20} color="#FFF" />
                  <Text style={styles.pickupButtonText}>Mark as Picked Up</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Store Configuration</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Number of Surprise Boxes</Text>
        <View style={styles.settingValue}>
          <TouchableOpacity
            style={styles.valueButton}
            onPress={() => setStoreSettings(prev => ({ ...prev, surpriseBoxes: Math.max(1, prev.surpriseBoxes - 1) }))}
          >
            <MaterialIcons name="remove" size={20} color="#036B52" />
          </TouchableOpacity>
          <Text style={styles.valueText}>{storeSettings.surpriseBoxes}</Text>
          <TouchableOpacity
            style={styles.valueButton}
            onPress={() => setStoreSettings(prev => ({ ...prev, surpriseBoxes: prev.surpriseBoxes + 1 }))}
          >
            <MaterialIcons name="add" size={20} color="#036B52" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Price per Box</Text>
        <View style={styles.settingValue}>
          <TouchableOpacity
            style={styles.valueButton}
            onPress={() => setStoreSettings(prev => ({ ...prev, price: Math.max(0.01, prev.price - 0.50) }))}
          >
            <MaterialIcons name="remove" size={20} color="#036B52" />
          </TouchableOpacity>
          <Text style={styles.valueText}>${storeSettings.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.valueButton}
            onPress={() => setStoreSettings(prev => ({ ...prev, price: prev.price + 0.50 }))}
          >
            <MaterialIcons name="add" size={20} color="#036B52" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Store Address</Text>
        <Text style={styles.addressText}>{storeSettings.address || 'No address set'}</Text>
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chế độ chủ cửa hàng</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.authRequired}>
          <Text style={styles.authRequiredText}>Please log in to access store owner features</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#036B52" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasStore) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chế độ chủ cửa hàng</Text>
          <View style={styles.headerRight} />
        </View>
        {renderNoStorePrompt()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chế độ chủ cửa hàng</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Store Owner Mode Toggle */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleLabel}>Chế độ chủ cửa hàng</Text>
          <Text style={styles.toggleDescription}>Quản lý cửa hàng và đơn đặt hàng</Text>
        </View>
        <Switch
          value={isStoreOwnerMode}
          onValueChange={toggleStoreOwnerMode}
          trackColor={{ false: '#E0E0E0', true: '#036B52' }}
          thumbColor={isStoreOwnerMode ? '#FFF' : '#FFF'}
        />
      </View>

      {isStoreOwnerMode && (
        <>
          {/* Tab Content - Full Screen */}
          <View style={styles.fullScreenContent}>
            {activeTab === 'reservations' ? renderReservationsTab() : renderSettingsTab()}
          </View>

          {/* Bottom Tab Navigation */}
          <View style={styles.bottomTabContainer}>
            <TouchableOpacity
              style={[styles.bottomTab, activeTab === 'reservations' && styles.activeBottomTab]}
              onPress={() => setActiveTab('reservations')}
            >
              <MaterialIcons 
                name="receipt" 
                size={24} 
                color={activeTab === 'reservations' ? '#036B52' : '#666'} 
              />
              <Text style={[styles.bottomTabText, activeTab === 'reservations' && styles.activeBottomTabText]}>
                Reservations
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomTab, activeTab === 'settings' && styles.activeBottomTab]}
              onPress={() => setActiveTab('settings')}
            >
              <MaterialIcons 
                name="settings" 
                size={24} 
                color={activeTab === 'settings' ? '#036B52' : '#666'} 
              />
              <Text style={[styles.bottomTabText, activeTab === 'settings' && styles.activeBottomTabText]}>
                Settings
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  authRequired: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  authRequiredText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#666',
  },
  noStoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noStoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noStoreDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  storeActionButtons: {
    width: '100%',
    gap: 12,
  },
  createStoreButton: {
    backgroundColor: '#036B52',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createStoreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fullScreenContent: {
    flex: 1,
  },
  bottomTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 20,
    paddingTop: 8,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeBottomTab: {
    // Active state styling handled by icon and text colors
  },
  bottomTabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeBottomTabText: {
    color: '#036B52',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 32,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  reservationsList: {
    flex: 1,
  },
  reservationCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  reservationDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  pickupTime: {
    fontSize: 14,
    color: '#666',
  },
  pickupButton: {
    backgroundColor: '#036B52',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
  },
  pickupButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  settingItem: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueButton: {
    backgroundColor: '#F0F0F0',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    marginHorizontal: 16,
    minWidth: 60,
    textAlign: 'center',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#036B52',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StoreOwnerScreen;
