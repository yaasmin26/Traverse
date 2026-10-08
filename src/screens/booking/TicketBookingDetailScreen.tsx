import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { AppHeader } from '../../components/AppHeader';
import { colors } from '../../theme/colors';

export const TicketBookingDetailScreen: React.FC = () => {
  const {
    navigate,
    goBack,
    selectedDepartureTicket,
    selectedReturnTicket,
    setSelectedReturnTicket,
    passengers,
    addPassenger,
    removePassenger,
    updatePassenger,
  } = useApp();

  const [returnSelected, setReturnSelected] = useState<boolean>(!!selectedReturnTicket);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [newPassengerModal, setNewPassengerModal] = useState<boolean>(false);
  const [newPassengerName, setNewPassengerName] = useState<string>('');

  const depPrice = selectedDepartureTicket.price;
  const retPrice = returnSelected && selectedReturnTicket ? selectedReturnTicket.price : 0;
  const totalAmount = passengers.length * (depPrice + retPrice);

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingName(passengers[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingName.trim()) {
      updatePassenger(editingIndex, editingName.trim());
    }
    setEditingIndex(null);
    setEditingName('');
  };

  const handleAdd = () => {
    if (newPassengerName.trim()) {
      addPassenger(newPassengerName.trim());
      setNewPassengerName('');
      setNewPassengerModal(false);
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
          title="Ticket"
          subtitle="Find your ticket for your travel"
          showBack
          onBack={goBack}
          rightIcon="ticket"
        />

        {/* Departure Section */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeaderTitle}>Departure</Text>

          <View style={styles.journeyCard}>
            <View style={styles.timelineCol}>
              <View style={styles.stationDot} />
              <View style={styles.timelineLine} />
              <View style={styles.stationDot} />
            </View>

            <View style={styles.journeyMiddle}>
              <View style={styles.pointRow}>
                <Text style={styles.pointCode}>{selectedDepartureTicket.from}</Text>
                <Text style={styles.pointTime}>{selectedDepartureTicket.depTime}</Text>
              </View>

              <Text style={styles.durationTag}>{selectedDepartureTicket.duration}</Text>

              <View style={styles.pointRow}>
                <Text style={styles.pointCode}>{selectedDepartureTicket.to}</Text>
                <Text style={styles.pointTime}>{selectedDepartureTicket.arrTime}</Text>
              </View>
            </View>

            <View style={styles.journeyRight}>
              <Text style={styles.cardDate}>{selectedDepartureTicket.date}</Text>
              <Text style={styles.classDetail}>{selectedDepartureTicket.operator}</Text>
              <Text style={styles.passengerCount}>{passengers.length} Person</Text>
            </View>
          </View>
        </View>

        {/* Return Section */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Return</Text>
            {returnSelected && (
              <TouchableOpacity
                onPress={() => setReturnSelected(false)}
                style={styles.removeReturnBtn}
              >
                <Text style={styles.removeReturnText}>Remove Return</Text>
              </TouchableOpacity>
            )}
          </View>

          {returnSelected && selectedReturnTicket ? (
            <View style={styles.journeyCard}>
              <View style={styles.timelineCol}>
                <View style={styles.stationDot} />
                <View style={styles.timelineLine} />
                <View style={styles.stationDot} />
              </View>

              <View style={styles.journeyMiddle}>
                <View style={styles.pointRow}>
                  <Text style={styles.pointCode}>{selectedReturnTicket.from}</Text>
                  <Text style={styles.pointTime}>{selectedReturnTicket.depTime}</Text>
                </View>

                <Text style={styles.durationTag}>{selectedReturnTicket.duration}</Text>

                <View style={styles.pointRow}>
                  <Text style={styles.pointCode}>{selectedReturnTicket.to}</Text>
                  <Text style={styles.pointTime}>{selectedReturnTicket.arrTime}</Text>
                </View>
              </View>

              <View style={styles.journeyRight}>
                <Text style={styles.cardDate}>{selectedReturnTicket.date}</Text>
                <Text style={styles.classDetail}>{selectedReturnTicket.operator}</Text>
                <Text style={styles.passengerCount}>{passengers.length} Person</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setReturnSelected(true)}
              style={styles.addReturnCard}
            >
              <Ionicons name="add" size={36} color="#7a965a" />
              <Text style={styles.addReturnLabel}>Add Return Ticket</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Interactive Passenger Details */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Passenger Details</Text>
            <TouchableOpacity
              onPress={() => setNewPassengerModal(true)}
              style={styles.addPassengerHeaderBtn}
            >
              <Ionicons name="person-add" size={16} color="#445738" />
              <Text style={styles.addPassengerHeaderText}>Add Passenger</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.passengerList}>
            {passengers.map((name, index) => (
              <View key={index} style={styles.passengerPill}>
                {editingIndex === index ? (
                  <View style={styles.inlineEditRow}>
                    <TextInput
                      value={editingName}
                      onChangeText={setEditingName}
                      autoFocus
                      onSubmitEditing={saveEdit}
                      style={styles.inlineInput}
                    />
                    <TouchableOpacity onPress={saveEdit} style={styles.saveCheckBtn}>
                      <Ionicons name="checkmark" size={18} color="#07a829" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => startEdit(index)}
                    style={styles.passengerTouch}
                  >
                    <View style={styles.passengerIndexBadge}>
                      <Text style={styles.passengerIndexText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.passengerNameText}>{name}</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.passengerActions}>
                  <TouchableOpacity
                    onPress={() => (editingIndex === index ? saveEdit() : startEdit(index))}
                    style={styles.iconActionBtn}
                  >
                    <Ionicons
                      name={editingIndex === index ? 'checkmark' : 'pencil-outline'}
                      size={17}
                      color="#556b46"
                    />
                  </TouchableOpacity>
                  {passengers.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removePassenger(index)}
                      style={styles.iconActionBtn}
                    >
                      <Ionicons name="close-circle-outline" size={18} color="#d32f2f" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Total From This Page */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total From This Page</Text>
          <View style={styles.totalBox}>
            <Text style={styles.totalValue}>
              Rp {totalAmount.toLocaleString('id-ID')}
            </Text>
          </View>
        </View>

        {/* NEXT Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigate('TicketAddons')}
          style={styles.nextBtn}
        >
          <Text style={styles.nextBtnText}>NEXT</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal to Add Passenger */}
      <Modal visible={newPassengerModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Passenger</Text>
            <TextInput
              placeholder="Full Name (e.g. John Doe)"
              placeholderTextColor="#99a888"
              value={newPassengerName}
              onChangeText={setNewPassengerName}
              style={styles.modalInput}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setNewPassengerModal(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAdd} style={styles.modalSaveBtn}>
                <Text style={styles.modalSaveText}>Add</Text>
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
    paddingHorizontal: 16,
    paddingTop: 44,
  },
  sectionBlock: {
    marginTop: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 10,
  },
  addPassengerHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e6edd4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addPassengerHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#445738',
  },
  removeReturnBtn: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  removeReturnText: {
    fontSize: 12,
    color: '#d32f2f',
    fontWeight: '600',
  },
  journeyCard: {
    backgroundColor: '#fbf9d4',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#2b3a1a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  addReturnCard: {
    backgroundColor: 'rgba(251, 249, 212, 0.6)',
    borderRadius: 24,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#8da857',
    flexDirection: 'row',
    gap: 8,
  },
  addReturnLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#556b46',
  },
  timelineCol: {
    alignItems: 'center',
    marginRight: 14,
  },
  stationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#7a965a',
    backgroundColor: '#fbf9d4',
  },
  timelineLine: {
    width: 2,
    height: 38,
    backgroundColor: '#7a965a',
    marginVertical: 4,
  },
  journeyMiddle: {
    justifyContent: 'space-between',
    height: 60,
    marginRight: 20,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointCode: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
    width: 36,
  },
  pointTime: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  durationTag: {
    fontSize: 11,
    color: '#556947',
    marginLeft: 48,
  },
  journeyRight: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 3,
  },
  cardDate: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  classDetail: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  passengerCount: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '500',
    marginTop: 4,
  },
  passengerList: {
    gap: 10,
  },
  passengerPill: {
    backgroundColor: '#fbf9d4',
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  passengerTouch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  passengerIndexBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#749e39',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerIndexText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  passengerNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  inlineEditRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
    borderBottomWidth: 1.5,
    borderBottomColor: '#749e39',
    paddingVertical: 2,
  },
  saveCheckBtn: {
    padding: 4,
  },
  passengerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconActionBtn: {
    padding: 4,
  },
  totalSection: {
    gap: 8,
    marginTop: 20,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  totalBox: {
    backgroundColor: '#fbf9d4',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#faf9d4',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.primaryDark,
    borderWidth: 1,
    borderColor: '#cddbb0',
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#778a63',
  },
  modalSaveBtn: {
    backgroundColor: '#749e39',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
