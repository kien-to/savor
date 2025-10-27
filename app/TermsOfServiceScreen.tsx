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

const TermsOfServiceScreen = () => {
  const router = useRouter();
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');

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
          {language === 'vi' ? 'Điều Khoản Dịch Vụ' : 'Terms of Service'}
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Điều Khoản Sử Dụng Dịch Vụ</Text>
            
            <Text style={styles.subtitle}>1. Chấp Nhận Điều Khoản</Text>
            <Text style={styles.text}>
              Bằng việc sử dụng ứng dụng Savor, bạn đồng ý tuân thủ các điều khoản và điều kiện này.
            </Text>
            
            <Text style={styles.subtitle}>2. Mô Tả Dịch Vụ</Text>
            <Text style={styles.text}>
              Savor là nền tảng kết nối người dùng với các nhà hàng để mua thực phẩm thừa với giá giảm, góp phần giảm lãng phí thực phẩm.
            </Text>
            
            <Text style={styles.subtitle}>3. Tài Khoản Người Dùng</Text>
            <Text style={styles.text}>
              Bạn có trách nhiệm bảo mật thông tin tài khoản và mật khẩu. Bạn đồng ý chịu trách nhiệm cho mọi hoạt động xảy ra dưới tài khoản của mình.
            </Text>
            
            <Text style={styles.subtitle}>4. Thanh Toán và Hoàn Tiền</Text>
            <Text style={styles.text}>
              Thanh toán được xử lý thông qua Stripe. Chính sách hoàn tiền tuân theo quy định của từng nhà hàng. Liên hệ trực tiếp với nhà hàng để được hỗ trợ hoàn tiền.
            </Text>
            
            <Text style={styles.subtitle}>5. Trách Nhiệm Người Dùng</Text>
            <Text style={styles.text}>
              Bạn cam kết sử dụng dịch vụ một cách hợp pháp và không gây hại đến hoạt động của nhà hàng hoặc người dùng khác.
            </Text>
            
            <Text style={styles.subtitle}>6. Giới Hạn Trách Nhiệm</Text>
            <Text style={styles.text}>
              Savor không chịu trách nhiệm về chất lượng thực phẩm hoặc dịch vụ của các nhà hàng đối tác.
            </Text>
            
            <Text style={styles.subtitle}>7. Thay Đổi Điều Khoản</Text>
            <Text style={styles.text}>
              Chúng tôi có quyền thay đổi các điều khoản này bất kỳ lúc nào. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được coi là chấp nhận điều khoản mới.
            </Text>
            
            <Text style={styles.subtitle}>8. Liên Hệ</Text>
            <Text style={styles.text}>
              Mọi thắc mắc về điều khoản dịch vụ, vui lòng liên hệ: support@savor.app
            </Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms of Service</Text>
            
            <Text style={styles.subtitle}>1. Acceptance of Terms</Text>
            <Text style={styles.text}>
              By using the Savor app, you agree to be bound by these terms and conditions.
            </Text>
            
            <Text style={styles.subtitle}>2. Service Description</Text>
            <Text style={styles.text}>
              Savor is a platform connecting users with restaurants to purchase surplus food at discounted prices, helping reduce food waste.
            </Text>
            
            <Text style={styles.subtitle}>3. User Accounts</Text>
            <Text style={styles.text}>
              You are responsible for maintaining the security of your account information and password. You agree to be responsible for all activities that occur under your account.
            </Text>
            
            <Text style={styles.subtitle}>4. Payment and Refunds</Text>
            <Text style={styles.text}>
              Payments are processed through Stripe. Refund policies follow individual restaurant policies. Contact restaurants directly for refund assistance.
            </Text>
            
            <Text style={styles.subtitle}>5. User Responsibilities</Text>
            <Text style={styles.text}>
              You agree to use the service lawfully and not harm the operations of restaurants or other users.
            </Text>
            
            <Text style={styles.subtitle}>6. Limitation of Liability</Text>
            <Text style={styles.text}>
              Savor is not responsible for the quality of food or services provided by partner restaurants.
            </Text>
            
            <Text style={styles.subtitle}>7. Changes to Terms</Text>
            <Text style={styles.text}>
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of new terms.
            </Text>
            
            <Text style={styles.subtitle}>8. Contact</Text>
            <Text style={styles.text}>
              For questions about these terms, please contact: support@savor.app
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

export default TermsOfServiceScreen;
