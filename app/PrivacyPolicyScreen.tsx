import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const PrivacyPolicyScreen = () => {
  const router = useRouter();
  const [language, setLanguage] = useState<'vi' | 'en'>('vi'); // Default to Vietnamese

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {language === 'vi' ? 'Chính Sách Bảo Mật' : 'Privacy Policy'}
        </Text>
        <TouchableOpacity 
          style={styles.languageButton}
          onPress={toggleLanguage}
        >
          <Text style={styles.languageText}>
            {language === 'vi' ? 'EN' : 'VI'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {language === 'vi' ? (
          /* Vietnamese Version */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chính Sách Bảo Mật & Quyền Truy Cập</Text>
            
            <Text style={styles.subtitle}>Thu Thập Dữ Liệu</Text>
            <Text style={styles.text}>
              Savor thu thập thông tin sau để cung cấp dịch vụ giảm lãng phí thực phẩm:
            </Text>
            <Text style={styles.bulletPoint}>• Thông tin tài khoản (tên, email, số điện thoại)</Text>
            <Text style={styles.bulletPoint}>• Dữ liệu vị trí để tìm cửa hàng gần nhất</Text>
            <Text style={styles.bulletPoint}>• Lịch sử đặt hàng và sở thích</Text>
            <Text style={styles.bulletPoint}>• Thông tin thanh toán (được xử lý an toàn qua Stripe)</Text>
            
            <Text style={styles.subtitle}>Quyền Truy Cập Được Sử Dụng</Text>
            <Text style={styles.text}>
              Savor yêu cầu các quyền truy cập sau:
            </Text>
            <Text style={styles.bulletPoint}>• Truy cập Vị trí: Để tìm cửa hàng thực phẩm gần nhất và tính khoảng cách</Text>
            <Text style={styles.bulletPoint}>• Truy cập Camera: Để quét mã QR cho việc check-in cửa hàng</Text>
            <Text style={styles.bulletPoint}>• Truy cập Bộ nhớ: Để lưu tùy chọn ứng dụng và dữ liệu offline</Text>
            <Text style={styles.bulletPoint}>• Truy cập Mạng: Để đồng bộ dữ liệu với máy chủ</Text>
            
            <Text style={styles.subtitle}>Sử Dụng Dữ Liệu</Text>
            <Text style={styles.text}>
              Dữ liệu của bạn được sử dụng để:
            </Text>
            <Text style={styles.bulletPoint}>• Cung cấp gợi ý thực phẩm cá nhân hóa</Text>
            <Text style={styles.bulletPoint}>• Xử lý đặt hàng và thanh toán</Text>
            <Text style={styles.bulletPoint}>• Gửi thông báo quan trọng về đơn hàng</Text>
            <Text style={styles.bulletPoint}>• Cải thiện chất lượng dịch vụ</Text>
            
            <Text style={styles.subtitle}>Bảo Mật Dữ Liệu</Text>
            <Text style={styles.text}>
              Chúng tôi bảo vệ dữ liệu của bạn bằng các biện pháp bảo mật tiêu chuẩn ngành bao gồm mã hóa, máy chủ an toàn và kiểm tra bảo mật định kỳ.
            </Text>
            
            <Text style={styles.subtitle}>Dịch Vụ Bên Thứ Ba</Text>
            <Text style={styles.text}>
              Chúng tôi sử dụng các dịch vụ bên thứ ba sau:
            </Text>
            <Text style={styles.bulletPoint}>• Firebase (xác thực và lưu trữ dữ liệu)</Text>
            <Text style={styles.bulletPoint}>• Stripe (xử lý thanh toán)</Text>
            <Text style={styles.bulletPoint}>• Google Maps (dịch vụ vị trí)</Text>
            <Text style={styles.bulletPoint}>• Facebook (đăng nhập xã hội)</Text>
            
            <Text style={styles.subtitle}>Quyền Của Bạn</Text>
            <Text style={styles.text}>
              Bạn có quyền truy cập, cập nhật hoặc xóa dữ liệu cá nhân của mình. Liên hệ với chúng tôi tại privacy@savor.app để được hỗ trợ.
            </Text>
          </View>
        ) : (
          /* English Version */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy Policy & Permissions</Text>
            
            <Text style={styles.subtitle}>Data Collection</Text>
            <Text style={styles.text}>
              Savor collects the following information to provide our food waste reduction services:
            </Text>
            <Text style={styles.bulletPoint}>• Account information (name, email, phone number)</Text>
            <Text style={styles.bulletPoint}>• Location data to find nearby stores</Text>
            <Text style={styles.bulletPoint}>• Reservation history and preferences</Text>
            <Text style={styles.bulletPoint}>• Payment information (processed securely via Stripe)</Text>
            
            <Text style={styles.subtitle}>Permissions Used</Text>
            <Text style={styles.text}>
              Savor requests the following permissions:
            </Text>
            <Text style={styles.bulletPoint}>• Location Access: To find nearby food stores and calculate distances</Text>
            <Text style={styles.bulletPoint}>• Camera Access: To scan QR codes for store check-ins</Text>
            <Text style={styles.bulletPoint}>• Storage Access: To save app preferences and offline data</Text>
            <Text style={styles.bulletPoint}>• Network Access: To sync data with our servers</Text>
            
            <Text style={styles.subtitle}>Data Usage</Text>
            <Text style={styles.text}>
              Your data is used to:
            </Text>
            <Text style={styles.bulletPoint}>• Provide personalized food recommendations</Text>
            <Text style={styles.bulletPoint}>• Process reservations and payments</Text>
            <Text style={styles.bulletPoint}>• Send important notifications about your orders</Text>
            <Text style={styles.bulletPoint}>• Improve our service quality</Text>
            
            <Text style={styles.subtitle}>Data Security</Text>
            <Text style={styles.text}>
              We protect your data using industry-standard security measures including encryption, secure servers, and regular security audits.
            </Text>
            
            <Text style={styles.subtitle}>Third-Party Services</Text>
            <Text style={styles.text}>
              We use the following third-party services:
            </Text>
            <Text style={styles.bulletPoint}>• Firebase (authentication and data storage)</Text>
            <Text style={styles.bulletPoint}>• Stripe (payment processing)</Text>
            <Text style={styles.bulletPoint}>• Google Maps (location services)</Text>
            <Text style={styles.bulletPoint}>• Facebook (social login)</Text>
            
            <Text style={styles.subtitle}>Your Rights</Text>
            <Text style={styles.text}>
              You have the right to access, update, or delete your personal data. Contact us at privacy@savor.app for assistance.
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {language === 'vi' 
              ? `Cập nhật lần cuối: ${new Date().toLocaleDateString('vi-VN')}`
              : `Last updated: ${new Date().toLocaleDateString()}`
            }
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 8,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  languageButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    minWidth: 40,
    alignItems: 'center',
  },
  languageText: {
    color: Colors.light.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 4,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
});

export default PrivacyPolicyScreen;
