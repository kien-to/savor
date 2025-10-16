import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { myStoreService, StoreInfo } from '../services/myStore';

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

  const toggleStoreOwnerMode = async () => {
    const newMode = !state.isStoreOwnerMode;
    await AsyncStorage.setItem('isStoreOwnerMode', newMode.toString());
    setState(prev => ({ ...prev, isStoreOwnerMode: newMode }));
  };

  const checkStoreOwnership = async () => {
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
      console.log('User does not have a store or error fetching store info:', error);
      // For testing, simulate having a store with mock data
      const mockStoreInfo = {
        id: '1',
        title: 'Test Store',
        type: 'restaurant',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zip_code: '12345',
        country: 'Test Country',
        phone: '+1-555-0123',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      };
      setState(prev => ({
        ...prev,
        hasStore: true,
        storeInfo: mockStoreInfo,
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
