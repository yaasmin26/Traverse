import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { AppAssets } from '../../assets';
import { AppInput } from '../../components/AppInput';
import { colors } from '../../theme/colors';

export const SignInScreen: React.FC = () => {
  const { navigate, setUser } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username.trim()) {
      setUser((prev) => ({
        ...prev,
        name: username.trim(),
        username: username.trim(),
      }));
    }
    navigate('MainTabs');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Cream Area with Back Button */}
        <View style={styles.topCream}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigate('LoginLanding')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Curved Olive Form Card */}
        <LinearGradient
          colors={['#4e603c', '#7d995e']}
          style={styles.card}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          {/* Traverse Logo */}
          <View style={styles.logoRow}>
            <Image
              source={AppAssets.logo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Form Fields */}
          <View style={styles.formArea}>
            <AppInput
              label="Email / Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your email or username"
              rightIconName="person-outline"
            />

            <AppInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              rightIconName="key-outline"
            />

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Forgot Password',
                  'Silakan hubungi administrator untuk mereset kata sandi.'
                )
              }
              style={styles.forgotBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Forgot Password ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLogin}
              style={styles.loginBtn}
            >
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>or continue with</Text>

            {/* Social Logins */}
            <View style={styles.socialRow}>
              <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
                <Image source={AppAssets.socialApple} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
                <Image source={AppAssets.socialFb} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
                <Image source={AppAssets.socialGoogle} style={styles.socialIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Switch Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have account? </Text>
            <TouchableOpacity onPress={() => navigate('CreateAccount')}>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.homeIndicator} />
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfad3',
  },
  scrollContent: {
    flexGrow: 1,
  },
  topCream: {
    height: 100,
    backgroundColor: '#fbfad3',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(78, 96, 60, 0.1)',
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingHorizontal: 26,
    paddingTop: 36,
    paddingBottom: 20,
    justifyContent: 'space-between',
    minHeight: 740,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 130,
    height: 90,
  },
  formArea: {
    gap: 12,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -2,
    marginBottom: 8,
  },
  forgotText: {
    color: '#fbfad5',
    fontSize: 13,
    fontWeight: '500',
  },
  loginBtn: {
    height: 52,
    backgroundColor: '#fbf9d4',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  orText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 14,
    marginVertical: 14,
    fontWeight: '400',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 22,
    marginBottom: 16,
  },
  socialIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
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
    marginTop: 8,
  },
});
