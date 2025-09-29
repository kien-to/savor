import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  userId: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    userId: null,
    isLoading: true,
  });

  // Initialize auth state from AsyncStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        setAuthState({
          token,
          userId,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          token: null,
          userId: null,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (token: string, userId: string) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userId', userId);
    setAuthState({ token, userId, isLoading: false });
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    setAuthState({ token: null, userId: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
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