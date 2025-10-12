import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useStoreOwner } from '../context/StoreOwnerContext';

const SettingsScreen = () => {
  const router = useRouter();
  const auth = getAuth();
  const { logout } = useAuth();
  const { isStoreOwnerMode, toggleStoreOwnerMode, hasStore } = useStoreOwner();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/LoginScreen');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleContact = () => {
    router.push('/ContactScreen');
  };

  const handleStoreOwnerMode = () => {
    router.push('/StoreOwnerScreen');
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
        <Text style={styles.headerTitle}>Quản lý tài khoản</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CÀI ĐẶT</Text>
        {renderSettingsItem(
          <MaterialIcons name="person-outline" size={24} color="#000" />,
          'Chi tiết tài khoản',
          () => {
            router.push('/AccountDetailsScreen');
          }
        )}
        {renderSettingsItem(
          <MaterialCommunityIcons name="store-cog" size={24} color="#000" />,
          'Chế độ chủ cửa hàng',
          handleStoreOwnerMode
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CỘNG ĐỒNG</Text>
        {renderSettingsItem(
          <MaterialCommunityIcons name="store-plus" size={24} color="#000" />,
          'Đăng ký cửa hàng',
          () => {
            router.push('/SignUpStoreScreen');
          }
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HỖ TRỢ</Text>
        {renderSettingsItem(
          <MaterialIcons name="phone" size={24} color="#000" />,
          'Liên hệ',
          handleContact
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
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