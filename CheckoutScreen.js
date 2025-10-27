import React, { useCallback, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Modal,
    Pressable,
    Dimensions,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';
import { useCart } from "./CartContext";
import { LinearGradient } from 'expo-linear-gradient';

// --- NEW Colors for HomeScreen Pink Theme ---
const PRIMARY_BG = '#F8F8F8'; // Light Gray Background (Same as HomeScreen)
const CARD_BG = '#FFFFFF'; // White Card/Component Background (Same as HomeScreen)
const ACCENT_COLOR_MAIN = '#FF3E96'; // Bright Pink Accent (Primary Pink from HomeScreen)
const ACCENT_COLOR_SECONDARY = '#FF8CBA'; // Lighter Pink Accent (from LinearGradient)
const PRIMARY_TEXT = '#333333'; // Dark Text
const SECONDARY_TEXT = '#888888'; // Gray Text

const { width, height } = Dimensions.get("window");
const PADDING_HORIZONTAL = width * 0.05; // HomeScreen se liya gaya

// --- Static Data (American details ke mutabiq) ---
const mockAddress = {
    street: "742 Evergreen Terrace",
    city: "Springfield, OR 97477",
    name: "M. Smith",
    phone: "(555) 123-4567",
};

// Dummy Payment Method
const mockPayment = {
    type: "Cash On Delivery",
};

const CheckoutScreen = ({ navigate }) => {
    const { cartItems, removeAllFromCart } = useCart();
    const cartItemDetails = cartItems;

    // State for Modals
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Delivery Fee
    const DELIVERY_FEE = 5.0;

    // Cart items aur total ko calculate karein
    const calculateSubtotal = () => {
        return cartItemDetails
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toFixed(2);
    };

    const calculateGrandTotal = () => {
        const subtotal = parseFloat(calculateSubtotal());
        return (subtotal + DELIVERY_FEE).toFixed(2);
    };

    const subtotal = calculateSubtotal();
    const grandTotal = calculateGrandTotal();

    const [fontsLoaded] = useFonts({
        // Yahan apni custom fonts ki mapping dein
        'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    });

    // --- 1. Order Confirmation aur Cart Clearing ---
    const confirmOrder = async () => {
        // 1. Confirmation Modal band karein
        setShowConfirmationModal(false);

        // 2. Cart ko permanent empty karein (Actual implementation yahan aayegi)
        // await removeAllFromCart();
        console.log("Cart cleared permanently after order confirmation.");

        // 3. Success Modal dikhao
        setShowSuccessModal(true);
    };

    // --- 2. Final Navigation ---
    const goToHomeScreen = () => {
        // Success Modal band karein
        setShowSuccessModal(false);
        removeAllFromCart();

        // Home Screen par navigate karein
        navigate("Home");
    }

    // Place Order Button click
    const handlePlaceOrder = () => {
        // Validation check (Agar cart khali ho tou proceed na karein)
        if (cartItemDetails.length === 0) {
            alert("Your cart is empty. Please add items to place an order.");
            return;
        }
        // Confirmation modal dikhao
        setShowConfirmationModal(true);
    };

    if (cartItemDetails.length === 0) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: PRIMARY_BG }]}>
                <MaterialCommunityIcons name="cart-off" size={80} color={SECONDARY_TEXT} />
                <Text style={styles.emptyText}>Your Cart is Empty!</Text>
                <Text style={styles.emptySubText}>Please add items to proceed to checkout.</Text>
                <TouchableOpacity onPress={() => navigate('Home')} style={styles.backToHomeButton}>
                    <Text style={styles.backToHomeButtonText}>Go to Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                {/* --- Header --- */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigate('Cart')} style={{ padding: 5 }}>
                        <Icon name="arrow-left" size={width * 0.07} color={PRIMARY_TEXT} />
                    </TouchableOpacity>
                    <Text style={[styles.pageTitle, {
                        fontSize: width * 0.065, // HomeScreen title size se match
                        fontWeight: '800',
                    }]}>Checkout</Text>
                    <View style={{ width: width * 0.07 }} />{/* Dummy view for alignment */}
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollViewStyle}>
                    {/* --- 1. Delivery Address --- */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Delivery Address</Text>
                            <TouchableOpacity>
                                <Text style={styles.changeText}>Change</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.addressBox}>
                            <Ionicons
                                name="location-outline"
                                size={22}
                                color={ACCENT_COLOR_MAIN}
                                style={{ marginRight: 10 }}
                            />
                            <View>
                                <Text style={styles.addressName}>{mockAddress.name}</Text>
                                <Text style={styles.addressDetail}>{mockAddress.street}</Text>
                                <Text style={styles.addressDetail}>{mockAddress.city}</Text>
                            </View>
                        </View>
                    </View>

                    {/* --- 2. Payment Method --- */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Payment Method</Text>
                            <TouchableOpacity>
                                <Text style={styles.changeText}>Change</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.paymentBox}>
                            <Ionicons
                                name="card-outline"
                                size={22}
                                color={ACCENT_COLOR_MAIN}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={styles.paymentText}>
                                {mockPayment.type}
                            </Text>
                        </View>
                    </View>

                    {/* --- 3. Order Summary --- */}
                    <View style={[styles.card, styles.summaryCard]}>
                        <Text style={styles.cardTitle}>Order Summary</Text>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>
                                Subtotal ({cartItemDetails.length} items)
                            </Text>
                            <Text style={styles.totalAmount}>${subtotal}</Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Delivery Fee</Text>
                            <Text style={styles.totalAmount}>${DELIVERY_FEE.toFixed(2)}</Text>
                        </View>

                        <View style={[styles.totalRow, styles.grandTotalRow]}>
                            <Text style={styles.grandTotalText}>Grand Total</Text>
                            <Text style={styles.grandTotalAmount}>${grandTotal}</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* --- Place Order Button (Fixed at the bottom) --- */}
                <View style={styles.fixedBottom}>
                    <TouchableOpacity
                        style={styles.placeOrderButton}
                        onPress={handlePlaceOrder}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#7B68EE', '#9370DB']}
                            style={styles.placeOrderButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.placeOrderButtonText}>
                                Place Order: ${grandTotal}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ------------------------------------------------------------------ */}
            {/* --- MODAL 1: Custom Confirmation Modal --- */}
            {/* ------------------------------------------------------------------ */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showConfirmationModal}
                onRequestClose={() => {
                    setShowConfirmationModal(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Confirm Order</Text>
                        <Text style={styles.modalText}>
                            Please confirm the order of ${grandTotal} for delivery to {mockAddress.name}.
                        </Text>
                        <View style={styles.modalButtonContainer}>
                            <Pressable
                                style={[styles.modalButton, styles.buttonCancel]}
                                onPress={() => setShowConfirmationModal(false)}
                            >
                                <Text style={[styles.textStyle, { color: PRIMARY_TEXT }]}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={confirmOrder}
                                style={styles.buttonConfirm}
                            >
                                <LinearGradient
                                    colors={[ACCENT_COLOR_SECONDARY, ACCENT_COLOR_MAIN]}
                                    style={styles.modalButtonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={styles.textStyle}>Yes, Confirm!</Text>
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ------------------------------------------------------------------ */}
            {/* --- MODAL 2: Order Success Modal --- */}
            {/* ------------------------------------------------------------------ */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showSuccessModal}
                onRequestClose={goToHomeScreen}
            >
                <View style={styles.centeredView}>
                    <View style={styles.successModalView}>
                        <Ionicons name="checkmark-circle" size={80} color="#53db87" />
                        <Text style={styles.successTitle}>Order Placed Successfully!</Text>
                        <Text style={styles.successText}>
                            Your order #{Math.floor(Math.random() * 100000) + 10000} has been placed.
                            You will receive an email confirmation shortly.
                        </Text>
                        <Pressable
                            onPress={goToHomeScreen}
                            style={styles.successButton}
                        >
                            <LinearGradient
                                colors={[ACCENT_COLOR_SECONDARY, ACCENT_COLOR_MAIN]}
                                style={styles.modalButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.textStyle}>Back to Home</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    );
};

// ---------------------------------------------------
// Stylesheet
// ---------------------------------------------------

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        backgroundColor: PRIMARY_BG,
    },
    scrollViewStyle: {
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingTop: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PADDING_HORIZONTAL,
        height: height * 0.1, // HomeScreen ke header height se milta julta
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 20,
    },
    pageTitle: {
        fontWeight: '800',
        color: PRIMARY_TEXT,
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: width * 0.05,
        fontWeight: "bold",
        color: PRIMARY_TEXT,
        marginTop: 20,
    },
    emptySubText: {
        fontSize: width * 0.035,
        color: SECONDARY_TEXT,
        marginTop: 5,
        textAlign: "center",
    },
    backToHomeButton: {
        marginTop: 25,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
        backgroundColor: ACCENT_COLOR_MAIN,
        shadowColor: ACCENT_COLOR_MAIN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 8,
    },
    backToHomeButtonText: {
        color: 'white',
        fontSize: width * 0.04,
        fontWeight: '700',
    },

    // --- Card Styles ---
    card: {
        backgroundColor: CARD_BG,
        borderRadius: 18, // HomeScreen item card ke jaisa
        padding: 18,
        marginVertical: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: width * 0.045,
        fontWeight: "800", // HomeScreen title ke jaisa
        color: PRIMARY_TEXT,
    },
    changeText: {
        fontSize: width * 0.038,
        color: ACCENT_COLOR_MAIN, // Pink accent
        fontWeight: "700",
    },

    // --- Address Box ---
    addressBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0', // Light border color
        paddingTop: 15,
    },
    addressName: {
        fontSize: width * 0.04,
        fontWeight: "700",
        color: PRIMARY_TEXT,
    },
    addressDetail: {
        fontSize: width * 0.035,
        color: SECONDARY_TEXT,
        marginTop: 2,
    },

    // --- Payment Box ---
    paymentBox: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 15,
    },
    paymentText: {
        fontSize: width * 0.04,
        color: PRIMARY_TEXT,
        fontWeight: '600',
    },

    // --- Summary Styles ---
    summaryCard: {
        marginBottom: height * 0.15, // Fixed bottom button ke liye space
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
        marginTop: 5,
        paddingTop: 10,
    },
    totalText: {
        fontSize: width * 0.038,
        color: SECONDARY_TEXT,
        fontWeight: "600",
    },
    totalAmount: {
        fontSize: width * 0.04,
        fontWeight: "700",
        color: PRIMARY_TEXT,
    },
    grandTotalRow: {
        borderTopWidth: 2,
        borderTopColor: "#D3D3D3", // Thoda dark border
        paddingTop: 15,
        marginTop: 10,
    },
    grandTotalText: {
        fontSize: width * 0.045,
        fontWeight: "900", // Extra bold
        color: PRIMARY_TEXT,
    },
    grandTotalAmount: {
        fontSize: width * 0.05,
        fontWeight: "900",
        color: ACCENT_COLOR_MAIN, // Pink accent
    },

    // --- Fixed Bottom Button ---
    fixedBottom: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingVertical: 10,
        backgroundColor: 'white', // White background
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 12,
    },
    placeOrderButton: {
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: ACCENT_COLOR_MAIN,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
    placeOrderButtonGradient: {
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeOrderButtonText: {
        color: 'white',
        fontSize: width * 0.05,
        fontWeight: '900',
    },

    // --- Common Modal Styles ---
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker dim background
    },
    modalView: {
        margin: 20,
        backgroundColor: CARD_BG,
        borderRadius: 18,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
        width: "90%",
    },
    modalTitle: {
        marginBottom: 10,
        textAlign: "center",
        fontSize: width * 0.055,
        fontWeight: "900",
        color: PRIMARY_TEXT,
    },
    modalText: {
        marginBottom: 25,
        textAlign: "center",
        fontSize: width * 0.04,
        color: SECONDARY_TEXT,
    },
    modalButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        borderRadius: 30,
        padding: 12,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonCancel: {
        backgroundColor: '#E0E0E0', // Light Gray for Cancel
        borderRadius: 30,
        padding: 12,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonConfirm: {
        borderRadius: 30,
        overflow: 'hidden',
        flex: 1,
        marginHorizontal: 5,
    },
    modalButtonGradient: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
    },
    textStyle: {
        color: "white",
        fontWeight: "700",
        textAlign: "center",
        fontSize: width * 0.04,
    },

    // --- Success Modal Specific Styles ---
    successModalView: {
        margin: 20,
        backgroundColor: CARD_BG,
        borderRadius: 18,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
        width: "90%",
    },
    successTitle: {
        fontSize: width * 0.06,
        fontWeight: '900',
        color: PRIMARY_TEXT,
        marginTop: 15,
        marginBottom: 10,
        textAlign: 'center',
    },
    successText: {
        fontSize: width * 0.04,
        color: SECONDARY_TEXT,
        textAlign: 'center',
        marginBottom: 25,
    },
    successButton: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
    }
});

export default CheckoutScreen;