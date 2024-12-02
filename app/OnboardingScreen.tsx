import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

import { NavigationProp, useNavigation } from '@react-navigation/native';

const OnboardingScreens = () => {
  const navigation = useNavigation();

  const onboardingData = [
    {
      image: require('../assets/images/icon.png'), // Replace with your image
      title: 'Explore the stores',
      description:
        'With this app, you can save Surprise Bags filled with surplus food from your local restaurants, cafés, and stores.',
      buttonText: 'Next',
    },
    {
      image: require('../assets/images/icon.png'), // Replace with your image
      title: 'Get ready for a surprise',
      description:
        'Stores won’t know exactly what will be in the bag, as they pack it with their surplus food!',
      buttonText: 'Next',
    },
    {
      image: require('../assets/images/icon.png'), // Replace with your image
      title: 'Pick up and celebrate',
      description:
        'At the store, show your order details in the app, and then enjoy the food you pick up!',
      buttonText: 'Got it!',
    },
    {
      image: require('../assets/images/icon.png'), // Replace with your image
      title: 'Never miss a thing',
      description:
        'Changes to your order? Exciting new stores? Delicious things to try? Get push notifications to keep you up to date.',
      buttonText: 'Maybe later',
    },
  ];

  return (
    <Swiper
      loop={false}
      showsPagination={true}
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
    >
      {onboardingData.map((item, index) => (
        <View key={index} style={styles.container}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate('(tabs)')}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (index === onboardingData.length - 1) {
                navigation.navigate('Home'); // Navigate to the next screen
              }
            }}
          >
            <Text style={styles.buttonText}>
              {index === onboardingData.length - 1 ? 'Finish' : item.buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#036B52',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  skipText: {
    color: '#666',
    fontSize: 16,
  },
  dot: {
    backgroundColor: '#E0E0E0',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#036B52',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default OnboardingScreens;
