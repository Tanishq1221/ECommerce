import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 

import { Colors } from '../Theme/Colors';
import { db } from '../firebaseConfig'; 
import { useAuth } from '../store/AuthContext'; 

// Mock data for our first few battles
const BATTLE_PAIRS = [
  {
    id: 'b1',
    itemA: { name: 'Wireless Over-Ear Headphones', price: 199.99, image: '🎧' },
    itemB: { name: 'Noise-Canceling Earbuds', price: 149.99, image: '🔈' }
  },
  {
    id: 'b2',
    itemA: { name: 'Minimalist Smartwatch', price: 249.99, image: '⌚' },
    itemB: { name: 'Rugged Fitness Tracker', price: 129.99, image: '🏃‍♂️' }
  }
];

export default function BattleScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];
  
  const { user } = useAuth(); 

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  const currentBattle = BATTLE_PAIRS[currentIndex];

  const handleVote = async (choice, product) => {
    setHasVoted(true);
    
    try {
      await addDoc(collection(db, 'battleVotes'), {
        userId: user ? user.uid : 'guest',
        battleId: currentBattle.id,
        votedFor: choice,
        productName: product.name,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to save vote to Firebase:", error);
    }

    setTimeout(() => {
      if (currentIndex < BATTLE_PAIRS.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setHasVoted(false);
      } else {
        alert("You've voted on all battles today! Come back tomorrow.");
        // 🔥 NEW: Safe Navigation after voting finishes
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      }
    }, 1200); 
  };

  const renderProduct = (product, choice) => (
    <TouchableOpacity 
      style={[styles.productCard, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]} 
      onPress={() => !hasVoted && handleVote(choice, product)}
      activeOpacity={0.8}
    >
      <Text style={styles.emojiPlaceholder}>{product.image}</Text>
      <Text style={[styles.productName, { color: currentColors.text }]}>{product.name}</Text>
      <Text style={[styles.productPrice, { color: currentColors.primary }]}>${product.price}</Text>
      
      {hasVoted && (
        <View style={styles.voteOverlay}>
          <Text style={styles.voteText}>Voted! 🚀</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <View style={styles.header}>
        {/* 🔥 NEW: Safe Exit Navigation */}
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <Text style={[styles.backText, { color: currentColors.primary }]}>← Exit</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>Daily Battle ⚔️</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <Text style={[styles.subHeader, { color: currentColors.textSecondary }]}>
        Which one would you rather buy?
      </Text>

      <View style={styles.battleArena}>
        {renderProduct(currentBattle.itemA, 'A')}
        
        <View style={[styles.vsBadge, { backgroundColor: currentColors.primary }]}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        {renderProduct(currentBattle.itemB, 'B')}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '5%', paddingTop: 10 },
  backText: { fontSize: 16, fontWeight: '600', padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  subHeader: { textAlign: 'center', fontSize: 16, marginVertical: 20 },
  battleArena: { flex: 1, paddingHorizontal: '5%', paddingBottom: 40, justifyContent: 'space-between' },
  productCard: { flex: 1, borderRadius: 20, borderWidth: 2, alignItems: 'center', justifyContent: 'center', padding: '5%', marginBottom: 10, marginTop: 10, overflow: 'hidden' },
  emojiPlaceholder: { fontSize: 60, marginBottom: 15 },
  productName: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  productPrice: { fontSize: 16, fontWeight: '600' },
  vsBadge: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -15 }, { translateY: -15 }], zIndex: 10, width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  vsText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  voteOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  voteText: { color: 'white', fontSize: 24, fontWeight: 'bold' }
});