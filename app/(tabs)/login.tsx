import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen () {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerText}>Let's get started saving food!</Text>

      {/* Image */}
      <Image
        source={{ uri: 'https://example.com/image.png' }} // Replace with your image URL or use a local asset
        style={styles.image}
      />

      {/* Buttons */}
      <TouchableOpacity style={[styles.button, styles.appleButton]}>
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.facebookButton]}>
        <Text style={styles.buttonText}>Continue with Facebook</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.emailButton]}>
        <Text style={styles.buttonText}>Continue with email</Text>
      </TouchableOpacity>
      <Text style={styles.otherText}>Other</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C3C3C',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 8,
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  emailButton: {
    backgroundColor: '#036B52',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  otherText: {
    color: '#7D7D7D',
    fontSize: 14,
    marginTop: 10,
  },
});
