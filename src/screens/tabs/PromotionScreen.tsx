import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppAssets } from '../../assets';
import { colors } from '../../theme/colors';

interface PromoItem {
  id: string;
  image: any;
  name: string;
  discount: string;
}

const promos: PromoItem[] = [
  { id: '1', image: AppAssets.promoFore, name: 'Fore', discount: '15%' },
  { id: '2', image: AppAssets.promoKantek, name: 'Kantek', discount: '10K' },
  { id: '3', image: AppAssets.promoKalasan, name: 'Kalasan Bang Jun', discount: '10K' },
  { id: '4', image: AppAssets.promoWarungDewi, name: 'Warung Bu Dewi', discount: '10K' },
  { id: '5', image: AppAssets.promoFore, name: 'Fore', discount: '15%' },
  { id: '6', image: AppAssets.promoKantek, name: 'Kantek', discount: '10K' },
];

export const PromotionScreen: React.FC = () => {
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
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Promotion</Text>
            <Text style={styles.subtitle}>More and more and more!</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.bookmarkBtn}>
            <Ionicons name="bookmark-outline" size={28} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Promo Card List */}
        <View style={styles.promoList}>
          {promos.map((item, index) => (
            <TouchableOpacity
              key={`${item.id}-${index}`}
              activeOpacity={0.88}
              style={styles.promoCard}
            >
              <Image source={item.image} style={styles.promoImage} resizeMode="cover" />
              <View style={styles.promoInfoRow}>
                <Text style={styles.merchantName}>{item.name}</Text>
                <Text style={styles.discountValue}>{item.discount}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom tab spacer */}
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
  bookmarkBtn: {
    padding: 4,
  },
  promoList: {
    gap: 18,
  },
  promoCard: {
    backgroundColor: '#fbfce8',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  promoImage: {
    width: '100%',
    height: 136,
  },
  promoInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3d4e56',
  },
  discountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3d4e56',
  },
});
