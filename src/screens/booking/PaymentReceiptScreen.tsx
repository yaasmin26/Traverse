import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp, CompletedBooking } from '../../context/AppContext';
import { AppAssets } from '../../assets';
import { AppHeader } from '../../components/AppHeader';
import { colors } from '../../theme/colors';

const PAYMENT_METHODS = [
  'T-Split Bill',
  'QRIS',
  'Mandiri Virtual Account',
  'BCA Virtual Account',
  'GoPay / OVO',
];

export const PaymentReceiptScreen: React.FC = () => {
  const {
    navigate,
    goBack,
    paymentMethod,
    setPaymentMethod,
    splitUsers,
    setSplitUsers,
    addSplitUser,
    deleteSplitUser,
    toggleSplitUser,
    selectedDepartureTicket,
    selectedReturnTicket,
    passengers,
    addons,
    addBooking,
    selectedPlaceId,
  } = useApp();

  const [isMethodModalVisible, setIsMethodModalVisible] = useState(false);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [newHandle, setNewHandle] = useState('');
  const [newRole, setNewRole] = useState('Friend');

  const handleAddSplitMember = () => {
    if (!newHandle.trim()) return;
    addSplitUser(newHandle.trim(), newRole.trim() || 'Friend');
    setNewHandle('');
    setNewRole('Friend');
    setIsAddUserModalVisible(false);
  };

  const getAvatar = (key: string) => {
    switch (key) {
      case 'avatarElviruy':
        return AppAssets.avatarElviruy;
      case 'avatarDheayuk':
        return AppAssets.avatarDheayuk;
      case 'avatarYaasminn':
        return AppAssets.avatarYaasminn;
      case 'avatarZhafran':
        return AppAssets.avatarZhafran;
      default:
        return AppAssets.avatarYaasmin;
    }
  };

  const depTotal = (selectedDepartureTicket?.price || 150000) * passengers.length;
  const retTotal = selectedReturnTicket
    ? selectedReturnTicket.price * passengers.length
    : 0;

  const receiptItems = [
    {
      name: `Departure Ticket (${selectedDepartureTicket.from} → ${selectedDepartureTicket.to})`,
      pricePer: `Rp ${selectedDepartureTicket.price.toLocaleString('id-ID')}/pax`,
      total: `Rp ${depTotal.toLocaleString('id-ID')}`,
      qty: `${passengers.length} pax`,
    },
    ...(selectedReturnTicket
      ? [
          {
            name: `Return Ticket (${selectedReturnTicket.from} → ${selectedReturnTicket.to})`,
            pricePer: `Rp ${selectedReturnTicket.price.toLocaleString('id-ID')}/pax`,
            total: `Rp ${retTotal.toLocaleString('id-ID')}`,
            qty: `${passengers.length} pax`,
          },
        ]
      : []),
    ...addons
      .filter((a) => a.count > 0)
      .map((a) => ({
        name: a.title,
        pricePer: `Rp ${a.unitPrice.toLocaleString('id-ID')}${a.unitLabel}`,
        total: `Rp ${(a.unitPrice * a.count).toLocaleString('id-ID')}`,
        qty: `${a.count} ${a.unitLabel.replace('/', '')}`,
      })),
  ];

  const grandTotal =
    depTotal +
    retTotal +
    addons.reduce((sum, a) => sum + a.unitPrice * a.count, 0);

  const selectedSplitUsers = splitUsers.filter((u) => u.selected);
  const perPersonShare = Math.round(
    grandTotal / (selectedSplitUsers.length || 1)
  );

  const handleNext = () => {
    if (paymentMethod === 'T-Split Bill' || paymentMethod === 'QRIS') {
      navigate('QRISPayment');
    } else {
      // Immediate booking for VA / e-wallet
      const newBooking: CompletedBooking = {
        id: 'TVR' + Math.floor(100 + Math.random() * 900),
        destination: selectedPlaceId.toUpperCase(),
        date: selectedDepartureTicket.date,
        fromCode: selectedDepartureTicket.from,
        toCode: selectedDepartureTicket.to,
        depTime: selectedDepartureTicket.depTime,
        arrTime: selectedDepartureTicket.arrTime,
        duration: selectedDepartureTicket.duration,
        operator: selectedDepartureTicket.operator,
        passengers: [...passengers],
        totalPrice: grandTotal,
        paymentMethod: paymentMethod,
        status: 'Upcoming',
      };
      addBooking(newBooking);
      navigate('PaymentSuccess');
    }
  };

  return (
    <LinearGradient
      colors={['#faf9d5', '#b9cb9c', '#7f9c5d']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title="Payment"
          subtitle="Pay to go!"
          showBack
          onBack={goBack}
          rightIcon="ticket"
        />

        {/* Receipt Card */}
        <View style={styles.receiptCard}>
          <Text style={styles.receiptHeader}>Receipt</Text>

          <View style={styles.itemsList}>
            {receiptItems.map((item, index) => (
              <View key={index} style={styles.receiptRow}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPricePer}>{item.pricePer}</Text>
                </View>

                <View style={styles.itemRight}>
                  <Text style={styles.itemTotal}>{item.total}</Text>
                  <Text style={styles.itemQty}>{item.qty}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Grand Total */}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>
              Rp {grandTotal.toLocaleString('id-ID')}
            </Text>
          </View>
        </View>

        {/* Payment Method Selector */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsMethodModalVisible(true)}
          style={styles.paymentMethodPill}
        >
          <Text style={styles.paymentMethodText}>{paymentMethod}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.primaryDark} />
        </TouchableOpacity>

        {/* Split Bill Participants (Ticket-8.png) */}
        {paymentMethod === 'T-Split Bill' && (
          <View style={styles.splitSection}>
            <View style={styles.splitSectionHeader}>
              <View>
                <Text style={styles.splitSectionTitle}>
                  Select People to Split The Bill
                </Text>
                <Text style={styles.splitShareHint}>
                  Each pays: Rp {perPersonShare.toLocaleString('id-ID')} ({selectedSplitUsers.length} people)
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsAddUserModalVisible(true)}
                style={styles.addMemberPill}
              >
                <Ionicons name="add" size={16} color="#ffffff" />
                <Text style={styles.addMemberText}>Add Member</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.splitCard}>
              {splitUsers.map((userItem, index) => (
                <TouchableOpacity
                  key={userItem.id}
                  activeOpacity={0.8}
                  onPress={() => toggleSplitUser(userItem.id)}
                  style={[
                    styles.splitUserRow,
                    index < splitUsers.length - 1 && styles.userRowBorder,
                  ]}
                >
                  <Image
                    source={getAvatar(userItem.avatarKey)}
                    style={styles.userAvatar}
                  />

                  <View style={styles.userInfo}>
                    <Text style={styles.userHandle}>{userItem.handle}</Text>
                    <Text style={styles.userRole}>
                      {userItem.role} • Rp {perPersonShare.toLocaleString('id-ID')}
                    </Text>
                  </View>

                  {splitUsers.length > 1 && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      onPress={(e) => {
                        e.stopPropagation();
                        deleteSplitUser(userItem.id);
                      }}
                      style={{ padding: 6, marginRight: 6 }}
                    >
                      <Ionicons name="trash-outline" size={17} color="#d32f2f" />
                    </TouchableOpacity>
                  )}

                  <View
                    style={[
                      styles.checkCircle,
                      userItem.selected && styles.checkCircleActive,
                    ]}
                  >
                    {userItem.selected && (
                      <Ionicons name="checkmark" size={16} color="#ffffff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* NEXT Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          style={styles.nextBtn}
        >
          <Text style={styles.nextBtnText}>NEXT</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Payment Method Selection Modal */}
      <Modal
        visible={isMethodModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMethodModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            <View style={styles.methodList}>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method}
                  activeOpacity={0.7}
                  onPress={() => {
                    setPaymentMethod(method);
                    setIsMethodModalVisible(false);
                  }}
                  style={[
                    styles.methodOption,
                    paymentMethod === method && styles.methodOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.methodOptionText,
                      paymentMethod === method && styles.methodOptionTextActive,
                    ]}
                  >
                    {method}
                  </Text>
                  {paymentMethod === method && (
                    <Ionicons name="checkmark" size={20} color="#ffffff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsMethodModalVisible(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Split Member Modal */}
      <Modal
        visible={isAddUserModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddUserModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Split Bill Friend</Text>
            <Text style={styles.modalSubtitle}>
              Include another user or friend to share the ticket bill
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Username or handle (e.g. @budi)"
              placeholderTextColor="#888"
              value={newHandle}
              onChangeText={setNewHandle}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Role or nickname (e.g. Teman Kampus)"
              placeholderTextColor="#888"
              value={newRole}
              onChangeText={setNewRole}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsAddUserModalVisible(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleAddSplitMember}
                style={styles.modalSubmitBtn}
              >
                <Text style={styles.modalSubmitText}>Add Friend</Text>
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
    paddingHorizontal: 20,
    paddingTop: 44,
  },
  receiptCard: {
    backgroundColor: '#fbf9d4',
    borderRadius: 24,
    padding: 22,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  receiptHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 16,
  },
  itemsList: {
    gap: 12,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemLeft: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  itemPricePer: {
    fontSize: 11,
    color: '#657854',
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  itemQty: {
    fontSize: 11,
    color: '#657854',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e6e4be',
    marginVertical: 16,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  grandTotalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  paymentMethodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fbf9d4',
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 22,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  splitSection: {
    marginBottom: 24,
  },
  splitSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  splitSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  splitShareHint: {
    fontSize: 12,
    color: '#556947',
    marginTop: 2,
    fontWeight: '600',
  },
  addMemberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#749e39',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  addMemberText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  splitCard: {
    backgroundColor: '#fbf9d4',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  splitUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 14,
  },
  userRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eeecca',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userInfo: {
    flex: 1,
  },
  userHandle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  userRole: {
    fontSize: 12,
    color: '#657854',
    marginTop: 2,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#7a965a',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#749e39',
    borderColor: '#749e39',
  },
  nextBtn: {
    height: 50,
    backgroundColor: '#749e39',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fbf9d4',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#657854',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.primaryDark,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6e4be',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eae8cb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  modalSubmitBtn: {
    flex: 1.5,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#749e39',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  methodList: {
    gap: 10,
    marginVertical: 16,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e6e4be',
  },
  methodOptionActive: {
    backgroundColor: '#749e39',
    borderColor: '#749e39',
  },
  methodOptionText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  methodOptionTextActive: {
    color: '#ffffff',
  },
  modalCloseBtn: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eae8cb',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
