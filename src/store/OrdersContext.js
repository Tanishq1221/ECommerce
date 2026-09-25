import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './AuthContext';

export const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth(); // This grabs the currently logged-in user

  // 1. Fetch orders from Firestore when the user logs in
  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const userOrders = [];
          
          querySnapshot.forEach((doc) => {
            userOrders.push({ id: doc.id, ...doc.data() });
          });
          
          // Sort by newest first
          userOrders.sort((a, b) => b.createdAt - a.createdAt);
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders: ", error);
        }
      } else {
        setOrders([]); // Clear orders from screen if user logs out
      }
    };

    fetchOrders();
  }, [user]);

  // 2. Save a new order to Firestore
  const addOrder = async (cartItems, totalAmount) => {
    if (!user) {
      alert("You must be logged in to place an order.");
      return false;
    }

    const newOrder = {
      userId: user.uid,
      userEmail: user.email,
      date: new Date().toLocaleDateString(),
      items: cartItems,
      total: totalAmount,
      createdAt: new Date().getTime() // For sorting
    };

    try {
      // Add to cloud database
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      
      // Update the local screen instantly
      setOrders([{ id: docRef.id, ...newOrder }, ...orders]);
      return true;
    } catch (error) {
      console.error("Error adding order: ", error);
      return false;
    }
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);