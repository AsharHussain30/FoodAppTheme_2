import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';
import HomeScreen from './HomeScreen';
import ProductDetailScreen from './ProductScreen';
import ProfileScreen from './ProfileScreen';
import CartScreen from './CartScreen';
import FavouriteScreen from './FavouriteScreen';
import LocationScreen from './LocationScreen';
import Onboarding from './Onboarding';
import Orders from './Orders';
import Bookmark from './Bookmark';
import { CartProvider } from './CartContext';
import { FavouritesProvider } from './FavouriteContext';
import CheckoutScreen from './CheckoutScreen';
// Import all screens (assuming they are in the same file for this example)
// Agar aapne alag files mein rakha hai toh use import kar lein.
// const HomeScreen = require('./HomeScreen').default; // Example

// ----------------------------------------------------------------------
// NOTE: For a real app, define the Screens and Styles in separate files.
// For this single-file example, the screen components (HomeScreen, etc.)
// from the previous section should be pasted here or imported.
// (Assuming you have access to them now)
// ----------------------------------------------------------------------

const PRIMARY_BG = '#121212'; // Deep Dark Background
const screen = Dimensions.get('screen'); //Full Size Of Display
const window = Dimensions.get('window'); // After Status Bar Bottom Bar Remove Size
let total = screen.height - window.height;
console.log('Dimensions:', total / 2);
const App = () => {
  // State 1: Current screen ka naam
  const [currentScreen, setCurrentScreen] = useState('Onboarding');
  // State 2: Screen ko pass kiye jaane wale data/parameters
  const [screenParams, setScreenParams] = useState({});

  /**
   * Navigation function to change the screen state.
   * @param {string} screenName - The name of the screen to navigate to ('Home', 'Details', 'Profile').
   * @param {object} params - Optional data to pass to the next screen.
   */
  const navigate = (screenName, params = {}) => {
    setScreenParams(params);
    setCurrentScreen(screenName);
    console.log(`Navigating to: ${screenName} with params:`, params);
  };

  /**
   * Conditional Rendering (The Core of the system)
   * Decide which component to render based on the currentScreen state.
   */
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Onboarding':
        // Home screen ko navigate function pass kiya
        return <Onboarding navigate={navigate} />;
      case 'Home':
        // Home screen ko navigate function pass kiya
        return <HomeScreen navigate={navigate} />;
      case 'Details':
        // Details screen ko navigate function aur params pass kiye
        return (
          <ProductDetailScreen navigate={navigate} params={screenParams} />
        );
      case 'Orders':
        return <Orders navigate={navigate} />;
      case 'Map':
        return <LocationScreen navigate={navigate} />;
      case 'Cart':
        return <CartScreen navigate={navigate} />;
      case 'Checkout':
        return <CheckoutScreen navigate={navigate} />;
      case 'Bookmark':
        return <Bookmark navigate={navigate} />;
      case 'Profile':
        // Profile screen ko navigate function pass kiya
        return <ProfileScreen navigate={navigate} />;
      case 'Favourite':
        return <FavouriteScreen navigate={navigate} />;
      default:
        // Default ya error case
        return <Text style={{ color: 'red' }}>Screen Not Found</Text>;
    }
  };

  // <StatusBar
  //   barStyle="light-content"
  //   backgroundColor={PRIMARY_BG}
  //   hidden
  //   // barStyle={{ height: 20 }}
  // />
  return (
    <CartProvider>
      <FavouritesProvider>
        <SafeAreaView style={appStyles.container}>
          {renderScreen()}
        </SafeAreaView>
      </FavouritesProvider>
    </CartProvider>
  );
};

const appStyles = StyleSheet.create({
  container: {
    height: screen.height,
    backgroundColor: PRIMARY_BG,
    paddingBottom: total * 1,
  },
});

export default App;
