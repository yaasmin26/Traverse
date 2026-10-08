import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';

export const TravelRecapScreen: React.FC = () => {
  const { goBack } = useApp();

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
        {/* Top curved banner with Title */}
        <View style={styles.topCurvedBanner}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={goBack}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.bannerTitle}>Travel Recap</Text>
        </View>

        {/* 2x2 Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Card 1 */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total{'\n'}Destinations</Text>
            <Text style={styles.statValueBig}>60</Text>
          </View>

          {/* Card 2 */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Your Member{'\n'}Tier</Text>
            <Text style={styles.statTierValue}>Platinum</Text>
          </View>

          {/* Card 3 */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Top Visited{'\n'}Country</Text>
            <View style={styles.countryRow}>
              <Text style={styles.countryName}>Indonesia</Text>
              <View style={styles.flagIcon}>
                <View style={styles.flagRed} />
                <View style={styles.flagWhite} />
              </View>
            </View>
          </View>

          {/* Card 4 */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Your Travel{'\n'}Rate</Text>
            <Text style={styles.statValueBig}>4.7</Text>
          </View>
        </View>

        {/* A Words For This Year Card */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteHeader}>A Words For This Year:</Text>
          <Text style={styles.quoteBody}>
            Better Live it Your Life, We Were Runnin’ Out of Time!
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
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
  topCurvedBanner: {
    backgroundColor: '#566e43',
    borderRadius: 32,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    position: 'absolute',
    left: 18,
    top: 24,
    padding: 4,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#9ab777',
    borderRadius: 20,
    padding: 16,
    minHeight: 124,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
    lineHeight: 17,
  },
  statValueBig: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  statTierValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark,
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
  quoteCard: {
    backgroundColor: '#9ab777',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 10,
  },
  quoteBody: {
    fontSize: 13,
    color: colors.primaryDark,
    lineHeight: 18,
    fontStyle: 'italic',
    fontWeight: '500',
  },
});
