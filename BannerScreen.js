import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';

const { width } = Dimensions.get('screen');

// --- THEME & RESPONSIVE CONSTANTS ---
const PRIMARY_BG = '#121212';     
const PRIMARY_TEXT = '#FFFFFF';   
const SECONDARY_TEXT = '#B0B0B0'; 
const ACCENT_COLOR = '#FF4500';   

const SPACING = width * 0.07;    
const BANNER_HEIGHT = 160;       
const CAROUSEL_ITEM_WIDTH = width; 
const ITEM_SIZE = CAROUSEL_ITEM_WIDTH + SPACING; 

// --- DUMMY DATA ---
// NOTE: Make sure these paths are correct, or replace with image objects if using remote URLs.
const BANNER_DATA = [
  {
    id: 'd1',
    title: 'Deals for you',
    subtitle: 'Get $15 off on your first \norder over $80',
    image: require('./assets/barbecue.png'), // Local Image Path
    promoColor: '#2C3A47', // Corrected key name
  },
  {
    id: 'd2',
    title: 'Weekend Special',
    subtitle: 'Flat 50% OFF on all Pizza \norders above $50',
    image: require('./assets/pizza.png'), 
    promoColor: '#8E44AD', 
  },
  {
    id: 'd3',
    title: 'Free Delivery',
    subtitle: 'Enjoy free delivery \non all orders today!',
    image: require('./assets/burger.png'), 
    promoColor: '#007ACC', 
  },
];

// ---------------------------------------------------

const BannerScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0); 
  const flatListRef = useRef(null); 

  // --- Auto-scroll functionality ---
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (activeIndex + 1) % BANNER_DATA.length;
      
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      
      setActiveIndex(nextIndex);

    }, 5000); 

    return () => clearInterval(interval); 
  }, [activeIndex]);


  // --- Scroll Handler for Indicator Update ---
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / ITEM_SIZE);
    setActiveIndex(index);
  };
  
  // --- Individual Banner Card (Render Item) ---
  const renderItem = ({ item, index }) => {
    const marginRight = index === BANNER_DATA.length - 1 ? 0 : SPACING;
    const marginLeft = index === 1 ? width*0.14 : SPACING; 

    return (
        <View
            style={[
                styles.bannerContainer, 
                { 
                    // 🚨 FIX 1: Using item.promoColor instead of item.bgColor
                    backgroundColor: item.promoColor,
                    width: CAROUSEL_ITEM_WIDTH-SPACING*2,
                    marginLeft:marginLeft
                }
            ]}
        >
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Order now</Text>
                </TouchableOpacity>
            </View>

            <Image
                // 🚨 FIX 2: Correctly using local image source prop
                source={item.image} 
                style={styles.productImage}
                resizeMode="contain"
            />
        </View>
    );
  };

  // --- Dot Indicators Component ---
  const Indicator = () => (
    <View style={styles.indicatorContainer}>
      {BANNER_DATA.map((_, index) => (
        <View
          key={index.toString()}
          style={[
            styles.dot,
            { 
              backgroundColor: index === activeIndex ? ACCENT_COLOR : SECONDARY_TEXT, 
              width: index === activeIndex ? 20 : 8, 
            },
          ]}
        />
      ))}
    </View>
  );


  // --- Main Content (FlatList) ---
  return (
    <View style={styles.safeArea}>
      <FlatList
        ref={flatListRef}
        data={BANNER_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled 
        snapToInterval={ITEM_SIZE} 
        decelerationRate="fast" 
        onScroll={handleScroll}
        scrollEventThrottle={16} 
        
        style={styles.flatListContent} 
        
        getItemLayout={(data, index) => ({
            length: ITEM_SIZE,
            offset: ITEM_SIZE * index,
            index,
        })}
      />
      <Indicator /> 
    </View>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: PRIMARY_BG,
    paddingVertical: 20,
    overflow: 'hidden', 
  },
  flatListContent: {
  },

  // Banner Container (Item Card)
  bannerContainer: {
    height: BANNER_HEIGHT,
    borderRadius: 15,
    marginRight: SPACING, // Agle card ke liye space
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:"center",
  },

  // Text Content Container
  textContainer: {
    flex: 1.5, 
    padding: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_TEXT,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: SECONDARY_TEXT,
    marginBottom: 15,
  },
  button: {
    backgroundColor: PRIMARY_TEXT, 
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: PRIMARY_BG, 
    fontSize: 16,
    fontWeight: '600',
  },

  // Product Image Styling
  productImage: {
    width: BANNER_HEIGHT * 1.1, 
    height: BANNER_HEIGHT * 1.1,
    position: 'absolute',
    right: -20, 
    top: -(BANNER_HEIGHT * 1.1 - BANNER_HEIGHT) / 2, 
  },

  // Indicator Styles
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  dot: {
    height: 8,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});

export default BannerScreen;