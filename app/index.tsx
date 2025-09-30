import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/Colors';

export default function Index() {
  const router = useRouter();
  const { token, isLoading } = useAuth();
  
  useEffect(() => {
    console.log('Index - token:', token, 'isLoading:', isLoading);
    if (!isLoading) {
      if (token) {
        console.log('Index - User is authenticated, navigating to tabs');
        // User is authenticated, go to tabs
        router.replace('/(tabs)');
      } else {
        console.log('Index - User is NOT authenticated, navigating to login');
        // User is not authenticated, go to login
        router.replace('/LoginScreen');
      }
    }
  }, [token, isLoading, router]);
  
  // Show loading screen while checking authentication
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: Colors.light.background 
    }}>
      <ActivityIndicator size="large" color={Colors.light.primary} />
    </View>
  );
}
