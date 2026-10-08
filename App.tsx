import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { WebContainer } from './src/components/WebContainer';
import { BottomTabBar } from './src/components/BottomTabBar';

// Auth Screens (Modul 1: Splash, Login, Create Account, Home)
import { SplashScreen } from './src/screens/auth/SplashScreen';
import { LoginLandingScreen } from './src/screens/auth/LoginLandingScreen';
import { SignInScreen } from './src/screens/auth/SignInScreen';
import { CreateAccountScreen } from './src/screens/auth/CreateAccountScreen';
import { HomeScreen } from './src/screens/tabs/HomeScreen';

const RootNavigator: React.FC = () => {
  const { currentScreen } = useApp();
  const screenFadeAnim = useRef(new Animated.Value(1)).current;
  const prevScreen = useRef(currentScreen);

  useEffect(() => {
    if (prevScreen.current !== currentScreen) {
      prevScreen.current = currentScreen;
      screenFadeAnim.setValue(0.25);
      Animated.timing(screenFadeAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [currentScreen]);

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
      case 'MainTabs':
      default:
        return <HomeScreen />;
    }
  };

  const showBottomBar = currentScreen === 'MainTabs';

  return (
    <View style={styles.appContainer}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.screenContainer, { opacity: screenFadeAnim }]}>
        {renderScreen()}
      </Animated.View>
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
});
