import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import app from '../../config/firebase';
import { authService } from '../../services/auth';
import PhoneVerification from '../../components/PhoneVerification';
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// import { useRef } from 'react';

export default function PhoneLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);
//   const recaptchaVerifier = useRef(null);

  const isValidPhoneNumber = (number: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(number);
  };

  const sendVerificationCode = async () => {
    try {
      if (!isValidPhoneNumber(phoneNumber)) {
        Alert.alert('Invalid Phone Number', 'Please enter a valid phone number with country code (e.g., +1234567890)');
        return;
      }
      setLoading(true);
      const provider = new PhoneAuthProvider(auth);
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const verificationId = await provider.verifyPhoneNumber(
        formattedNumber,
        undefined
        // recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      Alert.alert('Code sent!', 'Please enter the verification code.');
    } catch (error: any) {
      console.error('Phone auth error:', error);
      Alert.alert('Error', 'Failed to send verification code. Please check your phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      setLoading(true);
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const userCredential = await signInWithCredential(auth, credential);
      const idToken = await userCredential.user.getIdToken();
      
      await authService.socialLogin({
        provider: 'phone',
        id_token: idToken
      });
      
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message);
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

      <Text style={styles.header}>Phone Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Phone number (e.g., +1234567890)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={sendVerificationCode}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'Send Code'}
        </Text>
      </TouchableOpacity>

      {verificationId && (
        <>
          <Text style={styles.verificationText}>
            Enter the 6-digit code sent to your phone
          </Text>
          
          <PhoneVerification
            code={code}
            setCode={setCode}
            maxLength={6}
          />
          
          <TouchableOpacity
            style={styles.button}
            onPress={verifyCode}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#036B52',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  verificationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 70,
    marginBottom: 32,
  },
}); 