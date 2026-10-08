import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp, CompletedBooking } from '../../context/AppContext';
import { colors } from '../../theme/colors';

export const TicketScreen: React.FC = () => {
  const { navigate, bookingHistory, addBooking, updateBooking, deleteBooking } = useApp();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Local' | 'City'>('All');
  const [selectedBooking, setSelectedBooking] = useState<CompletedBooking | null>(null);

  // CRUD Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<CompletedBooking | null>(null);

  // Form Fields for Create / Edit
  const [formDest, setFormDest] = useState('Kayutangan');
  const [formDate, setFormDate] = useState('20 April 2026');
  const [formFrom, setFormFrom] = useState('MLG');
  const [formTo, setFormTo] = useState('BWI');
  const [formDepTime, setFormDepTime] = useState('07.30');
  const [formArrTime, setFormArrTime] = useState('14.30');
  const [formOperator, setFormOperator] = useState('KAI • Panoramic Class');
  const [formPassengers, setFormPassengers] = useState('Yaasmin, Dhea Ayu');
  const [formPrice, setFormPrice] = useState('300000');
  const [formStatus, setFormStatus] = useState<'Upcoming' | 'Completed'>('Upcoming');

  const filteredTickets =
    activeFilter === 'All'
      ? bookingHistory
      : bookingHistory.filter((t) => {
          if (activeFilter === 'Local') return t.fromCode === 'MLG' || t.toCode === 'MLG';
          return t.fromCode !== 'MLG' || t.toCode !== 'MLG';
        });

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormDest('Bromo');
    setFormDate('25 April 2026');
    setFormFrom('MLG');
    setFormTo('SUB');
    setFormDepTime('08.00');
    setFormArrTime('11.30');
    setFormOperator('KAI • Panoramic Class');
    setFormPassengers('Yaasmin, Zhafran');
    setFormPrice('350000');
    setFormStatus('Upcoming');
    setIsCreateModalOpen(true);
  };

  // Submit Create Booking
  const handleSaveNewBooking = () => {
    const passengerArray = formPassengers
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const newBooking: CompletedBooking = {
      id: 'TVR' + Math.floor(100 + Math.random() * 900),
      destination: formDest.trim() || 'Kayutangan',
      date: formDate.trim() || '20 April 2026',
      fromCode: formFrom.trim().toUpperCase() || 'MLG',
      toCode: formTo.trim().toUpperCase() || 'BWI',
      depTime: formDepTime.trim() || '07.30',
      arrTime: formArrTime.trim() || '14.30',
      duration: '4h 30m',
      operator: formOperator.trim() || 'KAI • Economy',
      passengers: passengerArray.length > 0 ? passengerArray : ['Yaasmin'],
      totalPrice: parseInt(formPrice.replace(/[^0-9]/g, ''), 10) || 300000,
      paymentMethod: 'QRIS',
      status: formStatus,
    };

    addBooking(newBooking);
    setIsCreateModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (booking: CompletedBooking) => {
    setFormDest(booking.destination);
    setFormDate(booking.date);
    setFormFrom(booking.fromCode);
    setFormTo(booking.toCode);
    setFormDepTime(booking.depTime);
    setFormArrTime(booking.arrTime);
    setFormOperator(booking.operator);
    setFormPassengers(booking.passengers.join(', '));
    setFormPrice(booking.totalPrice.toString());
    setFormStatus(booking.status);
    setIsEditModalOpen(true);
  };

  // Submit Edit Booking
  const handleSaveEditBooking = () => {
    if (!selectedBooking) return;

    const passengerArray = formPassengers
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const updatedData: Partial<CompletedBooking> = {
      destination: formDest.trim(),
      date: formDate.trim(),
      fromCode: formFrom.trim().toUpperCase(),
      toCode: formTo.trim().toUpperCase(),
      depTime: formDepTime.trim(),
      arrTime: formArrTime.trim(),
      operator: formOperator.trim(),
      passengers: passengerArray.length > 0 ? passengerArray : selectedBooking.passengers,
      totalPrice: parseInt(formPrice.replace(/[^0-9]/g, ''), 10) || selectedBooking.totalPrice,
      status: formStatus,
    };

    updateBooking(selectedBooking.id, updatedData);
    setSelectedBooking({ ...selectedBooking, ...updatedData });
    setIsEditModalOpen(false);
  };

  // Confirm Delete Booking
  const handleConfirmDelete = () => {
    if (bookingToDelete) {
      deleteBooking(bookingToDelete.id);
      setBookingToDelete(null);
      if (selectedBooking?.id === bookingToDelete.id) {
        setSelectedBooking(null);
      }
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
        {/* Header with Quick Add Ticket button */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>My Ticket</Text>
            <Text style={styles.subtitle}>Check & manage your travel tickets</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenCreate}
              style={styles.addTicketPill}
            >
              <Ionicons name="add" size={16} color="#ffffff" />
              <Text style={styles.addTicketText}>New</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigate('TicketPlaces')}
              style={styles.ticketIconBtn}
            >
              <MaterialCommunityIcons
                name="ticket-outline"
                size={32}
                color={colors.primaryDark}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Tabs: All, Local, City */}
        <View style={styles.filterRow}>
          {(['All', 'Local', 'City'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterPill,
                  isActive ? styles.filterPillActive : styles.filterPillInactive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive ? styles.filterTextActive : styles.filterTextInactive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Ticket Cards */}
        <View style={styles.cardList}>
          {filteredTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              activeOpacity={0.9}
              onPress={() => setSelectedBooking(ticket)}
              style={styles.ticketCard}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.upcomingPill,
                    ticket.status === 'Completed' && styles.completedPill,
                  ]}
                >
                  <Text style={styles.upcomingText}>{ticket.status}</Text>
                </View>
                <Text style={styles.dateText}>{ticket.date}</Text>
                {ticket.destination && (
                  <View style={styles.destPill}>
                    <Text style={styles.destText}>{ticket.destination}</Text>
                  </View>
                )}
              </View>

              {/* Route */}
              <View style={styles.routeRow}>
                <View style={styles.stationBlock}>
                  <View style={styles.codeRow}>
                    <Text style={styles.stationCode}>{ticket.fromCode}</Text>
                    <MaterialCommunityIcons name="train" size={18} color={colors.primaryDark} />
                  </View>
                  <Text style={styles.timeText}>{ticket.depTime}</Text>
                </View>

                <View style={styles.lineArea}>
                  <Text style={styles.dashLine}>--------------------------→</Text>
                  <Text style={styles.durationText}>{ticket.duration}</Text>
                </View>

                <View style={styles.stationBlockRight}>
                  <View style={styles.codeRow}>
                    <MaterialCommunityIcons name="train" size={18} color={colors.primaryDark} />
                    <Text style={styles.stationCode}>{ticket.toCode}</Text>
                  </View>
                  <Text style={styles.timeText}>{ticket.arrTime}</Text>
                </View>
              </View>

              <Text style={styles.operatorText}>{ticket.operator}</Text>

              {/* Passengers Pill */}
              <View style={styles.passengerPreviewRow}>
                <Ionicons name="people-outline" size={15} color="#556947" />
                <Text style={styles.passengerPreviewText} numberOfLines={1}>
                  {ticket.passengers.length} Passengers: {ticket.passengers.join(', ')}
                </Text>
              </View>

              <View style={styles.cardDivider} />

              {/* Booking ID, Price & Quick Actions */}
              <View style={styles.footerRow}>
                <View>
                  <Text style={styles.bookingLabel}>Booking ID</Text>
                  <Text style={styles.bookingValue}>{ticket.id}</Text>
                </View>

                <View style={styles.footerRight}>
                  <View style={{ alignItems: 'flex-end', marginRight: 12 }}>
                    <Text style={styles.bookingLabel}>Total</Text>
                    <Text style={styles.priceValue}>
                      Rp {ticket.totalPrice.toLocaleString('id-ID')}
                    </Text>
                  </View>

                  <View style={styles.cardActionBtns}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedBooking(ticket);
                        handleOpenEdit(ticket);
                      }}
                      style={styles.cardIconBtn}
                    >
                      <Ionicons name="pencil" size={16} color={colors.primaryDark} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={(e) => {
                        e.stopPropagation();
                        setBookingToDelete(ticket);
                      }}
                      style={[styles.cardIconBtn, styles.cardDeleteBtn]}
                    >
                      <Ionicons name="trash-outline" size={16} color="#d32f2f" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {filteredTickets.length === 0 && (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="ticket-confirmation-outline"
                size={64}
                color="#78935c"
              />
              <Text style={styles.emptyTitle}>No tickets found</Text>
              <Text style={styles.emptySubtitle}>
                You don't have any tickets under {activeFilter} category.
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleOpenCreate}
                style={styles.bookNowBtn}
              >
                <Text style={styles.bookNowText}>+ Book / Add a Ticket</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom tab spacer */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Ticket Details Modal (READ + Actions) */}
      <Modal
        visible={!!selectedBooking && !isEditModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBooking(null)}
      >
        <View style={styles.modalOverlay}>
          {selectedBooking && (
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Ticket Details</Text>
                  <Text style={styles.modalBookingCode}>
                    Booking ID: {selectedBooking.id}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedBooking(null)}
                >
                  <Ionicons name="close-circle" size={28} color={colors.primaryDark} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Destination</Text>
                  <Text style={styles.detailValue}>{selectedBooking.destination}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Route</Text>
                  <Text style={styles.detailValue}>
                    {selectedBooking.fromCode} → {selectedBooking.toCode}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date & Time</Text>
                  <Text style={styles.detailValue}>
                    {selectedBooking.date} • {selectedBooking.depTime} - {selectedBooking.arrTime}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Operator</Text>
                  <Text style={styles.detailValue}>{selectedBooking.operator}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Method</Text>
                  <Text style={styles.detailValue}>{selectedBooking.paymentMethod}</Text>
                </View>

                <View style={styles.passengersSection}>
                  <Text style={styles.detailLabel}>
                    Passengers ({selectedBooking.passengers.length} people)
                  </Text>
                  <View style={styles.passengerChips}>
                    {selectedBooking.passengers.map((p, idx) => (
                      <View key={idx} style={styles.passengerChip}>
                        <Ionicons name="person" size={13} color="#ffffff" />
                        <Text style={styles.passengerChipText}>{p}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.modalDivider} />

                <View style={styles.detailRow}>
                  <Text style={styles.modalTotalLabel}>Total Paid</Text>
                  <Text style={styles.modalTotalValue}>
                    Rp {selectedBooking.totalPrice.toLocaleString('id-ID')}
                  </Text>
                </View>
              </View>

              {/* CRUD Action Buttons inside modal */}
              <View style={styles.modalActionButtonsRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleOpenEdit(selectedBooking)}
                  style={styles.modalEditBtn}
                >
                  <Ionicons name="pencil" size={16} color="#ffffff" />
                  <Text style={styles.modalEditBtnText}>Edit Ticket</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    setBookingToDelete(selectedBooking);
                  }}
                  style={styles.modalDeleteBtn}
                >
                  <Ionicons name="trash-outline" size={16} color="#ffffff" />
                  <Text style={styles.modalDeleteBtnText}>Cancel Ticket</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Create / Edit Booking Modal (CRUD Form) */}
      <Modal
        visible={isCreateModalOpen || isEditModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <ScrollView
            contentContainerStyle={styles.formModalScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEditModalOpen ? 'Edit Booking' : 'New Ticket Booking'}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                >
                  <Ionicons name="close-circle" size={26} color={colors.primaryDark} />
                </TouchableOpacity>
              </View>

              <Text style={styles.formSectionLabel}>Destination & Route</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Destination (e.g. Bromo, Kayutangan)"
                placeholderTextColor="#888"
                value={formDest}
                onChangeText={setFormDest}
              />

              <View style={styles.formRowTwo}>
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  placeholder="From (e.g. MLG)"
                  placeholderTextColor="#888"
                  value={formFrom}
                  onChangeText={setFormFrom}
                />
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  placeholder="To (e.g. BWI)"
                  placeholderTextColor="#888"
                  value={formTo}
                  onChangeText={setFormTo}
                />
              </View>

              <Text style={styles.formSectionLabel}>Date & Time</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Date (e.g. 25 April 2026)"
                placeholderTextColor="#888"
                value={formDate}
                onChangeText={setFormDate}
              />

              <View style={styles.formRowTwo}>
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  placeholder="Departure (e.g. 07.30)"
                  placeholderTextColor="#888"
                  value={formDepTime}
                  onChangeText={setFormDepTime}
                />
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  placeholder="Arrival (e.g. 14.30)"
                  placeholderTextColor="#888"
                  value={formArrTime}
                  onChangeText={setFormArrTime}
                />
              </View>

              <Text style={styles.formSectionLabel}>Operator / Class</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Operator (e.g. KAI • Panoramic Class)"
                placeholderTextColor="#888"
                value={formOperator}
                onChangeText={setFormOperator}
              />

              <Text style={styles.formSectionLabel}>
                Passengers (Separate with comma)
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Yaasmin, Dhea Ayu, Elvira"
                placeholderTextColor="#888"
                value={formPassengers}
                onChangeText={setFormPassengers}
              />

              <Text style={styles.formSectionLabel}>Total Price (Rp)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. 300000"
                keyboardType="numeric"
                placeholderTextColor="#888"
                value={formPrice}
                onChangeText={setFormPrice}
              />

              {/* Status Selector */}
              <Text style={styles.formSectionLabel}>Status</Text>
              <View style={styles.statusRow}>
                {(['Upcoming', 'Completed'] as const).map((st) => (
                  <TouchableOpacity
                    key={st}
                    activeOpacity={0.8}
                    onPress={() => setFormStatus(st)}
                    style={[
                      styles.statusPill,
                      formStatus === st && styles.statusPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        formStatus === st && styles.statusPillTextActive,
                      ]}
                    >
                      {st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Buttons */}
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  style={styles.formCancelBtn}
                >
                  <Text style={styles.formCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={isEditModalOpen ? handleSaveEditBooking : handleSaveNewBooking}
                  style={styles.formSubmitBtn}
                >
                  <Text style={styles.formSubmitText}>
                    {isEditModalOpen ? 'Save Changes' : 'Create Ticket'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Delete Confirmation Modal (CRUD Delete) */}
      <Modal
        visible={!!bookingToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setBookingToDelete(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteConfirmBox}>
            <View style={styles.deleteWarningIcon}>
              <Ionicons name="trash-outline" size={36} color="#d32f2f" />
            </View>

            <Text style={styles.deleteTitle}>Cancel Ticket?</Text>
            <Text style={styles.deleteSubtitle}>
              Are you sure you want to cancel booking {bookingToDelete?.id} to{' '}
              {bookingToDelete?.destination}?
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setBookingToDelete(null)}
                style={styles.formCancelBtn}
              >
                <Text style={styles.formCancelText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleConfirmDelete}
                style={styles.deleteRedBtn}
              >
                <Text style={styles.deleteRedText}>Yes, Cancel</Text>
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
    paddingTop: 48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: colors.primaryDark,
    marginTop: 2,
  },
  ticketIconBtn: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  filterPill: {
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  filterPillActive: {
    backgroundColor: '#4b5e3f',
  },
  filterPillInactive: {
    backgroundColor: '#fcfbd8',
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  filterTextInactive: {
    color: '#b1723f',
  },
  cardList: {
    gap: 20,
  },
  ticketCard: {
    backgroundColor: '#fbf9d4',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  upcomingPill: {
    backgroundColor: '#07a829',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
  },
  upcomingText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stationBlock: {
    alignItems: 'flex-start',
  },
  stationBlockRight: {
    alignItems: 'flex-end',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stationCode: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  timeText: {
    fontSize: 13,
    color: '#556947',
    marginTop: 2,
    fontWeight: '500',
  },
  lineArea: {
    alignItems: 'center',
  },
  dashLine: {
    color: '#556947',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  durationText: {
    fontSize: 11,
    color: '#556947',
    marginTop: 2,
  },
  operatorText: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '500',
    marginBottom: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#e6e4be',
    marginVertical: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingLabel: {
    fontSize: 14,
    color: colors.primaryDark,
  },
  bookingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  destPill: {
    backgroundColor: 'rgba(68, 87, 56, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 'auto',
  },
  destText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  passengerPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  passengerPreviewText: {
    fontSize: 12,
    color: '#556947',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#749e39',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(251, 249, 212, 0.6)',
    borderRadius: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#556947',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  bookNowBtn: {
    backgroundColor: '#749e39',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  bookNowText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  modalBookingCode: {
    fontSize: 13,
    color: '#657854',
    fontWeight: '600',
    marginTop: 2,
  },
  modalBody: {
    gap: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#657854',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  passengersSection: {
    marginTop: 4,
    gap: 8,
  },
  passengerChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  passengerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#749e39',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  passengerChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#e6e4be',
    marginVertical: 4,
  },
  modalTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  modalTotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#749e39',
  },
  modalCloseBtn: {
    height: 46,
    borderRadius: 23,
    backgroundColor: '#749e39',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addTicketPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#749e39',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  addTicketText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  completedPill: {
    backgroundColor: '#657854',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardActionBtns: {
    flexDirection: 'row',
    gap: 6,
  },
  cardIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6edd8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDeleteBtn: {
    backgroundColor: '#fee2e2',
  },
  modalActionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalEditBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#749e39',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalEditBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalDeleteBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#d32f2f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalDeleteBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  formModalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  formModalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fbf9d4',
    borderRadius: 24,
    padding: 24,
  },
  formSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 2,
  },
  formInput: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.primaryDark,
    borderWidth: 1,
    borderColor: '#e6e4be',
    marginBottom: 4,
  },
  formRowTwo: {
    flexDirection: 'row',
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    marginTop: 4,
  },
  statusPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#e6edd8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPillActive: {
    backgroundColor: '#749e39',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  statusPillTextActive: {
    color: '#ffffff',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  formCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eae8cb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  formSubmitBtn: {
    flex: 1.5,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#749e39',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSubmitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  deleteConfirmBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fbf9d4',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  deleteWarningIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  deleteSubtitle: {
    fontSize: 13,
    color: '#556947',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  deleteRedBtn: {
    flex: 1.5,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#d32f2f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteRedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
