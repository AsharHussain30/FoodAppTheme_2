import React from 'react';
import {
  View,
  Text,
  Platform,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Aapke Dark Theme variables
const PRIMARY_BG = '#121212';
const CARD_BG = '#282828';
const PRIMARY_TEXT = '#FFFFFF';
const SECONDARY_TEXT = '#B0B0B0';
const ACCENT_COLOR = '#FF4500';

// --- Platform Specific Font Family ---
const PRIMARY_FONT = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

// --- DUMMY BOOKMARK DATA ---
const BOOKMARKED_ITEMS = [
  {
    id: 'f1',
    name: 'Spicy Chicken Wings',
    type: 'Food',
    price: 15.5,
    rating: 4.6,
    image:
      'https://www.simplyrecipes.com/thmb/wxTY04BVXObpzxb6-e8YE4XleI8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__06__Spicy-Fried-Chicken-LEAD-1-e7cb02e138b24cde9f0d3eefc519f88b.jpg',
  },
  {
    id: 'r1',
    name: 'Italian Delight Pizzeria',
    type: 'Restaurant',
    category: 'Pizza, Pasta',
    rating: 4.8,
    image:
      'https://slicelife.imgix.net/9998/photos/original/125076390_3778461295498759_3301290945945546231_o.jpg?auto=compress&auto=format',
  },
  {
    id: 'f2',
    name: 'Classic Veggie Burger',
    type: 'Food',
    price: 8.99,
    rating: 4.2,
    image:
      'https://static.wixstatic.com/media/91e241_c2c5919401694f3a8962262eee6ced6f~mv2.png/v1/fill/w_980,h_735,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/91e241_c2c5919401694f3a8962262eee6ced6f~mv2.png',
  },
];

// --- BOOKMARK CARD COMPONENT ---
const BookmarkCard = ({ item }) => (
  <TouchableOpacity style={styles.bookmarkCard}>
    <Image
      source={{ uri: item.image }}
      style={styles.itemImage}
      resizeMode="cover"
    />
    <View style={styles.infoContainer}>
      <Text style={styles.itemName} numberOfLines={1}>
        {item.name}
      </Text>

      <View style={styles.ratingRow}>
        <Icon name="star" size={14} color="#FFD700" />
        <Text style={styles.itemRating}>{item.rating}</Text>
        <Text style={styles.itemType}> | {item.type}</Text>
      </View>

      {item.type === 'Food' && (
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      )}
      {item.type === 'Restaurant' && (
        <Text style={styles.itemCategory}>{item.category}</Text>
      )}
    </View>

    <TouchableOpacity style={styles.removeButton}>
      <Icon name="bookmark-check" size={24} color={ACCENT_COLOR} />
    </TouchableOpacity>
  </TouchableOpacity>
);

// --- MAIN SAVED SCREEN COMPONENT ---
const Bookmark = ({ navigate }) => {
  const CartButton = ({ navigateTo, onPress }) => {
    return (
      <TouchableOpacity
        style={cartStyles.cartWrapper}
        onPress={
          onPress ? onPress : () => navigate("Cart")
        }>
        
        <View style={cartStyles.notchRing} /> 

        {/* Outer Circle (Shadow/Lift effect ke liye) */}
        <View style={cartStyles.cartButton}>
          {/* Inner Icon */}
          <Icon name="cart-outline" size={30} color={PRIMARY_TEXT} />
        </View>
      </TouchableOpacity>
    );
  };

  // --- SUB-COMPONENTS (Styles Updated) ---
  const BottomNavItem = React.memo(({ icon, label, active, navigateTo }) => {
    const handlePress = () => {
      console.log(`Navigating to: ${label} screen`);
      navigate(navigateTo);
    };

    return (
      <TouchableOpacity style={styles.navItem} onPress={handlePress}>
        <Icon
          name={active ? icon : `${icon}-outline`}
          size={24}
          color={active ? ACCENT_COLOR : SECONDARY_TEXT}
        />
        <Text style={[styles.navLabel, active && styles.navLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  });

  // Check karte hain ki koi item saved hai ya nahi
  const hasBookmarks = BOOKMARKED_ITEMS.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Bookmarks</Text>
        <TouchableOpacity
          onPress={() => navigate('Home')}
          style={{ padding: 5 }}>
          <Icon name="home-outline" size={24} color={SECONDARY_TEXT} />
        </TouchableOpacity>
      </View>

      {!hasBookmarks ? (
        // --- Empty State UI ---
        <View style={styles.emptyContainer}>
          <Icon
            name="bookmark-remove-outline"
            size={80}
            color={SECONDARY_TEXT}
          />
          <Text style={styles.emptyTitle}>Nothing Saved Yet</Text>
          <Text style={styles.emptySubtitle}>
            Apne pasandida restaurants ya dishes ko yahan bookmark karein.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigate('Home')}>
            <Text style={styles.browseButtonText}>Start Browsing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // --- List UI ---
        <FlatList
          data={BOOKMARKED_ITEMS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookmarkCard item={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNavItem icon="home" label="Home" navigateTo="Home" />
        <BottomNavItem icon="shopping" label="My Order" navigateTo="Orders" />
         <View style={{ flex: 1, height: 60 }} /> 
        <CartButton navigateTo="Cart" />
        <BottomNavItem
          icon="bookmark"
          active
          label="Saved"
          navigateTo="Bookmark"
        />
        <BottomNavItem icon="account" label="Profile" navigateTo="Profile" />
      </View>
    </View>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_BG,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: CARD_BG,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  // Bookmark Card Styles
  bookmarkCard: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
    marginBottom: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  itemRating: {
    fontSize: 14,
    color: SECONDARY_TEXT,
    marginLeft: 4,
  },
  itemType: {
    fontSize: 14,
    color: SECONDARY_TEXT,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
  },
  itemCategory: {
    fontSize: 14,
    color: SECONDARY_TEXT,
  },
  removeButton: {
    padding: 10,
    marginLeft: 10,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: SECONDARY_TEXT,
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: ACCENT_COLOR,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  browseButtonText: {
    color: PRIMARY_TEXT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    backgroundColor: CARD_BG, // Use the card color for the whole bar
    height: 60,
    paddingTop: 10,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    // Middle item (CartButton ke liye) ko khaali chhod denge
    // Taaqi woh transparent rahe aur floating button dikhe
  },
  navLabel: {
    fontSize: 12,
    color: SECONDARY_TEXT,
    marginTop: 5,
    fontFamily: PRIMARY_FONT,
  },
  navLabelActive: {
    color: ACCENT_COLOR,
    fontWeight: 'bold',
    fontFamily: PRIMARY_FONT,
  },
});

const cartStyles = StyleSheet.create({
  cartWrapper: {
    // Positioned in the center of the bottom bar, floating up
    position: 'absolute',
    left: '50%',
    bottom: 0,
    marginLeft: -45, // Width (90) / 2 = -45
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'flex-end', // Aligned to the bottom of the wrapper
    zIndex: 10,
  },
  notchRing: {
    // This large circle sits slightly below the main button
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: CARD_BG, // Bottom Nav Bar ka color
    position: 'absolute',
    top: -15, // Yeh circle button se thoda neeche shuru hoga
    opacity: 0.9, // Thodi transparency for a soft look
  },
  cartButton: {
    width: 60, // Smaller than the ring
    height: 60,
    borderRadius: 30,
    backgroundColor: ACCENT_COLOR, // Bright color
    justifyContent: 'center',
    alignItems: 'center',

    // Button ko upar uthaya
    position: 'absolute',
    top: 5, // Ring ke upar center karne ke liye adjust kiya

    // Strong Shadow for depth
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 12,
  },
});

export default Bookmark;
