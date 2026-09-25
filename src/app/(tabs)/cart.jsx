import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../Theme/Colors';
import { useCart } from '../../store/CartContext'; 

export default function CartScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];
  
  // Replace these with the exact function names from your CartContext
  const { cartItems, removeFromCart, updateQuantity } = useCart(); 

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const renderCartItem = ({ item }) => (
    <View style={[styles.cartItem, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={[styles.itemTitle, { color: currentColors.text }]} numberOfLines={1}>{item.title}</Text>
        <Text style={[styles.itemPrice, { color: currentColors.primary }]}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.qtyButton, { backgroundColor: currentColors.background, borderColor: currentColors.border }]}
            onPress={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
          >
            <Text style={[styles.qtyText, { color: currentColors.text }]}>-</Text>
          </TouchableOpacity>
          
          <Text style={[styles.qtyValue, { color: currentColors.text }]}>{item.quantity || 1}</Text>
          
          <TouchableOpacity 
            style={[styles.qtyButton, { backgroundColor: currentColors.background, borderColor: currentColors.border }]}
            onPress={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
          >
            <Text style={[styles.qtyText, { color: currentColors.text }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
        <Text style={styles.removeIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>My Cart</Text>

        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🛒</Text>
              <Text style={[styles.emptyText, { color: currentColors.textSecondary }]}>Your cart is empty</Text>
              <TouchableOpacity 
                style={[styles.shopButton, { backgroundColor: currentColors.primary }]}
                onPress={() => router.push('/')}
              >
                <Text style={styles.shopButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          }
        />

        {cartItems.length > 0 && (
          <View style={[styles.checkoutContainer, { backgroundColor: currentColors.surface, borderTopColor: currentColors.border }]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: currentColors.textSecondary }]}>Total:</Text>
              <Text style={[styles.totalValue, { color: currentColors.text }]}>${calculateTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.checkoutButton, { backgroundColor: currentColors.primary }]}
              onPress={() => router.push('/checkout')}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  
  cartItem: { flexDirection: 'row', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, alignItems: 'center' },
  itemImage: { width: 80, height: 80, borderRadius: 8, resizeMode: 'cover' },
  itemDetails: { flex: 1, marginLeft: 15 },
  itemTitle: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderWidth: 1 },
  qtyText: { fontSize: 18, fontWeight: 'bold' },
  qtyValue: { marginHorizontal: 15, fontSize: 16, fontWeight: '600' },
  
  removeButton: { padding: 10 },
  removeIcon: { fontSize: 20 },
  
  checkoutContainer: { paddingVertical: 20, borderTopWidth: 1, marginTop: 'auto' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  totalLabel: { fontSize: 18, fontWeight: '500' },
  totalValue: { fontSize: 24, fontWeight: 'bold' },
  checkoutButton: { padding: 16, borderRadius: 12, alignItems: 'center' },
  checkoutButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyIcon: { fontSize: 60, marginBottom: 20, opacity: 0.5 },
  emptyText: { fontSize: 18, marginBottom: 30 },
  shopButton: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  shopButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});