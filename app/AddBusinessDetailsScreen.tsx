import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

const AddBusinessDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Form state
  const [businessName, setBusinessName] = useState(params.storeName || '');
  
  // Store type dropdown state
  const [storeTypeOpen, setStoreTypeOpen] = useState(false);
  const [storeType, setStoreType] = useState(null);
  const [storeTypes] = useState([
    { label: 'Buffet restaurant', value: 'buffet' },
    { label: 'Café', value: 'cafe' },
    { label: 'Bakery', value: 'bakery' },
    { label: 'Grocery store', value: 'grocery' },
    // Add more store types as needed
  ]);

  // Country dropdown state
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState('US');
  const [countries] = useState([
    { label: 'United States', value: 'US' },
    // Add more countries as needed
  ]);

  // Address state
  const [street, setStreet] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

  const handleContinue = () => {
    // Add validation and API call here
    router.push('/ReviewBusinessDetailsScreen');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign up your store</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Add your business details</Text>
        <Text style={styles.subtitle}>Please provide your business details below.</Text>

        {/* Business Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business details</Text>
          
          <Text style={styles.label}>Business name</Text>
          <TextInput
            style={styles.input}
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Enter business name"
          />

          <Text style={styles.label}>Store type</Text>
          <DropDownPicker
            open={storeTypeOpen}
            value={storeType}
            items={storeTypes}
            setOpen={setStoreTypeOpen}
            setValue={setStoreType}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          <Text style={styles.sectionTitle}>Business address</Text>
          
          <Text style={styles.label}>Street name and number</Text>
          <TextInput
            style={styles.input}
            value={street}
            onChangeText={setStreet}
            placeholder="Enter street address"
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Zip code</Text>
              <TextInput
                style={styles.input}
                value={zipCode}
                onChangeText={setZipCode}
                placeholder="Enter zip code"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Enter city"
              />
            </View>
          </View>

          <Text style={styles.label}>Country</Text>
          <DropDownPicker
            open={countryOpen}
            value={country}
            items={countries}
            setOpen={setCountryOpen}
            setValue={setCountry}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          <Text style={styles.sectionTitle}>Contact details</Text>
          
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  dropdown: {
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 16,
  },
  dropdownContainer: {
    borderColor: '#E0E0E0',
  },
  continueButton: {
    backgroundColor: '#036B52',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddBusinessDetailsScreen; 