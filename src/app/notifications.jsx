import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '../Theme/Colors';

export default function NotificationsScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];

  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    deliveryAlerts: true,
    battleReminders: true,
    promotions: false,
    newArrivals: false
  });

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedPrefs = await AsyncStorage.getItem('@notification_prefs');
        if (savedPrefs) {
          setPreferences(JSON.parse(savedPrefs));
        }
      } catch (error) {
        console.error("Failed to load notification preferences", error);
      }
    };
    loadPreferences();
  }, []);

  const togglePreference = async (key) => {
    const updatedPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(updatedPrefs);
    try {
      await AsyncStorage.setItem('@notification_prefs', JSON.stringify(updatedPrefs));
    } catch (error) {
      console.error("Failed to save notification preferences", error);
    }
  };

  const ToggleRow = ({ title, description, value, onToggle }) => (
    <View style={[styles.toggleRow, { borderBottomColor: currentColors.border }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.toggleTitle, { color: currentColors.text }]}>{title}</Text>
        <Text style={[styles.toggleDesc, { color: currentColors.textSecondary }]}>{description}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onToggle} 
        trackColor={{ true: currentColors.primary, false: currentColors.border }}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      
      <View style={[styles.header, { borderBottomColor: currentColors.border }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/settings')} style={styles.backButton}>
          <Text style={[styles.backText, { color: currentColors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>Notifications</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.sectionTitle, { color: currentColors.textSecondary }]}>Orders & Deliveries</Text>
        <View style={[styles.sectionCard, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
          <ToggleRow 
            title="Order Updates" 
            description="Confirmations, cancellations, and refund statuses."
            value={preferences.orderUpdates}
            onToggle={() => togglePreference('orderUpdates')}
          />
          <ToggleRow 
            title="Delivery Alerts" 
            description="Real-time tracking updates when your package is out for delivery."
            value={preferences.deliveryAlerts}
            onToggle={() => togglePreference('deliveryAlerts')}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: currentColors.textSecondary }]}>App Features</Text>
        <View style={[styles.sectionCard, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
          <ToggleRow 
            title="Daily Battle Reminders" 
            description="Get notified when a new voting battle is live to earn discounts."
            value={preferences.battleReminders}
            onToggle={() => togglePreference('battleReminders')}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: currentColors.textSecondary }]}>Offers & Discovery</Text>
        <View style={[styles.sectionCard, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
          <ToggleRow 
            title="Promotions & Sales" 
            description="Alerts for flash sales, holiday discounts, and personalized deals."
            value={preferences.promotions}
            onToggle={() => togglePreference('promotions')}
          />
          <ToggleRow 
            title="New Arrivals" 
            description="Be the first to know when exciting new products drop."
            value={preferences.newArrivals}
            onToggle={() => togglePreference('newArrivals')}
          />
        </View>

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
  
  sectionTitle: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, marginLeft: 5, marginTop: 15 },
  sectionCard: { borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginBottom: 10 },
  
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 15, borderBottomWidth: StyleSheet.hairlineWidth },
  textContainer: { flex: 1, paddingRight: 20 },
  toggleTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  toggleDesc: { fontSize: 13, lineHeight: 18 },
  
  bottomSpacer: { height: 40 }
});