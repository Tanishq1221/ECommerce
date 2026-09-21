import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  // 1. Load the saved wishlist automatically when the app starts
  useEffect(() => {
    const loadSavedWishlist = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@my_wishlist');
        if (savedData) {
          setWishlistItems(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Failed to load wishlist data", error);
      }
    };
    loadSavedWishlist();
  }, []);

  const toggleWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.find((item) => item.id === product.id);
      let updatedWishlist;

      if (exists) {
        // Remove it
        updatedWishlist = prevItems.filter((item) => item.id !== product.id);
      } else {
        // Add it
        updatedWishlist = [...prevItems, product];
      }

      // 2. Save the newly updated wishlist back to the phone's memory
      AsyncStorage.setItem('@my_wishlist', JSON.stringify(updatedWishlist));
      
      return updatedWishlist;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);