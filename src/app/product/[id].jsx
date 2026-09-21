import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '../../components/CustomButton';
import { Colors } from '../../Theme/Colors';
import { PRODUCTS } from '../../constants/data';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext'; 

export default function ProductDetails() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const { addToCart } = useCart();
  
  const { wishlistItems, toggleWishlist } = useWishlist(); 

  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Product not found!</Text>
        <TouchableOpacity onPress={() => router.back()}><Text>Go Back</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isSaved = wishlistItems.some((item) => item.id === product.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => toggleWishlist(product)} 
            style={styles.heartButton}
          >
            <Text style={styles.heartIcon}>{isSaved ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Text style={styles.imageText}>Image for {product.title}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton 
            title="Add to Cart" 
            onPress={() => {
              addToCart(product);
              alert(`${product.title} added to cart!`);
            }} 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { flexGrow: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
  backButton: { paddingVertical: 10 },
  backText: { fontSize: 16, color: Colors.light.primary, fontWeight: '600' },
  heartButton: { padding: 10 },
  heartIcon: { fontSize: 24 },
  imageContainer: { width: '100%', height: 300, backgroundColor: Colors.light.surface, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  imageText: { color: Colors.light.textSecondary, fontSize: 18 },
  detailsContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.light.text, marginBottom: 8 },
  price: { fontSize: 22, fontWeight: '700', color: Colors.light.primary, marginBottom: 16 },
  description: { fontSize: 16, color: Colors.light.textSecondary, lineHeight: 24 },
  buttonContainer: { paddingHorizontal: 20, paddingBottom: 30, marginTop: 'auto' },
});