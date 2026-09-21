import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedOrders = await AsyncStorage.getItem('@my_orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } catch (error) {
        console.error("Failed to load orders", error);
      }
    };
    loadOrders();
  }, []);

  const addOrder = async (cartItems, totalAmount) => {
    const newOrder = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(),
      items: cartItems,
      total: totalAmount
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    await AsyncStorage.setItem('@my_orders', JSON.stringify(updatedOrders));
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);