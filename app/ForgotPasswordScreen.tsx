import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    if (!isEmailValid(email)) {
      Alert.alert('Email không hợp lệ', 'Vui lòng nhập email hợp lệ');
      return;
    }

    try {
      setLoading(true);
      await authService.forgotPassword({ email });
      Alert.alert(
        'Email đã gửi',
        'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Quên mật khẩu</Text>
      
      <Text style={styles.description}>
        Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />

      <TouchableOpacity
        style={[
          styles.button, 
          loading || !isEmailValid(email) ? styles.buttonInactive : styles.buttonActive
        ]}
        disabled={loading || !isEmailValid(email)}
        onPress={handleForgotPassword}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 70,
    backgroundColor: '#FFF',
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 16,
    zIndex: 1,
    padding: 2,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#F8F8F8',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonActive: {
    backgroundColor: '#036B52',
  },
  buttonInactive: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
}); 