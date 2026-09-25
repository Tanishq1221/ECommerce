import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import CustomButton from '../components/CustomButton';
import { Colors } from '../Theme/Colors';

const FAQS = [
  {
    id: '1',
    question: 'How do I track my order?',
    answer: 'Once your order ships, you will receive an email with a tracking link. You can also view real-time updates in the "Orders" tab on your profile.'
  },
  {
    id: '2',
    question: 'What is the Daily Battle? ⚔️',
    answer: 'The Daily Battle is a fun mini-game where you vote between two products. By participating, you can unlock exclusive discounts and help decide which items go on sale!'
  },
  {
    id: '3',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day money-back guarantee. If you are not satisfied with your purchase, you can return it in its original packaging for a full refund.'
  },
  {
    id: '4',
    question: 'How does the AI Assistant work?',
    answer: 'Our AI Assistant is like a virtual store clerk. Just type what you are looking for (like "sneakers under $100"), and it will instantly search our inventory to find the best matches.'
  },
  {
    id: '5',
    question: 'Can I change my shipping address?',
    answer: 'Yes! You can manage and update your default shipping locations anytime in Settings > Shipping Addresses.'
  }
];

export default function HelpScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];
  
  // Tracks which FAQ question is currently open
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    // If clicking the already open one, close it. Otherwise, open the new one.
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@yourecommerceapp.com?subject=App Support Request');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentColors.border }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/settings')} style={styles.backButton}>
          <Text style={[styles.backText, { color: currentColors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>Help & FAQ</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Frequently Asked Questions</Text>
        <Text style={[styles.sectionSub, { color: currentColors.textSecondary }]}>Find quick answers to common questions below.</Text>

        <View style={[styles.faqContainer, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
          {FAQS.map((faq, index) => {
            const isExpanded = expandedId === faq.id;
            const isLast = index === FAQS.length - 1;
            
            return (
              <View key={faq.id} style={[styles.faqItem, !isLast && { borderBottomColor: currentColors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
                <TouchableOpacity 
                  style={styles.faqQuestionRow} 
                  onPress={() => toggleExpand(faq.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.faqQuestion, { color: currentColors.text }]}>{faq.question}</Text>
                  <Text style={[styles.faqIcon, { color: currentColors.primary }]}>
                    {isExpanded ? '−' : '+'}
                  </Text>
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={[styles.faqAnswer, { color: currentColors.textSecondary }]}>
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: currentColors.text, marginTop: 30 }]}>Still need help?</Text>
        <View style={[styles.contactCard, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
          <Text style={styles.contactEmoji}>💬</Text>
          <Text style={[styles.contactTitle, { color: currentColors.text }]}>Contact Support</Text>
          <Text style={[styles.contactDesc, { color: currentColors.textSecondary }]}>
            Our team is available 24/7 to help you with your orders and account.
          </Text>
          <View style={styles.buttonWrapper}>
            <CustomButton title="Email Us" onPress={handleEmailSupport} />
          </View>
        </View>

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
  
  container: { paddingHorizontal: '5%', paddingTop: 25, paddingBottom: 50 },
  
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  sectionSub: { fontSize: 15, marginBottom: 20 },
  
  faqContainer: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  faqItem: { paddingVertical: 5 },
  faqQuestionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  faqQuestion: { fontSize: 16, fontWeight: '600', flex: 1, paddingRight: 15 },
  faqIcon: { fontSize: 24, fontWeight: '300' },
  
  faqAnswerContainer: { paddingHorizontal: 15, paddingBottom: 15, paddingTop: 5 },
  faqAnswer: { fontSize: 15, lineHeight: 22 },
  
  contactCard: { borderRadius: 12, borderWidth: 1, padding: 20, alignItems: 'center', marginTop: 15 },
  contactEmoji: { fontSize: 40, marginBottom: 10 },
  contactTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  contactDesc: { fontSize: 14, textAlign: 'center', marginBottom: 20, paddingHorizontal: 10, lineHeight: 20 },
  buttonWrapper: { width: '100%' }
});