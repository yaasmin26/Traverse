import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { AppAssets } from '../../assets';
import { colors } from '../../theme/colors';

export const ProfileScreen: React.FC = () => {
  const { user, updateUser, resetUserData, navigate } = useApp();

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  // Edit Profile Form State
  const [formName, setFormName] = useState(user.name);
  const [formUsername, setFormUsername] = useState(user.username);
  const [formPhone, setFormPhone] = useState(user.phone);
  const [formEmail, setFormEmail] = useState(user.email);
  const [formAddress, setFormAddress] = useState(user.address);

  // Top Up State
  const [topUpAmount, setTopUpAmount] = useState('100000');

  const handleOpenEditProfile = () => {
    setFormName(user.name);
    setFormUsername(user.username);
    setFormPhone(user.phone);
    setFormEmail(user.email);
    setFormAddress(user.address);
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = () => {
    updateUser({
      name: formName.trim() || user.name,
      username: formUsername.trim() || user.username,
      phone: formPhone.trim() || user.phone,
      email: formEmail.trim() || user.email,
      address: formAddress.trim() || user.address,
    });
    setIsEditProfileOpen(false);
  };

  const handleConfirmTopUp = () => {
    const amountNum = parseInt(topUpAmount.replace(/[^0-9]/g, ''), 10) || 50000;
    updateUser({
      balance: user.balance + amountNum,
    });
    setIsTopUpOpen(false);
  };

  const handleReset = () => {
    resetUserData();
  };

  const menuItems = [
    {
      id: 'personal',
      title: 'Edit Personal Data',
      icon: (
        <Ionicons name="person-outline" size={22} color={colors.primaryDark} />
      ),
      action: handleOpenEditProfile,
    },
    {
      id: 'recap',
      title: 'Travel Recap',
      icon: (
        <Ionicons name="receipt-outline" size={22} color={colors.primaryDark} />
      ),
      action: () => navigate('TravelRecap'),
    },
    {
      id: 'benefit',
      title: 'Member Benefit',
      icon: (
        <Ionicons name="happy-outline" size={22} color={colors.primaryDark} />
      ),
      action: () => {},
    },
    {
      id: 'password',
      title: 'Change Password',
      icon: (
        <Ionicons name="lock-closed-outline" size={22} color={colors.primaryDark} />
      ),
      action: () => navigate('ForgotPassword'),
    },
    {
      id: 'payment',
      title: 'My payment method',
      icon: (
        <Ionicons name="card-outline" size={22} color={colors.primaryDark} />
      ),
      action: () => navigate('PaymentReceipt'),
    },
    {
      id: 'reset',
      title: 'Reset All Demo Data',
      icon: (
        <Ionicons name="refresh-outline" size={22} color="#d32f2f" />
      ),
      action: handleReset,
    },
    {
      id: 'logout',
      title: 'Log Out',
      icon: (
        <Ionicons name="arrow-back-outline" size={22} color={colors.primaryDark} />
      ),
      action: () => navigate('LoginLanding'),
    },
  ];

  return (
    <LinearGradient
      colors={['#faf8d6', '#b9cb9c', '#7f9c5d']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Dark-Green Header Card */}
        <LinearGradient
          colors={['#586d42', '#69834e', '#7b9859']}
          style={styles.headerBanner}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Text style={styles.headerTitle}>Personal Data</Text>
        </LinearGradient>

        {/* Avatar Section overlapping Header */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenEditProfile}
            style={styles.avatarWrapper}
          >
            <Image
              source={AppAssets.avatarYaasmin}
              style={styles.avatarImage}
              resizeMode="cover"
            />
            <View style={styles.editAvatarBadge}>
              <Ionicons name="pencil" size={14} color="#ffffff" />
            </View>
          </TouchableOpacity>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{user.name || 'Yaasmin'}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleOpenEditProfile}
              style={styles.editPencilBtn}
            >
              <Ionicons name="pencil" size={16} color={colors.primaryDark} />
            </TouchableOpacity>
          </View>
          <View style={styles.tierBadge}>
            <Text style={styles.starText}>★</Text>
            <Text style={styles.tierText}>{user.tier || 'Platinum Member'}</Text>
          </View>
        </View>

        {/* Main Body Content */}
        <View style={styles.bodyContent}>
          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Your balance</Text>
              <View style={styles.balanceValueRow}>
                <Ionicons name="compass-outline" size={18} color="#364522" />
                <Text style={styles.balanceValueText}>
                  Rp {user.balance.toLocaleString('id-ID')}
                </Text>
              </View>
            </View>
            <Image
              source={AppAssets.mandiriCard}
              style={styles.mandiriCardImg}
              resizeMode="contain"
            />
          </View>

          {/* Quick Action Buttons: Refillable & Scan to pay */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setIsTopUpOpen(true)}
              style={styles.actionPill}
            >
              <Ionicons name="card-outline" size={18} color="#ffffff" />
              <Text style={styles.actionPillText}>Refillable</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigate('QRISPayment')}
              style={styles.actionPill}
            >
              <MaterialCommunityIcons name="qrcode-scan" size={18} color="#ffffff" />
              <Text style={styles.actionPillText}>Scan to pay</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Menu List */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={item.action}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder,
                ]}
              >
                <View style={styles.menuLeft}>
                  {item.icon}
                  <Text
                    style={[
                      styles.menuTitle,
                      item.id === 'reset' && { color: '#d32f2f' },
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.primaryDark} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom tab spacer */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Edit Profile Modal (CRUD Update) */}
      <Modal
        visible={isEditProfileOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditProfileOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView
            contentContainerStyle={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Personal Data</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsEditProfileOpen(false)}
                >
                  <Ionicons name="close-circle" size={26} color={colors.primaryDark} />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Full Name"
                placeholderTextColor="#888"
                value={formName}
                onChangeText={setFormName}
              />

              <Text style={styles.inputLabel}>Username / Handle</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Username"
                placeholderTextColor="#888"
                value={formUsername}
                onChangeText={setFormUsername}
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Phone"
                keyboardType="phone-pad"
                placeholderTextColor="#888"
                value={formPhone}
                onChangeText={setFormPhone}
              />

              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#888"
                value={formEmail}
                onChangeText={setFormEmail}
              />

              <Text style={styles.inputLabel}>Address / City</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="City, Country"
                placeholderTextColor="#888"
                value={formAddress}
                onChangeText={setFormAddress}
              />

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsEditProfileOpen(false)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSaveProfile}
                  style={styles.modalSaveBtn}
                >
                  <Text style={styles.modalSaveText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Top Up / Refillable Modal */}
      <Modal
        visible={isTopUpOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsTopUpOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Top Up Balance</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsTopUpOpen(false)}
              >
                <Ionicons name="close-circle" size={26} color={colors.primaryDark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.topUpSubtitle}>
              Current balance: Rp {user.balance.toLocaleString('id-ID')}
            </Text>

            <View style={styles.topUpChipsRow}>
              {['50000', '100000', '250000', '500000'].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  activeOpacity={0.8}
                  onPress={() => setTopUpAmount(amt)}
                  style={[
                    styles.topUpChip,
                    topUpAmount === amt && styles.topUpChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.topUpChipText,
                      topUpAmount === amt && styles.topUpChipTextActive,
                    ]}
                  >
                    +Rp {parseInt(amt, 10).toLocaleString('id-ID')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Or custom amount</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 150000"
              keyboardType="numeric"
              placeholderTextColor="#888"
              value={topUpAmount}
              onChangeText={setTopUpAmount}
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsTopUpOpen(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleConfirmTopUp}
                style={styles.modalSaveBtn}
              >
                <Text style={styles.modalSaveText}>Top Up Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerBanner: {
    paddingTop: 52,
    paddingBottom: 85,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: -74,
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 148,
    height: 148,
    borderRadius: 74,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#445738',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  editPencilBtn: {
    padding: 4,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7b9858',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 6,
  },
  starText: {
    color: '#ffdd00',
    fontSize: 14,
  },
  tierText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  bodyContent: {
    paddingHorizontal: 20,
  },
  balanceCard: {
    backgroundColor: '#86a464',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  balanceInfo: {
    gap: 4,
  },
  balanceLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  balanceValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceValueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#364522',
  },
  mandiriCardImg: {
    width: 92,
    height: 58,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  actionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#86a464',
    height: 48,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  menuContainer: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#d6dfc5',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334220',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#556943',
    marginBottom: 4,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: '#f3f6ec',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2d3b1c',
    borderWidth: 1,
    borderColor: '#d7dfcc',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#e6ebd8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#556943',
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#445738',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  topUpSubtitle: {
    fontSize: 14,
    color: '#667755',
    marginBottom: 14,
  },
  topUpChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  topUpChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#edf2e3',
    borderWidth: 1,
    borderColor: '#cddac0',
  },
  topUpChipActive: {
    backgroundColor: '#445738',
    borderColor: '#445738',
  },
  topUpChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#445738',
  },
  topUpChipTextActive: {
    color: '#ffffff',
  },
});
