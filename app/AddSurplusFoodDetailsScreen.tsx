import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const AddSurplusFoodDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleContinue = () => {
    if (name && description) {
      router.push({
        pathname: '/SignUpStoreScreen',
        params: { 
          category: params.category,
          bagName: name,
          bagDescription: description
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Add a name and a description</Text>
        <Text style={styles.subtitle}>
          We've made it easy! Here's what we suggest. You can always make changes.
        </Text>

        {/* Name Input */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Baked goods"
        />

        {/* Description Input */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Rescue a Surprise Bag containing a selection of baked goods."
          multiline
          numberOfLines={4}
          maxLength={200}
        />
        <Text style={styles.charCount}>{description.length}/200</Text>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.continueButton,
          (!name || !description) && styles.continueButtonDisabled
        ]}
        disabled={!name || !description}
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
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 22,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginTop: -20,
    marginBottom: 24,
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

export default AddSurplusFoodDetailsScreen; 