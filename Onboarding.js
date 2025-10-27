import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // If using Expo or have this library

import Svg, { Path } from 'react-native-svg'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Get screen dimensions for responsive scaling
const { width, height } = Dimensions.get('window');
const CURVE_DEPTH = 22; // The depth of the curve in points/pixels
const SVG_HEIGHT = 15;  // Must be greater than CURVE_DEPTH
  const svgPath = `M0 0 
                   L0 ${SVG_HEIGHT} 
                   C${width / 3} ${SVG_HEIGHT - CURVE_DEPTH}, ${width * 2 / 3} ${SVG_HEIGHT - CURVE_DEPTH}, ${width} ${SVG_HEIGHT}
                   L${width} 0 Z`;
// Define constants for proportional sizing
const PADDING_HORIZONTAL = width * 0.05;
const CHEF_HEIGHT_RATIO = 0.5; // Chef area takes up 50% of the screen height
const BOTTOM_SECTION_HEIGHT_RATIO = 1 - CHEF_HEIGHT_RATIO;
const ICON_SIZE = width * 0.15; // Responsive icon size

// Placeholder images (Replace with actual imports/URIs)
const chefImage = { uri: 'https://grannyo.ca/wp-content/uploads/2019/07/about.png' }; // Replace
const pepperIcon = { uri: 'https://png.pngtree.com/png-vector/20241023/ourmid/pngtree-chili-pepper-icon-set-png-image_14145593.png' }; // Replace
const lemonIcon = { uri: 'https://cdn-icons-png.flaticon.com/512/6539/6539278.png' }; // Replace
const hotDogIcon = { uri: 'https://images.vexels.com/media/users/3/271224/isolated/preview/e9737fb6b25b8052a80e81fdc9f5f513-detailed-hot-dog-icon.png' }; // Replace
const burgerIcon = { uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/burger-3d-icon-png-download-8402542.png' }; // Replace
const bottomSandwich = { uri: 'https://www.burgerbeacon.com/assets/img/footer/hand.png' }; // Replace

const OnboardingScreen = ({navigate}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Upper Chef/Purple Background Section */}
      <View style={styles.upperSection}>
        {/* The purple-to-white gradient at the top. Using a standard View as a placeholder for the gradient effect seen in the image. */}
        <LinearGradient
          colors={['#8E44AD', '#A569BD', '#D7BDE2', 'white']} // Approximate gradient colors from the image
          style={styles.gradientOverlay}
          locations={[0, 0.4, 0.8, 1]} // Adjust stops for the fade
        >
          {/* Chef Image with Dish */}
          <Image source={chefImage} style={styles.chefImage} resizeMode="contain" />

          {/* Floating Icons - Positioning them absolutely for "floating" effect */}
          <Image source={pepperIcon} style={[styles.floatingIcon, styles.pepper]} />
          <Image source={lemonIcon} style={[styles.floatingIcon, styles.lemon]} />
          <Image source={hotDogIcon} style={[styles.floatingIcon, styles.hotDog]} />
          <Image source={burgerIcon} style={[styles.floatingIcon, styles.burger]} />
        </LinearGradient>
      </View>
        <View style={styles.svgContainer}>
              <Svg 
                  height={SVG_HEIGHT} 
                  width={width} 
                  viewBox={`0 0 ${width} ${SVG_HEIGHT}`}
              >
                  {/* The Path is white and positioned at the bottom of the purple area */}
                  <Path d={svgPath} fill="white" />
              </Svg>
          </View>

      {/* Bottom Content Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.title}>Order Your{'\n'}Delicious Food</Text>
        <Text style={styles.subtitle}>
          Ask not what you can do for your country,{'\n'}Ask what's for lunch.
        </Text>

        {/* Action Button and Bottom Image */}
        <View style={styles.actionContainer}>
          {/* Bottom Left Sandwich Image */}
          <Image source={bottomSandwich} style={styles.sandwichImage} resizeMode="contain" />

          {/* Arrow Button */}
          <TouchableOpacity style={styles.arrowButton} onPress={() => {
            navigate("Home")
          }}>
            <LinearGradient
              colors={['#FFC0CB', '#FF69B4']} // Pink gradient
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="arrow-right" size={23} color="white"/>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  // Upper Section Styling
  upperSection: {
    width: width,
    height: height * CHEF_HEIGHT_RATIO,
    overflow: 'hidden', // Ensures the image doesn't bleed out
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: '#9B59B6', // A solid purple fallback color
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20, // Space between chef image bottom and white area start
  },
  chefImage: {
    width: width * 0.9,
    height: '100%',
    position: 'absolute',
    bottom: 0,
  },
  // Floating Icon Styling
  floatingIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 4, // To match the rounded square look
    position: 'absolute',
    // Background color to simulate the shadow/glow effect
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 5,
  },
  pepper: {
    top: height * 0.05,
    left: PADDING_HORIZONTAL * 1.5,
  },
  lemon: {
    bottom: height * 0.15,
    left: PADDING_HORIZONTAL * 0.5,
  },
  hotDog: {
    top: height * 0.1,
    right: PADDING_HORIZONTAL * 1.5,
  },
  burger: {
    bottom: height * 0.15,
    right: PADDING_HORIZONTAL * 0.5,
  },

 // --- SVG Curve Container ---
  svgContainer: {
    // position: 'absolute',
    // bottom: -SVG_HEIGHT + CURVE_DEPTH,
    width: width,
    height: SVG_HEIGHT,
    zIndex: 1, // Ensure SVG is above the background and chef
    backgroundColor: '#fff056',
  },
  // --- END SVG Curve Container ---


  // Bottom Section Styling
  bottomSection: {
    height: height * BOTTOM_SECTION_HEIGHT_RATIO,
    backgroundColor: '#fff056',
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingTop: 10,
    overflow:"hidden"
  },
  title: {
    fontSize: width * 0.1, // Responsive font size
    fontWeight: 'bold',
    color: '#34495E', // Dark grey/blue color
    textAlign: 'center',
    lineHeight: width * 0.12,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#7F8C8D', // Lighter grey color
    textAlign: 'center',
    lineHeight: width * 0.06,
    marginBottom: 40, // Space before the action container
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', // Pushes the container to the bottom
    marginBottom: 10,
  },
  sandwichImage: {
    width: width * 0.3, // About half the screen width
    height: width * 0.25, // Proportionally smaller height
    position: 'absolute',
    // backgroundColor:"red",
    left: -PADDING_HORIZONTAL, // Pull it out a bit to the left edge
    bottom: 0, // Align to the very bottom
  },
  arrowButton: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.09,
    overflow: 'hidden',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    position: 'absolute',
    right: 0, // Align to the right side
    bottom: 20, // Align to the very bottom
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default OnboardingScreen;