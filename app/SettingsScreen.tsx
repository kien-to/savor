import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';

const SettingsScreen = () => {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderSettingsItem = (
    icon: React.ReactNode,
    title: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        {icon}
        <Text style={styles.settingsItemText}>{title}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage account</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SETTINGS</Text>
        {renderSettingsItem(
          <MaterialIcons name="person-outline" size={24} color="#000" />,
          'Account details',
          () => {
            router.push('/AccountDetailsScreen');
          }
        )}
        {/* {renderSettingsItem(
          <MaterialIcons name="credit-card" size={24} color="#000" />,
          'Payment cards',
          () => {}
        )} */}
        {/* {renderSettingsItem(
          <MaterialIcons name="local-offer" size={24} color="#000" />,
          'Vouchers',
          () => {}
        )} */}
        {renderSettingsItem(
          <MaterialIcons name="notifications-none" size={24} color="#000" />,
          'Notifications',
          () => {}
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>COMMUNITY</Text>
        {renderSettingsItem(
          <MaterialIcons name="store" size={24} color="#000" />,
          'Recommend a store',
          () => {}
        )}
        {renderSettingsItem(
          <MaterialCommunityIcons name="store-plus" size={24} color="#000" />,
          'Sign up your store',
          () => {
            router.push('/SignUpStoreScreen');
          }
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUPPORT</Text>
        {/* {renderSettingsItem(
          <MaterialIcons name="shopping-bag" size={24} color="#000" />,
          'Help with an order',
          () => {}
        )} */}
        {renderSettingsItem(
          <MaterialIcons name="help-outline" size={24} color="#000" />,
          'FAQs',
          () => {}
        )}
        {/* {renderSettingsItem(
          <MaterialIcons name="group" size={24} color="#000" />,
          'Join Too Good To Go',
          () => {}
        )} */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OTHER</Text>
        {/* {renderSettingsItem(
          <MaterialIcons name="visibility-off" size={24} color="#000" />,
          'Hidden stores',
          () => {}
        )} */}
        {/* {renderSettingsItem(
          <MaterialIcons name="gavel" size={24} color="#000" />,
          'Legal',
          () => {}
        )} */}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
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
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4444',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SettingsScreen; 