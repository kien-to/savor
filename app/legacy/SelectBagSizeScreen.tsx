import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const bagSizes = [
  {
    id: 'small',
    label: 'Small',
    minValue: '15.00USD',
    price: '4.99USD',
    recommended: false,
  },
  {
    id: 'medium',
    label: 'Medium',
    minValue: '18.00USD',
    price: '5.99USD',
    recommended: true,
  },
  {
    id: 'large',
    label: 'Large',
    minValue: '21.00USD',
    price: '6.99USD',
    recommended: false,
  },
];

const SelectBagSizeScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedSize, setSelectedSize] = useState<string>('medium');

  const handleContinue = () => {
    if (selectedSize) {
      router.push({
        pathname: '/SetDailyBagsScreen',
        params: {
          ...params,
          bagSize: selectedSize,
        },
      });
    }
  };

  return (
    <View style={styles.container}>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Choose your Surprise Bag size</Text>

        {bagSizes.map((size) => (
          <View key={size.id} style={styles.sizeContainer}>
            {size.recommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Recommended for you</Text>
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.sizeButton,
                selectedSize === size.id && styles.sizeButtonSelected,
                size.recommended && styles.recommendedButton,
              ]}
              onPress={() => setSelectedSize(size.id)}
            >
              <View style={styles.leftContent}>
                <View style={[
                  styles.radioButton,
                  selectedSize === size.id && styles.radioButtonSelected
                ]}>
                  {selectedSize === size.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.sizeLabel}>{size.label}</Text>
              </View>
              <View style={styles.priceInfo}>
                <Text style={styles.minValue}>{size.minValue}</Text>
                <Text style={styles.priceText}>minimum value</Text>
                <Text style={styles.appPrice}>{size.price} price in app</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}

        {/* Recommendation Note */}
        <View style={styles.recommendationNote}>
          <Text style={styles.recommendationTitle}>Recommended for you</Text>
          <Text style={styles.recommendationText}>
            Based on your Surprise Bag type, we recommend starting with the Medium size. You can always change this later.
          </Text>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need help?</Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>
              What size should I choose for my Surprise Bags?
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>
              How much will I earn per Surprise Bag sold?
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    lineHeight: 34,
  },
  sizeContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    left: 16,
    backgroundColor: '#E6F2EF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  recommendedText: {
    color: '#036B52',
    fontSize: 14,
  },
  sizeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  sizeButtonSelected: {
    backgroundColor: '#036B52',
    borderColor: '#036B52',
  },
  recommendedButton: {
    borderColor: '#036B52',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#036B52',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#FFF',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
  },
  sizeLabel: {
    fontSize: 16,
    color: '#333',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  minValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priceText: {
    fontSize: 14,
    color: '#666',
  },
  appPrice: {
    fontSize: 14,
    color: '#666',
  },
  recommendationNote: {
    backgroundColor: '#E6F2EF',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
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

export default SelectBagSizeScreen; 