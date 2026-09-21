import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '../../Theme/Colors';
// 1. Import BOTH PRODUCTS and your custom CATEGORIES
import { PRODUCTS, CATEGORIES } from '../../constants/data'; 

export default function HomeScreen() {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('All');

  // 2. Filter using your categoryId instead of text
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryId === 'All' || product.categoryId === activeCategoryId;
    
    return matchesSearch && matchesCategory;
  });

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.imagePlaceholder}>
        <Text style={styles.cartIcon}>🛒</Text>
      </View>
      <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shop by Category</Text>
          <Text style={styles.subHeader}>Welcome to your new store!</Text>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for sneakers, watches..."
            placeholderTextColor={Colors.light.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery} 
          />
        </View>

        {/* 3. Horizontal ScrollView for your expanded category list */}
        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoryScroll}
          >
            {/* Hardcoded 'All' Button */}
            <TouchableOpacity
              style={[styles.categoryBtn, activeCategoryId === 'All' && styles.activeCategoryBtn]}
              onPress={() => setActiveCategoryId('All')}
            >
              <Text style={styles.categoryIcon}>🛒</Text>
              <Text style={[styles.categoryText, activeCategoryId === 'All' && styles.activeCategoryText]}>All</Text>
            </TouchableOpacity>

            {/* Dynamically load your categories from data.js */}
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryBtn, activeCategoryId === cat.id && styles.activeCategoryBtn]}
                onPress={() => setActiveCategoryId(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryText, activeCategoryId === cat.id && styles.activeCategoryText]}>
                  {cat.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Featured Products</Text>

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products found in this category.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.light.text },
  subHeader: { fontSize: 14, color: Colors.light.textSecondary, marginBottom: 20 },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: 12, paddingHorizontal: 15, marginBottom: 20, borderWidth: 1, borderColor: Colors.light.border },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: Colors.light.text },
  
  categoryScroll: { flexDirection: 'row', gap: 12, paddingBottom: 20 },
  categoryBtn: { alignItems: 'center', padding: 12, borderRadius: 12, backgroundColor: Colors.light.surface, width: 80, borderWidth: 1, borderColor: Colors.light.border },
  activeCategoryBtn: { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
  categoryIcon: { fontSize: 24, marginBottom: 5 },
  categoryText: { fontSize: 12, color: Colors.light.textSecondary, fontWeight: '500' },
  activeCategoryText: { color: 'white', fontWeight: 'bold' },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.light.text, marginBottom: 15 },
  
  row: { justifyContent: 'space-between' },
  productCard: { width: '48%', backgroundColor: Colors.light.surface, borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: Colors.light.border },
  imagePlaceholder: { width: '100%', height: 100, backgroundColor: Colors.light.background, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  cartIcon: { fontSize: 30, opacity: 0.2 },
  productTitle: { fontSize: 14, fontWeight: '600', color: Colors.light.text, marginBottom: 5 },
  productPrice: { fontSize: 14, fontWeight: 'bold', color: Colors.light.primary },
  
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: Colors.light.textSecondary }
});