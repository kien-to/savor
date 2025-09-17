import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
          },
          default: {},
        }),
      }}>
        {/* <Tabs.Screen
        name="index"
        options={{
          title: 'Index',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'HomeScreen',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarIcon: ({ color }) => <MaterialIcons name="login" size={28} color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <MaterialIcons name="favorite" size={28} color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <MaterialIcons name="map" size={28} color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tag.fill" color={color} />,
        }}
      /> */}
      {/* <Tabs.Screen
        name="payment"
        options={{
          title: 'Payment',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tag.fill" color={color} />,
        }}
      /> */}
      {/* <Tabs.Screen
        name="browse"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tag.fill" color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={28} color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="MyStore"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="store" size={24} color={color} />
          ),
        }}
      /> */}
      {/* <Tabs.Screen
        name="More"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="more-horiz" size={24} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
