import { StyleSheet } from 'react-native';
import { colors } from './colors';

/**
 * ============================================================================
 * [MODUL 1 - 3.2 EXTERNAL STYLING]
 * File styling terpisah untuk membuktikan penerapan External Styling.
 * Sesuai materi Modul 1 Halaman 16-17:
 * - Clean Code: Komponen utama tidak dipenuhi ratusan baris style.
 * - Reusable: Style dapat diimpor dan digunakan kembali di banyak komponen/screen.
 * ============================================================================
 */
export const externalStyles = StyleSheet.create({
  // External Card Style
  ticketCard: {
    backgroundColor: '#fbf9d4',
    borderRadius: 24,
    padding: 20,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Promo Banner Style
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#526840',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 22,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },

  // Category Item Style
  categoryItem: {
    alignItems: 'center',
    width: 66,
  },
  categoryIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#8aa754',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#3d5225',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 15,
  },

  // Destination Card Style
  destinationCard: {
    width: 244,
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },

  // News Card Style
  newsCard: {
    flex: 1,
  },
  newsImage: {
    width: '100%',
    height: 106,
    borderRadius: 16,
    marginBottom: 8,
  },
  newsTitle: {
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 15,
    fontWeight: '500',
  },

  // Section Header
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
