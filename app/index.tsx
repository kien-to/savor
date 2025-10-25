import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/Colors';

export default function Index() {
  const router = useRouter();
  const { token, isLoading, isGuest, isAuthenticated, guestSetupCompleted } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      // Add a small delay to ensure state is properly updated
      setTimeout(() => {
        if (isAuthenticated) {
          // User is authenticated, go to tabs
          router.replace('/(tabs)');
        } else if (isGuest) {
          // Guest user, go directly to tabs (setup will be prompted during first reservation)
          router.replace('/(tabs)');
        } else {
          // User is not authenticated and not in guest mode, go to login
          router.replace('/LoginScreen');
        }
      }, 100);
    }
  }, [token, isLoading, isGuest, isAuthenticated, guestSetupCompleted]);
  
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
