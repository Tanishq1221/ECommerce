import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import CustomButton from '../components/CustomButton';
import { Colors } from '../Theme/Colors';
import { useCart } from '../store/CartContext';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems } = useCart();

  const finalTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back to Cart</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Checkout</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Details</Text>
          <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={Colors.light.textSecondary} />
          <TextInput style={styles.input} placeholder="Street Address" placeholderTextColor={Colors.light.textSecondary} />
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Total to Pay:</Text>
          <Text style={styles.summaryTotal}>${finalTotal.toFixed(2)}</Text>
        </View>

        <CustomButton 
          title="Place Order" 
          onPress={() => {
            alert('Order Placed! (Backend connection coming in Phase 5)');
            router.replace('/'); 
          }} 
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 30 },
  backButton: { marginTop: 10, marginBottom: 20 },
  backText: { fontSize: 16, color: Colors.light.primary, fontWeight: '600' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.light.text, marginBottom: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.light.text, marginBottom: 12 },
  input: { backgroundColor: Colors.light.surface, borderWidth: 1, borderColor: Colors.light.border, borderRadius: 8, padding: 15, marginBottom: 10, fontSize: 16, color: Colors.light.text },
  summaryBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, borderTopWidth: 1, borderTopColor: Colors.light.border, marginBottom: 20 },
  summaryText: { fontSize: 18, fontWeight: '600', color: Colors.light.text },
  summaryTotal: { fontSize: 24, fontWeight: 'bold', color: Colors.light.primary },
});