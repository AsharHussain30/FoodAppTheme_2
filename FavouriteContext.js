// FavouritesContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import {View,Text} from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 Import AsyncStorage

// --- CONSTANTS ---
export const FavouritesContext = createContext();
const STORAGE_KEY = '@favourites_list'; // Key for AsyncStorage

// Initial Data (Used only if AsyncStorage is empty)
const INITIAL_FAVOURITE_ITEMS = [
    // Leave this empty initially so the list truly loads from storage
    // If storage is empty, the list will be empty.
];

// --- Favourites Provider ---
export const FavouritesProvider = ({ children }) => {
    const [favouriteItems, setFavouriteItems] = useState(INITIAL_FAVOURITE_ITEMS);
    const [isLoading, setIsLoading] = useState(true); // To check if data has loaded

    // =======================================================
    // 1. DATA LOADING (Runs once when component mounts)
    // =======================================================
    useEffect(() => {
        const loadFavourites = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
                const loadedItems = jsonValue != null ? JSON.parse(jsonValue) : INITIAL_FAVOURITE_ITEMS;
                setFavouriteItems(loadedItems);
            } catch (e) {
                console.error("Failed to load favourites from storage", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadFavourites();
    }, []); // Empty dependency array ensures it runs only on mount

    // =======================================================
    // 2. DATA SAVING (Runs whenever favouriteItems changes)
    // =======================================================
    useEffect(() => {
        // We only save if the loading process is complete
        if (!isLoading) {
            const saveFavourites = async () => {
                try {
                    const jsonValue = JSON.stringify(favouriteItems);
                    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
                    // console.log("Favourites saved to storage."); // Optional log
                } catch (e) {
                    console.error("Failed to save favourites to storage", e);
                }
            };
            saveFavourites();
        }
    }, [favouriteItems, isLoading]); // Saves whenever the list updates

    // --- CRUD FUNCTIONS (Now update state AND trigger saving) ---

    const addItem = (item) => {
        if (!favouriteItems.some(f => f.id === item.id)) {
            // Using functional update to ensure we use the latest state
            setFavouriteItems(prevItems => [...prevItems, item]);
        }
    };

    const removeItem = (itemId) => {
        setFavouriteItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };
    
    const isFavourite = (itemId) => {
        return favouriteItems.some(f => f.id === itemId);
    };

    if (isLoading) {
        // Optional: Return a loading indicator while AsyncStorage loads
        return (
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
                <Text style={{ color: 'white' }}>Loading Favourites...</Text>
            </View>
        );
    }

    return (
        <FavouritesContext.Provider value={{ favouriteItems, addItem, removeItem, isFavourite }}>
            {children}
        </FavouritesContext.Provider>
    );
};

// Custom hook for easy consumption in any screen
export const useFavourites = () => useContext(FavouritesContext);