import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomButton from '../components/CustomButton';
import { Colors } from '../Theme/Colors';

export default function ShippingScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@saved_addresses');
        if (savedData) setAddresses(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to load addresses", error);
      }
    };
    loadAddresses();
  }, []);

  const saveAddresses = async (newAddresses) => {
    setAddresses(newAddresses);
    await AsyncStorage.setItem('@saved_addresses', JSON.stringify(newAddresses));
  };

  const handleAddAddress = () => {
    if (!name || !street || !city) {
      alert("Please fill out all fields.");
      return;
    }
    
    const newAddress = {
      id: Date.now().toString(),
      name,
      street,
      city
    };

    saveAddresses([...addresses, newAddress]);
    
    setName('');
    setStreet('');
    setCity('');
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const filtered = addresses.filter(addr => addr.id !== id);
    saveAddresses(filtered);
  };

  const renderAddress = ({ item }) => (
    <View style={[styles.addressCard, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
      <View style={styles.addressInfo}>
        <Text style={[styles.nameText, { color: currentColors.text }]}>{item.name}</Text>
        <Text style={[styles.addressText, { color: currentColors.textSecondary }]}>{item.street}</Text>
        <Text style={[styles.addressText, { color: currentColors.textSecondary }]}>{item.city}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      {/* 🔥 Safe Keyboard handling for both iOS and Android */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.container}
      >
        
        {/* 🔥 Safe Navigation */}
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/settings')} style={styles.backButton}>
          <Text style={[styles.backText, { color: currentColors.primary }]}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>Saved Addresses</Text>
          {!showForm && (
            <TouchableOpacity onPress={() => setShowForm(true)}>
              <Text style={[styles.addText, { color: currentColors.primary }]}>+ Add New</Text>
            </TouchableOpacity>
          )}
        </View>

        {showForm ? (
          <View style={[styles.formContainer, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
            <Text style={[styles.formTitle, { color: currentColors.text }]}>New Shipping Address</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: currentColors.background, borderColor: currentColors.border, color: currentColors.text }]} 
              placeholder="Full Name" placeholderTextColor={currentColors.textSecondary}
              value={name} onChangeText={setName}
            />
            <TextInput 
              style={[styles.input, { backgroundColor: currentColors.background, borderColor: currentColors.border, color: currentColors.text }]} 
              placeholder="Street Address" placeholderTextColor={currentColors.textSecondary}
              value={street} onChangeText={setStreet}
            />
            <TextInput 
              style={[styles.input, { backgroundColor: currentColors.background, borderColor: currentColors.border, color: currentColors.text }]} 
              placeholder="City & ZIP Code" placeholderTextColor={currentColors.textSecondary}
              value={city} onChangeText={setCity}
            />
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
                <Text style={[styles.cancelText, { color: currentColors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <CustomButton title="Save Address" onPress={handleAddAddress} />
              </View>
            </View>
          </View>
        ) : (
          <FlatList
            data={addresses}
            renderItem={renderAddress}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: currentColors.textSecondary }]}>No saved addresses yet.</Text>
                <CustomButton title="Add Your First Address" onPress={() => setShowForm(true)} />
              </View>
            }
          />
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  // 🔥 Percentage-based padding for responsiveness
  container: { flex: 1, paddingHorizontal: '5%' },
  backButton: { marginTop: 10, paddingVertical: 10, alignSelf: 'flex-start' },
  backText: { fontSize: 16, fontWeight: '600' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  addText: { fontSize: 16, fontWeight: 'bold' },
  
  addressCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '5%', borderRadius: 12, marginBottom: 15, borderWidth: 1 },
  addressInfo: { flex: 1 },
  nameText: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  addressText: { fontSize: 15, marginBottom: 2 },
  deleteButton: { padding: 10 },
  deleteIcon: { fontSize: 20 },

  formContainer: { padding: '5%', borderRadius: 12, borderWidth: 1 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  formActions: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  cancelBtn: { padding: 15 },
  cancelText: { fontSize: 16, fontWeight: '600' },
  
  emptyContainer: { alignItems: 'center', marginTop: '15%' },
  emptyText: { fontSize: 16, marginBottom: 20 }
});