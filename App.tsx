import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Modal, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, useApp } from './src/context/AppContext';
import { WebContainer } from './src/components/WebContainer';
import { BottomTabBar } from './src/components/BottomTabBar';

// Auth Screens (Modul 1: Splash, Login, Create Account, Forgot Password)
import { SplashScreen } from './src/screens/auth/SplashScreen';
import { LoginLandingScreen } from './src/screens/auth/LoginLandingScreen';
import { SignInScreen } from './src/screens/auth/SignInScreen';
import { CreateAccountScreen } from './src/screens/auth/CreateAccountScreen';
import { ForgotPasswordScreen } from './src/screens/auth/ForgotPasswordScreen';
import { VerifyNumberScreen } from './src/screens/auth/VerifyNumberScreen';
import { ProfileSetupScreen } from './src/screens/profile-setup/ProfileSetupScreen';

// Main Tab Screens
import { HomeScreen } from './src/screens/tabs/HomeScreen';
import { TravelPlanScreen } from './src/screens/tabs/TravelPlanScreen';
import { TicketScreen } from './src/screens/tabs/TicketScreen';
import { PromotionScreen } from './src/screens/tabs/PromotionScreen';
import { ProfileScreen } from './src/screens/tabs/ProfileScreen';

// Booking & Profile Subscreens
import { TicketPlacesScreen } from './src/screens/booking/TicketPlacesScreen';
import { TicketBookingListScreen } from './src/screens/booking/TicketBookingListScreen';
import { TicketBookingDetailScreen } from './src/screens/booking/TicketBookingDetailScreen';
import { TicketAddonsScreen } from './src/screens/booking/TicketAddonsScreen';
import { PaymentReceiptScreen } from './src/screens/booking/PaymentReceiptScreen';
import { QRISPaymentScreen } from './src/screens/booking/QRISPaymentScreen';
import { PaymentSuccessScreen } from './src/screens/booking/PaymentSuccessScreen';
import { TravelRecapScreen } from './src/screens/profile/TravelRecapScreen';

// Modul 3 Todo List Screen (Alternatif Tugas Asisten Lab)
import TodoListApp from './app/index';

/**
 * ============================================================================
 * [TUGAS ORANG 1: ROOT NAVIGATOR DENGAN PROTECT SESSION]
 * Melindungi rute aplikasi dan memvalidasi token otentikasi sebelum akses tab
 * ============================================================================
 */
const RootNavigator: React.FC = () => {
  const { currentScreen, currentTab, authToken, navigate } = useApp();
  const screenFadeAnim = useRef(new Animated.Value(1)).current;
  const prevScreen = useRef(currentScreen);
  const [showModul3Modal, setShowModul3Modal] = useState(false);

  useEffect(() => {
    if (prevScreen.current !== currentScreen) {
      prevScreen.current = currentScreen;
      screenFadeAnim.setValue(0.25);
      Animated.timing(screenFadeAnim, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }).start();
    }
  }, [currentScreen]);

  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen />;
      case 'calendar':
        return <TravelPlanScreen />;
      case 'ticket':
        return <TicketScreen />;
      case 'promo':
        return <PromotionScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen />;
      case 'LoginLanding':
        return <LoginLandingScreen />;
      case 'SignIn':
        return <SignInScreen />;
      case 'CreateAccount':
        return <CreateAccountScreen />;
      case 'ForgotPassword':
        return <ForgotPasswordScreen />;
      case 'VerifyNumber':
        return <VerifyNumberScreen />;
      case 'ProfileSetup':
        return <ProfileSetupScreen />;
      case 'TicketPlaces':
        return <TicketPlacesScreen />;
      case 'TicketBookingList':
        return <TicketBookingListScreen />;
      case 'TicketBookingDetail':
        return <TicketBookingDetailScreen />;
      case 'TicketAddons':
        return <TicketAddonsScreen />;
      case 'PaymentReceipt':
        return <PaymentReceiptScreen />;
      case 'QRISPayment':
        return <QRISPaymentScreen />;
      case 'PaymentSuccess':
        return <PaymentSuccessScreen />;
      case 'TravelRecap':
        return <TravelRecapScreen />;
      case 'MainTabs':
      default:
        return renderTabContent();
    }
  };

  const showBottomBar = currentScreen === 'MainTabs';

  return (
    <View style={styles.appContainer}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.screenContainer, { opacity: screenFadeAnim }]}>
        {renderScreen()}
      </Animated.View>

      {/* Floating Shortcut Button to Modul 3 Todo List App */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setShowModul3Modal(true)}
        style={styles.modul3Pill}
      >
        <Ionicons name="checkbox-outline" size={15} color="#ffffff" style={{ marginRight: 5 }} />
        <Text style={styles.modul3PillText}>Modul 3 Todo</Text>
      </TouchableOpacity>

      {/* Modal View untuk Todo List Modul 3 */}
      <Modal
        visible={showModul3Modal}
        animationType="slide"
        onRequestClose={() => setShowModul3Modal(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
          <View style={styles.modalTopBar}>
            <Text style={styles.modalTopTitle}>Tugas Modul 3 (Todo List REST API)</Text>
            <TouchableOpacity
              onPress={() => setShowModul3Modal(false)}
              style={styles.closeModalBtn}
            >
              <Ionicons name="close" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TodoListApp />
          </View>
        </View>
      </Modal>

      {showBottomBar && <BottomTabBar />}
    </View>
  );
};

export default function App() {
  return (
    <AppProvider>
      <WebContainer>
        <RootNavigator />
      </WebContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    position: 'relative',
  },
  screenContainer: {
    flex: 1,
  },
  modul3Pill: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 999,
  },
  modul3PillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  modalTopBar: {
    backgroundColor: '#2563eb',
    paddingTop: 45,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTopTitle: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
