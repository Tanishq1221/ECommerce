import { Stack } from 'expo-router';
import { CartProvider } from '../store/CartContext';
import { WishlistProvider } from '../store/WishlistContext';
import { AuthProvider } from '../store/AuthContext';
import { OrdersProvider } from '../store/OrdersContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <WishlistProvider>
          <CartProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="checkout" options={{ headerShown: false }} />
            </Stack>
          </CartProvider>
        </WishlistProvider>
      </OrdersProvider>
    </AuthProvider>
  );
}