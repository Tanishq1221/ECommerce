import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import CustomButton from '../components/CustomButton';
import { Colors } from '../Theme/Colors';
import { useAuth } from '../store/AuthContext'; 

export default function EditProfileScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];
  
  const { user } = useAuth(); // Grabs the logged-in user's data from Firebase

  // State for our form fields (pre-filled with Firebase data if available)
  const [name, setName] = useState('Tanishq Pandey'); 
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  
  const handleSave = () => {
    // Here is where you would normally update Firebase Firestore with the new data
    alert('Profile Updated Successfully! ✅');
    router.back(); // Go back to settings after saving
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={[styles.header, { borderBottomColor: currentColors.border }]}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/settings')} style={styles.backButton}>
            <Text style={[styles.backText, { color: currentColors.primary }]}>← Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>Edit Profile</Text>
          <View style={{ width: 65 }} /> {/* Spacer to keep title centered */}
        </View>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          {/* Avatar Profile Picture Bubble */}
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarCircle, { backgroundColor: currentColors.primary }]}>
              <Text style={styles.avatarText}>TP</Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.changePhotoText, { color: currentColors.primary }]}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentColors.textSecondary }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentColors.surface, color: currentColors.text, borderColor: currentColors.border }]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={currentColors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentColors.textSecondary }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentColors.surface, color: currentColors.textSecondary, borderColor: currentColors.border }]}
              value={email}
              editable={false} // Email is usually locked to the Firebase account
            />
            <Text style={[styles.helperText, { color: currentColors.textSecondary }]}>Email cannot be changed directly.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentColors.textSecondary }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentColors.surface, color: currentColors.text, borderColor: currentColors.border }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 000-0000"
              placeholderTextColor={currentColors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton title="Save Changes" onPress={handleSave} />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '5%', paddingVertical: 15, borderBottomWidth: 1 },
  backButton: { padding: 5 },
  backText: { fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  
  container: { paddingHorizontal: '5%', paddingTop: 30, paddingBottom: 40 },
  
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: 'white' },
  changePhotoText: { fontSize: 16, fontWeight: '600' },
  
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 14, fontSize: 16 },
  helperText: { fontSize: 12, marginTop: 6, marginLeft: 4 },
  
  buttonContainer: { marginTop: 20 }
});