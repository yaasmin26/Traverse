import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';

export const VerifyNumberScreen: React.FC = () => {
  const { navigate, goBack, user } = useApp();
  const [digits, setDigits] = useState<string[]>(['4', '2', '8', '']);
  const [secondsLeft, setSecondsLeft] = useState(54);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDigitChange = (text: string, index: number) => {
    const newDigits = [...digits];
    newDigits[index] = text.slice(-1);
    setDigits(newDigits);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    navigate('ProfileSetup');
  };

  const formattedTime = `00:${secondsLeft.toString().padStart(2, '0')}`;

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
        <View style={styles.content}>
          {/* Top Bar with Back Arrow */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={goBack}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={30} color="#ffffff" />
          </TouchableOpacity>

          {/* Heading */}
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Verification</Text>
            <Text style={styles.subtitle}>
              We sent the verification code to your number
            </Text>
            <Text style={styles.resendText}>
              Resend code in <Text style={styles.timerBold}>{formattedTime}</Text>
            </Text>
          </View>

          {/* OTP 4 Boxes */}
          <View style={styles.otpRow}>
            {digits.map((digit, i) => (
              <View key={i} style={styles.otpBox}>
                <TextInput
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(val) => handleDigitChange(val, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              </View>
            ))}
          </View>

          {/* Phone Number with edit pencil */}
          <View style={styles.phoneRow}>
            <Text style={styles.phoneText}>{user.phone || '+62 812 8976 9946'}</Text>
            <TouchableOpacity onPress={goBack} style={styles.editBtn}>
              <Ionicons name="pencil" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Continue Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleContinue}
            style={styles.continueBtn}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.homeIndicator} />
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 36,
  },
  headerBlock: {
    marginBottom: 44,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#e4eed8',
    marginBottom: 8,
  },
  resendText: {
    fontSize: 14,
    color: '#e4eed8',
  },
  timerBold: {
    fontWeight: '700',
    color: '#ffffff',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  otpBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  otpInput: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.primaryDark,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  phoneText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  editBtn: {
    padding: 4,
  },
  continueBtn: {
    height: 52,
    backgroundColor: '#fbf9d4',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  continueBtnText: {
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
