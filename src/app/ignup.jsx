import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import CustomButton from '../components/CustomButton';
import { Colors } from '../Theme/Colors';
import { useAuth } from '../store/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  
  // Dark mode integration
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];

  const { signup } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setIsProcessing(true);
    
    // Call the signup function from your AuthContext
    const result = await signup(email, password);
    
    setIsProcessing(false);

    if (result.success) {
      alert("Signup Successful! Welcome to the app! 🎉");
      router.replace('/'); // Send them to the Home screen
    } else {
      // THIS WILL TELL US EXACTLY WHY IT FAILS
      alert("FIREBASE SAYS: " + result.error); 
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <View style={styles.container}>
        
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: currentColors.primary }]}>← Back to Login</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: currentColors.text }]}>Create Account</Text>
        <Text style={[styles.subHeader, { color: currentColors.textSecondary }]}>Sign up to start shopping!</Text>

        <View style={styles.inputContainer}>
          <TextInput 
            style={[styles.input, { backgroundColor: currentColors.surface, borderColor: currentColors.border, color: currentColors.text }]} 
            placeholder="Email Address" 
            placeholderTextColor={currentColors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput 
            style={[styles.input, { backgroundColor: currentColors.surface, borderColor: currentColors.border, color: currentColors.text }]} 
            placeholder="Password (Min 6 characters)" 
            placeholderTextColor={currentColors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {isProcessing ? (
          <ActivityIndicator size="large" color={currentColors.primary} style={{ marginTop: 20 }} />
        ) : (
          <CustomButton 
            title="Sign Up" 
            onPress={handleRegister} 
          />
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  backButton: { marginBottom: 20, alignSelf: 'flex-start' },
  backText: { fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subHeader: { fontSize: 16, marginBottom: 30 },
  inputContainer: { marginBottom: 30 },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 15, fontSize: 16 },
});