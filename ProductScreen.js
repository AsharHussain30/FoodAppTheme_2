import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For clock icon
import { useCart } from './CartContext'; // Import the hook

const { width, height } = Dimensions.get('window');

// --- Responsive Sizing Constants ---
const PADDING_HORIZONTAL = width * 0.06; // Slightly more padding than home screen
const HEADER_HEIGHT = height * 0.1;
const MAIN_IMAGE_SIZE = width * 0.5; // Image diameter
const QUANTITY_SELECTOR_WIDTH = width * 0.35;
const INFO_CARD_WIDTH = width * 0.4;
const INFO_CARD_HEIGHT = height * 0.15;
const ADD_TO_CART_BUTTON_HEIGHT = height * 0.08;
const BOTTOM_SAFE_AREA_PADDING = Platform.OS === 'ios' ? 30 : 20;

// --- VISUAL ASSETS ---
const dishImage = {
  uri: 'https://images.unsplash.com/photo-1512621776951-a578ed2ace84?w=800&q=80',
}; // Soba Noodles
const panImage = {
  uri: 'https://cdn-icons-png.flaticon.com/512/2927/2927829.png',
}; // Simple frying pan icon (for illustration)

const ProductScreen = ({ navigate, params }) => {
  // Added navigation prop
  const [quantity, setQuantity] = React.useState(1);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  let totalPrice = params.price * quantity;
  const { addToCart } = useCart();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        {/* --- Header --- */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigate('Home')}
            style={styles.headerIconWrapper}
            activeOpacity={0.7}>
            <Icon name="chevron-left" size={width * 0.07} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
          <TouchableOpacity
            style={styles.headerIconWrapper}
            activeOpacity={0.7}>
            <Icon name="share-2" size={width * 0.06} color="#333" />
          </TouchableOpacity>
        </View>

        {/* --- Main Food Image & Price Tag --- */}
        <View style={styles.imageContainer}>
          <Image
            source={params.image}
            style={styles.mainDishImage}
            resizeMode="contain"
          />
          <LinearGradient
            colors={['#FF6B8B', '#FF3E96']}
            style={styles.priceTag}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text style={styles.priceTagText}>Per Price</Text>
            <Text style={styles.priceTagValue}>${params.price.toFixed(2)}</Text>
          </LinearGradient>
        </View>

        {/* --- Quantity Selector --- */}
        <LinearGradient
          colors={['#FF8CBA', '#FF3E96']}
          style={styles.quantitySelectorGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <TouchableOpacity
            onPress={handleDecreaseQuantity}
            style={styles.quantityButton}
            activeOpacity={0.7}>
            <Icon name="minus" size={12} color={'#FF3E96'} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={handleIncreaseQuantity}
            style={styles.quantityButton}
            activeOpacity={0.7}>
            <Icon name="plus" size={12} color={'#FF3E96'} />
          </TouchableOpacity>
        </LinearGradient>

        {/* --- Dish Title & Description --- */}
        <View style={styles.dishDetails}>
          <Text style={styles.dishTitle}>{params.name}</Text>
          <View style={styles.dishSubtitleContainer}>
            <Text style={styles.dishSubtitle}>{params.description}</Text>
            <Text style={styles.foodItemTag}>{params.tag}</Text>
          </View>
        </View>

        {/* --- Info Cards (Delivery & Calories) --- */}
        <View style={styles.infoCardsContainer}>
          <View style={styles.infoCard}>
            <Ionicons
              name="timer-outline"
              size={width * 0.06}
              color="#4CAF50"
            />
            <Text style={styles.infoCardValue}>15-20 Min</Text>
            <Text style={styles.infoCardLabel}>Delivery</Text>
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="fire"
              size={width * 0.06}
              color="#FF6347"
            />
            <Text style={styles.infoCardValue}>435 Kcal</Text>
            <Text style={styles.infoCardLabel}>Calories</Text>
          </View>
        </View>
      </ScrollView>

      {/* --- Add to Cart Button --- */}
      <LinearGradient
        colors={['#8E44AD', '#A569BD']}
        style={styles.addToCartButtonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <TouchableOpacity
          style={styles.addToCartButton}
          // activeOpacity={0.9}
          onPress={() => {
            navigate("Cart");
            addToCart({ ...params, quantity })
          }}>
          <MaterialCommunityIcons
            name="shopping-outline"
            size={width * 0.06}
            color="white"
            style={styles.addToCartIcon}
          />
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          <View style={styles.addToCartArrows}>
            <Icon name="chevron-right" size={width * 0.05} color="white" />
            <Icon
              name="chevron-right"
              size={width * 0.05}
              color="white"
              style={{ marginLeft: -width * 0.02 }}
            />
            <Icon
              name="chevron-right"
              size={width * 0.05}
              color="white"
              style={{ marginLeft: -width * 0.02 }}
            />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: height,
    width: width,
    backgroundColor: '#F8F8F8',
  },
  scrollViewContent: {
    paddingBottom:
      ADD_TO_CART_BUTTON_HEIGHT + BOTTOM_SAFE_AREA_PADDING + height * 0.02, // Adjust padding for button
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING_HORIZONTAL,
    height: HEADER_HEIGHT,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerIconWrapper: {
    padding: width * 0.015,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: width * 0.055,
    fontWeight: '700',
    color: '#333',
  },

  // --- Main Food Image & Price Tag ---
  imageContainer: {
    width: MAIN_IMAGE_SIZE,
    height: MAIN_IMAGE_SIZE,
    borderRadius: MAIN_IMAGE_SIZE / 2,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: height * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    position: 'relative',
    borderWidth: 1, // Subtle border as seen in screenshot
    borderColor: '#E0E0E0',
  },
  mainDishImage: {
    width: '90%', // Image takes up most of the circle
    height: '90%',
    borderRadius: (MAIN_IMAGE_SIZE * 0.9) / 2, // Match container radius
  },
  priceTag: {
    position: 'absolute',
    top: height * 0.015, // Adjusted position to match screenshot
    right: 0,
    flexDirection: 'column', // Stack text vertically
    alignItems: 'center',
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.03,
    borderRadius: 15,
    shadowColor: '#FF3E96',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  priceTagText: {
    fontSize: width * 0.028,
    color: 'white',
    fontWeight: '500',
  },
  priceTagValue: {
    fontSize: width * 0.045,
    color: 'white',
    fontWeight: 'bold',
  },

  // --- Quantity Selector ---
  quantitySelectorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: QUANTITY_SELECTOR_WIDTH,
    height: height * 0.06,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: -height * 0.035, // Overlap with the image container
    shadowColor: '#FF3E96',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    paddingHorizontal: width * 0.01,
  },
  quantityButton: {
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: (width * 0.1) / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'white',
  },

  // --- Dish Title & Description ---
  dishDetails: {
    paddingHorizontal: PADDING_HORIZONTAL,
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  dishTitle: {
    fontSize: width * 0.075,
    fontWeight: '900', // Extra bold
    color: '#333',
    textAlign: 'center',
    lineHeight: width * 0.08,
  },
  dishSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.005,
  },
  dishSubtitle: {
    fontSize: width * 0.055,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
    marginRight: width * 0.01,
    paddingTop: 10,
  },
  foodItemTag: {
    fontSize: width * 0.06,
    marginLeft: 5,
    paddingTop: 10,
  },

  // --- Info Cards (Delivery & Calories) ---
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: PADDING_HORIZONTAL,
    marginTop: height * 0.04,
    marginBottom: height * 0.03,
  },
  infoCard: {
    width: INFO_CARD_WIDTH,
    height: INFO_CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    paddingVertical: height * 0.02,
  },
  infoCardValue: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
    marginTop: height * 0.005,
  },
  infoCardLabel: {
    fontSize: width * 0.03,
    color: '#888',
    fontWeight: '500',
    paddingVertical: 4,
    paddingBottom: 7,
  },

  // --- Add to Cart Button ---
  addToCartButtonGradient: {
    height: ADD_TO_CART_BUTTON_HEIGHT,
    width: width - 30,
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 30,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.88, // Nearly full width
    height: ADD_TO_CART_BUTTON_HEIGHT,
    borderRadius: 25,
    alignSelf: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
    shadowColor: '#A569BD',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 15,
  },
  addToCartIcon: {
    marginRight: width * 0.02,
  },
  addToCartButtonText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'white',
    flex: 1, // Allow text to take space
    textAlign: 'center',
  },
  addToCartArrows: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProductScreen;
