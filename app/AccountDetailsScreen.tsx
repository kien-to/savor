import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';

interface AccountDetailItem {
  label: string;
  value: string;
  optional?: boolean;
}

const AccountDetailsScreen = () => {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const personalInfo: AccountDetailItem[] = [
    { label: 'Name', value: user?.displayName || 'Not set' },
    { label: 'Email', value: user?.email || 'Not set' },
    { label: 'Phone number', value: user?.phoneNumber || 'Not set', optional: true },
    { label: 'Country', value: 'United States' },
    { label: 'Gender', value: 'Not set', optional: true },
    { label: 'Dietary preferences', value: 'Not set', optional: true },
    { label: 'Birthday', value: 'Not set' },
  ];

  const locations = [
    { label: 'Home', value: 'Not set' },
    { label: 'Work', value: 'Not set' },
    { label: 'Other', value: 'Not set' },
  ];

  const renderDetailItem = (item: AccountDetailItem) => (
    <TouchableOpacity key={item.label} style={styles.detailItem}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{item.label}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {item.optional && !item.value ? '(optional)' : item.value}
        </Text>
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account details</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal info</Text>
        {personalInfo.map(renderDetailItem)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My locations</Text>
        {locations.map(location => renderDetailItem({
          label: location.label,
          value: location.value
        }))}
      </View>
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  valueContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
    textAlign: 'right',
  },
});

export default AccountDetailsScreen;