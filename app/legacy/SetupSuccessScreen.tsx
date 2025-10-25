import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { storeManagementService } from '../../services/storeManagement';

const SetupSuccessScreen = () => {
  const router = useRouter();

  const handleStartSelling = async () => {
    try {
      // Enable selling for the store
      await storeManagementService.toggleSelling(true);
      router.push('/MyStore');
    } catch (error) {
      console.error('Failed to enable selling:', error);
      // You might want to show an error message to the user
    }
  };

  const handleMaybeLater = () => {
    router.push('/MyStore');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <MaterialIcons name="shopping-bag" size={64} color="#FFF" />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Fantastic</Text>
        <Text style={styles.subtitle}>
          You've created your first{'\n'}Surprise Bag.
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartSelling}
          >
            <Text style={styles.startButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.laterButton}
            onPress={handleMaybeLater}
          >
            <Text style={styles.laterButtonText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="store" size={24} color="#036B52" />
          <Text style={styles.navTextActive}>MyStore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="more-horiz" size={24} color="#666" />
          <Text style={styles.navText}>More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#036B52',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    color: '#FFEB7F',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 32,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonText: {
    color: '#036B52',
    fontSize: 16,
    fontWeight: '600',
  },
  laterButton: {
    alignItems: 'center',
  },
  laterButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    backgroundColor: '#036B52',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    color: '#FFF',
    marginTop: 4,
    opacity: 0.7,
  },
  navTextActive: {
    color: '#FFF',
    marginTop: 4,
  },
});

export default SetupSuccessScreen; 