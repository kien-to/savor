import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const categories = [
  { id: 'meals', label: 'Meals' },
  { id: 'bread', label: 'Bread & pastries' },
  { id: 'groceries', label: 'Groceries' },
  { id: 'other', label: 'Other' },
];

const SelectSurplusFoodScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedCategory) {
      router.push({
        pathname: '/AddSurplusFoodDetailsScreen',
        params: { category: selectedCategory }
      });
    }
  };

  return (
    <View style={styles.container}>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>
          Select the category that best describes your surplus food
        </Text>
        <Text style={styles.subtitle}>
          Let customers know what they can expect in their Surprise Bags.
        </Text>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonSelected
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <View style={[
              styles.radioButton,
              selectedCategory === category.id && styles.radioButtonSelected
            ]}>
              {selectedCategory === category.id && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <Text style={styles.categoryText}>{category.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !selectedCategory && styles.continueButtonDisabled
        ]}
        disabled={!selectedCategory}
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
    paddingTop: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  categoryButtonSelected: {
    backgroundColor: '#036B52',
    borderColor: '#036B52',
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
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#036B52',
    padding: 16,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SelectSurplusFoodScreen; 