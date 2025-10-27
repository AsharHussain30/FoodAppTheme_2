import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from './CartContext';

const { width, height } = Dimensions.get('window');

// --- Responsive Sizing Constants ---
const PADDING_HORIZONTAL = width * 0.06;
const HEADER_HEIGHT = height * 0.1;
const CART_ITEM_HEIGHT = height * 0.16;
const CHECKOUT_BUTTON_HEIGHT = height * 0.07;
const BOTTOM_SAFE_AREA_PADDING = Platform.OS === 'ios' ? 30 : 20;

// --- Mock Data ---
const initialCartItems = [
  {
    id: '1',
    name: 'Soba Noodles with Greens',
    price: 26.5,
    quantity: 2,
    imageUri:
      'https://images.unsplash.com/photo-1512621776951-a578ed2ace84?w=800&q=80',
    tagline: 'Spicy & Veggie',
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    price: 18.0,
    quantity: 1,
    imageUri:
      'https://images.unsplash.com/photo-1540189549336-e61623912da5?w=800&q=80',
    tagline: 'High Protein',
  },
  {
    id: '3',
    name: 'Fresh Orange Juice',
    price: 7.5,
    quantity: 3,
    imageUri:
      'https://images.unsplash.com/photo-1502808027791-03290076a084?w=800&q=80',
    tagline: '100% Natural',
  },
];

const DELIVERY_FEE = 5.0;

// --- Utility Functions ---
const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

