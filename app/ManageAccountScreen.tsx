import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

const ManageAccountScreen = ({ navigation }) => {
  // Menu Data
  const menuOptions = [
    { id: '1', label: 'Account details', icon: '👤', screen: 'AccountDetails' },
    { id: '2', label: 'Payment cards', icon: '💳', screen: 'PaymentCards' },
    { id: '3', label: 'Vouchers', icon: '🎟️', screen: 'Vouchers' },
    { id: '4', label: 'Notifications', icon: '🔔', screen: 'Notifications' },
    { id: '5', label: 'Recommend a store', icon: '📷', screen: 'RecommendStore' },
    { id: '6', label: 'Sign up your store', icon: '🏪', screen: 'SignUpStore' },
    { id: '7', label: 'Help with an order', icon: '🛒', screen: 'HelpOrder' },
    { id: '8', label: 'How Too Good To Go works', icon: '❓', screen: 'HowItWorks' },
    { id: '9', label: 'Join Too Good To Go', icon: '👥', screen: 'Join' },
    { id: '10', label: 'Hidden stores', icon: '🙈', screen: 'HiddenStores' },
    { id: '11', label: 'Legal', icon: '⚖️', screen: 'Legal' },
  ];

  const handleLogOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', onPress: () => console.log('Logged Out') },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage account</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Options */}
      <FlatList
        data={menuOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.menuList}
      />

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
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
    borderColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 18,
    color: '#333',
  },
  menuList: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#FFF5F5',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  logoutText: {
    fontSize: 16,
    color: '#D9534F',
    fontWeight: '600',
  },
});

export default ManageAccountScreen;
