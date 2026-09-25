import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../Theme/Colors';
import { useAuth } from '../../store/AuthContext'; 

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth(); 
  
  // 1. Detect the system theme (dark or light)
  const theme = useColorScheme() ?? 'light';
  const currentColors = Colors[theme];

  return (
    // 2. Apply dynamic colors using arrays: [staticStyle, { dynamicColor }]
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentColors.surface }]}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>My Profile</Text>

        <View style={[styles.profileCard, { backgroundColor: currentColors.background, borderColor: currentColors.border }]}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: currentColors.surface }]}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: currentColors.text }]}>{user ? 'Verified Shopper' : 'Guest User'}</Text>
            <Text style={[styles.userEmail, { color: currentColors.textSecondary }]}>{user ? user.email : 'Sign in to save your orders'}</Text>
          </View>
        </View>

        <View style={[styles.menuContainer, { backgroundColor: currentColors.background, borderColor: currentColors.border }]}>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: currentColors.border }]} onPress={() => router.push('/orders')}>
            <Text style={[styles.menuText, { color: currentColors.text }]}>📦 My Orders</Text>
            <Text style={[styles.menuArrow, { color: currentColors.textSecondary }]}>→</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: currentColors.border }]} onPress={() => router.push('/shipping')}>
            <Text style={[styles.menuText, { color: currentColors.text }]}>📍 Shipping Addresses</Text>
            <Text style={[styles.menuArrow, { color: currentColors.textSecondary }]}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: currentColors.border }]} onPress={() => router.push('/settings')}>
            <Text style={[styles.menuText, { color: currentColors.text }]}>⚙️ Settings</Text>
            <Text style={[styles.menuArrow, { color: currentColors.textSecondary }]}>→</Text>
          </TouchableOpacity>
        </View>

        {user ? (
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: currentColors.textSecondary }]} 
            onPress={logout}
          >
            <Text style={styles.loginButtonText}>Log Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: currentColors.primary }]} 
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Log In / Sign Up</Text>
          </TouchableOpacity>
        )}

      </View>
    </SafeAreaView>
  );
}

// Notice how we removed all the hardcoded "Colors.light.X" from the stylesheet!
// Layout logic stays here, color logic moves to the component above.
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 12, marginBottom: 30, borderWidth: 1 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontSize: 30 },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4, textTransform: 'capitalize' },
  userEmail: { fontSize: 14 },
  menuContainer: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
  menuText: { fontSize: 16, fontWeight: '500' },
  menuArrow: { fontSize: 16 },
  loginButton: { marginTop: 30, padding: 16, borderRadius: 8, alignItems: 'center' },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});