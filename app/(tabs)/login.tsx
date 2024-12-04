import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import * as Google from 'expo-auth-session/providers/google';
import { socialAuthService, googleConfig } from "../../services/socialAuth";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [_, response, promptAsync] = Google.useAuthRequest({
    ...googleConfig,
    redirectUri: Platform.select({
      ios: 'com.your.app.bundle.id:/oauth2redirect',  // Replace with your app's bundle ID
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
      const result = await socialAuthService.handleGoogleLogin(response);
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
      <Text style={styles.headerText}>Let's get started saving food!</Text>

      <Image
        source={{ uri: "https://example.com/image.png" }}
        style={styles.image}
      />

      <TouchableOpacity 
        style={[styles.button, styles.googleButton]}
        onPress={() => handleSocialLogin('google')}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.facebookButton]}
        onPress={() => handleSocialLogin('facebook')}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.emailButton]}
        onPress={() => router.push("/EmailScreen")}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Continue with email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={() => router.push("/LoginScreen")}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Login with email</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3C3C3C",
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
    resizeMode: "contain",
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 8,
  },
  googleButton: {
    backgroundColor: "#DB4437",
  },
  facebookButton: {
    backgroundColor: "#1877F2",
  },
  emailButton: {
    backgroundColor: "#036B52",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#036B52",
  },
});

