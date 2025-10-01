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
import { useAuth } from '../context/AuthContext';

const PhoneLoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    try {
      setLoading(true);
      // Here you would implement phone number verification
      // For now, we'll simulate sending a code
      setTimeout(() => {
        setIsCodeSent(true);
        setLoading(false);
        Alert.alert('Thành công', 'Mã xác thực đã được gửi đến số điện thoại của bạn');
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Lỗi', 'Không thể gửi mã xác thực. Vui lòng thử lại.');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã xác thực');
      return;
    }

    try {
      setLoading(true);
      // Here you would verify the code with your backend
      // For now, we'll simulate successful verification
      setTimeout(async () => {
        setLoading(false);
        // Simulate successful login with mock token and userId
        await login('mock-phone-token-' + phoneNumber, 'mock-user-id-' + phoneNumber);
        Alert.alert('Thành công', isSignUp ? 'Đăng ký thành công!' : 'Đăng nhập thành công!', [
          {
            text: 'OK',
            onPress: () => router.replace('/'),
          },
        ]);
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Lỗi', 'Mã xác thực không đúng. Vui lòng thử lại.');
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
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isSignUp ? 'Đăng ký với số điện thoại' : 'Đăng nhập với số điện thoại'}
        </Text>
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
          {isCodeSent 
            ? 'Nhập mã xác thực' 
            : isSignUp 
              ? 'Tạo tài khoản mới' 
              : 'Chào mừng trở lại'
          }
        </Text>
        
        <Text style={styles.subtitle}>
          {isCodeSent 
            ? `Chúng tôi đã gửi mã xác thực đến số ${phoneNumber}`
            : isSignUp
              ? 'Nhập số điện thoại để tạo tài khoản Savor'
              : 'Đăng nhập vào tài khoản Savor của bạn'
          }
        </Text>

        {!isCodeSent ? (
          <>
            <View style={styles.phoneInputContainer}>
              <Text style={styles.countryCode}>+84</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="Nhập số điện thoại"
                placeholderTextColor={Colors.light.textSecondary}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
              </Text>
            </TouchableOpacity>

            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>
                {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
              </Text>
              <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.switchLink}>
                  {isSignUp ? 'Đăng nhập' : 'Đăng ký ngay'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TextInput
              style={styles.codeInput}
              placeholder="Nhập mã 6 chữ số"
              placeholderTextColor={Colors.light.textSecondary}
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              textAlign="center"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Đang xác thực...' : 'Xác thực'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => {
                setIsCodeSent(false);
                setVerificationCode('');
              }}
            >
              <Text style={styles.resendText}>Gửi lại mã</Text>
            </TouchableOpacity>
          </>
        )}
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.cardBackground,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginRight: 12,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.light.border,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 16,
    color: Colors.light.text,
  },
  codeInput: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.text,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: Colors.light.cardBackground,
    letterSpacing: 8,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.light.accent,
    fontSize: 18,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginRight: 5,
  },
  switchLink: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
});

export default PhoneLoginScreen;
