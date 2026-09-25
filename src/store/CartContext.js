import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // 1. Load cart from Firestore or local storage
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const cartRef = doc(db, 'carts', user.uid);
          const cartSnap = await getDoc(cartRef);
          if (cartSnap.exists()) {
            setCartItems(cartSnap.data().items || []);
          } else {
            setCartItems([]);
          }
        } catch (error) {
          console.error("Failed to load cloud cart", error);
        }
      } else {
        try {
          const savedData = await AsyncStorage.getItem('@my_cart');
          if (savedData) setCartItems(JSON.parse(savedData));
        } catch (error) {
          console.error("Failed to load local cart", error);
        }
      }
    };
    loadCart();
  }, [user]);

  // Helper function to save to the correct database
  const saveCart = async (newCart) => {
    setCartItems(newCart);
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      await setDoc(cartRef, { items: newCart });
    } else {
      await AsyncStorage.setItem('@my_cart', JSON.stringify(newCart));
    }
  };

  // 2. Add items to the cart
  const addToCart = (product) => {
    let updatedCart;
    const existingItem = cartItems.find((item) => item.id === product.id);
    
    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id 
          ? { ...item, quantity: (item.quantity || 1) + 1 } 
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    
    saveCart(updatedCart);
  };

  // 3. NEW: Remove an item completely
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    saveCart(updatedCart); // Saves the update to Firebase/AsyncStorage
  };

  // 4. NEW: Update the exact quantity (+ or -)
  const updateQuantity = (id, quantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    saveCart(updatedCart); // Saves the update to Firebase/AsyncStorage
  };

  // 5. Empty the cart after checkout
  const clearCart = async () => {
    setCartItems([]);
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      await setDoc(cartRef, { items: [] });
    }
    await AsyncStorage.removeItem('@my_cart');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);