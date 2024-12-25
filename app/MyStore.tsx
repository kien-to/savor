import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const MyStore = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Menu and Notification Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="menu" size={24} color="#000" />
          <Text style={styles.menuText}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Welcome Header */}
        <Text style={styles.welcomeText}>Hi, Savor</Text>

        {/* Surprise Bags Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Surprise Bags</Text>
          <View style={styles.bagContent}>
            <Image
              source={require('../assets/images/icon.png')} // You'll need to add this image
              style={styles.bagImage}
              resizeMode="cover"
            />
            <Text style={styles.bagType}>Baked goods</Text>
            <Text style={styles.bagCount}>3 Surprise Bags per day</Text>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start selling</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How it works Video Section */}
        <View style={styles.videoSection}>
          <View style={styles.videoContainer}>
            <MaterialIcons name="play-circle-fill" size={50} color="#036B52" />
          </View>
          <Text style={styles.videoTitle}>
            HOW DOES{'\n'}TOO GOOD TO GO{'\n'}WORK?
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="store" size={24} color="#036B52" />
          <Text style={styles.navTextActive}>MyStore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="more-horiz" size={24} color="#666" />
          <Text style={styles.navText}>More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 8,
    fontSize: 16,
  },
  notificationButton: {
    position: 'relative',
  },
  content: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 24,
  },
  card: {
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  bagContent: {
    padding: 16,
  },
  bagImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  bagType: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bagCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#036B52',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  videoSection: {
    margin: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#036B52',
    textAlign: 'center',
    lineHeight: 32,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
    backgroundColor: '#FFF',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    color: '#666',
    marginTop: 4,
  },
  navTextActive: {
    color: '#036B52',
    marginTop: 4,
  },
});

export default MyStore; 