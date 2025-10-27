import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// --- Responsive Sizing Constants ---
const PADDING_HORIZONTAL = width * 0.05;
const HEADER_HEIGHT = height * 0.1;
const Search_BUTTON_HEIGHT = height * 0.07;

// --- Mock Filter Data ---
const categories = [
  { category: 'Crispy', categoryId: 4 },
  { category: 'Sea Food', categoryId: 7 },
  { category: 'Taco', categoryId: 5 },
  { category: 'Steaks', categoryId: 6 },
  { category: 'Noodles', categoryId: 2 },
  { category: 'Sweets', categoryId: 3 },
];
const sortOptions = [
  'Newest First',
  'Price: Low to High',
  'Price: High to Low',
];
const priceRanges = ['Under $50', '$50 - $200', 'Over $200'];

// --- Filter Modal Component ---
const FilterModalScreen = ({ openFilterModal, setFilterModal, setFilterData }) => {
  // const [openFilterModal, setFilterModal] = useState(params ? true : false);

  // States for applied filters (aap inhein apne hisaab se update kar sakte hain)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSort, setSelectedSort] = useState(sortOptions[null]);
  const [selectedPrice, setSelectedPrice] = useState(null);

  // --- Functions ---
  const handleApplyFilters = () => {
    // Yahan aap apna API call ya filtering logic chala sakte hain
    console.log('Filters Applied:', {
      selectedCategory,
      selectedSort,
      selectedPrice,
    });
    setFilterData({
      selectedCategory,
      selectedSort,
      selectedPrice
    })
    setFilterModal(false); // Modal bandh karein
  };

  const handleClearFilters = () => {
    // Sab filters reset karein
    setSelectedCategory(null);
    setSelectedSort(sortOptions[null]);
    setSelectedPrice(null);
  };

  const FilterButton = ({ label, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
      onPress={onPress}>
      <Text
        style={[
          styles.filterButtonText,
          isSelected && styles.filterButtonTextSelected,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* --- THE MODAL --- */}
      <Modal
        animationType="slide" // Modal poore screen se upar aayega
        transparent={false} // Poora screen cover karega
        visible={openFilterModal}
        onRequestClose={() => setFilterModal(false)} // Android back button ke liye
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
          <View style={styles.header}>
            {/* CLOSE BUTTON */}
            <TouchableOpacity onPress={() => setFilterModal(false)}>
              <Ionicons name="close" size={30} color="#333" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Filters</Text>

            {/* CLEAR BUTTON */}
            <TouchableOpacity
              onPress={handleClearFilters}
              style={styles.headerIconWrapper}>
              <Text
              style={styles.clearText}
              >
                Clear
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.modalBody}
            contentContainerStyle={styles.scrollContent}>
            {/* --- 1. Category Filter --- */}
            <Text style={styles.filterSectionTitle}>Categories</Text>
            <View style={styles.filterGroup}>
              {categories.map((cat) => (
                <FilterButton
                  key={cat}
                  label={cat.category}
                  isSelected={selectedCategory === cat.categoryId}
                  onPress={() => setSelectedCategory(cat.categoryId)}
                />
              ))}
            </View>

            <View style={styles.divider} />

            {/* --- 2. Sort By Filter --- */}
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <View style={styles.filterGroup}>
              {sortOptions.map((sort) => (
                <FilterButton
                  key={sort}
                  label={sort}
                  isSelected={selectedSort === sort}
                  onPress={() => setSelectedSort(sort)}
                />
              ))}
            </View>

            <View style={styles.divider} />

            {/* --- 3. Price Range Filter --- */}
            <Text style={styles.filterSectionTitle}>Price Range</Text>
            <View style={styles.filterGroup}>
              {priceRanges.map((price) => (
                <FilterButton
                  key={price}
                  label={price}
                  isSelected={selectedPrice === price}
                  onPress={() => setSelectedPrice(price)}
                />
              ))}
            </View>
          </ScrollView>

          {/* --- APPLY BUTTON (Bottom) --- */}
          <LinearGradient
            colors={['#7B68EE', '#9370DB']}
            style={styles.checkoutButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => {
                handleApplyFilters();
              }}
              activeOpacity={0.9}>
              <Text style={styles.checkoutButtonText}>Search Filter</Text>
              <Feather name="arrow-right" size={width * 0.06} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  // --- Header Styles ---
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
    paddingHorizontal: width * 0.015,
    paddingVertical: width * 0.010,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: width * 0.065,
    fontWeight: '600',
    color: '#333',
  },
  clearText:{
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },

  // --- Checkout Button ---
  checkoutButtonGradient: {
    width: width * 0.88,
    height: Search_BUTTON_HEIGHT,
    borderRadius: 25,
    alignSelf: 'center',
    bottom: 20
    // paddingHorizontal: PADDING_HORIZONTAL,
    // marginVertical: 20,

  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.88,
    height: Search_BUTTON_HEIGHT,
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
    textAlign: 'center',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'white',
    marginRight: width * 0.02,
  },
  modalBody: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // --- Filter Group Styles ---
  filterSectionTitle: {
    fontSize: width * 0.05,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    // marginTop: 15,
  },
  filterGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // React Native 0.71+ mein 'gap' support karta hai
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  filterButtonSelected: {
    borderColor: '#FF3E96',
    backgroundColor: '#FF3E96',
  },
  filterButtonText: {
    fontSize: width * 0.045,
    fontWeight: '300',
    color: '#333',
    textAlign: 'center',
  },
  filterButtonTextSelected: {
    fontSize: width * 0.045,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FilterModalScreen;
