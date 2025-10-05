import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { getAuth, signOut } from 'firebase/auth';
import firebase from '../config/firebase';

interface AuthState {
  token: string | null;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  isLoading: boolean;
  isGuest: boolean;
  guestSetupCompleted: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, userId: string, email?: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  clearAllStorage: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    userId: null,
    userEmail: null,
    userName: null,
    isLoading: true,
    isGuest: false,
    guestSetupCompleted: false,
  });

  // Initialize auth state from AsyncStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthContext - Initializing auth...');
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        const userEmail = await AsyncStorage.getItem('userEmail');
        const userName = await AsyncStorage.getItem('userName');
        const isGuest = await AsyncStorage.getItem('isGuest');
        const guestSetupCompleted = await AsyncStorage.getItem('guestSetupCompleted');
        console.log('AuthContext - Retrieved from storage - token:', token, 'userId:', userId, 'userEmail:', userEmail, 'userName:', userName, 'isGuest:', isGuest, 'guestSetupCompleted:', guestSetupCompleted);
        setAuthState({
          token,
          userId,
          userEmail,
          userName,
          isLoading: false,
          isGuest: isGuest === 'true',
          guestSetupCompleted: guestSetupCompleted === 'true',
        });
        console.log('AuthContext - Auth state set, isLoading: false');
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          token: null,
          userId: null,
          userEmail: null,
          userName: null,
          isLoading: false,
          isGuest: false,
          guestSetupCompleted: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (token: string, userId: string, email?: string, name?: string) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userId', userId);
    if (email) {
      await AsyncStorage.setItem('userEmail', email);
    }
    if (name) {
      await AsyncStorage.setItem('userName', name);
    }
    await AsyncStorage.removeItem('isGuest'); // Clear guest mode when logging in
    setAuthState({ 
      token, 
      userId, 
      userEmail: email || null, 
      userName: name || null, 
      isLoading: false, 
      isGuest: false, 
      guestSetupCompleted: false 
    });
  };

  const continueAsGuest = async () => {
    console.log('AuthContext - Continuing as guest...');
    
    // Clear all authentication data
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userName');
    
    // Clear all user-related cached data
    await AsyncStorage.removeItem('userPhoneNumber');
    await AsyncStorage.removeItem('customerName');
    await AsyncStorage.removeItem('guestName');
    await AsyncStorage.removeItem('guestSetupCompleted');
    
    // Clear all local reservation data
    await AsyncStorage.removeItem('localGuestReservations');
    await AsyncStorage.removeItem('localAuthenticatedReservations');
    
    // Set guest mode
    await AsyncStorage.setItem('isGuest', 'true');
    
    setAuthState({ 
      token: null, 
      userId: null, 
      userEmail: null, 
      userName: null, 
      isLoading: false, 
      isGuest: true, 
      guestSetupCompleted: false 
    });
    console.log('AuthContext - Guest mode activated, all previous user data cleared');
  };

  const logout = async () => {
    console.log('AuthContext - Logging out...');
    try {
      // Sign out of Firebase to avoid cached currentUser from previous sessions
      const auth = getAuth(firebase);
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut warning:', e);
    }
    
    // Clear all authentication data
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('isGuest');
    // Also clear any SecureStore token
    try { await SecureStore.deleteItemAsync('authToken'); } catch {}
    
    // Clear all user-related cached data
    await AsyncStorage.removeItem('userPhoneNumber');
    await AsyncStorage.removeItem('customerName');
    await AsyncStorage.removeItem('guestName');
    await AsyncStorage.removeItem('guestSetupCompleted');
    
    // Clear all local reservation data
    await AsyncStorage.removeItem('localGuestReservations');
    await AsyncStorage.removeItem('localAuthenticatedReservations');
    
    setAuthState({ 
      token: null, 
      userId: null, 
      userEmail: null, 
      userName: null, 
      isLoading: false, 
      isGuest: false, 
      guestSetupCompleted: false 
    });
    console.log('AuthContext - Logout complete, all auth and cached data cleared');
  };

  const clearAllStorage = async () => {
    console.log('AuthContext - Clearing ALL storage...');
    try {
      await AsyncStorage.clear();
      setAuthState({ 
        token: null, 
        userId: null, 
        userEmail: null, 
        userName: null, 
        isLoading: false, 
        isGuest: false, 
        guestSetupCompleted: false 
      });
      console.log('AuthContext - ALL storage cleared successfully');
    } catch (error) {
      console.error('AuthContext - Error clearing storage:', error);
    }
  };

  const isAuthenticated = !!(authState.token && authState.userId);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, continueAsGuest, clearAllStorage, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 