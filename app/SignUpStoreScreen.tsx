import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const SignUpStoreScreen = () => {
  const router = useRouter();
  const [storeName, setStoreName] = useState('');

  const handleManualEntry = () => {
    router.push({
      pathname: '/AddBusinessDetailsScreen',
      params: { storeName }
    });
  };

  const handleContinue = () => {
    if (!storeName.trim()) {
      Alert.alert('Error', 'Please enter a store name');
      return;
    }
    
    router.push({
      pathname: '/AddBusinessDetailsScreen',
      params: { storeName }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign up your store</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.heroImage}
          />
          <TouchableOpacity style={styles.howItWorksButton}>
            <MaterialIcons name="play-circle-filled" size={24} color="#036B52" />
            <Text style={styles.howItWorksText}>How Too Good To Go works</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Sign up your business</Text>
          <Text style={styles.subtitle}>
            Let's find your store and get you started. It will only take a few minutes!
          </Text>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for your store's name"
              value={storeName}
              onChangeText={setStoreName}
              placeholderTextColor="#666"
            />
          </View>

          {/* Manual Entry Button */}
          <TouchableOpacity 
            style={styles.manualEntryButton}
            onPress={handleManualEntry}
          >
            <MaterialIcons name="add" size={24} color="#036B52" />
            <Text style={styles.manualEntryText}>Add store details manually</Text>
          </TouchableOpacity>

          {/* Terms and Continue Button */}
          <View style={styles.footer}>
            <Text style={styles.termsText}>
              By proceeding, you agree to Too Good To Go's{' '}
              <Text style={styles.linkText}>Privacy Policy</Text> and{' '}
              <Text style={styles.linkText}>Terms and Conditions</Text>.
            </Text>

            <TouchableOpacity 
              style={[styles.continueButton, !storeName.trim() && styles.continueButtonDisabled]}
              disabled={!storeName.trim()}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink}>
              <Text style={styles.loginText}>
                Already have a store account? <Text style={styles.loginLinkText}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    // paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  howItWorksButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
  },
  howItWorksText: {
    color: '#036B52',
    marginLeft: 4,
    fontWeight: '500',
  },
  mainContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  footer: {
    marginTop: 'auto',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  linkText: {
    color: '#036B52',
  },
  continueButton: {
    backgroundColor: '#036B52',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLinkText: {
    color: '#036B52',
    fontWeight: '500',
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#036B52',
    borderRadius: 8,
    marginBottom: 24,
  },
  manualEntryText: {
    color: '#036B52',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default SignUpStoreScreen; 