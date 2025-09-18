import React, { useState } from 'react';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const DrawerMenu = () => (
    <>
      {isDrawerOpen && (
        <TouchableOpacity 
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setIsDrawerOpen(false)}
        />
      )}
      <View style={[
        styles.drawer,
        isDrawerOpen ? styles.drawerOpen : styles.drawerClosed
      ]}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Store Profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileInitial}>
            <Text style={styles.initialText}>S</Text>
          </View>
          <Text style={styles.profileName}>Savor</Text>
          <TouchableOpacity style={styles.menuOptions}>
            <MaterialIcons name="more-vert" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Store Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>STORE</Text>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="dashboard" size={24} color="#000" />
            <Text style={styles.menuItemText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="insert-chart" size={24} color="#000" />
            <Text style={styles.menuItemText}>Performance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#000" />
            <Text style={styles.menuItemText}>Financials</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="card-giftcard" size={24} color="#000" />
            <Text style={styles.menuItemText}>Milestones</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              setIsDrawerOpen(false);
              router.push('/Settings');
            }}
          >
            <MaterialIcons name="settings" size={24} color="#036B52" />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="help" size={24} color="#000" />
            <Text style={styles.menuItemText}>Help center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="card-giftcard" size={24} color="#000" />
            <Text style={styles.menuItemText}>Earn 120USD</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const handleStartSelling = () => {
    router.push('/SelectSurplusFoodScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Add Drawer Menu */}
      <DrawerMenu />
      
      {/* Modify menu button to toggle drawer */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setIsDrawerOpen(!isDrawerOpen)}
        >
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
              source={require('../../assets/images/icon.png')}
              style={styles.bagImage}
              resizeMode="cover"
            />
            <Text style={styles.bagType}>Baked goods</Text>
            <Text style={styles.bagCount}>3 Surprise Bags per day</Text>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStartSelling}
            >
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
  drawer: {
    position: 'absolute',
    left: '-80%',
    top: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    width: '80%',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  drawerOpen: {
    left: 0,
  },
  drawerClosed: {
    left: '-80%',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  logoSection: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  logo: {
    width: 120,
    height: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileInitial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#036B52',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  menuSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
  },
  menuOptions: {
    padding: 8,
  },
});

export default MyStore; 