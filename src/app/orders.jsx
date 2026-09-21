import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '../Theme/Colors';
import { useOrders } from '../store/OrdersContext';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrders(); // Fetching the saved orders

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.itemCount}>{item.items.length} item(s)</Text>
        <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Orders</Text>

        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { flex: 1, paddingHorizontal: 20 },
  backButton: { marginTop: 10, paddingVertical: 10, alignSelf: 'flex-start' },
  backText: { fontSize: 16, color: Colors.light.primary, fontWeight: '600' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.light.text, marginVertical: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: Colors.light.textSecondary },
  orderCard: { backgroundColor: Colors.light.surface, padding: 20, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: Colors.light.border },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: Colors.light.text },
  orderDate: { fontSize: 14, color: Colors.light.textSecondary },
  orderDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.light.border },
  itemCount: { fontSize: 15, color: Colors.light.textSecondary },
  orderTotal: { fontSize: 18, fontWeight: 'bold', color: Colors.light.primary }
});