import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('@user_session');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to load user session", error);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const loggedInUser = {
      id: '123',
      name: email.split('@')[0],
      email: email,
    };
    
    setUser(loggedInUser);
    await AsyncStorage.setItem('@user_session', JSON.stringify(loggedInUser));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@user_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);