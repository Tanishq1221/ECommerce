import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useWishlist } from '../../store/WishlistContext';
import { Colors } from '../../Theme/Colors';

export default function WishlistScreen() {
  const { wishlistItems } = useWishlist();
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemCard} 
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <Text style={styles.heartIcon}>❤️</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        
        {wishlistItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved items yet!</Text>
          </View>
        ) : (
          <FlatList 
            data={wishlistItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.surface },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.light.text, marginBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: Colors.light.textSecondary },
  itemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.light.background, padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: Colors.light.border },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: Colors.light.text, marginBottom: 4 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: Colors.light.primary },
  heartIcon: { fontSize: 20 }
});