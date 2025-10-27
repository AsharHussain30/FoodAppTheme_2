import React, { useState } from 'react'; // useState hook imported
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFavourites } from './FavouriteContext'; // Import the hook

// App's Dark Theme variables
const PRIMARY_BG = '#121212';     
const CARD_BG = '#282828';       
const PRIMARY_TEXT = '#FFFFFF';
const SECONDARY_TEXT = '#B0B0B0';
const ACCENT_COLOR = '#FF4500';  
const SPACING = 16;

// --- INITIAL DUMMY DATA ---
const INITIAL_FAVOURITE_ITEMS = [
    { id: 0, name: 'Hot Chili Pasta', type: 'Food', price: 18.50, rating: 4.6, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=725&auto=format&fit=crop', deliveryTime: '25 min' },
    { id: 1, name: 'The Kebab Corner', type: 'Restaurant', category: 'Indian, Grill', rating: 4.8, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVKZ_48yH_Cn_CNG6wn05hIO9eHDykQp1YUQ&s', distance: '1.2 km' },
    { id: 2, name: 'Veggie Supreme Pizza', type: 'Food', price: 22.00, rating: 4.9, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvKrvYyLC_eyksYv5xOegtAIjYj6NjHBm-Qg&s', deliveryTime: '35 min' },
];

// --- FAVOURITE CARD COMPONENT ---
// onDelete: function is passed as a prop to handle removal
const FavouriteCard = ({ item, onDelete }) => (
    <TouchableOpacity style={styles.favouriteCard}>
        <Image 
            source={{ uri: item.image }} 
            style={styles.itemImage}
            resizeMode="cover"
        />
        <View style={styles.infoContainer}>
            <Text style={styles.itemName} numberOfLines={1}>{item.title}</Text>
            
            <View style={styles.detailRow}>
                <Icon name="star" size={14} color="#FFD700" />
                <Text style={styles.itemRating}>{item.rating}</Text>
                <Text style={styles.itemType}> | {"Food"}</Text>
            </View>

            {/* Food specific info */}
                <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    <View style={styles.timeBadge}>
                        <Icon name="clock-time-three-outline" size={12} color={SECONDARY_TEXT} />
                        <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                </View>
           
            {/* Restaurant specific info */}
            {item.type === 'Restaurant' && (
                <Text style={styles.itemCategory}>{item.category} ({item.distance})</Text>
            )}
        </View>
        
        {/* Remove/Un-favourite Button */}
        <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onDelete(item.id)} // Call the onDelete function with item ID
        >
            <Icon name="heart-minus" size={24} color={ACCENT_COLOR} />
        </TouchableOpacity>
    </TouchableOpacity>
);

// --- MAIN FAVOURITE SCREEN COMPONENT ---
const FavouriteScreen = ({ navigate }) => {
  const { favouriteItems,removeItem,isFavourites } = useFavourites();
      
console.log(favouriteItems,"fav");
    return (
        <View style={styles.container}>
            
            {/* --- HEADER --- */}
            <View style={styles.header}>
                <Text style={styles.pageTitle}>My Favourites</Text>
                <TouchableOpacity onPress={() => navigate('Home')} style={{padding: 5}}>
                    <Icon name="home-outline" size={24} color={SECONDARY_TEXT} />
                </TouchableOpacity>
            </View>

            {favouriteItems[0] ? (
                // --- List UI ---
                <FlatList
                    data={favouriteItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        // Passing the removeItem function down to the Card component
                        <FavouriteCard item={item} onDelete={removeItem} />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )
            : (
                // --- Empty State UI (Now fully in English) ---
                <View style={styles.emptyContainer}>
                    <Icon name="heart-broken-outline" size={80} color={SECONDARY_TEXT} />
                    <Text style={styles.emptyTitle}>No Favourites Yet!</Text>
                    <Text style={styles.emptySubtitle}>
                        Save your favorite dishes and restaurants using the heart icon.
                    </Text>
                    <TouchableOpacity style={styles.browseButton} onPress={() => navigate('Home')}>
                        <Text style={styles.browseButtonText}>Explore Dishes</Text>
                    </TouchableOpacity>
                </View>
            )}
            
        </View>
    );
};

// --- STYLESHEET (No changes needed here for logic) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PRIMARY_BG,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING,
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
        paddingHorizontal: SPACING,
        paddingVertical: SPACING,
    },
    
    // Favourite Card Styles
    favouriteCard: {
        flexDirection: 'row',
        backgroundColor: CARD_BG,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        padding: 10,
    },
    itemImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: PRIMARY_TEXT,
        marginBottom: 5,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
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
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: ACCENT_COLOR,
        marginRight: 15,
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PRIMARY_BG,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    timeText: {
        fontSize: 12,
        color: SECONDARY_TEXT,
        marginLeft: 4,
    },
    itemCategory: {
        fontSize: 14,
        color: SECONDARY_TEXT,
        marginTop: 5,
    },
    actionButton: {
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
});

export default FavouriteScreen;