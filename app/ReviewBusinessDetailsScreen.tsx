import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { myStoreService } from '../services/myStore';

const ReviewBusinessDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const businessDetails = {
    businessName: params.businessName as string,
    storeType: params.storeType as string,
    street: params.street as string,
    city: params.city as string,
    state: params.state as string,
    zipCode: params.zipCode as string,
    country: params.country as string,
    phone: params.phone as string,
    latitude: parseFloat(params.latitude as string),
    longitude: parseFloat(params.longitude as string),
    backgroundUrl: params.backgroundUrl as string,
    imageUrl: params.imageUrl as string,
  };

  const handleEdit = () => {
    router.back(); // Go back to AddBusinessDetailsScreen
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      await myStoreService.createStore(businessDetails);
      router.replace('/(tabs)/MyStore');
    } catch (error) {
      console.error('Error creating store:', error);
      Alert.alert(
        'Error',
        'Failed to create store. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
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
              latitude: businessDetails.latitude,
              longitude: businessDetails.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: businessDetails.latitude,
                longitude: businessDetails.longitude,
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
            <Text style={styles.businessName}>{businessDetails.businessName}</Text>
            <Text style={styles.businessType}>{businessDetails.storeType}</Text>
          </View>

          <Text style={styles.address}>
            {`${businessDetails.street}, ${businessDetails.city}, ${businessDetails.state} ${businessDetails.zipCode}, ${businessDetails.country}`}
          </Text>
          
          <Text style={styles.phone}>{businessDetails.phone}</Text>
        </View>

        <View style={styles.imagesContainer}>
          <Text style={styles.sectionTitle}>Store Images</Text>
          <Image 
            source={{ uri: params.backgroundUrl as string }} 
            style={styles.previewImage}
            resizeMode="cover"
          />
          <Image 
            source={{ uri: params.imageUrl as string }} 
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton,
            isLoading && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
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
  continueButtonDisabled: {
    backgroundColor: '#CCC',
  },
  imagesContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default ReviewBusinessDetailsScreen;