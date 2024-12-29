import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { storeDetailsService } from '../services/storeDetails';

const bagOptions = [
  { value: 2, recommended: false },
  { value: 3, recommended: true },
  { value: 4, recommended: false },
  { value: 5, recommended: false },
];

const SetDailyBagsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedCount, setSelectedCount] = useState(3);
  const [showEarnings, setShowEarnings] = useState(false);

  // Calculate earnings based on bag size and count
  const calculateDailyEarnings = useMemo(() => {
    const bagSize = params.bagSize as string;
    let pricePerBag = 0;

    switch (bagSize) {
      case 'small':
        pricePerBag = 4.99;
        break;
      case 'medium':
        pricePerBag = 5.99;
        break;
      case 'large':
        pricePerBag = 6.99;
        break;
      default:
        pricePerBag = 5.99; // Default to medium if not specified
    }

    const dailyEarnings = (pricePerBag * selectedCount).toFixed(2);
    return `${dailyEarnings}USD`;
  }, [selectedCount, params.bagSize]);

  const handleContinue = async () => {
    try {
      await storeDetailsService.updateBagDetails({
        category: params.category as string,
        name: params.name as string,
        description: params.description as string,
        size: params.bagSize as string,
        dailyCount: selectedCount,
      });
      
      router.push({
        pathname: '/SetWeeklyScheduleScreen',
        params: {
          ...params,
          dailyBags: selectedCount,
        },
      });
    } catch (error) {
      console.error('Failed to update bag count:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View> */}

      <ScrollView style={styles.content}>
        <Text style={styles.title}>
          Set the daily number of Surprise Bags
        </Text>

        {/* Bag Count Options */}
        <View style={styles.optionsContainer}>
          {bagOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                selectedCount === option.value && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedCount(option.value)}
            >
              <Text style={[
                styles.optionText,
                selectedCount === option.value && styles.optionTextSelected
              ]}>
                {option.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommendation Note */}
        <View style={styles.recommendationNote}>
          <Text style={styles.recommendationTitle}>Recommended for you</Text>
          <Text style={styles.recommendationText}>
            We recommend starting with 2-3 Surprise Bags per day. You can always change this later.
          </Text>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need help?</Text>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => {/* Handle expansion */}}
          >
            <Text style={styles.helpButtonText}>
              What if I have no food left over?
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => {/* Handle expansion */}}
          >
            <Text style={styles.helpButtonText}>
              How much will I earn per Surprise Bag sold?
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => {/* Handle expansion */}}
          >
            <Text style={styles.helpButtonText}>
              What is the difference between price in app and value per Surprise Bag?
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => {/* Handle expansion */}}
          >
            <Text style={styles.helpButtonText}>
              How do payouts work?
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Earnings Bar */}
      <TouchableOpacity 
        style={styles.earningsBar}
        onPress={() => setShowEarnings(!showEarnings)}
      >
        <Text style={styles.earningsText}>Earnings per day</Text>
        <View style={styles.earningsAmount}>
          <Text style={styles.earningsValue}>{calculateDailyEarnings}</Text>
          <MaterialIcons 
            name={showEarnings ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color="#FFF" 
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 32,
    lineHeight: 34,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  optionButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#036B52',
    borderColor: '#036B52',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#FFF',
  },
  recommendationNote: {
    backgroundColor: '#E6F2EF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#036B52',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#036B52',
    lineHeight: 20,
  },
  helpSection: {
    marginBottom: 32,
  },
  helpTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  helpButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  helpButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    paddingRight: 16,
  },
  earningsBar: {
    backgroundColor: '#036B52',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  earningsText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  earningsAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningsValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  continueButton: {
    backgroundColor: '#036B52',
    padding: 16,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SetDailyBagsScreen; 