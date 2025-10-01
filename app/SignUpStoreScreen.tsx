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
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const SignUpStoreScreen = () => {
  const router = useRouter();
  const [storeName, setStoreName] = useState('');

  const handleDirectSignup = () => {
    // Open Google Form for direct signup
    Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLScRmhk8JMsbmhpkIz-6j-TW47BMBspwFnZD1AngXu84_oVNCA/viewform?usp=dialog');
  };

  const handleConsultation = () => {
    Alert.alert(
      'Contact for Consultation',
      'How would you like to contact us for consultation?',
      [
        {
          text: 'Phone',
          onPress: () => Linking.openURL('tel:0964928175'),
        },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:kientrungto95@gmail.com'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleManualEntry = () => {
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
        <Text style={styles.headerTitle}>Đăng ký cửa hàng</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
               {/* Hero Section */}
               <View style={styles.heroContainer}>
                 <View style={styles.heroImageContainer}>
                   <Text style={styles.heroIcon}>🏪</Text>
                 </View>
               </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Hợp tác với Savor</Text>
          <Text style={styles.subtitle}>
            Tham gia Savor để giảm lãng phí thực phẩm và tăng doanh thu cửa hàng của bạn
          </Text>

          {/* Options Section */}
          <View style={styles.optionsSection}>
            <Text style={styles.optionsTitle}>Chọn cách bắt đầu</Text>
            
            <View style={styles.optionCards}>
              <TouchableOpacity style={styles.primaryOptionCard} onPress={handleDirectSignup}>
                <Text style={styles.optionEmoji}>🚀</Text>
                <Text style={styles.primaryOptionTitle}>Đăng ký trực tiếp</Text>
                <Text style={styles.optionDescription}>Bắt đầu ngay với cửa hàng của bạn</Text>
                <View style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Đăng ký ngay</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryOptionCard} onPress={handleConsultation}>
                <Text style={styles.optionEmoji}>💬</Text>
                <Text style={styles.secondaryOptionTitle}>Tư vấn & Hỏi đáp</Text>
                <Text style={styles.optionDescription}>Có câu hỏi? Cần tư vấn thêm? Liên hệ với chúng tôi</Text>
                <View style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Liên hệ tư vấn</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Benefits Section */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Tại sao hợp tác với Savor?</Text>
            <View style={styles.benefits}>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitEmoji}>🌱</Text>
                <Text style={styles.benefitText}>Giảm lãng phí thức ăn</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitEmoji}>💰</Text>
                <Text style={styles.benefitText}>Tăng doanh thu</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitEmoji}>🤝</Text>
                <Text style={styles.benefitText}>Mở rộng khách hàng</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitEmoji}>🌍</Text>
                <Text style={styles.benefitText}>Bảo vệ môi trường</Text>
              </View>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Liên hệ trực tiếp</Text>
            <TouchableOpacity onPress={() => Linking.openURL('tel:0964928175')}>
              <Text style={styles.contactText}>📞 Phone: 0964928175</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:kientrungto95@gmail.com')}>
              <Text style={styles.contactText}>✉️ Email: kientrungto95@gmail.com</Text>
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
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 20,
  },
  heroImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  heroIcon: {
    fontSize: 48,
    color: Colors.light.accent,
  },
  mainContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsSection: {
    marginBottom: 32,
  },
  optionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionCards: {
    gap: 16,
  },
  primaryOptionCard: {
    backgroundColor: '#036B52',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  secondaryOptionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#036B52',
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  primaryOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  secondaryOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#036B52',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#036B52',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#036B52',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  benefitsSection: {
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  benefitItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  benefitEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  contactInfo: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#036B52',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default SignUpStoreScreen; 