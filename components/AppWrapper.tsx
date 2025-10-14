import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStoreOwner } from '../context/StoreOwnerContext';
import { storeOwnerApiService, StoreOwnerReservation, StoreOwnerSettings } from '../services/storeOwnerApi';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const { isStoreOwnerMode, toggleStoreOwnerMode, hasStore } = useStoreOwner();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'reservations' | 'settings'>('reservations');
  const [currentReservations, setCurrentReservations] = useState<StoreOwnerReservation[]>([]);
  const [pastReservations, setPastReservations] = useState<StoreOwnerReservation[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreOwnerSettings>({
    surpriseBoxes: 10,
    price: 16,
    isSelling: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log('AppWrapper - isStoreOwnerMode:', isStoreOwnerMode, 'hasStore:', hasStore);

  // Load data when store owner mode is enabled
  useEffect(() => {
    if (isStoreOwnerMode && hasStore) {
      loadReservations();
      loadSettings();
    }
  }, [isStoreOwnerMode, hasStore]);

  const loadReservations = async () => {
    try {
      setIsLoading(true);
      const data = await storeOwnerApiService.getReservations();
      setCurrentReservations(data.currentReservations);
      setPastReservations(data.pastReservations);
    } catch (error) {
      console.error('Error loading reservations:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await storeOwnerApiService.getSettings();
      setStoreSettings(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
      // Don't show alert for settings as it's not critical
    }
  };

  const handleMarkAsPickedUp = async (reservationId: string, customerName: string) => {
    try {
      await storeOwnerApiService.updateReservationStatus(reservationId, 'picked_up');
      // Update both current and past reservations
      setCurrentReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, status: 'picked_up' as const }
            : res
        )
      );
      setPastReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, status: 'picked_up' as const }
            : res
        )
      );
      Alert.alert('Thành công', `Đã đánh dấu đơn hàng của ${customerName} là đã lấy`);
    } catch (error) {
      console.error('Error updating reservation status:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const handleRefresh = async () => {
    console.log('Refreshing reservations...');
    setIsRefreshing(true);
    
    try {
      await loadReservations();
    } catch (error) {
      console.error('Error refreshing reservations:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<StoreOwnerSettings>) => {
    try {
      const updatedSettings = { ...storeSettings, ...newSettings };
      await storeOwnerApiService.updateSettings(updatedSettings);
      setStoreSettings(updatedSettings);
      Alert.alert('Thành công', 'Đã cập nhật cài đặt cửa hàng');
    } catch (error) {
      console.error('Error updating settings:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật cài đặt');
    }
  };

  // If store owner mode is enabled, show the store owner interface
  if (isStoreOwnerMode && hasStore) {
    console.log('Rendering store owner interface');
    return (
      <View style={styles.storeOwnerContainer} pointerEvents="auto">
        {/* Store Owner Header */}
        <View style={styles.storeOwnerHeader}>
          <Text style={styles.storeOwnerTitle}>Chế độ chủ cửa hàng</Text>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => {
              console.log('Exit button pressed');
              toggleStoreOwnerMode();
            }}
          >
            <MaterialIcons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Store Owner Content */}
        <View style={styles.storeOwnerContent} pointerEvents="auto">
          {activeTab === 'reservations' ? (
            <View style={styles.tabContent}>
              <View style={styles.tabHeader}>
                <Text style={styles.tabTitle}>Đơn đặt hàng</Text>
                <TouchableOpacity onPress={handleRefresh} disabled={isRefreshing}>
                  <MaterialIcons 
                    name="refresh" 
                    size={24} 
                    color={isRefreshing ? "#999" : "#036B52"} 
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.reservationsList}>
                {/* Current Reservations */}
                <Text style={styles.sectionTitle}>Đơn hàng hiện tại ({currentReservations.length})</Text>
                {currentReservations.map((reservation) => (
                  <TouchableOpacity 
                    key={reservation.id} 
                    style={styles.reservationCard}
                    onPress={() => {
                      router.push({
                        pathname: "/ReservationDetailScreen",
                        params: {
                          reservationId: reservation.id,
                          storeName: 'Store', // Store owner view - we don't have store name in reservation
                          storeImage: '', // Store owner view - we don't have store image
                          storeAddress: '', // Store owner view - we don't have store address
                          customerName: reservation.customerName,
                          customerEmail: reservation.customerEmail || '',
                          phoneNumber: '', // Store owner view - we don't have phone
                          quantity: reservation.quantity.toString(),
                          totalAmount: reservation.totalAmount.toString(),
                          status: reservation.status,
                          pickupTime: reservation.pickupTime || 'Chưa lên lịch',
                          createdAt: reservation.createdAt,
                          paymentType: 'Trả tiền tại cửa hàng',
                        },
                      });
                    }}
                  >
                    <View style={styles.reservationHeader}>
                      <Text style={styles.customerName}>{reservation.customerName}</Text>
                      <View style={[
                        styles.statusBadge, 
                        { backgroundColor: reservation.status === 'active' ? '#4CAF50' : '#2196F3' }
                      ]}>
                        <Text style={styles.statusText}>
                          {reservation.status === 'active' ? 'Đang chờ' : 'Đã lấy'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.reservationDetails}>
                      Số lượng: {reservation.quantity} • {reservation.totalAmount.toFixed(0)}.000đ
                    </Text>
                    <Text style={styles.pickupTime}>
                      Lấy hàng: {reservation.pickupTime}
                    </Text>
                    {reservation.status === 'active' && (
                      <TouchableOpacity 
                        style={styles.pickupButton}
                        onPress={(e) => {
                          e.stopPropagation(); // Prevent card navigation
                          handleMarkAsPickedUp(reservation.id, reservation.customerName);
                        }}
                      >
                        <MaterialIcons name="check-circle" size={20} color="#FFF" />
                        <Text style={styles.pickupButtonText}>Đánh dấu đã lấy</Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ))}

                {/* Past Reservations */}
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Đơn hàng đã qua ({pastReservations.length})</Text>
                {pastReservations.map((reservation) => (
                  <TouchableOpacity 
                    key={reservation.id} 
                    style={[styles.reservationCard, { opacity: 0.7 }]}
                    onPress={() => {
                      router.push({
                        pathname: "/ReservationDetailScreen",
                        params: {
                          reservationId: reservation.id,
                          storeName: 'Store', // Store owner view - we don't have store name in reservation
                          storeImage: '', // Store owner view - we don't have store image
                          storeAddress: '', // Store owner view - we don't have store address
                          customerName: reservation.customerName,
                          customerEmail: reservation.customerEmail || '',
                          phoneNumber: '', // Store owner view - we don't have phone
                          quantity: reservation.quantity.toString(),
                          totalAmount: reservation.totalAmount.toString(),
                          status: reservation.status,
                          pickupTime: reservation.pickupTime || 'Chưa lên lịch',
                          createdAt: reservation.createdAt,
                          paymentType: 'Trả tiền tại cửa hàng',
                        },
                      });
                    }}
                  >
                    <View style={styles.reservationHeader}>
                      <Text style={styles.customerName}>{reservation.customerName}</Text>
                      <View style={[
                        styles.statusBadge, 
                        { backgroundColor: reservation.status === 'active' ? '#4CAF50' : '#2196F3' }
                      ]}>
                        <Text style={styles.statusText}>
                          {reservation.status === 'active' ? 'Đang chờ' : 'Đã lấy'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.reservationDetails}>
                      Số lượng: {reservation.quantity} • {reservation.totalAmount.toFixed(0)}.000đ
                    </Text>
                    <Text style={styles.pickupTime}>
                      Lấy hàng: {reservation.pickupTime || 'Chưa xác định'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.tabContent}>
              <Text style={styles.tabTitle}>Cài đặt cửa hàng</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Số túi đồ ăn bất ngờ</Text>
                <View style={styles.settingValue}>
                  <TouchableOpacity 
                    style={styles.valueButton}
                    onPress={() => handleUpdateSettings({ surpriseBoxes: Math.max(1, storeSettings.surpriseBoxes - 1) })}
                  >
                    <MaterialIcons name="remove" size={20} color="#036B52" />
                  </TouchableOpacity>
                  <Text style={styles.valueText}>{storeSettings.surpriseBoxes}</Text>
                  <TouchableOpacity 
                    style={styles.valueButton}
                    onPress={() => handleUpdateSettings({ surpriseBoxes: storeSettings.surpriseBoxes + 1 })}
                  >
                    <MaterialIcons name="add" size={20} color="#036B52" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Giá mỗi túi</Text>
                <View style={styles.settingValue}>
                  <TouchableOpacity 
                    style={styles.valueButton}
                    onPress={() => handleUpdateSettings({ price: Math.max(1, storeSettings.price - 1) })}
                  >
                    <MaterialIcons name="remove" size={20} color="#036B52" />
                  </TouchableOpacity>
                  <Text style={styles.valueText}>{storeSettings.price.toFixed(0)}.000đ</Text>
                  <TouchableOpacity 
                    style={styles.valueButton}
                    onPress={() => handleUpdateSettings({ price: storeSettings.price + 1 })}
                  >
                    <MaterialIcons name="add" size={20} color="#036B52" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Store Owner Bottom Tabs */}
        <View style={styles.storeOwnerBottomTabs} pointerEvents="auto">
          <TouchableOpacity
            style={[styles.storeOwnerTab, activeTab === 'reservations' && styles.activeStoreOwnerTab]}
            onPress={() => {
              console.log('Reservations tab pressed');
              setActiveTab('reservations');
            }}
          >
            <MaterialIcons 
              name="receipt" 
              size={24} 
              color={activeTab === 'reservations' ? '#036B52' : '#666'} 
            />
            <Text style={[styles.storeOwnerTabText, activeTab === 'reservations' && styles.activeStoreOwnerTabText]}>
              Đơn hàng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.storeOwnerTab, activeTab === 'settings' && styles.activeStoreOwnerTab]}
            onPress={() => {
              console.log('Settings tab pressed');
              setActiveTab('settings');
            }}
          >
            <MaterialIcons 
              name="settings" 
              size={24} 
              color={activeTab === 'settings' ? '#036B52' : '#666'} 
            />
            <Text style={[styles.storeOwnerTabText, activeTab === 'settings' && styles.activeStoreOwnerTabText]}>
              Cài đặt
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Normal customer interface
  console.log('Rendering normal customer interface');
  return <>{children}</>;
}

const styles = StyleSheet.create({
  storeOwnerContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  storeOwnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#036B52',
    paddingTop: 50, // Account for status bar
    zIndex: 10000,
  },
  storeOwnerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  exitButton: {
    padding: 8,
    zIndex: 10001,
  },
  storeOwnerContent: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#036B52',
    marginBottom: 12,
    marginTop: 8,
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
    marginBottom: 8,
  },
  pickupButton: {
    backgroundColor: '#036B52',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  pickupButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  settingItem: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
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
  storeOwnerBottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 20,
    paddingTop: 8,
    zIndex: 10000,
  },
  storeOwnerTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeStoreOwnerTab: {
    // Active state styling handled by icon and text colors
  },
  storeOwnerTabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeStoreOwnerTabText: {
    color: '#036B52',
    fontWeight: '600',
  },
});
