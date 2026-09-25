import { useState, useEffect } from 'react';
// 🔥 FIX: Added ScrollView to the imports below!
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomButton from '../components/CustomButton';
import { Colors } from '../Theme/Colors';

export default function PaymentsScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];

  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    const loadCards = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@saved_cards');
        if (savedData) setCards(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to load cards", error);
      }
    };
    loadCards();
  }, []);

  const saveCards = async (newCards) => {
    setCards(newCards);
    await AsyncStorage.setItem('@saved_cards', JSON.stringify(newCards));
  };

  const handleAddCard = () => {
    if (!cardName || !cardNumber || !expiry || !cvc) {
      alert("Please fill out all fields.");
      return;
    }
    
    const last4 = cardNumber.slice(-4);
    
    const newCard = {
      id: Date.now().toString(),
      name: cardName,
      last4: last4.length === 4 ? last4 : '1234',
      expiry,
      isDefault: cards.length === 0 
    };

    saveCards([...cards, newCard]);
    
    setCardName('');
    setCardNumber('');
    setExpiry('');
    setCvc('');
    setShowForm(false);
  };

  const handleSetDefault = (id) => {
    setCards(prev => prev.map(card => ({
      ...card,
      isDefault: card.id === id
    })));
  };

  const handleDelete = (id) => {
    const filtered = cards.filter(card => card.id !== id);
    if (filtered.length > 0 && cards.find(c => c.id === id)?.isDefault) {
      filtered[0].isDefault = true;
    }
    saveCards(filtered);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.cardContainer, 
        { 
          backgroundColor: currentColors.surface, 
          borderColor: item.isDefault ? currentColors.primary : currentColors.border 
        }
      ]}
      onPress={() => handleSetDefault(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardBrand, { color: currentColors.text }]}>💳 Credit Card</Text>
        {item.isDefault && (
          <View style={[styles.defaultBadge, { backgroundColor: currentColors.primary }]}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>
      
      <Text style={[styles.cardNumber, { color: currentColors.textSecondary }]}>
        •••• •••• •••• {item.last4}
      </Text>
      
      <View style={styles.cardFooter}>
        <View>
          <Text style={[styles.cardLabel, { color: currentColors.textSecondary }]}>Cardholder</Text>
          <Text style={[styles.cardValue, { color: currentColors.text }]}>{item.name}</Text>
        </View>
        <View style={styles.expiryContainer}>
          <Text style={[styles.cardLabel, { color: currentColors.textSecondary }]}>Expires</Text>
          <Text style={[styles.cardValue, { color: currentColors.text }]}>{item.expiry}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Text style={[styles.deleteText, { color: '#FF3B30' }]}>Remove</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        
        <View style={[styles.header, { borderBottomColor: currentColors.border }]}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/settings')} style={styles.backButton}>
            <Text style={[styles.backText, { color: currentColors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>Payment Methods</Text>
          <View style={{ width: 50 }} />
        </View>

        {showForm ? (
          <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
            <Text style={[styles.formTitle, { color: currentColors.text }]}>Add New Card</Text>
            
            <TextInput 
              style={[styles.input, { backgroundColor: currentColors.surface, borderColor: currentColors.border, color: currentColors.text }]} 
              placeholder="Name on Card" placeholderTextColor={currentColors.textSecondary}
              value={cardName} onChangeText={setCardName}
            />
            <TextInput 
              style={[styles.input, { backgroundColor: currentColors.surface, borderColor: currentColors.border, color: currentColors.text }]} 
              placeholder="Card Number" placeholderTextColor={currentColors.textSecondary}
              keyboardType="number-pad" maxLength={16}
              value={cardNumber} onChangeText={setCardNumber}
            />
            
            <View style={styles.row}>
              <TextInput 
                style={[styles.input, styles.halfInput, { backgroundColor: currentColors.surface, borderColor: currentColors.border, color: currentColors.text }]} 
                placeholder="MM/YY" placeholderTextColor={currentColors.textSecondary}
                maxLength={5}
                value={expiry} onChangeText={setExpiry}
              />
              <TextInput 
                style={[styles.input, styles.halfInput, { backgroundColor: currentColors.surface, borderColor: currentColors.border, color: currentColors.text }]} 
                placeholder="CVC" placeholderTextColor={currentColors.textSecondary}
                keyboardType="number-pad" maxLength={4} secureTextEntry
                value={cvc} onChangeText={setCvc}
              />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
                <Text style={[styles.cancelText, { color: currentColors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <CustomButton title="Save Card" onPress={handleAddCard} />
              </View>
            </View>
          </ScrollView>
        ) : (
          <>
            <FlatList
              data={cards}
              renderItem={renderCard}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: currentColors.textSecondary }]}>No payment methods saved.</Text>
                </View>
              }
            />
            
            <View style={[styles.footer, { backgroundColor: currentColors.background, borderTopColor: currentColors.border }]}>
              <CustomButton title="+ Add New Card" onPress={() => setShowForm(true)} />
            </View>
          </>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '5%', paddingVertical: 15, borderBottomWidth: 1 },
  backButton: { padding: 5 },
  backText: { fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  
  listContainer: { paddingHorizontal: '5%', paddingTop: 20, paddingBottom: 40 },
  
  cardContainer: { borderWidth: 2, borderRadius: 16, padding: 20, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardBrand: { fontSize: 18, fontWeight: 'bold' },
  defaultBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  defaultText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  
  cardNumber: { fontSize: 22, letterSpacing: 2, marginBottom: 20 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  expiryContainer: { alignItems: 'flex-end' },
  cardLabel: { fontSize: 12, textTransform: 'uppercase', marginBottom: 4 },
  cardValue: { fontSize: 15, fontWeight: '600' },
  
  deleteButton: { alignSelf: 'flex-end', paddingVertical: 5 },
  deleteText: { fontSize: 14, fontWeight: 'bold' },

  formContainer: { paddingHorizontal: '5%', paddingTop: 25 },
  formTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  
  formActions: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  cancelBtn: { padding: 15 },
  cancelText: { fontSize: 16, fontWeight: '600' },
  
  footer: { paddingHorizontal: '5%', paddingVertical: 15, borderTopWidth: 1 },
  
  emptyContainer: { alignItems: 'center', marginTop: '15%' },
  emptyText: { fontSize: 16, marginBottom: 20 }
});