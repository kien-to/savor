import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { myStoreService, StoreInfo } from '../services/myStore';
import { useAuth } from './AuthContext';

interface StoreOwnerState {
  isStoreOwnerMode: boolean;
  hasStore: boolean;
  storeInfo: StoreInfo | null;
  isLoading: boolean;
}

interface StoreOwnerContextType extends StoreOwnerState {
  toggleStoreOwnerMode: () => void;
  checkStoreOwnership: () => Promise<void>;
  refreshStoreInfo: () => Promise<void>;
}

const StoreOwnerContext = createContext<StoreOwnerContextType | undefined>(undefined);

export function StoreOwnerProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userId, isGuest } = useAuth();
  const [state, setState] = useState<StoreOwnerState>({
    isStoreOwnerMode: false,
    hasStore: false,
    storeInfo: null,
    isLoading: true,
  });

  // Initialize store owner state from AsyncStorage
  useEffect(() => {
    const initializeStoreOwnerState = async () => {
      try {
        // Load store owner mode from AsyncStorage
        const storedMode = await AsyncStorage.getItem('isStoreOwnerMode');
        const isStoreOwnerMode = storedMode === 'true';
        
        setState(prev => ({
          ...prev,
          isStoreOwnerMode,
          isLoading: false,
        }));
        
        // Check if user has a store
        await checkStoreOwnership();
      } catch (error) {
        console.error('Error initializing store owner state:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeStoreOwnerState();
  }, []);

  // Listen to authentication changes and re-check store ownership
  useEffect(() => {
    const handleAuthChange = async () => {
      if (!isAuthenticated || isGuest) {
        // User is not authenticated or is a guest, reset store owner state
        setState(prev => ({
          ...prev,
          hasStore: false,
          storeInfo: null,
          isStoreOwnerMode: false,
        }));
        await AsyncStorage.removeItem('isStoreOwnerMode');
      } else {
        // User is authenticated, check store ownership
        await checkStoreOwnership();
      }
    };

    handleAuthChange();
  }, [isAuthenticated, userId, isGuest]);

  const toggleStoreOwnerMode = async () => {
    const newMode = !state.isStoreOwnerMode;
    
    if (newMode) {
      await checkStoreOwnership();
    }
    
    await AsyncStorage.setItem('isStoreOwnerMode', newMode.toString());
    setState(prev => ({ ...prev, isStoreOwnerMode: newMode }));
  };

  const checkStoreOwnership = async () => {
    if (!isAuthenticated || isGuest) {
      setState(prev => ({
        ...prev,
        hasStore: false,
        storeInfo: null,
        isLoading: false,
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const storeInfo = await myStoreService.getStoreInfo();
      setState(prev => ({
        ...prev,
        hasStore: true,
        storeInfo,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        hasStore: false,
        storeInfo: null,
        isLoading: false,
      }));
    }
  };

  const refreshStoreInfo = async () => {
    await checkStoreOwnership();
  };

  return (
    <StoreOwnerContext.Provider
      value={{
        ...state,
        toggleStoreOwnerMode,
        checkStoreOwnership,
        refreshStoreInfo,
      }}
    >
      {children}
    </StoreOwnerContext.Provider>
  );
}

export function useStoreOwner() {
  const context = useContext(StoreOwnerContext);
  if (context === undefined) {
    throw new Error('useStoreOwner must be used within a StoreOwnerProvider');
  }
  return context;
}
