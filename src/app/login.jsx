import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import CustomButton from '../components/CustomButton';
import { Colors } from '../Theme/Colors';
import { useAuth } from '../store/AuthContext'; 

export default function LoginScreen() {
  const router = useRouter();
  const { login, signup } = useAuth(); 
  
  // Dark mode integration
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); 

  const handleAuthentication = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    let response;
    if (isLogin) {
      response = await login(email, password);
    } else {
      response = await signup(email, password);
    }

    if (response.success) {
      router.back(); 
    } else {
      alert(response.error); 
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: currentColors.primary }]}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={[styles.subHeader, { color: currentColors.textSecondary }]}>
            {isLogin ? 'Sign in to continue to your store.' : 'Sign up to save your cart and orders.'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={[styles.inputLabel, { color: currentColors.text }]}>Email</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: currentColors.surface, borderColor: currentColors.border, color: currentColors.text }]} 
            placeholder="Enter your email" 
            placeholderTextColor={currentColors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail} 
          />

          <Text style={[styles.inputLabel, { color: currentColors.text }]}>Password</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: currentColors.surface, borderColor: currentColors.border, color: currentColors.text }]} 
            placeholder="Enter your password" 
            placeholderTextColor={currentColors.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword} 
          />

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotText, { color: currentColors.primary }]}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <CustomButton 
            title={isLogin ? 'Log In' : 'Sign Up'} 
            onPress={handleAuthentication} 
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: currentColors.textSecondary }]}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={[styles.signUpText, { color: currentColors.primary }]}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  backButton: { marginTop: 10, paddingVertical: 10, alignSelf: 'flex-start' },
  backText: { fontSize: 16, fontWeight: '600' },
  headerContainer: { marginTop: 30, marginBottom: 40 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subHeader: { fontSize: 16 },
  formContainer: { flex: 1 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 16, marginBottom: 20, fontSize: 16 },
  forgotPassword: { alignItems: 'flex-end', marginBottom: 30 },
  forgotText: { fontWeight: '600' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 30 },
  footerText: { fontSize: 15 },
  signUpText: { fontSize: 15, fontWeight: 'bold' }
});