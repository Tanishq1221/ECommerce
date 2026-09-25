import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth'; 

import { Colors } from '../Theme/Colors';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            try {
              const auth = getAuth();
              await signOut(auth);
              router.replace('/login'); 
            } catch (error) {
              Alert.alert("Error", "Failed to log out.");
            }
          }
        }
      ]
    );
  };

  const SettingRow = ({ icon, title, onPress, showArrow = true, rightElement }) => (
    <TouchableOpacity 
      style={[styles.settingRow, { borderBottomColor: currentColors.border }]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingRowLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <Text style={[styles.settingTitle, { color: currentColors.text }]}>{title}</Text>
      </View>
      {rightElement ? (
        rightElement
      ) : showArrow ? (
        <Text style={[styles.settingArrow, { color: currentColors.textSecondary }]}>›</Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.background }]}>
      
      <View style={[styles.header, { borderBottomColor: currentColors.border }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backButton}>
          <Text style={[styles.backText, { color: currentColors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.sectionTitle, { color: currentColors.textSecondary }]}>Account</Text>
        <View style={[styles.sectionCard, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
          <SettingRow icon="👤" title="Edit Profile" onPress={() => router.push('/edit-profile')} />
          <SettingRow icon="📍" title="Shipping Addresses" onPress={() => router.push('/shipping')} />
          <SettingRow icon="💳" title="Payment Methods" onPress={() => router.push('/payments')} />
        </View>

        <Text style={[styles.sectionTitle, { color: currentColors.textSecondary }]}>Preferences</Text>
        <View style={[styles.sectionCard, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
          <SettingRow icon="🔔" title="Notification Preferences" onPress={() => router.push('/notifications')} />
          
        </View>

        <Text style={[styles.sectionTitle, { color: currentColors.textSecondary }]}>Support</Text>
        <View style={[styles.sectionCard, { backgroundColor: currentColors.surface, borderColor: currentColors.border }]}>
          <SettingRow icon="❓" title="Help Center & FAQ" onPress={() => router.push('/help')} />
          <SettingRow icon="📜" title="Terms of Service" onPress={() => router.push('/terms')} />
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#FF3B30' }]} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: currentColors.textSecondary }]}>Version 1.0.0</Text>
        
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
  
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 15, borderBottomWidth: StyleSheet.hairlineWidth },
  settingRowLeft: { flexDirection: 'row', alignItems: 'center' },
  settingIcon: { fontSize: 20, marginRight: 15 },
  settingTitle: { fontSize: 16, fontWeight: '500' },
  settingArrow: { fontSize: 24, fontWeight: '300', marginTop: -2 },
  
  logoutButton: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 35, shadowColor: '#FF3B30', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  
  versionText: { textAlign: 'center', marginTop: 25, fontSize: 13 }
});