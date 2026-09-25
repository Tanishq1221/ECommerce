import { View, Text, StyleSheet, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '../Theme/Colors';
import { useOrders } from '../store/OrdersContext';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrders(); 
  
  // 1. Dark Mode setup
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];

  // 2. Helper to format Firebase timestamps into readable dates
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Processing...';
    // Check if it's a Firebase timestamp with a toDate() method
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return 'Recent';
  };

  const renderOrder = ({ item }) => (
    <View style={[styles.orderCard, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
      <View style={styles.orderHeader}>
        <Text style={[styles.orderId, { color: currentColors.text }]}>Order #{item.id.slice(-6).toUpperCase()}</Text>
        <Text style={[styles.orderDate, { color: currentColors.textSecondary }]}>{formatDate(item.createdAt)}</Text>
      </View>
      <View style={[styles.orderDetails, { borderTopColor: currentColors.border }]}>
        <Text style={[styles.itemCount, { color: currentColors.textSecondary }]}>{item.items?.length || 0} item(s)</Text>
        <Text style={[styles.orderTotal, { color: currentColors.primary }]}>${item.total?.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: currentColors.primary }]}>← Back</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: currentColors.text }]}>My Orders</Text>

        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: currentColors.textSecondary }]}>You haven't placed any orders yet.</Text>
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

// Hardcoded colors removed from the stylesheet
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  backButton: { marginTop: 10, paddingVertical: 10, alignSelf: 'flex-start' },
  backText: { fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginVertical: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18 },
  orderCard: { padding: 20, borderRadius: 12, marginBottom: 15, borderWidth: 1 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontSize: 16, fontWeight: 'bold' },
  orderDate: { fontSize: 14 },
  orderDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1 },
  itemCount: { fontSize: 15 },
  orderTotal: { fontSize: 18, fontWeight: 'bold' }
});