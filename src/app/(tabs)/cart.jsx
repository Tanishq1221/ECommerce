import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // 1. ADDED THIS IMPORT

import { useCart } from '../../store/CartContext';
import CustomButton from '../../components/CustomButton';
import { Colors } from '../../Theme/Colors';

export default function CartScreen() {
  const { cartItems } = useCart();
  const router = useRouter(); // 2. ADDED THE ROUTER HERE

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyText}>Your cart is empty!</Text>
          </View>
        ) : (
          <>
            <FlatList 
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
            
            <View style={styles.footer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
              </View>
              
              {/* 3. UPDATED THE BUTTON HERE */}
              <CustomButton 
                title="Proceed to Checkout" 
                onPress={() => router.push('/checkout')} 
              />
              
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.surface },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.light.text, marginBottom: 20 },
  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: Colors.light.textSecondary },
  listContent: { paddingBottom: 20 },
  cartItem: { flexDirection: 'row', backgroundColor: Colors.light.background, borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: Colors.light.border, alignItems: 'center' },
  itemImage: { width: 60, height: 60, backgroundColor: Colors.light.surface, borderRadius: 8, marginRight: 15 },
  itemDetails: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: Colors.light.text, marginBottom: 4 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: Colors.light.primary },
  quantityContainer: { backgroundColor: Colors.light.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  quantityText: { fontSize: 14, fontWeight: '600', color: Colors.light.text },
  footer: { paddingVertical: 20, borderTopWidth: 1, borderTopColor: Colors.light.border },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalText: { fontSize: 20, fontWeight: '600', color: Colors.light.text },
  totalAmount: { fontSize: 22, fontWeight: 'bold', color: Colors.light.primary },
});