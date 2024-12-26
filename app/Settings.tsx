import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { myStoreService, StoreInfo } from '../services/myStore';

const Settings = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Store');
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      const info = await myStoreService.getStoreInfo();
      setStoreInfo(info);
      setLoading(false);
    };

    fetchStoreInfo();
  }, []);

  const renderStoreInformation = () => (
    <View style={styles.storeInfoContainer}>
      <Text style={styles.sectionTitle}>Store information</Text>
      <Text style={styles.description}>
        Here you can see the information we have registered about your store. 
        If any of this information is incorrect and needs to be changed, 
        please get in touch with us.
      </Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#036B52" />
      ) : storeInfo ? (
        <>
          <Text style={styles.subSectionTitle}>Store details</Text>
          
          <View style={styles.detailItem}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{storeInfo.name}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{storeInfo.address}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.label}>Zip code</Text>
            <Text style={styles.value}>{storeInfo.zip_code}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.label}>City</Text>
            <Text style={styles.value}>{storeInfo.city}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.label}>State</Text>
            <Text style={styles.value}>{storeInfo.state}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.errorText}>Failed to load store information</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="menu" size={24} color="#000" />
          <Text style={styles.menuText}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Settings</Text>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Store' && styles.activeTab]}
          onPress={() => setActiveTab('Store')}
        >
          <Text style={[styles.tabText, activeTab === 'Store' && styles.activeTabText]}>
            Store
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Notifications' && styles.activeTab]}
          onPress={() => setActiveTab('Notifications')}
        >
          <Text style={[styles.tabText, activeTab === 'Notifications' && styles.activeTabText]}>
            Notifications
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Account' && styles.activeTab]}
          onPress={() => setActiveTab('Account')}
        >
          <Text style={[styles.tabText, activeTab === 'Account' && styles.activeTabText]}>
            Account
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'Store' && renderStoreInformation()}
        {/* Add other tab content as needed */}
      </ScrollView>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#036B52',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#036B52',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  storeInfoContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  subSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  detailItem: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default Settings; 