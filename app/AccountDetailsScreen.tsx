import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import { userService } from '../services/user';

interface AccountDetailItem {
  label: string;
  value: string;
  optional?: boolean;
}

const AccountDetailsScreen = () => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await userService.getUserProfile();
        setName(profile.name || name);
        setEmail(profile.email || email);
        setPhone(profile.phone || phone);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await userService.updateUserProfile({ name, phone, email });
      
      // Save to AsyncStorage for use in PaymentScreen
      if (name) {
        await AsyncStorage.setItem('customerName', name);
      }
      if (phone) {
        await AsyncStorage.setItem('userPhoneNumber', phone);
      }
      
      router.back();
    } catch (e: any) {
      console.error('Save profile error:', e);
      alert(e?.message || 'Không thể lưu thông tin');
    } finally {
      setSaving(false);
    }
  };

  const locations = [
    { label: 'Địa chỉ nhà', value: 'Chưa cài đặt' },
  ];

  const renderDetailItem = (item: AccountDetailItem) => (
    <TouchableOpacity key={item.label} style={styles.detailItem}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{item.label}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {item.optional && !item.value ? '(tùy chọn)' : item.value}
        </Text>
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết tài khoản</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Họ tên</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập họ tên"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!saving}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.inputDisabled}
          value={email}
          editable={false}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={!saving}
        />
      </View>

      <TouchableOpacity style={[styles.saveButton, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveText}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  formGroup: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    fontSize: 16,
    color: '#333',
  },
  inputDisabled: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#425e57',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
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
  rowLabel: {
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