import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useApp, ScheduleItem } from '../../context/AppContext';
import { AppHeader } from '../../components/AppHeader';
import { colors } from '../../theme/colors';

export const TicketBookingListScreen: React.FC = () => {
  const {
    navigate,
    goBack,
    selectedDepartureTicket,
    setSelectedDepartureTicket,
    selectedReturnTicket,
    setSelectedReturnTicket,
  } = useApp();

  const schedules: ScheduleItem[] = [
    {
      id: '1',
      badge: 'Departure',
      date: '20 April 2026',
      from: 'MLG',
      to: 'BWI',
      depTime: '07.30',
      arrTime: '14:30',
      duration: '7h 30m',
      vehicle: 'train',
      operator: 'KAI  •  Panoramic Class',
      seats: '200 Seats Available',
      seatsColor: '#07a829',
      price: 150000,
    },
    {
      id: '2',
      badge: 'Return',
      date: '21 April 2026',
      from: 'BWI',
      to: 'MLG',
      depTime: '10.30',
      arrTime: '17:30',
      duration: '7h 30m',
      vehicle: 'train',
      operator: 'KAI  •  Panoramic Class',
      seats: '4 Seats Available',
      seatsColor: '#d32f2f',
      price: 150000,
    },
    {
      id: '3',
      badge: 'Departure',
      date: '20 April 2026',
      from: 'BWI',
      to: 'MLG',
      depTime: '08.30',
      arrTime: '10:30',
      duration: '2h 30m',
      vehicle: 'bus',
      operator: '87 Trans  •  Premium Class',
      seats: '200 Seats Available',
      seatsColor: '#07a829',
      price: 150000,
    },
    {
      id: '4',
      badge: 'Return',
      date: '21 April 2026',
      from: 'BWI',
      to: 'MLG',
      depTime: '10.30',
      arrTime: '17:30',
      duration: '7h 30m',
      vehicle: 'bus',
      operator: '87 Trans  •  Sleeper Class',
      seats: '4 Seats Available',
      seatsColor: '#d32f2f',
      price: 150000,
    },
  ];

  const handleSelectSchedule = (item: ScheduleItem) => {
    if (item.badge === 'Departure') {
      setSelectedDepartureTicket(item);
    } else {
      if (selectedReturnTicket?.id === item.id) {
        setSelectedReturnTicket(null); // toggle off
      } else {
        setSelectedReturnTicket(item);
      }
    }
  };

  const isScheduleSelected = (item: ScheduleItem) => {
    if (item.badge === 'Departure') {
      return selectedDepartureTicket.id === item.id;
    } else {
      return selectedReturnTicket?.id === item.id;
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

        {/* Schedule Cards */}
        <View style={styles.cardList}>
          {schedules.map((item) => {
            const isSelected = isScheduleSelected(item);

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() => handleSelectSchedule(item)}
                style={[
                  styles.scheduleCard,
                  isSelected && styles.scheduleCardSelected,
                ]}
              >
                {/* Badge + Date + Checkmark */}
                <View style={styles.cardTopRow}>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.badgePill,
                        item.badge === 'Return' && styles.returnBadge,
                      ]}
                    >
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                    <Text style={styles.dateText}>{item.date}</Text>
                  </View>

                  <View
                    style={[
                      styles.checkCircle,
                      isSelected && styles.checkCircleSelected,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#ffffff" />
                    )}
                  </View>
                </View>

                {/* Route */}
                <View style={styles.routeRow}>
                  <View style={styles.stationBlock}>
                    <View style={styles.codeRow}>
                      <Text style={styles.codeText}>{item.from}</Text>
                      <MaterialCommunityIcons
                        name={item.vehicle === 'train' ? 'train' : 'bus'}
                        size={18}
                        color={colors.primaryDark}
                      />
                    </View>
                    <Text style={styles.timeText}>{item.depTime}</Text>
                  </View>

                  <View style={styles.arrowArea}>
                    <Text style={styles.dashLine}>--------------------------→</Text>
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>

                  <View style={styles.stationBlockRight}>
                    <View style={styles.codeRow}>
                      <MaterialCommunityIcons
                        name={item.vehicle === 'train' ? 'train' : 'bus'}
                        size={18}
                        color={colors.primaryDark}
                      />
                      <Text style={styles.codeText}>{item.to}</Text>
                    </View>
                    <Text style={styles.timeText}>{item.arrTime}</Text>
                  </View>
                </View>

                <Text style={styles.operatorText}>{item.operator}</Text>

                <View style={styles.cardDivider} />

                {/* Footer */}
                <View style={styles.footerRow}>
                  <View>
                    <Text style={[styles.seatsText, { color: item.seatsColor }]}>
                      {item.seats}
                    </Text>
                    <Text style={styles.priceText}>
                      Rp {item.price.toLocaleString('id-ID')}/pax
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      handleSelectSchedule(item);
                      navigate('TicketBookingDetail');
                    }}
                    style={styles.detailsBtn}
                  >
                    <Text style={styles.detailsBtnText}>
                      {isSelected ? 'Selected' : 'Select'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom Continue Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigate('TicketBookingDetail')}
          style={styles.nextBtn}
        >
          <Text style={styles.nextBtnText}>NEXT</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  cardList: {
    gap: 16,
    marginTop: 14,
    marginBottom: 20,
  },
  scheduleCard: {
    backgroundColor: '#fbf9d4',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#2b3a1a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scheduleCardSelected: {
    borderColor: '#445738',
    backgroundColor: '#fefee8',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badgePill: {
    backgroundColor: '#07a829',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
  },
  returnBadge: {
    backgroundColor: '#07a829',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#8da857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: '#445738',
    borderColor: '#445738',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
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
    gap: 6,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  timeText: {
    fontSize: 13,
    color: colors.primaryDark,
    marginTop: 2,
    fontWeight: '500',
  },
  arrowArea: {
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
    marginBottom: 14,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#e6e4be',
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  seatsText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  detailsBtn: {
    backgroundColor: '#8da857',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
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
});
