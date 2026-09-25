import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '../Theme/Colors';

export default function TermsScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentColors.border }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/settings')} style={styles.backButton}>
          <Text style={[styles.backText, { color: currentColors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>Terms of Service</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.lastUpdated, { color: currentColors.textSecondary }]}>
          Last Updated: September 2026
        </Text>

        <Text style={[styles.heading, { color: currentColors.text }]}>1. Acceptance of Terms</Text>
        <Text style={[styles.paragraph, { color: currentColors.textSecondary }]}>
          By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
        </Text>

        <Text style={[styles.heading, { color: currentColors.text }]}>2. User Accounts</Text>
        <Text style={[styles.paragraph, { color: currentColors.textSecondary }]}>
          To use certain features of the app, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password.
        </Text>

        <Text style={[styles.heading, { color: currentColors.text }]}>3. Privacy Policy</Text>
        <Text style={[styles.paragraph, { color: currentColors.textSecondary }]}>
          Our Privacy Policy, which describes how we handle your personal data (including Firebase authentication data, saved payment methods, and shipping addresses) when you use our services, is incorporated into these Terms of Service.
        </Text>

        <Text style={[styles.heading, { color: currentColors.text }]}>4. Gamification & Daily Battles</Text>
        <Text style={[styles.paragraph, { color: currentColors.textSecondary }]}>
          Participation in the "Daily Battle" feature is strictly voluntary. Any promotional discounts or rewards earned through voting have no cash value and cannot be transferred or exchanged. We reserve the right to modify or cancel promotions at any time.
        </Text>

        <Text style={[styles.heading, { color: currentColors.text }]}>5. Limitation of Liability</Text>
        <Text style={[styles.paragraph, { color: currentColors.textSecondary }]}>
          In no event shall the app owners, directors, or employees be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
        </Text>

        <Text style={[styles.heading, { color: currentColors.text }]}>6. Modifications to the Service</Text>
        <Text style={[styles.paragraph, { color: currentColors.textSecondary }]}>
          We reserve the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
        </Text>

        <View style={styles.bottomSpacer} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '5%', paddingVertical: 15, borderBottomWidth: 1 },
  backButton: { padding: 5 },
  backText: { fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  
  container: { paddingHorizontal: '5%', paddingTop: 20, paddingBottom: 40 },
  
  lastUpdated: { fontSize: 14, fontStyle: 'italic', marginBottom: 25 },
  
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 15 },
  paragraph: { fontSize: 15, lineHeight: 24, marginBottom: 20 },
  
  bottomSpacer: { height: 40 }
});