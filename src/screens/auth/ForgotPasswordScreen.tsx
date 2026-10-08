import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { AppAssets } from '../../assets';
import { AppInput } from '../../components/AppInput';
import { colors } from '../../theme/colors';

export const ForgotPasswordScreen: React.FC = () => {
  const { navigate, goBack } = useApp();
  const [email, setEmail] = useState('priasigma@gmail.com');

  const handleSend = () => {
    if (Platform.OS === 'web') {
      window.alert('Password reset link sent to ' + email);
    } else {
      Alert.alert('Success', 'Password reset link sent to ' + email);
    }
    navigate('SignIn');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Top Cream Area with Back Arrow and Header */}
      <View style={styles.topArea}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={goBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={30} color={colors.primaryDark} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Forgot{'\n'}Your Password ?</Text>
          <Text style={styles.subtitle}>
            We will help you create a new password by entering your email
          </Text>
        </View>
      </View>

      {/* Bottom Olive Curved Card */}
      <LinearGradient
        colors={['#4e603c', '#7d995e']}
        style={styles.bottomCard}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.lockContainer}>
          <Image
            source={AppAssets.lockIcon}
            style={styles.lockIcon}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formArea}>
          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            rightIconName="mail-outline"
          />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSend}
            style={styles.sendButton}
          >
            <Text style={styles.sendButtonText}>Send email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.homeIndicator} />
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfad3',
  },
  topArea: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 28,
  },
  backButton: {
    marginBottom: 20,
  },
  headerContent: {
    paddingLeft: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.primaryDark,
    lineHeight: 42,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.primaryDark,
    maxWidth: 280,
  },
  bottomCard: {
    flex: 1,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  lockContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  lockIcon: {
    width: 60,
    height: 75,
  },
  formArea: {
    gap: 24,
    marginBottom: 40,
  },
  sendButton: {
    height: 52,
    backgroundColor: '#fbf9d4',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 3,
    alignSelf: 'center',
  },
});
