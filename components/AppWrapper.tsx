import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStoreOwner } from '../context/StoreOwnerContext';
import { storeOwnerApiService, StoreOwnerReservation, StoreOwnerSettings } from '../services/storeOwnerApi';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const { isStoreOwnerMode, toggleStoreOwnerMode, hasStore, isLoading: isStoreLoading } = useStoreOwner();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'reservations' | 'settings'>('reservations');
  const [currentReservations, setCurrentReservations] = useState<StoreOwnerReservation[]>([]);
  const [pastReservations, setPastReservations] = useState<StoreOwnerReservation[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreOwnerSettings>({
    title: '',
    description: '',
    address: '',
    imageUrl: '',
    backgroundUrl: '',
    avatarUrl: '',
    originalPrice: 0,
    discountedPrice: 0,
    price: 0,
    surpriseBoxes: 10,
    pickupTime: '',
    isSelling: false,
  });
  const [originalSettings, setOriginalSettings] = useState<StoreOwnerSettings>({
    title: '',
    description: '',
    address: '',
    imageUrl: '',
    backgroundUrl: '',
    avatarUrl: '',
    originalPrice: 0,
    discountedPrice: 0,
    price: 0,
    surpriseBoxes: 10,
    pickupTime: '',
    isSelling: false,
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [pendingReservationParams, setPendingReservationParams] = useState<
    | {
        reservationId: string;
        storeName: string;
        storeImage: string;
        storeAddress: string;
        customerName: string;
        customerEmail: string;
        phoneNumber: string;
        quantity: string;
        totalAmount: string;
        status: string;
        pickupTime: string;
        createdAt: string;
        paymentType: string;
      }
    | null
  >(null);

  console.log('AppWrapper - isStoreOwnerMode:', isStoreOwnerMode, 'hasStore:', hasStore);

  // Redirect to signup if trying to access store owner mode without a store
  useEffect(() => {
    if (isStoreOwnerMode && !isStoreLoading && !hasStore) {
      console.log('User tried to access store owner mode without a store, redirecting to signup');
      // Turn off store owner mode first
      toggleStoreOwnerMode();
      
      // Then navigate after a small delay
      setTimeout(() => {
        router.push('/SignUpStoreScreen');
      }, 100);
    }
  }, [isStoreOwnerMode, hasStore, isStoreLoading]);

  // Load data when store owner mode is enabled
  useEffect(() => {
    if (isStoreOwnerMode && hasStore) {
      loadReservations();
      loadSettings();
    }
  }, [isStoreOwnerMode, hasStore]);

  // Navigate to reservation detail only after overlay closes
  useEffect(() => {
    if (!isStoreOwnerMode && pendingReservationParams) {
      // Use a small delay to ensure overlay is fully closed before navigating
      const timer = setTimeout(() => {
        router.push({ pathname: "/ReservationDetailScreen", params: pendingReservationParams });
        setPendingReservationParams(null);
        setIsNavigating(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isStoreOwnerMode, pendingReservationParams]);

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
      setOriginalSettings(settings);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      // Don't show alert for settings as it's not critical
    }
  };

  const handleMarkAsPickedUp = async (reservationId: string, customerName: string) => {
    try {
      console.log('Marking reservation as picked up:', reservationId);
      const response = await storeOwnerApiService.updateReservationStatus(reservationId, 'picked_up');
      console.log('Update response:', response);
      
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
      
      // Refresh reservations to get the latest data
      await loadReservations();
      
      Alert.alert('Thành công', `Đã đánh dấu đơn hàng của ${customerName} là đã lấy`);
    } catch (error: any) {
      console.error('Error updating reservation status:', error);
      console.error('Error message:', error.message);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật trạng thái đơn hàng');
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

  const handleUpdateSettings = (newSettings: Partial<StoreOwnerSettings>) => {
    const updatedSettings = { ...storeSettings, ...newSettings };
    setStoreSettings(updatedSettings);
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true);
      await storeOwnerApiService.updateSettings(storeSettings);
      setOriginalSettings(storeSettings);
      setHasUnsavedChanges(false);
      Alert.alert('Thành công', 'Đã lưu cài đặt cửa hàng');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Lỗi', 'Không thể lưu cài đặt');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleCancelSettings = () => {
    setStoreSettings(originalSettings);
    setHasUnsavedChanges(false);
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Đã hoàn thành';
      case 'picked_up':
        return 'Đã lấy hàng';
      case 'cancelled':
        return 'Đã hủy';
      case 'expired':
        return 'Hết hạn';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return '#FF9800'; // Orange
      case 'confirmed':
        return '#4CAF50'; // Green
      case 'completed':
        return '#2196F3'; // Blue
      case 'picked_up':
        return '#00BCD4'; // Cyan - successfully picked up
      case 'cancelled':
        return '#F44336'; // Red
      case 'expired':
        return '#999'; // Gray
      default:
        return '#999';
    }
  };

  // If navigating, suppress overlay render to prevent flash
  if (isStoreOwnerMode && hasStore && !isNavigating) {
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
              
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 140 }}>
                {/* Current Reservations */}
                <Text style={styles.sectionTitle}>Đơn hàng hiện tại ({(currentReservations?.length ?? 0)})</Text>
                {(currentReservations ?? []).map((reservation) => (
                  <View 
                    key={reservation.id} 
                    style={styles.reservationCard}
                  >
                    <View style={styles.reservationHeader}>
                      <Text style={styles.customerName}>{reservation.customerName}</Text>
                      <View style={[
                        styles.statusBadge, 
                        { backgroundColor: getStatusColor(reservation.status) }
                      ]}>
                        <Text style={styles.statusText}>
                          {getStatusText(reservation.status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.reservationDetails}>
                      Số lượng: {reservation.quantity} • {reservation.totalAmount.toFixed(0)}.000đ
                    </Text>
                    <Text style={styles.pickupTime}>
                      Lấy hàng: {reservation.pickupTime}
                    </Text>
                    {(reservation.status !== 'completed' && reservation.status !== 'cancelled' && reservation.status !== 'picked_up') && (
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
                    {/* Contact Info */}
                    {(reservation.phoneNumber || reservation.customerEmail) && (
                      <View style={styles.contactInfo}>
                        {reservation.phoneNumber && (
                          <Text style={styles.contactText}>📞 {reservation.phoneNumber}</Text>
                        )}
                        {reservation.customerEmail && (
                          <Text style={styles.contactText}>📧 {reservation.customerEmail}</Text>
                        )}
                      </View>
                    )}
                  </View>
                ))}

                {/* Past Reservations */}
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Đơn hàng đã qua ({(pastReservations?.length ?? 0)})</Text>
                {(pastReservations ?? []).map((reservation) => (
                  <View 
                    key={reservation.id} 
                    style={[styles.reservationCard, { opacity: 0.7 }]}
                  >
                    <View style={styles.reservationHeader}>
                      <Text style={styles.customerName}>{reservation.customerName}</Text>
                      <View style={[
                        styles.statusBadge, 
                        { backgroundColor: getStatusColor(reservation.status) }
                      ]}>
                        <Text style={styles.statusText}>
                          {getStatusText(reservation.status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.reservationDetails}>
                      Số lượng: {reservation.quantity} • {reservation.totalAmount.toFixed(0)}.000đ
                    </Text>
                    <Text style={styles.pickupTime}>
                      Lấy hàng: {reservation.pickupTime || 'Chưa xác định'}
                    </Text>
                    {/* Contact Info */}
                    {(reservation.phoneNumber || reservation.customerEmail) && (
                      <View style={styles.contactInfo}>
                        {reservation.phoneNumber && (
                          <Text style={styles.contactText}>📞 {reservation.phoneNumber}</Text>
                        )}
                        {reservation.customerEmail && (
                          <Text style={styles.contactText}>📧 {reservation.customerEmail}</Text>
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.tabContent}>
              <Text style={styles.tabTitle}>Cài đặt cửa hàng</Text>
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 140 }}>
                {/* Basic Information */}
                <Text style={styles.sectionHeader}>Thông tin cơ bản</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tên cửa hàng *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={storeSettings.title}
                    onChangeText={(text) => handleUpdateSettings({ title: text })}
                    placeholder="Nhập tên cửa hàng"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mô tả</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={storeSettings.description}
                    onChangeText={(text) => handleUpdateSettings({ description: text })}
                    placeholder="Mô tả về cửa hàng của bạn"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Địa chỉ</Text>
                  <TextInput
                    style={styles.textInput}
                    value={storeSettings.address}
                    onChangeText={(text) => handleUpdateSettings({ address: text })}
                    placeholder="Nhập địa chỉ cửa hàng"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* Images */}
                <Text style={styles.sectionHeader}>Hình ảnh</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>URL Hình ảnh chính</Text>
                  <TextInput
                    style={styles.textInput}
                    value={storeSettings.imageUrl}
                    onChangeText={(text) => handleUpdateSettings({ imageUrl: text })}
                    placeholder="https://..."
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>URL Hình nền</Text>
                  <TextInput
                    style={styles.textInput}
                    value={storeSettings.backgroundUrl}
                    onChangeText={(text) => handleUpdateSettings({ backgroundUrl: text })}
                    placeholder="https://..."
                    placeholderTextColor="#999"
                  />
                </View>

                {/* Pricing */}
                <Text style={styles.sectionHeader}>Giá cả</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Giá gốc (1.000đ)</Text>
                  <View style={styles.numberInputContainer}>
                    <TouchableOpacity 
                      style={styles.valueButton}
                      onPress={() => handleUpdateSettings({ originalPrice: Math.max(0, storeSettings.originalPrice - 1) })}
                    >
                      <MaterialIcons name="remove" size={20} color="#036B52" />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.numberInput}
                      value={storeSettings.originalPrice.toString()}
                      onChangeText={(text) => {
                        const num = parseFloat(text) || 0;
                        handleUpdateSettings({ originalPrice: num });
                      }}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity 
                      style={styles.valueButton}
                      onPress={() => handleUpdateSettings({ originalPrice: storeSettings.originalPrice + 1 })}
                    >
                      <MaterialIcons name="add" size={20} color="#036B52" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Giá khuyến mãi (1.000đ)</Text>
                  <View style={styles.numberInputContainer}>
                    <TouchableOpacity 
                      style={styles.valueButton}
                      onPress={() => handleUpdateSettings({ discountedPrice: Math.max(0, storeSettings.discountedPrice - 1) })}
                    >
                      <MaterialIcons name="remove" size={20} color="#036B52" />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.numberInput}
                      value={storeSettings.discountedPrice.toString()}
                      onChangeText={(text) => {
                        const num = parseFloat(text) || 0;
                        handleUpdateSettings({ discountedPrice: num });
                      }}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity 
                      style={styles.valueButton}
                      onPress={() => handleUpdateSettings({ discountedPrice: storeSettings.discountedPrice + 1 })}
                    >
                      <MaterialIcons name="add" size={20} color="#036B52" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Availability */}
                <Text style={styles.sectionHeader}>Sẵn có</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Số túi còn lại</Text>
                  <View style={styles.numberInputContainer}>
                    <TouchableOpacity 
                      style={styles.valueButton}
                      onPress={() => handleUpdateSettings({ surpriseBoxes: Math.max(0, storeSettings.surpriseBoxes - 1) })}
                    >
                      <MaterialIcons name="remove" size={20} color="#036B52" />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.numberInput}
                      value={storeSettings.surpriseBoxes.toString()}
                      onChangeText={(text) => {
                        const num = parseInt(text) || 0;
                        handleUpdateSettings({ surpriseBoxes: num });
                      }}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity 
                      style={styles.valueButton}
                      onPress={() => handleUpdateSettings({ surpriseBoxes: storeSettings.surpriseBoxes + 1 })}
                    >
                      <MaterialIcons name="add" size={20} color="#036B52" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Thời gian lấy hàng</Text>
                  <TextInput
                    style={styles.textInput}
                    value={storeSettings.pickupTime}
                    onChangeText={(text) => handleUpdateSettings({ pickupTime: text })}
                    placeholder="Ví dụ: 5:00 PM - 8:00 PM"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* Save/Cancel Buttons */}
                {hasUnsavedChanges && (
                  <View style={styles.settingsActions}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={handleCancelSettings}
                      disabled={isSavingSettings}
                    >
                      <Text style={styles.cancelButtonText}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={handleSaveSettings}
                      disabled={isSavingSettings}
                    >
                      {isSavingSettings ? (
                        <Text style={styles.saveButtonText}>Đang lưu...</Text>
                      ) : (
                        <>
                          <MaterialIcons name="check" size={20} color="#fff6e7" />
                          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
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
              color={activeTab === 'reservations' ? '#004d3d' : '#004d3d'} 
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
              color={activeTab === 'settings' ? '#004d3d' : '#004d3d'} 
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
    backgroundColor: '#fff6e7',
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
    backgroundColor: '#004d3d',
    paddingTop: 50, // Account for status bar
    zIndex: 10000,
  },
  storeOwnerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff6e7',
    fontFamily: 'Montserrat',
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
    color: '#004d3d',
    fontFamily: 'Montserrat',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004d3d',
    marginBottom: 12,
    marginTop: 8,
    fontFamily: 'Montserrat',
  },
  reservationsList: {
    flex: 1,
  },
  reservationCard: {
    backgroundColor: '#fff6e7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#004d3d',
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
    color: '#004d3d',
    fontFamily: 'Montserrat',
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
    color: '#004d3d',
    marginBottom: 4,
    fontFamily: 'Montserrat',
  },
  pickupTime: {
    fontSize: 14,
    color: '#004d3d',
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  pickupButton: {
    backgroundColor: '#004d3d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  pickupButtonText: {
    color: '#fff6e7',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'Montserrat',
  },
  contactInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  contactText: {
    fontSize: 13,
    color: '#004d3d',
    marginBottom: 4,
    fontFamily: 'Montserrat',
  },
  settingItem: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  settingsActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#004d3d',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#004d3d',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveButtonText: {
    color: '#fff6e7',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    marginLeft: 4,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004d3d',
    marginTop: 20,
    marginBottom: 12,
    fontFamily: 'Montserrat',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004d3d',
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  textInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#004d3d',
    fontFamily: 'Montserrat',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  numberInput: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 8,
    color: '#004d3d',
    fontFamily: 'Montserrat',
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
    color: '#004d3d',
    marginTop: 4,
    fontFamily: 'Montserrat',
  },
  activeStoreOwnerTabText: {
    color: '#004d3d',
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
});
