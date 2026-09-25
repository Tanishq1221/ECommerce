import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, Image, useColorScheme, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '../../Theme/Colors';
import { PRODUCTS, CATEGORIES } from '../../constants/data'; 

export default function HomeScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];
  
  const { width } = useWindowDimensions(); 
  const cardWidth = (width - 55) / 2; 

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('All');

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryId === 'All' || product.categoryId === activeCategoryId;
    return matchesSearch && matchesCategory;
  });

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={[styles.productCard, { width: cardWidth, backgroundColor: currentColors.surface, borderColor: currentColors.border }]} 
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={[styles.productTitle, { color: currentColors.text }]} numberOfLines={1}>{item.title}</Text>
      <Text style={[styles.productPrice, { color: currentColors.primary }]}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>Shop by Category</Text>
          <Text style={[styles.subHeader, { color: currentColors.textSecondary }]}>Welcome to your new store!</Text>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: currentColors.text }]}
            placeholder="Search for sneakers, watches..."
            placeholderTextColor={currentColors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery} 
          />
        </View>

        <TouchableOpacity 
          style={[styles.battleBanner, { backgroundColor: currentColors.primary }]}
          onPress={() => router.push('/battle')}
          activeOpacity={0.8}
        >
          <Text style={styles.battleBannerTitle}>🔥 Play Daily Battle ⚔️</Text>
          <Text style={styles.battleBannerSub}>Vote for your favorite products to unlock deals!</Text>
        </TouchableOpacity>

        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoryScroll}
          >
            <TouchableOpacity
              style={[
                styles.categoryBtn, 
                { backgroundColor: currentColors.surface, borderColor: currentColors.border },
                activeCategoryId === 'All' && { backgroundColor: currentColors.primary, borderColor: currentColors.primary }
              ]}
              onPress={() => setActiveCategoryId('All')}
            >
              <Text style={styles.categoryIcon}>🛒</Text>
              <Text style={[
                styles.categoryText, 
                { color: currentColors.textSecondary },
                activeCategoryId === 'All' && styles.activeCategoryText
              ]}>All</Text>
            </TouchableOpacity>

            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryBtn, 
                  { backgroundColor: currentColors.surface, borderColor: currentColors.border },
                  activeCategoryId === cat.id && { backgroundColor: currentColors.primary, borderColor: currentColors.primary }
                ]}
                onPress={() => setActiveCategoryId(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryText, 
                  { color: currentColors.textSecondary },
                  activeCategoryId === cat.id && styles.activeCategoryText
                ]}>
                  {cat.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Featured Products</Text>

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: currentColors.textSecondary }]}>No products found in this category.</Text>
          }
        />

        <TouchableOpacity 
          style={[styles.aiFab, { backgroundColor: currentColors.primary }]}
          onPress={() => router.push('/ai-assistant')}
        >
          <Text style={styles.aiFabIcon}>✨</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: '5%', paddingTop: 10 }, 
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  subHeader: { fontSize: 14, marginBottom: 20 },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 15, marginBottom: 20, borderWidth: 1 },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  
  battleBanner: { padding: 16, borderRadius: 12, marginBottom: 20, alignItems: 'center', justifyContent: 'center', width: '100%' },
  battleBannerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  battleBannerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '500' },
  
  categoryScroll: { flexDirection: 'row', gap: 12, paddingBottom: 20 },
  categoryBtn: { alignItems: 'center', padding: 12, borderRadius: 12, minWidth: 80, borderWidth: 1 },
  categoryIcon: { fontSize: 24, marginBottom: 5 },
  categoryText: { fontSize: 12, fontWeight: '500' },
  activeCategoryText: { color: 'white', fontWeight: 'bold' },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  
  row: { justifyContent: 'space-between' },
  productCard: { borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1 }, 
  productImage: { width: '100%', aspectRatio: 1, borderRadius: 8, marginBottom: 10, resizeMode: 'cover' }, 
  productTitle: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  productPrice: { fontSize: 14, fontWeight: 'bold' },
  
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
  
  aiFab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  aiFabIcon: { fontSize: 28 }
});