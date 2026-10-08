import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { AppAssets } from '../../assets';
import { AppHeader } from '../../components/AppHeader';
import { colors } from '../../theme/colors';

interface PlaceItem {
  id: string;
  name: string;
  image: any;
  priceValue: string;
}

export const TicketPlacesScreen: React.FC = () => {
  const { navigate, goBack, selectedPlaceId, setSelectedPlaceId } = useApp();

  const places: PlaceItem[] = [
    {
      id: 'umm',
      name: 'Danau UMM',
      image: AppAssets.ticketPlaceUmm,
      priceValue: 'Rp 5.800.000',
    },
    {
      id: 'kayutangan',
      name: 'Kayutangan',
      image: AppAssets.ticketPlaceKayutangan,
      priceValue: 'Rp 250.000',
    },
    {
      id: 'bromo',
      name: 'Bromo',
      image: AppAssets.ticketPlaceBromo,
      priceValue: 'Rp 450.000',
    },
    {
      id: 'ub',
      name: 'IUB/UB',
      image: AppAssets.ticketPlaceUb,
      priceValue: 'Rp 3.500.000',
    },
  ];

  const currentTotal =
    places.find((p) => p.id === selectedPlaceId)?.priceValue || 'Rp 250.000';

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
          onRightPress={() => navigate('TicketBookingList')}
        />

        {/* Places List matching Figma */}
        <View style={styles.placesList}>
          {places.map((place) => {
            const isSelected = selectedPlaceId === place.id;
            return (
              <TouchableOpacity
                key={place.id}
                activeOpacity={0.88}
                onPress={() => setSelectedPlaceId(place.id)}
                style={[
                  styles.placeCard,
                  isSelected && styles.placeCardSelected,
                ]}
              >
                <Image
                  source={place.image}
                  style={styles.placeImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Total From This Page */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total From This Page</Text>
          <View style={styles.totalPill}>
            <Text style={styles.totalValue}>{currentTotal}</Text>
          </View>
        </View>

        {/* NEXT Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigate('TicketBookingList')}
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
  placesList: {
    gap: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  placeCard: {
    width: '100%',
    aspectRatio: 398 / 192,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#203010',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  placeCardSelected: {
    borderColor: '#445738',
  },
  placeImage: {
    width: '100%',
    height: '100%',
  },
  totalSection: {
    gap: 8,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  totalPill: {
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
});
