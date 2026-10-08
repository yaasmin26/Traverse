import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { AppAssets } from '../../assets';
import { colors } from '../../theme/colors';

export const LoginLandingScreen: React.FC = () => {
  const { navigate } = useApp();

  return (
    <View style={styles.container}>
      {/* Top Cream Section */}
      <View style={styles.topSection}>
        <Image
          source={AppAssets.logoCard}
          style={styles.logoCard}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Olive Curved Section */}
      <LinearGradient
        colors={['#4e603c', '#7d995e']}
        style={styles.bottomCard}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigate('SignIn')}
            style={styles.whiteButton}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigate('CreateAccount')}
            style={styles.whiteButton}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.footerText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>|</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.footerText}>Terms of use</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.homeIndicator} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfad3',
  },
  topSection: {
    flex: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCard: {
    width: 140,
    height: 140,
    borderRadius: 24,
  },
  bottomCard: {
    flex: 1.3,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingHorizontal: 28,
    paddingTop: 54,
    paddingBottom: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonsContainer: {
    gap: 18,
  },
  whiteButton: {
    height: 54,
    backgroundColor: '#ffffff',
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  footerText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '400',
    paddingHorizontal: 8,
  },
  footerDivider: {
    color: '#ffffff',
    fontSize: 13,
    opacity: 0.6,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 3,
    alignSelf: 'center',
  },
});
