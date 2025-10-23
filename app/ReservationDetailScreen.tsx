import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

const ReservationDetailScreen = () => {
  const router = useRouter();
  const {
    reservationId,
    storeName,
    storeImage,
    storeAddress,
    customerName,
    customerEmail,
    phoneNumber,
    quantity,
    totalAmount,
    status,
    pickupTime,
    createdAt,
    paymentType,
  } = useLocalSearchParams();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800'; // Orange
      case 'confirmed':
        return '#4CAF50'; // Green
      case 'completed':
        return '#2196F3'; // Blue
      case 'cancelled':
        return '#F44336'; // Red
      case 'expired':
        return '#999'; // Gray
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'expired':
        return 'Hết hạn';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            try {
              // @ts-ignore expo-router runtime provides canGoBack on router
              if ((router as any).canGoBack?.()) {
                router.back();
              } else {
                router.replace('/');
              }
            } catch {
              router.replace('/');
            }
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Store Information */}
        <View style={styles.storeCard}>
          <Image
            source={{ uri: storeImage as string }}
            style={styles.storeImage}
          />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{storeName}</Text>
            <Text style={styles.storeAddress}>{storeAddress}</Text>
          </View>
        </View>

        {/* Order Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Trạng thái đơn hàng</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status as string) }]}>
              <Text style={styles.statusText}>{getStatusText(status as string)}</Text>
            </View>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Thông tin đơn hàng</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mã đơn hàng:</Text>
            <Text style={styles.detailValue}>{reservationId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Số lượng:</Text>
            <Text style={styles.detailValue}>{quantity} túi</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tổng tiền:</Text>
            <Text style={styles.detailValue}>{Number(totalAmount).toFixed(0)}.000đ</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phương thức thanh toán:</Text>
            <Text style={styles.detailValue}>{paymentType || 'Trả tiền tại cửa hàng'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Thời gian đặt:</Text>
            <Text style={styles.detailValue}>{formatDate(createdAt as string)}</Text>
          </View>
        </View>

        {/* Pickup Information */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Thông tin nhận hàng</Text>
          
          <View style={styles.pickupTimeContainer}>
            <MaterialIcons name="schedule" size={20} color={Colors.light.primary} />
            <Text style={styles.pickupTimeText}>{pickupTime}</Text>
          </View>
          
          <View style={styles.pickupLocationContainer}>
            <MaterialIcons name="location-on" size={20} color={Colors.light.primary} />
            <Text style={styles.pickupLocationText}>{storeAddress}</Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Thông tin khách hàng</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Họ tên:</Text>
            <Text style={styles.detailValue}>{customerName}</Text>
          </View>
          
          {customerEmail && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{customerEmail}</Text>
            </View>
          )}
          
          {phoneNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Số điện thoại:</Text>
              <Text style={styles.detailValue}>{phoneNumber}</Text>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <MaterialIcons name="info" size={20} color={Colors.light.primary} />
          <Text style={styles.instructionsText}>
            Vui lòng đến cửa hàng đúng giờ để nhận hàng. Mang theo mã đơn hàng để xác nhận.
          </Text>
        </View>
      </ScrollView>
    </View>
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
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  storeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  storeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 14,
    color: '#666',
  },
  statusCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    flex: 1,
    textAlign: 'right',
  },
  pickupTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickupTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
    marginLeft: 8,
  },
  pickupLocationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pickupLocationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  instructionsCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});

export default ReservationDetailScreen;
