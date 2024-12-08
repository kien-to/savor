import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { API_URL } from '../config';

const StoreDetailScreen = () => {
  const { storeId } = useLocalSearchParams();
  const router = useRouter();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/stores/${storeId}`);
        const data = await response.json();
        setStoreData(data);
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#036B52" />;
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.headerContainer}>
      {/* Background Image */}
      <Image
        source={require('../assets/images/icon.png')} // Replace with your actual image path
        style={styles.backgroundImage}
      />

      {/* Top Overlay Section */}
      {/* <View style={styles.overlayContainer}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>⇪</Text> 
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>♡</Text> 
          </TouchableOpacity>
        </View>
      </View> */}

      {/* Store Information */}
      <View style={styles.avaContainer}>
        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>5+ left</Text>
        </View>

        {/* Store Logo */}
        <Image
          source={require('../assets/images/icon.png')} // Replace with your logo path
          style={styles.storeLogo}
        />
      </View>
    </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" // Ensures taps are handled properly
      >
        {/* Store Info */}
        <View style={styles.storeInfoContainer}>
          <Text style={styles.storeTitle}>Theo Chocolate</Text>
          <Text style={styles.storeSubtitle}>Surprise Bag</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>4.6 (952)</Text>
          </View>
          <Text style={styles.pickUpTime}>Pick up: 1:45 PM - 8:40 PM</Text>
          <TouchableOpacity style={styles.todayBadge}>
            <Text style={styles.todayText}>Today</Text>
          </TouchableOpacity>
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>$18.00</Text>
            <Text style={styles.currentPrice}>$5.99</Text>
          </View>
        </View>

        {/* Address */}
        <TouchableOpacity style={styles.addressContainer}>
          <Text style={styles.addressText}>
            3400 Phinney Ave N, Seattle, WA 98103, USA
          </Text>
          <Text style={styles.moreInfoText}>More information about the store</Text>
        </TouchableOpacity>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>What you could get</Text>
          <Text style={styles.description}>
            Rescue a Surprise Bag filled with chocolates. Theo will also offer
            10% off any regular priced purchases you make at the time of pick
            up.
          </Text>
        </View>

        {/* Ingredients & Allergens */}
        <TouchableOpacity style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsText}>Ingredients & allergens</Text>
        </TouchableOpacity>

        {/* Customer Reviews */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.sectionTitle}>What other people are saying</Text>
          <View style={styles.ratingOverallContainer}>
            <Text style={styles.ratingOverall}>4.6 / 5.0</Text>
            <Text style={styles.reviewsNote}>
            Based on 952 ratings 
            {/* over the past 6 months */}
          </Text>
          </View>
          <View style={styles.highlightsContainer}>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightEmoji}>😊</Text>
              <Text style={styles.highlightText}>Friendly staff</Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightEmoji}>⏱</Text>
              <Text style={styles.highlightText}>Quick pickup</Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightEmoji}>💰</Text>
              <Text style={styles.highlightText}>Great value</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.reserveButtonContainer}>
         <TouchableOpacity style={styles.reserveButton} onPress={() => alert('Reservation Confirmed')}>
           <Text style={styles.reserveButtonText}>Reserve</Text>
         </TouchableOpacity>
       </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // Prevents content from being blocked by the Reserve Button
  },
  storeInfoContainer: {
    marginBottom: 16,
  },
  storeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  storeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  pickUpTime: {
    fontSize: 14,
    color: '#666',
  },
  todayBadge: {
    backgroundColor: '#036B52',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  todayText: {
    color: '#FFF',
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#036B52',
  },
  addressContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 16,
  },
  addressText: {
    fontSize: 14,
    color: '#036B52',
    marginBottom: 4,
  },
  moreInfoText: {
    fontSize: 12,
    color: '#666',
  },
  descriptionContainer: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  ingredientsContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 16,
  },
  ingredientsText: {
    fontSize: 14,
    color: '#036B52',
  },
  reviewsContainer: {
    marginVertical: 16,
  },
  ratingOverallContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingOverall: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  highlightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  highlightItem: {
    alignItems: 'center',
  },
  highlightEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 12,
    color: '#666',
  },
  reviewsNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  reserveButtonContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
  },
  reserveButton: {
    backgroundColor: '#036B52',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  reserveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayContainer: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
  },
  backText: {
    color: '#FFF',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
    marginLeft: 8,
  },
  actionIcon: {
    color: '#FFF',
    fontSize: 16,
  },
  avaContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 0,
  },
  badge: {
    backgroundColor: '#FFCC00',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    position: 'absolute',
    top: -25,
    left: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  storeLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFF',
    // marginBottom: ,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
});

export default StoreDetailScreen;
