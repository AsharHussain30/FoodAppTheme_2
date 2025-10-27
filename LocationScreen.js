import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  FlatList,
  ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

// --- Responsive Sizing Constants ---
const PADDING_HORIZONTAL = width * 0.06;
const HEADER_HEIGHT = height * 0.1;
const SEARCH_BAR_HEIGHT = width * 0.12;
const LOCATION_CARD_HEIGHT = height * 0.15;
const BOTTOM_NAV_HEIGHT = height * 0.09;
const BOTTOM_SAFE_AREA_PADDING = Platform.OS === 'ios' ? 30 : 40;
// --- Mock Data ---
const savedLocations = [
  {
    id: '1',
    type: 'Home',
    address: '123 Main St, Apt 4B, Cityville',
    icon: 'home',
    active: true,
    shadowColor: '#3CB371' // Green for Home
  },
  {
    id: '2',
    type: 'Work',
    address: '456 Tech Ave, Floor 10, Office Park',
    icon: 'briefcase-outline',
    active: false,
    shadowColor: '#4169E1' // Blue for Work
  },
  {
    id: '3',
    type: 'Gym',
    address: '789 Fitness Blvd, Studio 2',
    icon: 'dumbbell',
    active: false,
    shadowColor: '#FFA500' // Orange for Gym
  },
];

