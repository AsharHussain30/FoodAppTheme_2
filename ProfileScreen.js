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

const { width, height } = Dimensions.get('window');

// --- Responsive Sizing Constants ---
const PADDING_HORIZONTAL = width * 0.06;
const HEADER_HEIGHT = height * 0.1;
const AVATAR_SIZE = width * 0.25;
const MENU_ITEM_HEIGHT = height * 0.08;
const LOGOUT_BUTTON_HEIGHT = height * 0.07;
const BOTTOM_SAFE_AREA_PADDING = Platform.OS === 'ios' ? 30 : 40;
const BOTTOM_NAV_HEIGHT = height * 0.09;

// --- Mock Data ---
const userData = {
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  status: 'Premium Member',
  avatarUri: 'https://placehold.co/500x500/7B68EE/ffffff?text=AJ',
};

const menuItems = [
  {
    id: '1',
    title: 'Edit Profile',
    icon: 'user',
    color: '#FF6B8B',
    screen: 'EditProfile',
  },
  {
    id: '2',
    title: 'Payment Methods',
    icon: 'credit-card',
    color: '#7B68EE',
    screen: 'Payment',
  },
  {
    id: '3',
    title: 'Order History',
    icon: 'clock',
    color: '#FFA500',
    screen: 'Orders',
  },
  {
    id: '4',
    title: 'Addresses & Location',
    icon: 'map-pin',
    color: '#4CAF50',
    screen: 'Locations',
  },
  {
    id: '5',
    title: 'Settings & Privacy',
    icon: 'settings',
    color: '#333333',
    screen: 'Settings',
  },
  {
    id: '6',
    title: 'Help Center',
    icon: 'help-circle',
    color: '#1E90FF',
    screen: 'Help',
  },
];

const ProfileScreen = ({ navigate }) => {
  // Placeholder function for menu item actions
  const handleMenuItemPress = (item) => {
    console.log(`Navigating to ${item.screen} for: ${item.title}`);
    // navigation.navigate(item.screen); // Uncomment if using React Navigation
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.8}
      onPress={() => handleMenuItemPress(item)}>
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.menuIconWrapper,
            { backgroundColor: item.color + '15' },
          ]}>
          <Icon name={item.icon} size={width * 0.055} color={item.color} />
        </View>
        <Text style={styles.menuItemTitle}>{item.title}</Text>
      </View>
      <Icon name="chevron-right" size={width * 0.06} color="#ccc" />
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.headerIconWrapper} activeOpacity={0.7}>
          <Icon name="edit-2" size={width * 0.06} color="#7B68EE" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        >
        {/* --- Profile Card --- */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: userData.avatarUri }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <View style={styles.statusBadge}>
            <MaterialCommunityIcons
              name="star-circle"
              size={width * 0.04}
              color="#FFD700"
            />
            <Text style={styles.statusText}>{userData.status}</Text>
          </View>
        </View>

        {/* --- Menu List --- */}
        <Text style={styles.menuSectionTitle}>Account & Preferences</Text>
        <FlatList
          data={menuItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.menuListContainer}
        />

        {/* --- Logout Button --- */}
        <LinearGradient
          colors={['#FF6B8B', '#FF3E96']}
          style={styles.logoutButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.9}
            onPress={() => console.log('User Logged Out')}>
            <Icon
              name="log-out"
              size={width * 0.06}
              color="white"
              style={styles.logoutIcon}
            />
            <Text style={styles.logoutButtonText}>Log Out</Text>
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
          <Icon name="map-pin" size={width * 0.06} color="#B0B0B0" />
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
          <Icon name="settings" size={width * 0.06} color="#FF3E96" />
        </TouchableOpacity>
      </View>
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

  // --- Profile Card ---
  profileCard: {
    alignItems: 'center',
    paddingVertical: height * 0.04,
    backgroundColor: 'white',
    marginHorizontal: PADDING_HORIZONTAL,
    marginTop: height * 0.03,
    borderRadius: 25,
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: '#7B68EE',
    marginBottom: height * 0.015,
  },
  userName: {
    fontSize: width * 0.065,
    fontWeight: '800',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: width * 0.04,
    color: '#888',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEA',
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.01,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  statusText: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#333',
    marginLeft: 5,
  },

  // --- Menu List ---
  menuSectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#333',
    marginTop: height * 0.04,
    marginBottom: height * 0.01,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  menuListContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: MENU_ITEM_HEIGHT,
    paddingHorizontal: width * 0.04,
    borderRadius: 15,
    marginBottom: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconWrapper: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.04,
  },
  menuItemTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
  },

  // --- Logout Button ---
  logoutButtonGradient: {
    width: width * 0.88,
    alignSelf: 'center',
    borderRadius: 25,
    marginVertical: height * 0.03,
    shadowColor: '#FF3E96',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: LOGOUT_BUTTON_HEIGHT,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  logoutButtonText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: width * 0.02,
  },
  logoutIcon: {
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

export default ProfileScreen;
