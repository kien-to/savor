import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GuestSetupScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return;
    }
    
    if (!phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    // Phone number validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      
      // Store guest information
      await AsyncStorage.setItem('guestName', name);
      await AsyncStorage.setItem('customerName', name);
      await AsyncStorage.setItem('userPhoneNumber', phone);
      await AsyncStorage.setItem('guestSetupCompleted', 'true');
      
      Alert.alert(
        'Thiết lập hoàn tất!',
        'Thông tin của bạn đã được lưu. Bạn có thể bắt đầu đặt hàng ngay.',
        [
          {
            text: 'OK',
            onPress: () => router.back() // Go back to payment screen
          }
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thiết lập tài khoản khách</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>
              Chào mừng đến với Savor!
            </Text>
            
            <Text style={styles.subtitle}>
              Để có thể đặt hàng, chúng tôi cần một số thông tin cơ bản từ bạn
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Họ tên *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập họ tên của bạn"
                placeholderTextColor={Colors.light.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Số điện thoại *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                placeholderTextColor={Colors.light.textSecondary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSetup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Đang xử lý...' : 'Hoàn tất thiết lập'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.noteText}>
              Thông tin này sẽ được lưu trên thiết bị của bạn để thuận tiện cho các lần đặt hàng sau.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40, // Same width as back button to center the title
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: Colors.light.textSecondary,
  },
  buttonText: {
    color: Colors.light.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  noteText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});

export default GuestSetupScreen;