const LocationScreen = ({ navigate }) => {
  const [selectedLocationId, setSelectedLocationId] = React.useState('1');

  const renderLocationCard = ({ item }) => {
    const isActive = item.id === selectedLocationId;
    return (
      <TouchableOpacity
        style={[
          styles.locationCard,
          isActive && styles.activeLocationCard,
          { shadowColor: item.shadowColor } // Use unique shadow color
        ]}
        activeOpacity={0.8}
        onPress={() => setSelectedLocationId(item.id)}
      >
        {/* Left Icon */}
        <View style={[styles.locationIconContainer, isActive && styles.activeLocationIconContainer]}>
          <MaterialCommunityIcons
            name={item.icon}
            size={width * 0.07}
            color={isActive ? 'white' : item.shadowColor}
          />
        </View>

        {/* Text Details */}
        <View style={styles.locationDetails}>
          <Text style={styles.locationType}>{item.type}</Text>
          <Text style={styles.locationAddress} numberOfLines={2}>{item.address}</Text>
        </View>

        {/* Radio Button/Selector */}
        <View style={styles.locationSelector}>
          <View style={[styles.outerCircle, isActive && styles.activeOuterCircle]}>
            {isActive && <View style={styles.innerCircle} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate("Home")} style={styles.headerIconWrapper} activeOpacity={0.7}>
          <Icon name="chevron-left" size={width * 0.07} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Location</Text>
        <TouchableOpacity style={styles.headerIconWrapper} activeOpacity={0.7}>
          <Icon name="more-vertical" size={width * 0.06} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* --- Map Placeholder --- */}
        <ImageBackground source={{ uri: "https://static.vecteezy.com/system/resources/previews/022/967/352/non_2x/city-map-gps-navigation-with-location-pin-markers-urban-downtown-roads-parks-river-red-pointers-on-roadmap-navigator-illustration-vector.jpg" }} style={styles.mapPlaceholder} imageStyle={{ opacity: 0.35 }}>
          <Icon name="map-pin" size={width * 0.1} color="#FF3E96" style={styles.mapPin} />
          <Text style={styles.mapText}>Tap To View Map</Text>
        </ImageBackground>

        {/* --- Search/Add Location Bar --- */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Icon name="search" size={width * 0.05} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search or add new location..."
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
            <LinearGradient
              colors={['#7B68EE', '#9370DB']}
              style={styles.addButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="plus" size={width * 0.05} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* --- Saved Locations Title --- */}
        <View style={styles.savedLocationsHeader}>
          <Text style={styles.savedLocationsTitle}>Saved Locations</Text>
          <Text style={styles.savedLocationsCount}>({savedLocations.length} saved)</Text>
        </View>

        {/* --- Location Cards List --- */}
        <FlatList
          data={savedLocations}
          renderItem={renderLocationCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.locationsListContainer}
        />


        {/* --- Confirm Button --- */}
        <LinearGradient
          colors={['#FF6B8B', '#FF3E96']}
          style={styles.confirmButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity style={styles.confirmButton} activeOpacity={0.9}>
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
            <Icon name="arrow-right" size={width * 0.06} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>

      {/* --- Bottom Navigation Bar --- */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity
          style={styles.navBarItem}
          onPress={() => {
            navigate('Home');
          }}>
          <Icon name="home" size={width * 0.06} color="#B0B0B0" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBarItem}
          onPress={() => {
            navigate('Map');
          }}>
          <Icon name="map-pin" size={width * 0.06} color="#FF3E96" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => {
            navigate('Cart');
          }}>
          <LinearGradient
            colors={['#8E44AD', '#A569BD']}
            style={styles.cartButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <MaterialCommunityIcons
              name="shopping-outline"
              size={width * 0.07}
              color="white"
            />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBarItem}
          onPress={() => {
            navigate('Orders');
          }}>
          <Icon name="file-text" size={width * 0.06} color="#B0B0B0" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBarItem}
          onPress={() => {
            navigate('Profile');
          }}>
          <Icon name="settings" size={width * 0.06} color="#B0B0B0" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    height: height,
    width: width,
  },
  scrollViewContent: {
    paddingBottom: height * 0.04 + BOTTOM_SAFE_AREA_PADDING,
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

  // --- Map Placeholder ---
  mapPlaceholder: {
    width: width * 0.9,
    height: height * 0.25,
    backgroundColor: 'black', // Light purple map background
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: height * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mapPin: {
    marginBottom: 5,
  },
  mapText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#FF3E96',
  },

  // --- Search/Add Location Bar ---
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
    marginVertical: height * 0.03,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    height: SEARCH_BAR_HEIGHT,
    paddingHorizontal: PADDING_HORIZONTAL * 0.7,
    marginRight: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginRight: width * 0.02,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#333',
    paddingVertical: 0,
  },
  addButton: {
    width: SEARCH_BAR_HEIGHT,
    height: SEARCH_BAR_HEIGHT,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 10,
  },
  addButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Saved Locations Title ---
  savedLocationsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: PADDING_HORIZONTAL,
    marginBottom: height * 0.02,
  },
  savedLocationsTitle: {
    fontSize: width * 0.055,
    fontWeight: '800',
    color: '#333',
    marginRight: width * 0.01,
  },
  savedLocationsCount: {
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#888',
    marginBottom: 2,
  },

  // --- Location Cards List ---
  locationsListContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    // paddingBottom: height * 0.02,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    height: LOCATION_CARD_HEIGHT,
    marginBottom: height * 0.02,
    padding: width * 0.03,
    shadowOffset: { width: 0, height: 5 }, // Dynamic shadow color set in renderLocationCard
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeLocationCard: {
    borderColor: '#FF3E96',
    borderWidth: 2,
    shadowColor: '#FF3E96',
    shadowOpacity: 0.4,
  },
  locationIconContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeLocationIconContainer: {
    backgroundColor: '#FF3E96',
  },
  locationDetails: {
    flex: 1,
    marginLeft: width * 0.04,
  },
  locationType: {
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#333',
    marginBottom: 3,
  },
  locationAddress: {
    fontSize: width * 0.035,
    color: '#888',
    fontWeight: '500',
  },
  locationSelector: {
    marginLeft: width * 0.03,
  },
  outerCircle: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: (width * 0.06) / 2,
    borderWidth: 2,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeOuterCircle: {
    borderColor: '#FF3E96',
  },
  innerCircle: {
    width: width * 0.03,
    height: width * 0.03,
    borderRadius: (width * 0.03) / 2,
    backgroundColor: '#FF3E96',
  },

  // --- Confirm Button ---
  confirmButtonGradient: {
    // marginBottom: 70,
    marginVertical:height * 0.03,
    alignSelf: "center",
    width: width * 0.88,
    // height: height * 0.07,
    borderRadius: 25,
    // paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.88,
    height: height * 0.07,
    borderRadius: 25,
    alignSelf: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
    shadowColor: '#FF3E96',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 15,
  },
  confirmButtonText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'white',
    marginRight: width * 0.02,
  },
  // --- Bottom Navigation Bar Styles ---
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    height: BOTTOM_NAV_HEIGHT,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 12,
  },
  navBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -BOTTOM_NAV_HEIGHT * 0.5,
    shadowColor: '#8E44AD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 15,
  },
  cartButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.15) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LocationScreen;