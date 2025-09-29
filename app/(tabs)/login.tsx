import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import * as Google from 'expo-auth-session/providers/google';
import { socialAuthService, googleConfig } from "../../services/socialAuth";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../constants/Colors";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [_, response, promptAsync] = Google.useAuthRequest({
    ...googleConfig,
    redirectUri: Platform.select({
      ios: "com.googleusercontent.apps.956015678432-mcgun19fkpv3jk3pu10lbhe40oqgvt7d:/oauth2redirect",
      android: 'com.your.app.bundle.id:/oauth2redirect', // Replace with your app's bundle ID
      default: 'your-scheme://oauth2redirect',
    }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleAuthResponse(response);
    }
  }, [response]);

  const handleGoogleAuthResponse = async (response: any) => {
    try {
      setLoading(true);
      const { idToken } = response.authentication;
      console.log('Google ID Token:', idToken);
      if (!idToken) throw new Error('No ID token found');
      const result = await socialAuthService.handleGoogleLogin(idToken);
      await login(result.token, result.user_id);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
      if (provider === 'google') {
        await promptAsync();
      } else {
        const response = await socialAuthService.handleFacebookLogin();
        await login(response.token, response.user_id);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Chung tay cứu lấy đồ ăn</Text>

      <Image
        source={{ uri: "https://example.com/image.png" }}
        style={styles.image}
      />

      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={() => handleSocialLogin('google')}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Tiếp tục với Google</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={[styles.button, styles.facebookButton]}
        onPress={() => handleSocialLogin('facebook')}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Continue with Facebook</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={[styles.button, styles.phoneButton]}
        onPress={() => router.push("/PhoneLoginScreen")}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Tiếp tục với số điện thoại</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.emailButton]}
        onPress={() => router.push("/LoginScreen")}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Tiếp tục với Email</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.primary,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 36,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    resizeMode: "contain",
  },
  button: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: "#DB4437",
  },
  facebookButton: {
    backgroundColor: "#1877F2",
  },
  emailButton: {
    backgroundColor: Colors.light.primary,
  },
  buttonText: {
    color: Colors.light.accent,
    fontSize: 16,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
  },
  phoneButton: {
    backgroundColor: "#34B7F1",
  },
});
