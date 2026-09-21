import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import CustomButton from '../components/CustomButton';
import { Colors } from '../Theme/Colors';
import { useAuth } from '../store/AuthContext'; // 1. Import Auth Context

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth(); // 2. Grab the login function
  
  // 3. State to hold the text you type
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    await login(email, password); // Logs the user in
    router.back(); // Sends you back to the profile screen automatically
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.subHeader}>Sign in to continue to your store.</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your email" 
            placeholderTextColor={Colors.light.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail} // Updates state when you type
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your password" 
            placeholderTextColor={Colors.light.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword} // Updates state when you type
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* 4. Trigger the handleLogin function */}
          <CustomButton 
            title="Log In" 
            onPress={handleLogin} 
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: { flex: 1, paddingHorizontal: 20 },
  backButton: { marginTop: 10, paddingVertical: 10 },
  backText: { fontSize: 16, color: Colors.light.primary, fontWeight: '600' },
  headerContainer: { marginTop: 30, marginBottom: 40 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: Colors.light.text, marginBottom: 8 },
  subHeader: { fontSize: 16, color: Colors.light.textSecondary },
  formContainer: { flex: 1 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.light.text, marginBottom: 8 },
  input: { backgroundColor: Colors.light.surface, borderWidth: 1, borderColor: Colors.light.border, borderRadius: 8, padding: 16, marginBottom: 20, fontSize: 16, color: Colors.light.text },
  forgotPassword: { alignItems: 'flex-end', marginBottom: 30 },
  forgotText: { color: Colors.light.primary, fontWeight: '600' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 30 },
  footerText: { color: Colors.light.textSecondary, fontSize: 15 },
  signUpText: { color: Colors.light.primary, fontSize: 15, fontWeight: 'bold' }
});