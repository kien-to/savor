import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';

const PaymentScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Apple Pay');

  const price = 5.99; // Price per item
  const subtotal = price * quantity;

  const handlePayment = () => {
    alert('Payment Successful!');
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const selectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    closeModal();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theo Chocolate</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Pickup Information */}
        <View style={styles.pickupContainer}>
          <Text style={styles.pickupBadge}>Pick up today</Text>
          <Text style={styles.pickupTime}>1:45 PM - 8:40 PM</Text>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
          <View style={styles.paymentMethod}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Apple_Pay_logo.svg' }} // Apple Pay logo
              style={styles.paymentLogo}
            />
            <Text style={styles.paymentText}>{selectedPaymentMethod}</Text>
            <TouchableOpacity style={styles.editButton} onPress={openModal}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummaryContainer}>
          <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
          <View style={styles.orderRow}>
            <Text style={styles.orderText}>Subtotal</Text>
            <Text style={styles.orderText}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderText}>Sales taxes</Text>
            <Text style={styles.orderText}>$0.00</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderTotalText}>Total</Text>
            <Text style={styles.orderTotalText}>${subtotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Terms and Conditions */}
        <Text style={styles.termsText}>
          By reserving this meal you agree to Too Good To Go's{' '}
          <Text style={styles.linkText}>Terms and Conditions</Text>.
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
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.quantityText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>{selectedPaymentMethod}</Text>
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
            <Text style={styles.modalTitle}>Select a payment method</Text>

            {/* Payment Methods */}
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => selectPaymentMethod('Payment Card')}
            >
              <Text style={styles.paymentOptionText}>💳 Payment card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => selectPaymentMethod('Apple Pay')}
            >
              <Text style={styles.paymentOptionText}> Apple Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => selectPaymentMethod('PayPal')}
            >
              <Text style={styles.paymentOptionText}>💸 PayPal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => selectPaymentMethod('Cash App Pay')}
            >
              <Text style={styles.paymentOptionText}>💵 Cash App Pay</Text>
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
    paddingVertical: 70,
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
