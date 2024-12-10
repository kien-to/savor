import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';

const ProfileScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add your refresh logic here
      // await fetchProfileData();
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#036B52']}
          tintColor="#036B52"
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://via.placeholder.com/80' }} // Replace with user profile picture URL
            style={styles.avatar}
          />
          <Text style={styles.userName}>Kiên Tô</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text> {/* Replace with settings icon */}
        </TouchableOpacity>
      </View>

      {/* Orders Section */}
      <View style={styles.ordersSection}>
        <Text style={styles.ordersText}>You don’t have any orders yet.</Text>
        <TouchableOpacity style={styles.findButton}>
          <Text style={styles.findButtonText}>Find a Surprise Bag</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>CO2e avoided</Text>
          <Text style={styles.statUnit}>kWh</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Money saved</Text>
          <Text style={styles.statUnit}>USD</Text>
        </View>
      </View>

      {/* Version Info */}
      <Text style={styles.versionText}>Version 24.11.0 (33015)</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 60,
    backgroundColor: '#FFF',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#036B52',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 18,
    color: '#FFF',
  },
  ordersSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 16,
  },
  ordersText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  findButton: {
    backgroundColor: '#036B52',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  findButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#036B52',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 12,
    color: '#666',
  },
  versionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ProfileScreen;
