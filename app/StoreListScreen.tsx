import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Store } from '../types/store';
import { Colors } from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

const StoreListScreen = () => {
  const router = useRouter();
  const { stores: storesParam, title } = useLocalSearchParams();
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    if (storesParam) {
      setStores(JSON.parse(decodeURIComponent(storesParam as string)));
    }
  }, [storesParam]);

  const renderItem = (item: Store) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({
        pathname: '/StoreScreen',
        params: { storeId: item.id }
      })}
    >
      <View style={styles.cardHeader}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.cardImage} 
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardPickupTime}>{item.pickUpTime}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardDistance}>{item.distance}</Text>
          <Text style={styles.cardPrice}>{(item.price * 1000).toLocaleString('vi-VN')}đ</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.listWrapper}>
        <FlatList
          data={stores}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={true}
          ListFooterComponent={<View style={styles.listFooter} />}
        />
      </View>
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
    width: 40, // Balance the back button
  },
  listContainer: {
    padding: 8,
    paddingBottom: 32,
  },
  listFooter: {
    height: 32,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    minHeight: 220, // Ensure consistent card height
  },
  cardHeader: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
    flex: 1,
  },
  cardPickupTime: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDistance: {
    fontSize: 12,
    color: '#666',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  listWrapper: {
    flex: 1,
  },
});

export default StoreListScreen; 