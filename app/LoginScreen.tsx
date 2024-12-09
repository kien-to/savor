import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      await SecureStore.setItemAsync('authToken', response.token);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Đăng nhập lỗi', error.message === 'Login failed' ? 'Đăng nhập thất bại' : 
                                  error.message === 'Invalid credentials' ? 'Thông tin đăng nhập không hợp lệ' :
                                  'Có lỗi xảy ra, vui lòng thử lại sau');
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

      <Text style={styles.header}>Đăng nhập</Text>
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity
        style={[styles.button, loading ? styles.buttonInactive : styles.buttonActive]}
        disabled={loading}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Đăng nhập...' : 'Đăng nhập'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.forgotPasswordLink}
        onPress={() => router.push('/ForgotPasswordScreen')}
      >
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.signupLink}
        onPress={() => router.push('/EmailScreen')}
      >
        <Text style={styles.signupText}>Không có tài khoản? Đăng ký</Text>
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
    marginBottom: 32,
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
  signupLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  signupText: {
    color: '#036B52',
    fontSize: 16,
  },
  forgotPasswordLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#036B52',
    fontSize: 16,
  },
}); 