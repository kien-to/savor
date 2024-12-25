import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const ReviewBusinessDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const businessDetails = {
    name: params.businessName || 'Savor',
    type: params.storeType || 'Sushi restaurant',
    address: params.street || '950 N Pleasant St',
    city: params.city || 'Amherst',
    state: params.state || 'MA',
    zipCode: params.zipCode || '01002',
    country: params.country || 'USA',
    phone: params.phone || '+1 4132104239',
    location: {
      latitude: parseFloat(params.latitude as string) || 42.3867,
      longitude: parseFloat(params.longitude as string) || -72.5301,
    },
  };

  const handleEdit = () => {
    router.back(); // Go back to AddBusinessDetailsScreen
  };

  const handleContinue = () => {
    // Navigate to seller's home screen instead of SuccessScreen
    router.replace('/(tabs)/MyStore');
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

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Review your store details</Text>

        {/* Map View */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: businessDetails.location.latitude,
              longitude: businessDetails.location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: businessDetails.location.latitude,
                longitude: businessDetails.location.longitude,
              }}
            />
          </MapView>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEdit}
          >
            <MaterialIcons name="edit" size={20} color="#FFF" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Business Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.businessHeader}>
            <Text style={styles.businessName}>{businessDetails.name}</Text>
            <Text style={styles.businessType}>{businessDetails.type}</Text>
          </View>

          <Text style={styles.address}>
            {`${businessDetails.address}, ${businessDetails.city}, ${businessDetails.state} ${businessDetails.zipCode}, ${businessDetails.country}`}
          </Text>
          
          <Text style={styles.phone}>{businessDetails.phone}</Text>
        </View>

        {/* Continue Button */}
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
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginHorizontal: 16,
    marginVertical: 24,
  },
  mapContainer: {
    height: 250,
    marginBottom: 24,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  editButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#036B52',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  businessHeader: {
    marginBottom: 16,
  },
  businessName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  businessType: {
    fontSize: 16,
    color: '#666',
  },
  address: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  phone: {
    fontSize: 16,
    color: '#666',
  },
  continueButton: {
    backgroundColor: '#036B52',
    marginHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewBusinessDetailsScreen;