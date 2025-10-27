import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
  Animated,
  useAnimatedValue,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterModalScreen from './ModalComponent';

const { width, height } = Dimensions.get('window');

// --- Responsive Sizing Constants ---
const PADDING_HORIZONTAL = width * 0.05;
const HEADER_HEIGHT = height * 0.1;
const SEARCH_BAR_HEIGHT = width * 0.12;
const CATEGORY_ITEM_WIDTH = width * 0.19;
const FOOD_ITEM_CARD_WIDTH = width * 0.44;
const BOTTOM_NAV_HEIGHT = height * 0.09;

// --- FIXED & RELIABLE VISUAL ASSETS ---
const profileImage = {
  uri: 'https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg',
};

// Categories (Using publicly accessible icons)
const categories = [
  {
    id: 1,
    name: 'Dinners',
    icon: {
      uri: 'https://img.pikbest.com/png-images/20241031/a-restaurant-logo-salt--26-spoon_11036962.png!sw800',
    },
  },
  {
    id: 2,
    name: 'Noodles',
    icon: {
      uri: 'https://png.pngtree.com/png-vector/20240730/ourmid/pngtree-noodles-on-white-plate-transparent-background-png-image_13297981.png',
    },
  },
  {
    id: 3,
    name: 'Desserts',
    icon: {
      uri: 'https://png.pngtree.com/png-clipart/20240610/original/pngtree-pink-donut-vector-png-image_15292482.png',
    },
  },
  {
    id: 4,
    name: 'Crispy',
    icon: {
      uri: 'https://media.istockphoto.com/id/1295596568/photo/slice-of-pizza-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=J-Z7_Dh8vn-4TyAo-yCV1ZdS8BGEO56aOxUZMXnpd-Y=',
    },
  },
  {
    id: 5,
    name: 'Taco',
    icon: {
      uri: 'https://t4.ftcdn.net/jpg/05/74/60/33/360_F_574603360_hPIZA7fh7Wk6NtfAniJW9Knb43r6vRso.jpg',
    },
  },
  {
    id: 6,
    name: 'Steak',
    icon: {
      uri: 'https://www.shutterstock.com/image-photo/grilled-beef-fillet-steak-meat-600nw-1383180032.jpg',
    },
  },
  {
    id: 7,
    name: 'Sea Food',
    icon: {
      uri: 'https://img.freepik.com/premium-photo/sushi-rolls-white-background_461160-1720.jpg',
    },
  },
];

const popularItems = [
  {
    id: 'p1',
    name: 'Spicy Noodles',
    description: 'Hot & Spicy',
    price: 14.8,
    image: {
      uri: 'https://png.pngtree.com/png-vector/20240730/ourmid/pngtree-noodles-on-white-plate-transparent-background-png-image_13297981.png',
    },
    tag: '🌶️',
  },
  {
    id: 'p2',
    name: 'Vegan Bowl',
    description: 'Fresh & Green',
    price: 26.5,
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgbBuXH1UYCoWsrjsBAWOBbkWdgZwDAl_-sg&s',
    },
    tag: '🌱',
  },
  {
    id: 'p3',
    name: 'Crispy Chicken',
    description: 'Fried perfection',
    price: 18.5,
    image: {
      uri: 'https://media.istockphoto.com/id/1207976129/photo/close-up-fried-chickens-on-white-plate-isolated-on-table-look-yummy-and-yellow-gold-color.jpg?s=612x612&w=0&k=20&c=8Hh-554Lrsm_MjorxwrKM0CfJ0wTEX9IHkagHcr7BYk=',
    },
    tag: '🍗',
  },
  {
    id: 'p4',
    name: 'Berry Pancakes',
    description: 'Sweet breakfast',
    price: 32.0,
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUYJTVrRobnLUhzmRDo4xdkPGXmMFNZMggwA&s',
    },
    tag: '🥞',
  },
  // Add more items to force scrolling
  {
    id: 'p5',
    name: 'Salmon Fillet',
    description: 'Grilled to perfection',
    price: 38.0,
    image: {
      uri: 'https://media.istockphoto.com/id/913034864/photo/fish-dish-grilled-salmon-and-asparagus.jpg?s=612x612&w=0&k=20&c=f0NLE67qkpMXf_wa3kPY3QKs-xxEDI4YNqPu72qdGeU=',
    },
    tag: '🐟',
  },
  {
    id: 'p6',
    name: 'Veggie Skewers',
    description: 'Summer BBQ',
    price: 12.5,
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvt60UKi6qtpf5cbY5dopi5u6ki5Mk6IqLuA&s',
    },
    tag: '🍢',
  },
];

// Popular Items (Using high-quality public food images)
const totalItems = [
  {
    id: 'p1',
    categoryId: 1,
    name: 'Spicy Noodles',
    description: 'Hot & Spicy',
    date: '2025-10-01T00:00:00.000Z',
    price: 14.8,
    image: {
      uri: 'https://png.pngtree.com/png-vector/20240730/ourmid/pngtree-noodles-on-white-plate-transparent-background-png-image_13297981.png',
    },
    tag: '🌶️',
  },
  {
    id: 'p2',
    categoryId: 1,
    name: 'Vegan Bowl',
    description: 'Fresh & Green',
    date: '2025-10-02T00:00:00.000Z',
    price: 26.5,
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgbBuXH1UYCoWsrjsBAWOBbkWdgZwDAl_-sg&s',
    },
    tag: '🌱',
  },
  {
    id: 'p3',
    categoryId: 1,
    name: 'Crispy Chicken',
    description: 'Fried perfection',
    date: '2025-10-03T00:00:00.000Z',
    price: 18.5,
    image: {
      uri: 'https://media.istockphoto.com/id/1207976129/photo/close-up-fried-chickens-on-white-plate-isolated-on-table-look-yummy-and-yellow-gold-color.jpg?s=612x612&w=0&k=20&c=8Hh-554Lrsm_MjorxwrKM0CfJ0wTEX9IHkagHcr7BYk=',
    },
    tag: '🍗',
  },
  {
    id: 'p4',
    categoryId: 1,
    name: 'Berry Pancakes',
    description: 'Sweet breakfast',
    date: '2025-10-04T00:00:00.000Z',
    price: 32.0,
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUYJTVrRobnLUhzmRDo4xdkPGXmMFNZMggwA&s',
    },
    tag: '🥞',
  },
  // Add more items to force scrolling
  {
    id: 'p5',
    categoryId: 1,
    name: 'Salmon Fillet',
    description: 'Grilled to perfection',
    date: '2025-10-05T00:00:00.000Z',
    price: 38.0,
    image: {
      uri: 'https://media.istockphoto.com/id/913034864/photo/fish-dish-grilled-salmon-and-asparagus.jpg?s=612x612&w=0&k=20&c=f0NLE67qkpMXf_wa3kPY3QKs-xxEDI4YNqPu72qdGeU=',
    },
    tag: '🐟',
  },
  {
    id: 'p6',
    categoryId: 1,
    name: 'Veggie Skewers',
    description: 'Summer BBQ',
    date: '2025-10-06T00:00:00.000Z',
    price: 12.5,
    image: {
      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvt60UKi6qtpf5cbY5dopi5u6ki5Mk6IqLuA&s',
    },
    tag: '🍢',
  },
  // --- Noodles Category (6 Items) ---
  {
    id: 'p1',
    categoryId: 2,
    name: 'Spicy Noodles',
    description: 'Hot & Szechuan',
    date: '2025-10-07T00:00:00.000Z',
    price: 14.8,
    image:
      'https://png.pngtree.com/png-vector/20240730/ourmid/pngtree-noodles-on-white-plate-transparent-background-png-image_13297981.png',
    tag: '🌶️',
  },
  {
    id: 'p2',
    categoryId: 2,
    name: 'Ramen Delight',
    description: 'Rich Broth',
    date: '2025-10-08T00:00:00.000Z',
    price: 18.0,
    image:
      'https://png.pngtree.com/png-clipart/20241013/original/pngtree-japanese-ramen-delight-noodles-in-rich-broth-with-eggs-and-meatballs-png-image_16306246.png',
    tag: '🍜',
  },
  {
    id: 'p3',
    categoryId: 2,
    name: 'Shrimp Pad Thai',
    description: 'Tangy & Sweet',
    date: '2025-10-09T00:00:00.000Z',
    price: 22.5,
    image:
      'https://png.pngtree.com/png-clipart/20231017/original/pngtree-pad-thai-noodles-png-image_13339546.png',
    tag: '🍤',
  },
  {
    id: 'p4',
    categoryId: 2,
    name: 'Veggie Lo Mein',
    description: 'Soy Garlic',
    date: '2025-10-10T00:00:00.000Z',
    price: 16.0,
    image:
      'https://www.shutterstock.com/image-photo/vegetarian-schezwan-noodles-vegetable-hakka-600nw-1837716592.jpg',
    tag: '🥬',
  },
  {
    id: 'p5',
    categoryId: 2,
    name: 'Peanut Noodles',
    description: 'Summer Special',
    date: '2025-10-11T00:00:00.000Z',
    price: 15.5,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRQu3c9FCEfeRqOFwEjglZc_qF8NtlmkW431RDRvW2F2L0D1N1ZWiLcOp1eJ4t2h0hGfI&usqp=CAU',
    tag: '🥜',
  },
  {
    id: 'p6',
    categoryId: 2,
    name: 'Tantanmen',
    description: 'Sesame Chili',
    date: '2025-10-12T00:00:00.000Z',
    price: 19.5,
    image:
      'https://t3.ftcdn.net/jpg/15/58/12/18/360_F_1558121859_ITTBwHBmO9lt4UvXtLQjerbdIp1IlnYp.jpg',
    tag: '🌶️',
  },

  // --- Desserts Category (6 Items) ---
  {
    id: 'p7',
    categoryId: 3,
    name: 'Berry Pancakes',
    description: 'Sweet breakfast',
    date: '2025-10-13T00:00:00.000Z',
    price: 32.0,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUYJTVrRobnLUhzmRDo4xdkPGXmMFNZMggwA&s',
    tag: '🥞',
  },
  {
    id: 'p8',
    categoryId: 3,
    name: 'Chocolate Lava',
    description: 'Warm & Gooey',
    date: '2025-10-14T00:00:00.000Z',
    price: 15.0,
    image:
      'https://www.shutterstock.com/image-photo/lava-cake-chocolate-coming-out-600nw-2500970875.jpg',
    tag: '🍫',
  },
  {
    id: 'p9',
    categoryId: 3,
    name: 'Tiramisu',
    description: 'Italian Classic',
    date: '2025-10-15T00:00:00.000Z',
    price: 18.5,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQClLq_elgtClPaTbuLWGrGg1tHVM-_v9gv8g&s',
    tag: '🍰',
  },
  {
    id: 'p10',
    categoryId: 3,
    name: 'Fruit Tart',
    description: 'Fresh & Creamy',
    date: '2025-10-16T00:00:00.000Z',
    price: 12.0,
    image:
      'https://img.freepik.com/premium-photo/fruit-tart-with-white-background-green-leaf-top_521733-455.jpg',
    tag: '🍓',
  },
  {
    id: 'p11',
    categoryId: 3,
    name: 'Apple Crumble',
    description: 'Cinnamon Spice',
    date: '2025-10-17T00:00:00.000Z',
    price: 10.5,
    image:
      'https://thumbs.dreamstime.com/b/rustic-apple-crumble-golden-oat-topping-served-scoop-vanilla-ice-cream-melting-over-warm-cinnamon-spiced-apples-382173855.jpg',
    tag: '🍎',
  },
  {
    id: 'p12',
    categoryId: 3,
    name: 'Mango Sticky Rice',
    description: 'Tropical Treat',
    date: '2025-10-18T00:00:00.000Z',
    price: 14.0,
    image:
      'https://img.freepik.com/premium-photo/mango-sticky-rice-white-background_269410-1094.jpg',
    tag: '🥭',
  },

  // --- Crispy/Fast Food Category (6 Items) ---
  {
    id: 'p13',
    categoryId: 4,
    name: 'Crispy Chicken',
    description: 'Fried perfection',
    date: '2025-10-19T00:00:00.000Z',
    price: 18.5,
    image:
      'https://img.freepik.com/premium-photo/fried-chicken-with-white-background-high-quality-ul_889056-81537.jpg',
    tag: '🍗',
  },
  {
    id: 'p14',
    categoryId: 4,
    name: 'Zesty Fries',
    description: 'Potato Goodness',
    date: '2025-10-20T00:00:00.000Z',
    price: 8.5,
    image:
      'https://img.freepik.com/premium-photo/loaded-cheese-fries-with-white-background-high-quality_889056-86336.jpg',
    tag: '🍟',
  },
  {
    id: 'p15',
    categoryId: 4,
    name: 'Onion Rings',
    description: 'Golden Batter',
    date: '2025-10-21T00:00:00.000Z',
    price: 9.5,
    image:
      'https://img.freepik.com/premium-photo/onion-rings-white-background-top-view_499484-1153.jpg',
    tag: '🧅',
  },
  {
    id: 'p16',
    categoryId: 4,
    name: 'Chicken Nuggets',
    description: "Kids' Favorite",
    date: '2025-10-22T00:00:00.000Z',
    price: 11.0,
    image:
      'https://www.shutterstock.com/image-photo/plate-chicken-nuggets-isolated-on-600nw-2536621959.jpg',
    tag: '🐥',
  },
  {
    id: 'p17',
    categoryId: 4,
    name: 'Fish & Chips',
    description: 'UK Style',
    date: '2025-10-23T00:00:00.000Z',
    price: 24.0,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUGHsFSh11XIp8fqbhVIl5Eb3IYZ3Oi056fg&s',
    tag: '🎣',
  },
  {
    id: 'p18',
    categoryId: 4,
    name: 'Mozzarella Sticks',
    description: 'Cheesy Melt',
    date: '2025-10-24T00:00:00.000Z',
    price: 13.0,
    image:
      'https://media.istockphoto.com/id/960026958/photo/mozzarella-cheese-sticks-on-white-plate-on-white-background.jpg?s=612x612&w=0&k=20&c=xvnl44h-LMXayLZanomvlO3IIUNYR5qfDJY5FNJtxWE=',
    tag: '🧀',
  },

  // --- Taco Category (6 Items) ---
  {
    id: 'p19',
    categoryId: 5,
    name: 'Classic Beef Taco',
    description: 'Ground Beef',
    date: '2025-10-25T00:00:00.000Z',
    price: 11.5,
    image:
      'https://png.pngtree.com/png-clipart/20250523/original/pngtree-traditional-beef-tacos-png-image_21060724.png',
    tag: '🌮',
  },
  {
    id: 'p20',
    categoryId: 5,
    name: 'Fish Tacos',
    description: 'Baja Style',
    date: '2025-10-26T00:00:00.000Z',
    price: 17.5,
    image:
      'https://thumbs.dreamstime.com/b/plate-fish-tacos-cabbage-slaw-isolated-white-background-emphasizing-mexican-dish-344005847.jpg',
    tag: '🐟',
  },
  {
    id: 'p21',
    categoryId: 5,
    name: 'Chicken Fajita',
    description: 'Grilled Chicken',
    date: '2025-10-27T00:00:00.000Z',
    price: 15.0,
    image:
      'https://png.pngtree.com/png-vector/20240807/ourmid/pngtree-sizzling-mexican-chicken-fajitas-on-a-plate-png-image_13404380.png',
    tag: '🌶️',
  },
  {
    id: 'p22',
    categoryId: 5,
    name: 'Al Pastor',
    description: 'Pineapple Pork',
    date: '2025-10-28T00:00:00.000Z',
    price: 16.5,
    image:
      'https://thumbs.dreamstime.com/b/close-up-shot-taco-al-pastor-pineapple-cilantro-white-plate-delicious-background-386427617.jpg',
    tag: '🍍',
  },
  {
    id: 'p23',
    categoryId: 5,
    name: 'Veggie Crunch Wrap',
    description: 'Fresh Salad',
    date: '2025-10-29T00:00:00.000Z',
    price: 13.0,
    image:
      'https://img.freepik.com/premium-photo/chicken-caesar-wrap-white-plate-white-background_864588-11088.jpg?w=360',
    tag: '🥗',
  },
  {
    id: 'p24',
    categoryId: 5,
    name: 'Shrimp Ceviche Taco',
    description: 'Lime Cured',
    date: '2025-10-30T00:00:00.000Z',
    price: 19.0,
    image:
      'https://thumbs.dreamstime.com/b/tacos-meat-vegetables-isolated-white-background-mexican-food-style-152395700.jpg',
    tag: '🦐',
  },

  // --- Steak Category (6 Items) ---
  {
    id: 'p25',
    categoryId: 6,
    name: 'Ribeye Steak',
    description: 'Marbled & Juicy',
    date: '2025-10-31T00:00:00.000Z',
    price: 45.0,
    image:
      'https://www.shutterstock.com/image-photo/grilled-sliced-beef-steak-tomatoes-600nw-1572054187.jpg',
    tag: '🥩',
  },
  {
    id: 'p26',
    categoryId: 6,
    name: 'Tenderloin',
    description: 'Filet Mignon',
    date: '2025-11-01T00:00:00.000Z',
    price: 55.0,
    image:
      'https://thumbs.dreamstime.com/b/plate-tender-beef-tenderloin-steak-peppercorn-sauce-isolated-white-background-delicious-juicy-meat-broccoli-garnish-385671238.jpg',
    tag: '🥩',
  },
  {
    id: 'p27',
    categoryId: 6,
    name: 'Lamb Chops',
    description: 'Herb Crusted',
    date: '2025-11-02T00:00:00.000Z',
    price: 42.0,
    image:
      'https://thumbs.dreamstime.com/b/lamb-chops-white-plate-set-against-transparent-background-374262293.jpg',
    tag: '🍖',
  },
  {
    id: 'p28',
    categoryId: 6,
    name: 'T-Bone',
    description: 'Large Cut',
    date: '2025-11-03T00:00:00.000Z',
    price: 48.0,
    image:
      'https://media.istockphoto.com/id/1409424028/photo/isolated-portion-of-grilled-beef-t-bone-steak.jpg?s=612x612&w=0&k=20&c=R4OArKKGwoioPXVyBf6_Lmfxtp0iEISG41iLIdl_9hk=',
    tag: '🥩',
  },
  {
    id: 'p29',
    categoryId: 6,
    name: 'Sirloin Tips',
    description: 'Mushroom Sauce',
    date: '2025-11-04T00:00:00.000Z',
    price: 35.0,
    image:
      'https://www.shutterstock.com/image-photo/grilled-sliced-beef-steak-tomatoes-600nw-1572054187.jpg',
    tag: '🥩',
  },
  {
    id: 'p30',
    categoryId: 6,
    name: 'Pork Loin',
    description: 'Maple Glaze',
    date: '2025-11-05T00:00:00.000Z',
    price: 33.0,
    image:
      'https://thumbs.dreamstime.com/b/roasted-pork-tenderloin-white-plate-background-296534610.jpg',
    tag: '🐷',
  },

  // --- Seafood/Sushi Category (6 Items) ---
  {
    id: 'p31',
    categoryId: 7,
    name: 'Salmon Fillet',
    description: 'Grilled to perfection',
    date: '2025-11-06T00:00:00.000Z',
    price: 38.0,
    image:
      'https://media.istockphoto.com/id/898087604/photo/fish-dish-salmon-steak-and-vegetables.jpg?s=612x612&w=0&k=20&c=jTXkvfw6naChqYqY3JnQoHZyRdd0y-C6uVwVns-V3UU=',
    tag: '🐟',
  },
  {
    id: 'p32',
    categoryId: 7,
    name: 'Tuna Sashimi',
    description: 'Premium Cut',
    date: '2025-11-07T00:00:00.000Z',
    price: 30.0,
    image:
      'https://thumbs.dreamstime.com/b/slices-raw-tuna-sashimi-green-shiso-leaves-parsley-garnish-wooden-plate-isolated-white-transparent-background-399070241.jpg',
    tag: '🍣',
  },
  {
    id: 'p33',
    categoryId: 7,
    name: 'California Roll',
    description: 'Avocado Crab',
    date: '2025-11-08T00:00:00.000Z',
    price: 19.0,
    image:
      'https://media.istockphoto.com/id/177096343/photo/sushi-and-chopsticks-on-a-white-plate.jpg?s=612x612&w=0&k=20&c=ZrJGDES6fri8HnmLNFZBJY89kEbfeqCa_CkM78reYZY=',
    tag: '🍣',
  },
  {
    id: 'p34',
    categoryId: 7,
    name: 'Lobster Tail',
    description: 'Butter Garlic',
    date: '2025-11-09T00:00:00.000Z',
    price: 60.0,
    image:
      'https://thumbs.dreamstime.com/b/grilled-lobster-tail-plate-served-asparagus-white-background-30477895.jpg',
    tag: '🦞',
  },
  {
    id: 'p35',
    categoryId: 7,
    name: 'Shrimp Scampi',
    description: 'Lemon Garlic',
    date: '2025-11-10T00:00:00.000Z',
    price: 29.0,
    image:
      'https://thumbs.dreamstime.com/b/plate-shrimp-scampi-garlic-butter-isolated-white-background-showcasing-seafood-dish-344016747.jpg',
    tag: '🍤',
  },
  {
    id: 'p36',
    categoryId: 7,
    name: 'Oysters',
    description: 'Fresh Shucked',
    date: '2025-11-11T00:00:00.000Z',
    price: 25.0,
    image:
      'https://thumbs.dreamstime.com/b/half-dozen-oysters-white-plate-ice-lemon-isolated-white-background-31513642.jpg',
    tag: '🐚',
  },
];

const HomeScreen = ({ navigate }) => {
  const renderCategoryItem = ({ item, index }) => {
    const isActive = item.id === selectedCategory;
    return (
      <TouchableOpacity
        onPress={() => {
            setSelectedCategory(isActive ? !item.id:item.id);
        }}
        style={[
          styles.categoryItem,
          isActive && styles.activeCategoryItem,
          { marginLeft: isActive ? PADDING_HORIZONTAL : width * 0.02 },
        ]}
        activeOpacity={0.7}>
        <View
          style={[
            styles.categoryIconContainer,
            isActive && styles.activeCategoryIconContainer,
          ]}>
          <Image
            source={item.icon}
            style={styles.categoryIcon}
            resizeMode="contain"
          />
        </View>
        <Text
          style={[styles.categoryName, isActive && styles.activeCategoryName]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={styles.foodItemCard}
      onPress={() => {
        navigate('Details', item);
      }}
      activeOpacity={0.8}>
      {/* Food Item Image */}
      <Image
        source={item.image}
        style={styles.foodItemImage}
        resizeMode="contain"
      />

      {/* Food Item Content */}
      <View style={styles.foodItemInfo}>
        <Text style={styles.foodItemName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.foodItemDescriptionContainer}>
          <Text style={styles.foodItemDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.foodItemTag}>{item.tag}</Text>
        </View>
        <Text style={styles.foodItemPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [filterData, setFilterData] = useState();

  const { selectedPrice, selectedSort } = filterData ? filterData : [];
  // Filter items based on search text (Live filtering)
  console.log(selectedCategory, isFocused, searchQuery, 'cat');

  const filteredItems = useMemo(() => {
    let itemsToFilter = [...totalItems];

    // -------------------------------------------------------------
    // **A. FILTERING LOGIC (Highest Priority se Low Priority tak)**
    // -------------------------------------------------------------

    // 2. **Search Query Filter**
    if (searchQuery.trim().length > 0) {
      const lowercasedQuery = searchQuery.trim().toLowerCase();

      itemsToFilter = itemsToFilter.filter((item) => {
        // Item name ya description search text se match hona chahiye
        return item.name.toLowerCase().includes(lowercasedQuery);
      });
    }

    // 3. **Category Filter (selectedCategory ya filterData se)**
    const categoryIdToFilter =
      selectedCategory >= 1 ? selectedCategory : filterData?.selectedCategory;

    if (categoryIdToFilter) {
      itemsToFilter = itemsToFilter.filter(
        (item) => item.categoryId === categoryIdToFilter
      );
    }

    // 4. **Price Range Filter (AB RETURN MISSING NAHI HAI)**
    if (selectedPrice) {
      let minPrice = 0;
      let maxPrice = Infinity;

      if (selectedPrice === 'Under $50') {
        maxPrice = 50;
      } else if (selectedPrice === '$50 - $200') {
        minPrice = 50;
        maxPrice = 200;
      } else if (selectedPrice === 'Over $200') {
        minPrice = 200;
      }

      // Filter lagana
      itemsToFilter = itemsToFilter.filter((item) => {
        return item.price >= minPrice && item.price < maxPrice;
      });
    }

    // -------------------------------------------------------------
    // **B. SORTING LOGIC (Aakhri Step)**
    // -------------------------------------------------------------

    if (selectedSort === 'Price: Low to High') {
      itemsToFilter.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'Price: High to Low') {
      itemsToFilter.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'Newest First') {
      itemsToFilter.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    }

    // -------------------------------------------------------------
    // **C. FINAL RETURN**
    // -------------------------------------------------------------

    if (
      searchQuery.trim().length === 0 &&
      selectedCategory === 0 &&
      !selectedPrice &&
      !selectedSort &&
      !filterData
    ) {
      return popularItems;
    }

    return itemsToFilter;
  }, [searchQuery, selectedCategory, selectedPrice, selectedSort, filterData]);

  const [openFilterModal, setFilterModal] = useState(false);

  // --- 1. Empty State Component ---
  const EmptyListComponent = ({ message = 'No items found.' }) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🥺</Text>
      <Text style={styles.emptyText}>{message}</Text>
      <Text style={styles.suggestionText}>
        Try adjusting your filters or search query.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* SCROLL FIX: ScrollView must have flex: 1 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <FilterModalScreen
          openFilterModal={openFilterModal}
          setFilterModal={setFilterModal}
          setFilterData={setFilterData}
        />
        {/* --- Header --- */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconWrapper}
            activeOpacity={0.7}>
            <Icon name="menu" size={width * 0.07} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Zomo Food</Text>
          <TouchableOpacity
            style={styles.profileImageWrapper}
            activeOpacity={0.8}>
            <Image source={profileImage} style={styles.profileImage} />
          </TouchableOpacity>
        </View>

        {/* --- Search Bar --- */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            {/* {!isFocused ? ( */}
              <Icon
                name="search"
                size={width * 0.05}
                color="#888"
                style={styles.searchIcon}
              />
            {/* ) : null} */}
            <TextInput
              style={styles.searchInput}
              
              onChangeText={(e) => {
                setSearchQuery(e);
              }}
              onChange={(e) => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setIsFocused(false);
                }, 200);
              }}
              placeholder="Search dishes..."
              placeholderTextColor="#888"
            />

            {/* {isFocused ? (
              <TouchableOpacity
                onPress={() => {
                  // console.log('asdasd');
                }}
                style={styles.searchButton}>
                <Icon
                  name="search"
                  size={width * 0.05}
                  color="#888"
                  style={[
                    styles.searchIcon,
                    isFocused ? { marginLeft: width * 0.04 } : null,
                  ]}
                />
              </TouchableOpacity>
            ) : null} */}
          </View>
          <TouchableOpacity
            onPress={() => {
              setFilterModal(true);
            }}
            style={styles.filterButton}
            activeOpacity={0.7}>
            <LinearGradient
              colors={['#FF8CBA', '#FF3E96']}
              style={styles.filterButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <Icon name="filter" size={width * 0.05} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* --- Categories --- */}
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesListContainer}
        />

        {/* --- Popular Items Header --- */}
        <View style={styles.popularItemsHeader}>
          <View style={styles.popularItemsTitleWrapper}>
            {/* Alignment for Title and Subtitle */}
            <View style={styles.popularItemsTextGroup}>
              <Text style={styles.popularItemsTitle}>Popular items</Text>
              <Text style={styles.popularItemsCount}>182 item total</Text>
            </View>
            <Text style={styles.popularItemsEmoji}>😊</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* --- Popular Items Grid --- */}
        <FlatList
          data={filteredItems}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <EmptyListComponent message="Your filtered list is empty." />
          }
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.popularItemsGridRow}
          contentContainerStyle={styles.popularItemsGridContainer}
        />
      </ScrollView>

      {/* --- Bottom Navigation Bar --- */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity
          style={styles.navBarItem}
          onPress={() => {
            navigate('Home');
          }}>
          <Icon name="home" size={width * 0.06} color="#FF3E96" />
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
  // FIX: Ensure ScrollView takes up all available space
  scrollView: {
    height: height,
    width: width,
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
    padding: width * 0.015,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: width * 0.065,
    fontWeight: '800',
    color: '#333',
  },
  profileImageWrapper: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: (width * 0.11) / 2,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: '#FF3E96',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },

  // --- Empty Component Styles ---
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
    textAlign: 'center',
  },
  suggestionText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },

  // --- Search Bar Styles ---
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
    marginVertical: height * 0.025,
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
    shadowColor: '#B0B0B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginHorizontal: width * 0.02,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#B0B0B0",
    padding: 10,
    outlineStyle:"none"
  },
  filterButton: {
    width: SEARCH_BAR_HEIGHT,
    height: SEARCH_BAR_HEIGHT,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#FF3E96',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 10,
  },
  filterButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Categories Styles ---
  categoriesListContainer: {
    paddingRight: PADDING_HORIZONTAL,
    paddingVertical: height * 0.01,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: width * 0.035,
    width: CATEGORY_ITEM_WIDTH,
    paddingBottom: height * 0.01,
  },
  activeCategoryItem: {
    backgroundColor: '#FFE8F0',
    borderRadius: 20,
    paddingVertical: height * 0.015,
  },
  categoryIconContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 200,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryIcon: {
    width: '70%',
    height: '70%',
  },
  categoryName: {
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#888',
    marginTop: height * 0.015,
  },
  activeCategoryName: {
    color: '#FF3E96',
    fontWeight: '700',
  },

  // --- Popular Items Header Styles ---
  popularItemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
    marginTop: height * 0.04,
    marginBottom: height * 0.02,
  },
  popularItemsTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // FIX: Remove flex from text group to prevent it from growing and pushing the emoji
  popularItemsTextGroup: {
    // Aligns the title and subtitle as a block
    marginRight: width * 0.02,
  },
  popularItemsTitle: {
    fontSize: width * 0.065,
    fontWeight: '900',
    color: '#333',
  },
  popularItemsCount: {
    fontSize: width * 0.035,
    color: '#888',
    fontWeight: '600',
    marginTop: 2,
  },
  popularItemsEmoji: {
    fontSize: width * 0.08,
    marginTop: -8,
  },
  viewAllButton: {
    fontSize: width * 0.04,
    color: '#7B68EE',
    fontWeight: '600',
  },

  // --- Popular Items Grid Styles ---
  popularItemsGridContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    // Ensure padding accounts for the fixed bottom nav bar
    paddingBottom: BOTTOM_NAV_HEIGHT + height * 0.02,
  },
  popularItemsGridRow: {
    justifyContent: 'space-between',
    marginBottom: width * 0.04,
  },
  foodItemCard: {
    width: FOOD_ITEM_CARD_WIDTH,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  foodItemImage: {
    width: '100%',
    height: FOOD_ITEM_CARD_WIDTH * 0.7,
    marginVertical: 10,
  },
  foodItemInfo: {
    padding: width * 0.04,
    paddingBottom: 0,
  },
  foodItemName: {
    fontSize: width * 0.045,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    marginBottom: height * 0.005,
  },
  foodItemDescriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
    alignSelf: 'center',
    paddingTop: 5,
  },
  foodItemDescription: {
    fontSize: width * 0.035,
    color: '#A9A9A9',
    textAlign: 'center',
  },
  foodItemTag: {
    fontSize: width * 0.04,
    marginLeft: 5,
  },

  foodItemPrice: {
    fontSize: width * 0.055,
    fontWeight: '900',
    color: '#FF3E96',
    textAlign: 'center',
    paddingTop: 3,
    paddingBottom: 20,
    fontFamily: 'Montserrat',
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

export default HomeScreen;
