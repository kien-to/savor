import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { token, isLoading } = useAuth();

  // Debug logging
  console.log('TabLayout - token:', token, 'isLoading:', isLoading);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: Colors[colorScheme ?? 'light'].background 
      }}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: Colors[colorScheme ?? 'light'].accent,
          },
          default: {
            backgroundColor: Colors[colorScheme ?? 'light'].accent,
            borderTopColor: Colors[colorScheme ?? 'light'].border,
            borderTopWidth: 1,
            paddingTop: 8,
            height: 60,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Bản đồ',
          tabBarIcon: ({ color }) => <MaterialIcons name="map" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={28} color={color} />,
        }}
      />
      {!token && (
        <Tabs.Screen
          name="login"
          options={{
            title: 'Đăng nhập',
            tabBarIcon: ({ color }) => <MaterialIcons name="login" size={28} color={color} />,
          }}
        />
      )}
    </Tabs>
  );
}
