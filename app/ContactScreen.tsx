import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ContactScreen = () => {
  const router = useRouter();

  const handleCall = () => {
    Linking.openURL('tel:0964928175');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:kientrungto95@gmail.com');
  };

  const handleSocialMedia = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Liên hệ</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Brand Section */}
        <View style={styles.brandSection}>
          <Text style={styles.logo}>SAVOR</Text>
          <Text style={styles.description}>
            Giảm thiểu lãng phí thực phẩm và tạo ra giá trị từ những món ăn thừa.
            Kết nối cửa hàng với khách hàng để xây dựng cộng đồng bền vững và tiết kiệm.
          </Text>
          <View style={styles.mission}>
            <Text style={styles.missionText}>
              🌱 Bảo vệ môi trường • 💰 Tiết kiệm chi phí • 🤝 Kết nối cộng đồng
            </Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <View style={styles.contactIcon}>
              <Text style={styles.contactEmoji}>📞</Text>
            </View>
            <Text style={styles.contactText}>0964928175</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <View style={styles.contactIcon}>
              <Text style={styles.contactEmoji}>✉️</Text>
            </View>
            <Text style={styles.contactText}>kientrungto95@gmail.com</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liên kết nhanh</Text>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => router.push('/(tabs)')}
          >
            <MaterialIcons name="home" size={20} color="#036B52" />
            <Text style={styles.linkText}>Trang chủ</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <MaterialIcons name="receipt" size={20} color="#036B52" />
            <Text style={styles.linkText}>Đơn đặt hàng</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => router.push('/SignUpStoreScreen')}
          >
            <MaterialIcons name="store" size={20} color="#036B52" />
            <Text style={styles.linkText}>Hợp tác với chúng tôi</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theo dõi chúng tôi</Text>
          
          <TouchableOpacity 
            style={styles.socialItem}
            onPress={() => handleSocialMedia('https://facebook.com/savor')}
          >
            <View style={styles.socialIcon}>
              <MaterialIcons name="facebook" size={20} color="#1877f2" />
            </View>
            <Text style={styles.socialText}>Facebook</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialItem}
            onPress={() => handleSocialMedia('https://instagram.com/savor')}
          >
            <View style={styles.socialIcon}>
              <MaterialIcons name="camera-alt" size={20} color="#E4405F" />
            </View>
            <Text style={styles.socialText}>Instagram</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialItem}
            onPress={() => handleSocialMedia('https://zalo.me/savor')}
          >
            <View style={[styles.socialIcon, styles.zaloIcon]}>
              <Text style={styles.zaloText}>Z</Text>
            </View>
            <Text style={styles.socialText}>Zalo</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialItem}
            onPress={() => handleSocialMedia('https://tiktok.com/@savor')}
          >
            <View style={styles.socialIcon}>
              <MaterialIcons name="music-note" size={20} color="#000" />
            </View>
            <Text style={styles.socialText}>TikTok</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Legal Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pháp lý</Text>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => router.push('/TermsOfServiceScreen')}
          >
            <MaterialIcons name="description" size={20} color="#036B52" />
            <Text style={styles.linkText}>Điều khoản dịch vụ</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => router.push('/PrivacyPolicyScreen')}
          >
            <MaterialIcons name="privacy-tip" size={20} color="#036B52" />
            <Text style={styles.linkText}>Chính sách bảo mật</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <MaterialIcons name="help" size={20} color="#036B52" />
            <Text style={styles.linkText}>Hỗ trợ</Text>
            <MaterialIcons name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © {new Date().getFullYear()} Savor. Tất cả quyền được bảo lưu.
          </Text>
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
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  brandSection: {
    backgroundColor: '#004d3d',
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff6e7',
    marginBottom: 16,
    letterSpacing: 1,
  },
  description: {
    color: 'rgba(255, 246, 231, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    fontSize: 16,
  },
  mission: {
    backgroundColor: 'rgba(255, 246, 231, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  missionText: {
    color: 'rgba(255, 246, 231, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(3, 107, 82, 0.2)',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contactIcon: {
    marginRight: 16,
    width: 32,
    alignItems: 'center',
  },
  contactEmoji: {
    fontSize: 20,
  },
  contactText: {
    flex: 1,
    fontSize: 16,
    color: '#036B52',
    fontWeight: '500',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  socialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#F8F8F8',
  },
  zaloIcon: {
    borderWidth: 2,
    borderColor: '#0068ff',
    backgroundColor: 'transparent',
  },
  zaloText: {
    color: '#0068ff',
    fontWeight: '700',
    fontSize: 14,
  },
  socialText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  copyright: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ContactScreen;
