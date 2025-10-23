import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStripe } from '@stripe/stripe-react-native';
// import { paymentService } from '../services/payment'; // Old payment service - commented out
import { reservationService } from '../services/reservations';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/Colors';
import { userService } from '../services/user';

const PaymentScreen = () => {
  // const stripe = useStripe();
  const router = useRouter();
  const { isGuest, isAuthenticated, userEmail, userName } = useAuth();
  const { 
    storeId, 
    storeTitle, 
    originalPrice,
    discountedPrice,
    price, 
    pickUpTime, 
    // pickUpTimestamp,
    itemsLeft,
    storeImage,
    storeAddress,
    storeLatitude,
    storeLongitude,
  } = useLocalSearchParams();
  
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Pay at Store');
  const [loading, setLoading] = useState(false);
  
  // Contact information state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');

  // Use discounted price if available, otherwise fallback to price
  const actualPrice = Number(discountedPrice) || Number(price);
  const originalPriceValue = Number(originalPrice) || actualPrice;
  const subtotal = actualPrice * quantity;

  // Format VND currency (multiply by 1000 to convert to proper VND)
  const formatVND = (amount: number) => {
    return `${(amount * 1000).toLocaleString('vi-VN')}đ`;
  };

  // Load stored contact information and hydrate from backend for authenticated users
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        // Load any locally stored values first as a fallback
        const storedPhone = await AsyncStorage.getItem('userPhoneNumber');
        const storedName = await AsyncStorage.getItem('customerName');
        if (storedPhone) setPhoneNumber(storedPhone);
        if (storedName) setCustomerName(storedName);

        // If authenticated, fetch profile from backend and override
        if (isAuthenticated) {
          try {
            const profile = await userService.getUserProfile();
            if (profile?.phone) setPhoneNumber(profile.phone);
            // Prefer backend name, then auth display name
            if (profile?.name || profile?.display_name || userName) {
              setCustomerName(profile.name || profile.display_name || userName || '');
            }
          } catch (e) {
            // Fallback to useAuth values if backend not available
            if (userName) setCustomerName(prev => prev || userName);
          }
        } else {
          // For guests, no backend profile; keep any locally stored values
          if (userName) setCustomerName(prev => prev || userName);
        }
      } catch (error) {
        console.error('Error loading contact info:', error);
      }
    };
    loadContactInfo();
  }, [isAuthenticated, userName]);

  const handlePayment = async () => {
    // Process payment directly with phone number from the form
    await processPayment();
  };

  const validateContactInfo = () => {
    if (!customerName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return false;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return false;
    }

    // Phone number validation (basic)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return false;
    }

    return true;
  };

  const processPayment = async () => {
    if (!validateContactInfo()) {
      return;
    }

    try {
      setLoading(true);
      
      // Store contact information for future use
      await AsyncStorage.setItem('userPhoneNumber', phoneNumber);
      await AsyncStorage.setItem('customerName', customerName);
      
      console.log("Processing payment with phone number:", phoneNumber);
      console.log("pickUpTime", pickUpTime);

      if (isGuest) {
        console.log("Creating guest reservation");
        // Create guest reservation
        const guestReservationData = {
          storeId: storeId.toString(),
          storeName: storeTitle.toString(),
          storeImage: storeImage?.toString() || '',
          storeAddress: storeAddress?.toString() || '',
          storeLatitude: Number(storeLatitude) || 0,
          storeLongitude: Number(storeLongitude) || 0,
          quantity,
          totalAmount: subtotal,
          originalPrice: originalPriceValue,
          discountedPrice: actualPrice,
          pickupTime: pickUpTime.toString(),
          name: customerName,
          phone: phoneNumber, 
          email: undefined, // No email for guests
          paymentType: selectedPaymentMethod,
        };

        await reservationService.createGuestReservation(guestReservationData);
        
        Alert.alert(
          'Đặt hàng thành công!',
          'Đơn hàng của bạn đã được đặt thành công. Vui lòng thanh toán tại cửa hàng khi nhận hàng.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      } else {
        console.log("Creating authenticated reservation");
        // Persist latest contact info to backend profile so user isn't re-prompted
        try {
          await userService.updateUserProfile({
            name: customerName || undefined,
            phone: phoneNumber || undefined,
            email: userEmail || undefined,
          });
        } catch (e) {
          console.warn('Failed to update user profile before reservation:', e);
        }
        // NEW WAY: For authenticated users, create reservation directly
        const authenticatedReservationData = {
          storeId: storeId.toString(),
          storeName: storeTitle.toString(),
          storeImage: storeImage?.toString() || '',
          storeAddress: storeAddress?.toString() || '',
          storeLatitude: Number(storeLatitude) || 0,
          storeLongitude: Number(storeLongitude) || 0,
          quantity,
          totalAmount: subtotal,
          originalPrice: originalPriceValue,
          discountedPrice: actualPrice,
          pickupTime: pickUpTime.toString(),
          name: customerName,
          phone: phoneNumber,
          email: userEmail || undefined,
          paymentType: selectedPaymentMethod,
        };

        await reservationService.createAuthenticatedReservation(authenticatedReservationData);
        
        Alert.alert(
          'Đặt hàng thành công!',
          'Đơn hàng của bạn đã được đặt thành công. Vui lòng thanh toán tại cửa hàng khi nhận hàng.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );

        // OLD WAY: Firebase-only payment service (commented out - doesn't work with email login)
        /*
        const { clientSecret, paymentIntentId } = await paymentService.createPaymentIntent(
          storeId.toString(),
          quantity,
          subtotal,
          selectedPaymentMethod,
          pickUpTime.toString()
        );

        const { error } = await paymentService.confirmPayAtStore(paymentIntentId);
        if (error) {
          Alert.alert('Lỗi', 'Không thể xác nhận đơn hàng');
          return;
        }

        Alert.alert(
          'Xác nhận đơn hàng',
          'Đơn hàng đã được đặt thành công. Vui lòng thanh toán tại cửa hàng khi nhận hàng.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
        */
      }
      
    } catch (error: any) {
      console.error('Payment error:', error);
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra trong quá trình đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const selectPaymentMethod = (method: React.SetStateAction<string>) => {
    setSelectedPaymentMethod(method);
    closeModal();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{storeTitle}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Pickup Information */}
        <View style={styles.pickupContainer}>
          <Text style={styles.pickupBadge}>Nhận hàng hôm nay</Text>
          <Text style={styles.pickupTime}>{pickUpTime}</Text>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.sectionTitle}>PHƯƠNG THỨC THANH TOÁN</Text>
          <View style={styles.paymentMethod}>
            <Text style={styles.paymentEmoji}>💵</Text>
            <Text style={styles.paymentText}>Trả tiền tại cửa hàng</Text>
            <TouchableOpacity style={styles.editButton} onPress={openModal}>
              <Text style={styles.editText}>Sửa</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummaryContainer}>
          <Text style={styles.sectionTitle}>CHI TIẾT ĐƠN HÀNG</Text>
          {originalPriceValue > actualPrice && (
            <View style={styles.orderRow}>
              <Text style={styles.orderText}>Giá gốc</Text>
              <Text style={[styles.orderText, styles.strikethrough]}>{formatVND(originalPriceValue * quantity)}</Text>
            </View>
          )}
          <View style={styles.orderRow}>
            <Text style={styles.orderText}>
              {originalPriceValue > actualPrice ? 'Giá khuyến mãi' : 'Tạm tính'}
            </Text>
            <Text style={[styles.orderText, originalPriceValue > actualPrice && styles.discountPrice]}>
              {formatVND(subtotal)}
            </Text>
          </View>
          {originalPriceValue > actualPrice && (
            <View style={styles.orderRow}>
              <Text style={styles.savingsText}>
                Bạn tiết kiệm được {formatVND((originalPriceValue - actualPrice) * quantity)}!
              </Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.orderRow}>
            <Text style={styles.orderTotalText}>Tổng cộng</Text>
            <Text style={styles.orderTotalText}>{formatVND(subtotal)}</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>THÔNG TIN LIÊN HỆ</Text>
          <View style={styles.nameInputContainer}>
            <Text style={styles.inputLabel}>Họ tên *</Text>
            <TextInput
              style={styles.contactInput}
              placeholder="Nhập họ tên của bạn"
              value={customerName}
              onChangeText={setCustomerName}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>
          <View style={styles.phoneInputContainer}>
            <Text style={styles.inputLabel}>Số điện thoại *</Text>
            <TextInput
              style={styles.contactInput}
              placeholder="Nhập số điện thoại để nhận hàng"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>
        </View>

        {/* Terms and Conditions */}
        <Text style={styles.termsText}>
          Bằng việc đặt món này, bạn đồng ý với{' '}
          <Text style={styles.linkText}>Điều khoản và Điều kiện</Text>.
        </Text>

        {/* Quantity and Payment Button */}
        <View style={styles.actionsContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.min(Number(itemsLeft), quantity + 1))}
            >
              <Text style={styles.quantityText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.payButton} 
            onPress={handlePayment}
            disabled={loading}
          >
            <Text style={styles.payButtonText}>
              {loading ? 'Đang xử lý...' : 'Thanh toán'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


      {/* Payment Method Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>

            {/* Payment Methods */}
            {/* Commented out other payment methods - only Pay at Store is available */}
            {/* 
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => selectPaymentMethod('Payment Card')}
            >
              <Text style={styles.paymentOptionText}>💳 Thẻ thanh toán</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => selectPaymentMethod('Apple Pay')}
            >
              <Text style={styles.paymentOptionText}> Apple Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => selectPaymentMethod('PayPal')}
            >
              <Text style={styles.paymentOptionText}>💸 PayPal</Text>
            </TouchableOpacity>
            */}
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => selectPaymentMethod('Pay at Store')}
            >
              <Text style={styles.paymentOptionText}>💵 Trả tiền tại cửa hàng</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60, // Safe area padding for status bar
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40, // Balance the back button
  },
  content: {
    padding: 16,
  },
  pickupContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  pickupBadge: {
    backgroundColor: Colors.light.primary,
    color: Colors.light.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  pickupTime: {
    fontSize: 14,
    color: '#666',
  },
  paymentMethodContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
  },
  paymentLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  paymentEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  paymentText: {
    fontSize: 14,
    flex: 1,
    color: '#333',
  },
  editButton: {
    padding: 4,
  },
  editText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  paymentOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
  },
  orderSummaryContainer: {
    marginBottom: 16,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderText: {
    fontSize: 14,
    color: '#666',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  discountPrice: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  savingsText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  orderTotalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  linkText: {
    color: '#036B52',
    textDecorationLine: 'underline',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  quantityText: {
    fontSize: 18,
    color: '#333',
  },
  quantityValue: {
    fontSize: 16,
    paddingHorizontal: 16,
  },
  payButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonText: {
    color: Colors.light.accent,
    fontSize: 18,
    fontWeight: '700',
  },
  // Contact section styles
  contactContainer: {
    marginBottom: 16,
  },
  nameInputContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  phoneInputContainer: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  contactInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
});

export default PaymentScreen;
