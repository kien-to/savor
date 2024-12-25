import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { geocodingService } from '../services/geocoding';

interface PlaceSuggestion {
  description: string;
  place_id: string;
}

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
  const [state, setState] = useState('');

  // Add new state for address suggestions
  const [streetSuggestions, setStreetSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search for street address
  const handleStreetChange = async (text: string) => {
    setStreet(text);
    
    if (text.length > 3) {
      try {
        setIsLoading(true);
        const suggestions = await geocodingService.getPlaceSuggestions(text);
        setStreetSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setStreetSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: PlaceSuggestion) => {
    try {
      setIsLoading(true);
      const details = await geocodingService.getPlaceDetails(suggestion.place_id);
      
      // Update all address fields
      setStreet(details.street);
      setCity(details.city);
      setState(details.state);
      setZipCode(details.zipCode);
      setCountry(details.country);
      
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error getting place details:', error);
      Alert.alert('Error', 'Could not get address details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    try {
      // Get coordinates from address
      const coordinates = await geocodingService.getCoordinates(
        street,
        city,
        state,
        zipCode,
        country
      );

      // Navigate with both address and coordinates
      router.push({
        pathname: '/ReviewBusinessDetailsScreen',
        params: {
          businessName,
          storeType,
          street,
          city,
          state,
          zipCode,
          country,
          phone,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        }
      });
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not verify address location. Please check the address and try again.'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign up your store</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View> */}

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" // Important for suggestions to work
      >
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
          
          <View style={styles.addressContainer}>
            <Text style={styles.label}>Street name and number</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                value={street}
                onChangeText={handleStreetChange}
                placeholder="Enter street address"
              />
              {isLoading && (
                <ActivityIndicator 
                  style={styles.loadingIndicator} 
                  color="#036B52" 
                />
              )}
            </View>

            {showSuggestions && streetSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {streetSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionSelect(suggestion)}
                  >
                    <Text style={styles.suggestionText}>
                      {suggestion.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.row}>
              <View style={styles.thirdWidth}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter city"
                />
              </View>
              <View style={styles.thirdWidth}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  value={state}
                  onChangeText={setState}
                  placeholder="Enter state"
                />
              </View>
              <View style={styles.thirdWidth}>
                <Text style={styles.label}>Zip code</Text>
                <TextInput
                  style={styles.input}
                  value={zipCode}
                  onChangeText={setZipCode}
                  placeholder="Enter zip code"
                  keyboardType="numeric"
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
          </View>

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
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    // marginBottom: 24,
  },
  section: {
    // marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
    // marginBottom: 16,
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
    marginBottom: 4,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  thirdWidth: {
    width: '31%', // Slightly less than 1/3 to account for spacing
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
    // marginTop: 24,
    marginBottom: 32,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addressContainer: {
    position: 'relative',
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  loadingIndicator: {
    position: 'absolute',
    right: 10,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default AddBusinessDetailsScreen; 