const CartScreen = ({ navigate }) => {
  const { cartItems, updateQuantity, removeAllFromCart } = useCart();

  // const [cartItems, setCartItems] = React.useState(initialCartItems);

  // // Calculate totals whenever cartItems changes
  const { subtotal, total } = React.useMemo(() => {
    const sub = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const finalTotal = sub + DELIVERY_FEE;
    return { subtotal: sub, total: finalTotal };
  }, [cartItems]);

  // const updateQuantity = (itemId, change) => {
  //   setCartItems(prevItems => prevItems.map(item => {
  //     if (item.id === itemId) {
  //       const newQuantity = item.quantity + change;
  //       if (newQuantity < 1) return null; // Logic to remove item
  //       return { ...item, quantity: newQuantity };
  //     }
  //     return item;
  //   }).filter(item => item !== null));
  // };

  const renderCartItem = ({ item }) => {
    const itemTotal = item.price * item.quantity;
    console.log(item);

    return (
      <View style={styles.itemCard}>
        {/* Item Image */}
        <Image
          source={item.image}
          style={styles.itemImage}
          resizeMode="cover"
        />

        {/* Item Details */}
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemTagline}>{item.description}</Text>
          <Text style={styles.itemPricePerUnit}>
            {formatCurrency(item.price)} per unit
          </Text>
        </View>

        {/* Quantity & Total */}
        <View style={styles.itemQuantitySection}>
          <Text style={styles.itemTotal}>{formatCurrency(itemTotal)}</Text>

          <View style={styles.quantitySelector}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
              style={styles.quantityButton}
              activeOpacity={0.7}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              style={styles.quantityButton}
              activeOpacity={0.7}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigate('Home')}
          style={styles.headerIconWrapper}
          activeOpacity={0.7}>
          <Icon name="chevron-left" size={width * 0.07} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart ({cartItems.length})</Text>
        <TouchableOpacity
          style={styles.headerIconWrapper}
          activeOpacity={0.7}
          onPress={() => {
            removeAllFromCart();
          }}>
          <MaterialCommunityIcons
            name="delete-outline"
            size={width * 0.06}
            color="#FF3E96"
          />
        </TouchableOpacity>
      </View>

      {/* Main Content ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        {/* --- Cart Items List --- */}
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.itemsListContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyCartContainer}>
              <Icon name="shopping-cart" size={width * 0.15} color="#ccc" />
              <Text style={styles.emptyCartText}>Your cart is empty!</Text>
            </View>
          )}
        />
        {/* --- Coupon / Note Section --- */}
        <View style={styles.couponContainer}>
          <TouchableOpacity style={styles.couponBox}>
            <Icon name="percent" size={width * 0.05} color="#4CAF50" />
            <Text style={styles.couponText}>Apply Coupon Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.noteBox}>
            <Icon name="edit-2" size={width * 0.05} color="#7B68EE" />
            <Text style={styles.couponText}>Add Note for Rider</Text>
          </TouchableOpacity>
        </View>
        {/* --- Price Summary --- */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>
              {cartItems[0] ? formatCurrency(DELIVERY_FEE) : formatCurrency(0)}
            </Text>
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>
              {cartItems[0] ? formatCurrency(total) : formatCurrency(0)}
            </Text>
          </View>
        </View>
        {/* --- Checkout Button --- */}
        <LinearGradient
          colors={cartItems[0] ? ['#7B68EE', '#9370DB'] : ['grey', 'silver']}
          style={styles.checkoutButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <TouchableOpacity onPress={() => navigate("Checkout")} style={styles.checkoutButton} activeOpacity={0.9}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <Icon name="arrow-right" size={width * 0.06} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
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
    // paddingBottom: CHECKOUT_BUTTON_HEIGHT + BOTTOM_SAFE_AREA_PADDING + height * 0.02,
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING_HORIZONTAL,
    height: HEADER_HEIGHT,
    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
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

  // --- Cart Items List ---
  itemsListContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingTop: height * 0.02,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 18,
    height: CART_ITEM_HEIGHT,
    marginBottom: height * 0.02,
    padding: width * 0.03,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  itemImage: {
    width: CART_ITEM_HEIGHT * 0.8,
    height: CART_ITEM_HEIGHT * 0.8,
    borderRadius: 12,
    marginRight: width * 0.03,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#333',
  },
  itemTagline: {
    fontSize: width * 0.032,
    color: '#888',
    fontWeight: '500',
    marginVertical: 3,
  },
  itemPricePerUnit: {
    fontSize: width * 0.03,
    color: '#FF3E96',
    fontWeight: '600',
  },

  // Quantity & Total Section
  itemQuantitySection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingVertical: width * 0.01,
  },
  itemTotal: {
    fontSize: width * 0.05,
    fontWeight: '900',
    color: '#333',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 2,
  },
  quantityButton: {
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityButtonText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#FF3E96',
  },
  quantityText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: width * 0.02,
  },

  // --- Coupon / Note Section ---
  couponContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING_HORIZONTAL,
    marginBottom: height * 0.03,
  },
  couponBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: width * 0.03,
    borderRadius: 15,
    flex: 1,
    marginRight: width * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: width * 0.03,
    borderRadius: 15,
    flex: 1,
    marginLeft: width * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  couponText: {
    fontSize: width * 0.029,
    fontWeight: '600',
    color: '#333',
    marginLeft: width * 0.02,
  },

  // --- Price Summary ---
  summaryContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: height * 0.025,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: PADDING_HORIZONTAL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryTitle: {
    fontSize: width * 0.05,
    fontWeight: '800',
    color: '#333',
    marginBottom: height * 0.015,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.008,
  },
  summaryLabel: {
    fontSize: width * 0.04,
    color: '#888',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: width * 0.04,
    color: '#333',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: height * 0.015,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
  },
  summaryTotalLabel: {
    fontSize: width * 0.05,
    color: '#333',
    fontWeight: '800',
  },
  summaryTotalValue: {
    fontSize: width * 0.05,
    color: '#7B68EE',
    fontWeight: '800',
  },

  // --- Checkout Button ---
  checkoutButtonGradient: {
    width: width * 0.88,
    height: CHECKOUT_BUTTON_HEIGHT,
    borderRadius: 25,
    alignSelf: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
    marginVertical: 20,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.88,
    height: CHECKOUT_BUTTON_HEIGHT,
    borderRadius: 25,
    alignSelf: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
    shadowColor: '#9370DB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 15,
  },
  checkoutButtonText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'white',
    marginRight: width * 0.02,
  },

  // --- Empty Cart State ---
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: PADDING_HORIZONTAL,
    marginVertical: height * 0.05,
    paddingVertical: height * 0.06,
  },
  emptyCartText: {
    fontSize: width * 0.05,
    color: '#888',
    marginTop: height * 0.01,
  },
});

export default CartScreen;
