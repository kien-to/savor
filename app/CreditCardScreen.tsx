import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CardField, useStripe, CardFieldInput } from '@stripe/stripe-react-native';
import { paymentService } from '../services/payment';

const CreditCardScreen = () => {
  const router = useRouter();
  const { totalAmount, storeId } = useLocalSearchParams();
  const { createPaymentMethod, confirmPayment } = useStripe();
  const [saveForFuture, setSaveForFuture] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handlePayment = async () => {
    if (!cardComplete) {
      Alert.alert('Error', 'Please complete card information');
      return;
    }

    try {
      setLoading(true);

      // 1. Create payment method from card
      const { paymentMethod, error: paymentMethodError } = await createPaymentMethod({
        paymentMethodType: 'Card',
      });

      if (paymentMethodError) {
        Alert.alert('Error', paymentMethodError.message);
        return;
      }

      // 2. Create payment intent
      const { clientSecret } = await paymentService.createPaymentIntent(
        storeId?.toString() || '',
        1,
        Number(totalAmount),
        'Payment Card'
      );

      // 3. Confirm payment with payment method
      const { error: confirmError } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (confirmError) {
        Alert.alert('Error', confirmError.message);
        return;
      }

      Alert.alert('Success', 'Payment completed successfully!');
      router.replace('/(tabs)');

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Thẻ thanh toán</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelButton}>Hủy</Text>
          </TouchableOpacity>
        </View>

        <CardField
          postalCodeEnabled={true}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={styles.cardField}
          onCardChange={(cardDetails) => {
            setCardComplete(cardDetails.complete);
          }}
        />

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Lưu cho lần sau</Text>
          <Switch
            value={saveForFuture}
            onValueChange={setSaveForFuture}
            thumbColor={saveForFuture ? '#036B52' : '#E0E0E0'}
            trackColor={{ true: '#A1DACD', false: '#E0E0E0' }}
          />
        </View>

        <TouchableOpacity 
          style={[styles.payButton, loading && styles.payButtonDisabled]} 
          onPress={handlePayment}
          disabled={loading || !cardComplete}
        >
          <Text style={styles.payButtonText}>
            {loading ? 'Đang xử lý...' : `Thanh toán $${Number(totalAmount).toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    fontSize: 16,
    color: '#036B52',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    flex: 1,
    marginRight: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#333',
  },
  payButton: {
    backgroundColor: '#036B52',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 16,
  },
  payButtonDisabled: {
    backgroundColor: '#A1DACD',
  },
});

export default CreditCardScreen;
