import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../Theme/Colors';
import { useAuth } from '../../store/AuthContext'; // 1. Import Auth Context

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth(); // 2. Grab user data and logout function

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>My Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.userInfo}>
            {/* 3. Show dynamic user data */}
            <Text style={styles.userName}>{user ? user.name : 'Guest User'}</Text>
            <Text style={styles.userEmail}>{user ? user.email : 'Sign in to save your orders'}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>📦 My Orders</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>📍 Shipping Addresses</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>⚙️ Settings</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Show Logout if logged in, otherwise show Login */}
        {user ? (
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: Colors.light.textSecondary }]} 
            onPress={logout}
          >
            <Text style={styles.loginButtonText}>Log Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Log In / Sign Up</Text>
          </TouchableOpacity>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.surface },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.light.text, marginBottom: 20 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.background, padding: 20, borderRadius: 12, marginBottom: 30, borderWidth: 1, borderColor: Colors.light.border },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.light.surface, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontSize: 30 },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: 'bold', color: Colors.light.text, marginBottom: 4, textTransform: 'capitalize' },
  userEmail: { fontSize: 14, color: Colors.light.textSecondary },
  menuContainer: { backgroundColor: Colors.light.background, borderRadius: 12, borderWidth: 1, borderColor: Colors.light.border, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.light.border },
  menuText: { fontSize: 16, color: Colors.light.text, fontWeight: '500' },
  menuArrow: { fontSize: 16, color: Colors.light.textSecondary },
  loginButton: { marginTop: 30, backgroundColor: Colors.light.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});