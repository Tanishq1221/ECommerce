import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // 1. Load the saved cart automatically when the app starts
  useEffect(() => {
    const loadSavedCart = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@my_cart');
        if (savedData) {
          setCartItems(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Failed to load cart data", error);
      }
    };
    loadSavedCart();
  }, []);

  // 2. Add items to the cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      let updatedCart;
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        updatedCart = prevItems.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        updatedCart = [...prevItems, { ...product, quantity: 1 }];
      }

      AsyncStorage.setItem('@my_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // 3. Empties the cart after checkout
  const clearCart = async () => {
    setCartItems([]);
    await AsyncStorage.removeItem('@my_cart');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);