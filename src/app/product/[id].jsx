import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import CustomButton from '../../components/CustomButton';
import { Colors } from '../../Theme/Colors';
import { PRODUCTS } from '../../constants/data';
import { useCart } from '../../store/CartContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];

  // Safely handle the back navigation
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/'); // Fallback to home if no history exists
    }
  };

  const product = PRODUCTS.find((p) => p.id === id);

  // If the product doesn't exist, show a clean error screen instead of broken charts
  if (!product) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.title, { color: currentColors.text, marginBottom: 20 }]}>Product Not Found 🕵️‍♂️</Text>
        <CustomButton title="Return to Home" onPress={() => router.replace('/')} />
      </SafeAreaView>
    );
  }

  const priceHistory = [
    { label: '30d ago', price: Math.round(product.price * 1.18) },
    { label: '20d ago', price: Math.round(product.price * 1.12) },
    { label: '10d ago', price: Math.round(product.price * 1.05) },
    { label: '5d ago', price: Math.round(product.price * 1.08) },
    { label: 'Today', price: product.price },
  ];

  const prices = priceHistory.map((entry) => entry.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const isLowestPrice = product.price <= minPrice;

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.title} added to cart! 🛒`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={[styles.backText, { color: currentColors.primary }]}>← Back</Text>
        </TouchableOpacity>

        <View style={[styles.imageContainer, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={[styles.title, { color: currentColors.text }]}>{product.title}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.currentPrice, { color: currentColors.primary }]}>
              ${product.price.toFixed(2)}
            </Text>
            {isLowestPrice && (
              <View style={styles.dealBadge}>
                <Text style={styles.dealBadgeText}>🔥 All-Time Low</Text>
              </View>
            )}
          </View>

          <View style={[styles.historyCard, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
            <View style={styles.historyHeader}>
              <Text style={[styles.historyTitle, { color: currentColors.text }]}>Price History (30 Days)</Text>
              <Text style={[styles.historySub, { color: currentColors.textSecondary }]}>
                Lowest: ${minPrice.toFixed(2)}
              </Text>
            </View>

            <View style={styles.chartContainer}>
              {priceHistory.map((item, index) => {
                const heightPercentage = Math.max(30, ((item.price - minPrice + 10) / (maxPrice - minPrice + 10)) * 100);
                const isCurrent = index === priceHistory.length - 1;

                return (
                  <View key={index} style={styles.chartColumn}>
                    <Text style={[styles.barPrice, { color: currentColors.textSecondary }]}>
                      ${item.price}
                    </Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${heightPercentage}%`,
                            backgroundColor: isCurrent ? currentColors.primary : currentColors.border,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.barLabel, { color: isCurrent ? currentColors.primary : currentColors.textSecondary }]}>
                      {item.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <Text style={[styles.sectionHeading, { color: currentColors.text }]}>Description</Text>
          <Text style={[styles.description, { color: currentColors.textSecondary }]}>
            {product.description || 'Premium quality materials crafted for longevity and top performance. Designed for everyday use with comfort and utility in mind.'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton title="Add to Cart" onPress={handleAddToCart} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: '5%', paddingBottom: 40 },
  backButton: { marginVertical: 12, alignSelf: 'flex-start', padding: 8 },
  backText: { fontSize: 16, fontWeight: '600' },

  imageContainer: { width: '100%', aspectRatio: 1, borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: '5%' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  detailsContainer: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: '5%', gap: 12 },
  currentPrice: { fontSize: 26, fontWeight: 'bold' },
  dealBadge: { backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  dealBadgeText: { color: 'white', fontWeight: 'bold', fontSize: 13 },

  historyCard: { borderWidth: 1, borderRadius: 14, padding: '5%', marginBottom: '6%' },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  historyTitle: { fontSize: 15, fontWeight: '700' },
  historySub: { fontSize: 13, fontWeight: '600' },

  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, paddingTop: 10 },
  chartColumn: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
  barPrice: { fontSize: 10, marginBottom: 4, fontWeight: '600' },
  barTrack: { width: '40%', minWidth: 10, maxWidth: 20, flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 10, marginTop: 6, fontWeight: '500' },

  sectionHeading: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  description: { fontSize: 15, lineHeight: 22, marginBottom: 25 },
  buttonContainer: { marginTop: 10 }
});