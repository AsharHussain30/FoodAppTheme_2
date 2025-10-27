import React, { useState } from 'react';
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
const BOTTOM_SAFE_AREA_PADDING = Platform.OS === 'ios' ? 30 : 20;
const BOTTOM_NAV_HEIGHT = height * 0.09;

// --- Mock Data ---

const currentOrders = [
  {
    id: 'C1001',
    status: 'In Transit',
    items: ['Spicy Noodles', 'Orange Juice'],
    total: 34.0,
    date: '2025-10-10',
    eta: '15 mins',
    progress: 75,
    icon: 'truck-fast-outline',
  },
];

const historyOrders = [
  {
    id: 'H2005',
    status: 'Delivered',
    items: ['Grilled Chicken Salad', 'Water Bottle'],
    total: 22.0,
    date: '2025-09-28',
    icon: 'check-circle-outline',
  },
  {
    id: 'H2004',
    status: 'Delivered',
    items: ['Pasta Carbonara', 'Latte'],
    total: 38.5,
    date: '2025-09-25',
    icon: 'check-circle-outline',
  },
  {
    id: 'H2003',
    status: 'Cancelled',
    items: ['Vegan Wrap'],
    total: 15.0,
    date: '2025-09-20',
    icon: 'close-circle-outline',
  },
];

const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

// --- Components ---

const OrderProgress = ({ progress, status }) => {
  if (status !== 'In Transit') return null;

  return (
    <View style={orderStyles.progressContainer}>
      <Text style={orderStyles.progressText}>
        Status: {status} (ETA: 15 mins)
      </Text>
      <View style={orderStyles.progressBarBackground}>
        <View
          style={[orderStyles.progressBarFill, { width: `${progress}%` }]}
        />
      </View>
    </View>
  );
};

const OrderCard = ({ order }) => {
  const isCurrent =
    order.status !== 'Delivered' && order.status !== 'Cancelled';

  const statusColor =
    order.status === 'Delivered'
      ? '#4CAF50'
      : order.status === 'Cancelled'
      ? '#FF6B8B'
      : '#7B68EE';

  const iconName = order.icon || 'history'; // Fallback icon

  return (
    <View style={orderStyles.cardContainer}>
      <View style={orderStyles.cardHeader}>
        <View
          style={[
            orderStyles.iconCircle,
            { backgroundColor: statusColor + '15' },
          ]}>
          <MaterialCommunityIcons
            name={iconName}
            size={width * 0.06}
            color={statusColor}
          />
        </View>
        <View style={orderStyles.headerTextContent}>
          <Text style={orderStyles.orderId}>Order ID: #{order.id}</Text>
          <Text style={orderStyles.orderDate}>{order.date}</Text>
        </View>
        <Text style={[orderStyles.orderTotal, { color: statusColor }]}>
          {formatCurrency(order.total)}
        </Text>
      </View>

      <View style={orderStyles.contentRow}>
        <Text style={orderStyles.itemCount}>
          {order.items.length} items:
          <Text style={orderStyles.itemList}> {order.items.join(', ')}</Text>
        </Text>
        <Text
          style={[
            orderStyles.statusTextLabel,
            { color: statusColor, borderColor: statusColor },
          ]}>
          {order.status}
        </Text>
      </View>

      <OrderProgress progress={order.progress} status={order.status} />

      {isCurrent && (
        <TouchableOpacity style={orderStyles.trackButton} activeOpacity={0.8}>
          <Text style={orderStyles.trackButtonText}>Track Order</Text>
          <Icon name="map-pin" size={width * 0.04} color="white" />
        </TouchableOpacity>
      )}

      {!isCurrent && (
        <TouchableOpacity style={orderStyles.reorderButton} activeOpacity={0.8}>
          <Icon
            name="refresh-ccw"
            size={width * 0.04}
            color="#7B68EE"
            style={{ marginRight: 8 }}
          />
          <Text style={orderStyles.reorderButtonText}>Reorder</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const OrderScreen = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState('Current'); // 'Current' or 'History'

  const ordersToDisplay =
    activeTab === 'Current' ? currentOrders : historyOrders;
  const emptyMessage =
    activeTab === 'Current'
      ? 'You have no active orders right now.'
      : 'Your order history is empty.';

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
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity style={styles.headerIconWrapper} activeOpacity={0.7}>
          <Icon name="search" size={width * 0.06} color="#7B68EE" />
        </TouchableOpacity>
      </View>

      {/* --- Tab Navigation --- */}
      <View style={styles.tabContainer}>
        {['Current', 'History'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
            style={styles.tabButton}>
            <Text style={styles.tabText(activeTab === tab)}>{tab}</Text>
            {activeTab === tab && (
              <LinearGradient
                colors={['#7B68EE', '#9370DB']}
                style={styles.tabIndicator}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* --- Orders List --- */}
      {ordersToDisplay.length > 0 ? (
        <FlatList
          data={ordersToDisplay}
          renderItem={({ item }) => <OrderCard order={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="inbox" size={width * 0.15} color="#ccc" />
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      )}

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
          <Icon name="file-text" size={width * 0.06} color="#FF3E96" />
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
    // flex: 1,
    height:height,
    width:width,
    backgroundColor: '#F8F8F8',
  },

  // --- Header Styles (Copied from ProfileScreen for consistency) ---
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
    zIndex: 10,
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

  // --- Tab Navigation Styles ---
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: PADDING_HORIZONTAL,
    borderRadius: 15,
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: width * 0.04,
  },
  tabText: (isActive) => ({
    fontSize: width * 0.045,
    fontWeight: isActive ? '800' : '500',
    color: isActive ? '#7B68EE' : '#888',
  }),
  tabIndicator: {
    height: 3,
    width: '60%',
    borderRadius: 1.5,
    position: 'absolute',
    bottom: 0,
  },

  // --- List and Empty State ---
  listContentContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: BOTTOM_SAFE_AREA_PADDING + height * 0.07,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.1,
  },
  emptyText: {
    fontSize: width * 0.045,
    color: '#888',
    marginTop: height * 0.02,
    fontWeight: '500',
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

const orderStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: height * 0.015,
  },
  iconCircle: {
    padding: width * 0.015,
    borderRadius: 15,
    marginRight: width * 0.03,
  },
  headerTextContent: {
    flex: 1,
  },
  orderId: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#333',
  },
  orderDate: {
    fontSize: width * 0.035,
    color: '#888',
  },
  orderTotal: {
    fontSize: width * 0.05,
    fontWeight: '900',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  itemCount: {
    fontSize: width * 0.04,
    color: '#888',
    flex: 1,
  },
  itemList: {
    fontWeight: '600',
    color: '#555',
  },
  statusTextLabel: {
    fontSize: width * 0.035,
    fontWeight: '700',
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.01,
    borderRadius: 15,
    borderWidth: 1,
    textAlign: 'center',
  },

  // Progress Bar for Current Orders
  progressContainer: {
    marginTop: height * 0.015,
    marginBottom: height * 0.02,
  },
  progressText: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#7B68EE',
    marginBottom: 5,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7B68EE',
    borderRadius: 4,
  },

  // Buttons
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7B68EE',
    borderRadius: 15,
    padding: width * 0.03,
    marginTop: height * 0.01,
  },
  trackButtonText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    padding: width * 0.03,
    marginTop: height * 0.01,
    borderWidth: 1,
    borderColor: '#7B68EE',
  },
  reorderButtonText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#7B68EE',
  },
});

export default OrderScreen;
