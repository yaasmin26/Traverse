import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { AppHeader } from '../../components/AppHeader';
import { colors } from '../../theme/colors';

export const PaymentSuccessScreen: React.FC = () => {
  const { navigate, lastBookingId, bookingHistory } = useApp();

  const currentBooking = bookingHistory.find((b) => b.id === lastBookingId) || bookingHistory[0];

  const handleBackToLobby = () => {
    navigate('MainTabs', 'home');
  };

  const handleViewTicket = () => {
    navigate('MainTabs', 'ticket');
  };

  return (
    <LinearGradient
      colors={['#faf9d5', '#b9cb9c', '#7f9c5d']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.content}>
        <AppHeader
          title="Payment"
          subtitle="Pay to go!"
          showBack
          onBack={handleBackToLobby}
          rightIcon="ticket"
        />

        <View style={styles.centerBlock}>
          <Text style={styles.headingTitle}>Payment Completed</Text>

          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={64} color="#ffffff" />
          </View>

          {currentBooking && (
            <View style={styles.bookingBadge}>
              <Text style={styles.bookingBadgeLabel}>Booking ID</Text>
              <Text style={styles.bookingBadgeId}>{currentBooking.id}</Text>
              <Text style={styles.bookingBadgeRoute}>
                {currentBooking.destination} • {currentBooking.passengers.length} Passengers
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleViewTicket}
            style={styles.viewTicketBtn}
          >
            <Text style={styles.viewTicketBtnText}>View Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleBackToLobby}
            style={styles.lobbyBtn}
          >
            <Text style={styles.lobbyBtnText}>Back to Lobby</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.homeIndicator} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headingTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 48,
    letterSpacing: -0.3,
  },
  successCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#749e39',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingBadge: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingBadgeLabel: {
    fontSize: 12,
    color: '#657854',
    fontWeight: '600',
  },
  bookingBadgeId: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
    marginVertical: 2,
    letterSpacing: 1,
  },
  bookingBadgeRoute: {
    fontSize: 13,
    fontWeight: '600',
    color: '#556947',
  },
  bottomButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  viewTicketBtn: {
    height: 52,
    backgroundColor: '#fbf9d4',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#749e39',
  },
  viewTicketBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  lobbyBtn: {
    height: 52,
    backgroundColor: '#749e39',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  lobbyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 3,
    alignSelf: 'center',
  },
});
