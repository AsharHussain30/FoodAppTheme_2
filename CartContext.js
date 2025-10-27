import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ActivityIndicator, Alert } from 'react-native';

// --- CONSTANTS ---
export const CartContext = createContext();
const STORAGE_KEY = '@shopping_cart'; // Unique key for Cart storage
const SHIPPING_FEE = 5.0;

// --- Cart Provider ---
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // =======================================================
  // 1. Data Loading (Initial Load from Storage)
  // =======================================================
  useEffect(() => {
    const loadCart = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        const loadedItems = jsonValue != null ? JSON.parse(jsonValue) : [];
        setCartItems(loadedItems);
      } catch (e) {
        console.error('Failed to load cart from storage', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  // =======================================================
  // 2. Data Saving (Save whenever cartItems state changes)
  // =======================================================
  useEffect(() => {
    // Only save once loading is complete
    if (!isLoading) {
      const saveCart = async () => {
        try {
          const jsonValue = JSON.stringify(cartItems);
          await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
          console.error('Failed to save cart to storage', e);
        }
      };
      saveCart();
    }
  }, [cartItems, isLoading]);

  // =======================================================
  // 3. Total Calculation (Optimized with useMemo)
  // =======================================================
  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]); // Recalculate only when cartItems changes

  const totalWithShipping = cartTotal > 0 ? cartTotal + SHIPPING_FEE : 0;

  // --- CRUD / ACTION FUNCTIONS ---

  // Adds a new item or increments quantity if item already exists
  const addToCart = (newItem) => {
    console.log(newItem, 'NewItem');
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);

      if (existingItem) {
        // Increment quantity
        return prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        );
      } else {
        // Add new item with quantity 1 (or provided quantity)
        return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
      }
    });
  };

  // Updates quantity or removes item if quantity <= 0
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // If quantity is 0 or less, remove the item
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) => {
      return prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  // Removes an item completely
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const removeAllFromCart = () => {
    setCartItems([]);
  };

  // --- Loading State UI ---
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
        <Text style={styles.loadingText}>Loading Cart Data...</Text>
      </View>
    );
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        totalWithShipping,
        addToCart,
        removeFromCart,
        removeAllFromCart,
        updateQuantity,
        SHIPPING_FEE, // Allow screens to access the fee
      }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to use the Cart Context
export const useCart = () => useContext(CartContext);

// Simple Loading Styles
const styles = {
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
};
