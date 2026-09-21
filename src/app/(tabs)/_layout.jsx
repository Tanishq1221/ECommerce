import { Tabs } from 'expo-router';
import { Colors } from '../../Theme/Colors';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.light.background,
          borderTopWidth: 1,
          borderTopColor: Colors.light.border,
          height: 60,
          paddingBottom: 10,
        }
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>
        }} 
      />
      <Tabs.Screen 
        name="wishlist" 
        options={{ 
          title: 'Saved',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>❤️</Text>
        }} 
      />
      <Tabs.Screen 
        name="cart" 
        options={{ 
          title: 'Cart',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🛒</Text>
        }} 
      />
      
      {/* THE NEW PROFILE TAB */}
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>
        }} 
      />
    </Tabs>
  );
}