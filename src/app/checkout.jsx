import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomButton from '../components/CustomButton';
import { Colors } from '../Theme/Colors';
import { useCart } from '../store/CartContext';
import { useOrders } from '../store/OrdersContext';

export default function CheckoutScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];

  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [isProcessing, setIsProcessing] = useState(false);

  // Address state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const finalTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Load addresses when checkout opens
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await AsyncStorage.getItem('@saved_addresses');
        if (data) {
          const parsed = JSON.parse(data);
          setSavedAddresses(parsed);
          // Auto-select the first address if they have one
          if (parsed.length > 0) setSelectedAddress(parsed[0]); 
        }
      } catch (error) {
        console.error("Failed to load addresses", error);
      }
    };
    loadAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!selectedAddress) {
      alert("Please add or select a shipping address.");
      return;
    }

    setIsProcessing(true);
    
    // Pass the selected address object to Firebase
    const success = await addOrder(cartItems, finalTotal, selectedAddress);
    
    if (success) {
      await clearCart(); 
      alert('Order Placed Successfully! 🎉');
      router.replace('/'); 
    } else {
      alert('Something went wrong. Please try again.');
    }
    
    setIsProcessing(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: currentColors.primary }]}>← Back to Cart</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: currentColors.text }]}>Checkout</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Shipping To</Text>
            <TouchableOpacity onPress={() => router.push('/shipping')}>
              <Text style={[styles.editText, { color: currentColors.primary }]}>Edit Addresses</Text>
            </TouchableOpacity>
          </View>

          {savedAddresses.length === 0 ? (
            <View style={[styles.emptyAddressBox, { borderColor: currentColors.border }]}>
              <Text style={[styles.emptyAddressText, { color: currentColors.textSecondary }]}>No saved addresses found.</Text>
              <CustomButton title="Add an Address" onPress={() => router.push('/shipping')} />
            </View>
          ) : (
            savedAddresses.map((addr) => (
              <TouchableOpacity 
                key={addr.id}
                style={[
                  styles.addressSelectCard, 
                  { backgroundColor: currentColors.surface, borderColor: selectedAddress?.id === addr.id ? currentColors.primary : currentColors.border }
                ]}
                onPress={() => setSelectedAddress(addr)}
              >
                <View style={styles.addressInfo}>
                  <Text style={[styles.nameText, { color: currentColors.text }]}>{addr.name}</Text>
                  <Text style={[styles.addressText, { color: currentColors.textSecondary }]}>{addr.street}, {addr.city}</Text>
                </View>
                {selectedAddress?.id === addr.id && (
                  <Text style={styles.checkIcon}>✅</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={[styles.summaryBox, { borderTopColor: currentColors.border }]}>
          <Text style={[styles.summaryText, { color: currentColors.text }]}>Total to Pay:</Text>
          <Text style={[styles.summaryTotal, { color: currentColors.primary }]}>${finalTotal.toFixed(2)}</Text>
        </View>

        {isProcessing ? (
          <ActivityIndicator size="large" color={currentColors.primary} style={{ marginTop: 20 }} />
        ) : (
          <CustomButton 
            title="Place Order" 
            onPress={handlePlaceOrder} 
          />
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 30 },
  backButton: { marginTop: 10, marginBottom: 20 },
  backText: { fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  
  section: { marginBottom: 25 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  editText: { fontSize: 14, fontWeight: 'bold' },
  
  emptyAddressBox: { padding: 20, borderWidth: 1, borderRadius: 12, alignItems: 'center', borderStyle: 'dashed' },
  emptyAddressText: { marginBottom: 15, fontSize: 16 },
  
  addressSelectCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 2, marginBottom: 10 },
  addressInfo: { flex: 1 },
  nameText: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  addressText: { fontSize: 14 },
  checkIcon: { fontSize: 20 },

  summaryBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, borderTopWidth: 1, marginBottom: 20 },
  summaryText: { fontSize: 18, fontWeight: '600' },
  summaryTotal: { fontSize: 24, fontWeight: 'bold' },
});