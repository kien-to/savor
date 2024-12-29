import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { paymentService } from '../services/payment';
import { useRouter, useLocalSearchParams } from 'expo-router';

const PaymentScreen = () => {
  const stripe = useStripe();
  const router = useRouter();
  const { 
    storeId, 
    storeTitle, 
    price, 
    pickUpTime, 
    itemsLeft 
  } = useLocalSearchParams();
  
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Payment Card');
  const [loading, setLoading] = useState(false);

  const subtotal = Number(price) * quantity;

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'Payment Card') {
      router.push({
        pathname: '/CreditCardScreen',
        params: { totalAmount: subtotal }
      });
      return;
    }

    try {
      setLoading(true);
      // console.log("storeId", storeId);
      console.log("pickUpTime", pickUpTime);
      // Create payment intent for all payment methods including Pay at Store
      const { clientSecret, paymentIntentId } = await paymentService.createPaymentIntent(
        storeId.toString(),
        quantity,
        subtotal,
        selectedPaymentMethod,
        pickUpTime.toString()
      );

      if (selectedPaymentMethod === 'Pay at Store') {
        // Use confirmPayAtStore instead of confirmPayment for Pay at Store
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
        return;
      }

      // Handle other payment methods
      if (selectedPaymentMethod === 'Apple Pay') {
        const { error: paymentError } = await stripe.handleNextAction(clientSecret);
        if (paymentError) {
          console.log(paymentError);
          Alert.alert('Lỗi', 'Không thể xử lý thanh toán');
          return;
        }
      } else {
        // Handle card payment
        const { error } = await stripe.confirmPayment(clientSecret, {
          paymentMethodType: 'Card',
        });
        
        if (error) {
          Alert.alert('Lỗi', error.message);
          return;
        }
      }

      // Payment successful
      Alert.alert('Thành công', 'Đặt hàng thành công!');
      router.replace('/(tabs)');
      
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra trong quá trình thanh toán');
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{storeTitle}</Text>
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
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Apple_Pay_logo.svg' }}
              style={styles.paymentLogo}
            />
            <Text style={styles.paymentText}>{selectedPaymentMethod}</Text>
            <TouchableOpacity style={styles.editButton} onPress={openModal}>
              <Text style={styles.editText}>Sửa</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummaryContainer}>
          <Text style={styles.sectionTitle}>CHI TIẾT ĐƠN HÀNG</Text>
          <View style={styles.orderRow}>
            <Text style={styles.orderText}>Tạm tính</Text>
            <Text style={styles.orderText}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderText}>Thuế</Text>
            <Text style={styles.orderText}>$0.00</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderTotalText}>Tổng cộng</Text>
            <Text style={styles.orderTotalText}>${subtotal.toFixed(2)}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: 70,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: '#036B52',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  pickupContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  pickupBadge: {
    backgroundColor: '#036B52',
    color: '#FFF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    fontSize: 12,
    marginBottom: 4,
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
  paymentText: {
    fontSize: 14,
    flex: 1,
    color: '#333',
  },
  editButton: {
    padding: 4,
  },
  editText: {
    color: '#036B52',
    fontSize: 14,
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
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },  
});

export default PaymentScreen;
