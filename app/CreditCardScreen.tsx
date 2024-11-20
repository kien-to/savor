import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

const CreditCardScreen = ({ route, navigation }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [saveForFuture, setSaveForFuture] = useState(false);

  const { totalAmount } = route.params; // Passed from the Payment Screen

  const handlePayment = () => {
    alert('Payment Successful!');
    navigation.goBack(); // Navigate back to the payment screen
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Payment card</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Card Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Card number</Text>
          <TextInput
            style={styles.input}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
            maxLength={19} // Format as XXXX XXXX XXXX XXXX
          />
        </View>

        {/* Expiry Date and Security Code */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.rowItem]}>
            <Text style={styles.inputLabel}>Expiry date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              keyboardType="numeric"
              value={expiryDate}
              onChangeText={setExpiryDate}
              maxLength={5} // Format as MM/YY
            />
          </View>
          <View style={[styles.inputContainer, styles.rowItem]}>
            <Text style={styles.inputLabel}>Security code</Text>
            <TextInput
              style={styles.input}
              placeholder="3 digits"
              keyboardType="numeric"
              value={securityCode}
              onChangeText={setSecurityCode}
              maxLength={3}
            />
          </View>
        </View>

        {/* Save for Future Reservations */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Save for future reservations</Text>
          <Switch
            value={saveForFuture}
            onValueChange={setSaveForFuture}
            thumbColor={saveForFuture ? '#036B52' : '#E0E0E0'}
            trackColor={{ true: '#A1DACD', false: '#E0E0E0' }}
          />
        </View>

        {/* Postal Code */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Postal code</Text>
          <TextInput
            style={styles.input}
            placeholder="Postal code"
            keyboardType="default"
            value={postalCode}
            onChangeText={setPostalCode}
          />
        </View>

        {/* Pay Button */}
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay ${totalAmount.toFixed(2)}</Text>
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
});

export default CreditCardScreen;
