import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { AppAssets } from '../../assets';
import { AppInput } from '../../components/AppInput';
import { ProgressBar } from '../../components/ProgressBar';
import { colors } from '../../theme/colors';

export const ProfileSetupScreen: React.FC = () => {
  const { navigate, user, setUser, profileStep, setProfileStep } = useApp();

  // Step 1 state
  const [fullName, setFullName] = useState('Yaasmin');
  const [address, setAddress] = useState('Malang, Jawa Timur');
  const [dob, setDob] = useState('11 May 2002');
  const [gender, setGender] = useState('Female');

  // Step 2 state
  const [username, setUsername] = useState('Yaasmin');

  // Step 3 state
  const [selectedPhoto, setSelectedPhoto] = useState<boolean>(true);

  // Step 4 state
  const [transportTypes, setTransportTypes] = useState<string[]>(['Bus']);

  // Step 5 state
  const [transportPurposes, setTransportPurposes] = useState<string[]>([
    'Daily journey',
    'Visiting family or friends',
    'Business needs',
  ]);

  const handleNext = () => {
    if (profileStep < 6) {
      setProfileStep(profileStep + 1);
    } else {
      setUser((prev) => ({
        ...prev,
        name: fullName || prev.name,
        username: username || prev.username,
        address: address || prev.address,
        dob: dob || prev.dob,
        gender: gender || prev.gender,
      }));
      navigate('MainTabs', 'home');
    }
  };

  const handlePrev = () => {
    if (profileStep > 1) {
      setProfileStep(profileStep - 1);
    } else {
      navigate('VerifyNumber');
    }
  };

  const toggleTransport = (item: string) => {
    setTransportTypes((prev) =>
      prev.includes(item) ? prev.filter((t) => t !== item) : [...prev, item]
    );
  };

  const togglePurpose = (item: string) => {
    setTransportPurposes((prev) =>
      prev.includes(item) ? prev.filter((t) => t !== item) : [...prev, item]
    );
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
          {/* Header Row with Back Button */}
          <View style={styles.topNavRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePrev}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <ProgressBar currentStep={profileStep} totalSteps={6} />

          {/* STEP 1: Personal Data */}
          {profileStep === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Let’s complete your profile</Text>

              <View style={styles.fieldsArea}>
                <AppInput
                  label="Full name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Your name"
                  variant="cream"
                  rightIconName="person-outline"
                />

                <AppInput
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Your address"
                  variant="cream"
                  rightIconName="home-outline"
                />

                <AppInput
                  label="Date of birth"
                  value={dob}
                  onChangeText={setDob}
                  placeholder="Date of birth"
                  variant="cream"
                  rightIconName="calendar-outline"
                />

                <View style={styles.genderWrapper}>
                  <Text style={styles.fieldLabel}>Gender</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      setGender(gender === 'Female' ? 'Male' : 'Female')
                    }
                    style={styles.dropdownBox}
                  >
                    <Text style={styles.dropdownText}>{gender || 'Choose gender'}</Text>
                    <Ionicons name="chevron-down" size={20} color={colors.primaryDark} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: Username */}
          {profileStep === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person-outline" size={72} color="#000000" />
              </View>

              <Text style={styles.stepTitle}>Username</Text>
              <Text style={styles.stepSubtitle}>
                Choose a username for your account . You can always change it later.
              </Text>

              <View style={styles.usernameInputBox}>
                <AppInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Yaasmin"
                  variant="cream"
                  rightIconName="checkmark"
                />
              </View>
            </View>
          )}

          {/* STEP 3: Profile picture */}
          {profileStep === 3 && (
            <View style={styles.stepContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedPhoto(!selectedPhoto)}
                style={styles.avatarCircle}
              >
                {selectedPhoto ? (
                  <Image
                    source={AppAssets.avatarYaasmin}
                    style={styles.avatarSetupImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="camera-outline" size={72} color="#000000" />
                )}
              </TouchableOpacity>

              <Text style={styles.stepTitle}>Profile picture</Text>
              <Text style={styles.stepSubtitle}>
                Choose a picture for your profile account . You can always change it later.
              </Text>
            </View>
          )}

          {/* STEP 4: Transportation */}
          {profileStep === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.questionTitle}>
                What transportation do you usually use?
              </Text>

              <View style={styles.optionsList}>
                {['Train', 'Bus', 'Airplane'].map((item) => {
                  const isSelected = transportTypes.includes(item);
                  return (
                    <TouchableOpacity
                      key={item}
                      activeOpacity={0.8}
                      onPress={() => toggleTransport(item)}
                      style={styles.optionPill}
                    >
                      <Text style={styles.optionText}>{item}</Text>
                      <View style={[styles.radioCircle, isSelected && styles.radioActive]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 5: What do you usually do with transportation */}
          {profileStep === 5 && (
            <View style={styles.stepContainer}>
              <Text style={styles.questionTitle}>
                what do you usually do with transportation?
              </Text>

              <View style={styles.optionsList}>
                {[
                  'Daily journey',
                  'Visiting family or friends',
                  'Vacation or recreation',
                  'Business needs',
                ].map((item) => {
                  const isSelected = transportPurposes.includes(item);
                  return (
                    <TouchableOpacity
                      key={item}
                      activeOpacity={0.8}
                      onPress={() => togglePurpose(item)}
                      style={styles.optionPill}
                    >
                      <Text style={styles.optionText}>{item}</Text>
                      <View style={[styles.radioCircle, isSelected && styles.radioActive]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 6: Complete */}
          {profileStep === 6 && (
            <View style={styles.stepContainer}>
              <View style={styles.completeIllustrationArea}>
                <Image
                  source={AppAssets.completeIllustration}
                  style={styles.completeImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.stepTitle}>Welcome, {user.name || 'Yaasmin'}</Text>
              <Text style={styles.stepSubtitle}>
                you're ready now, we'll help you{'\n'}find the best way to get around.
              </Text>
            </View>
          )}

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Continue Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNext}
            style={styles.continueBtn}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>

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
    paddingTop: 44,
    paddingBottom: 24,
  },
  topNavRow: {
    marginBottom: 4,
  },
  backButton: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  stepContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  stepSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#e4eed8',
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: 24,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 28,
    marginTop: 16,
  },
  fieldsArea: {
    width: '100%',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 6,
    marginLeft: 4,
  },
  genderWrapper: {
    marginVertical: 8,
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fbf9d4',
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 15,
    color: colors.primaryDark,
  },
  avatarCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    marginTop: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarSetupImage: {
    width: '100%',
    height: '100%',
  },
  usernameInputBox: {
    width: '100%',
    marginTop: 8,
  },
  optionsList: {
    width: '100%',
    gap: 16,
  },
  optionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fbf9d4',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  radioCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#7a965a',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    backgroundColor: '#86a863',
    borderColor: '#86a863',
  },
  radioInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#536d39',
  },
  completeIllustrationArea: {
    width: '100%',
    height: 310,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  completeImage: {
    width: '100%',
    height: '100%',
  },
  continueBtn: {
    height: 52,
    backgroundColor: '#fbf9d4',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
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
