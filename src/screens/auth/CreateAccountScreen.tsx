import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { AppInput } from '../../components/AppInput';
import { colors } from '../../theme/colors';

export const CreateAccountScreen: React.FC = () => {
  const { navigate, user, setUser } = useApp();
  const [email, setEmail] = useState('priasigma@gmail.com');
  const [phone, setPhone] = useState('812 8976 9946');
  const [password, setPassword] = useState('••••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••••');

  const handleCreate = () => {
    setUser((prev) => ({
      ...prev,
      email: email || prev.email,
      phone: `+62 ${phone}`,
    }));
    Alert.alert('Sukses', 'Akun berhasil dibuat!', [
      { text: 'Lanjut ke Home', onPress: () => navigate('MainTabs') },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <LinearGradient
        colors={colors.splashGradient}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Title with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigate('LoginLanding')}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <AppInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              rightIconName="mail-outline"
            />

            <View style={styles.phoneWrapper}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.phoneInputRow}>
                {/* Indonesia Flag Prefix Pill */}
                <View style={styles.flagPill}>
                  <View style={styles.flagIcon}>
                    <View style={styles.flagRed} />
                    <View style={styles.flagWhite} />
                  </View>
                  <Text style={styles.countryCode}>+62</Text>
                  <Ionicons name="chevron-down" size={16} color={colors.primaryDark} />
                </View>

                {/* Number Input */}
                <View style={styles.numberInputBox}>
                  <AppInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="812 **** ****"
                    rightIconName="call-outline"
                    containerStyle={styles.nestedInput}
                  />
                </View>
              </View>
            </View>

            <AppInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••••••"
              secureTextEntry
              rightIconName="key-outline"
            />

            <AppInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••••••••"
              secureTextEntry
              rightIconName="key-outline"
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCreate}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>Creat an account</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have account ? </Text>
            <TouchableOpacity onPress={() => navigate('SignIn')}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.homeIndicator} />
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  formContainer: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 6,
    marginLeft: 4,
  },
  phoneWrapper: {
    marginVertical: 4,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  flagIcon: {
    width: 20,
    height: 14,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  flagRed: {
    flex: 1,
    backgroundColor: '#E70011',
  },
  flagWhite: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  numberInputBox: {
    flex: 1,
  },
  nestedInput: {
    marginVertical: 0,
  },
  createButton: {
    height: 54,
    backgroundColor: '#fbf9d4',
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 16,
  },

    footerText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
  },
  footerLink: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 3,
    alignSelf: 'center',
  },
});

