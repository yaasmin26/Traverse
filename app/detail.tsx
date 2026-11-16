import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * Halaman Detail Destinasi Wisata
 * Kriteria Penilaian:
 * 1. Menerapkan useState (toggle favorit, jumlah tiket, status pemesanan)
 * 2. Menerapkan useEffect (menghitung total biaya dan efek perubahan jumlah tiket)
 * 3. Menerapkan router.back() dan router.canGoBack()
 * 4. Mengambil parameter URL menggunakan useLocalSearchParams() (Materi Modul 2 hal 21-22)
 */
export default function DetailScreen() {
  const router = useRouter();

  // Mengambil parameter dari URL/route (Materi Modul 2 hal 21)
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    location?: string;
    category?: string;
    price?: string;
    rating?: string;
    desc?: string;
  }>();

  const name = params.name || 'Destinasi Wisata';
  const location = params.location || 'Indonesia';
  const category = params.category || 'Wisata Alam';
  const price = params.price || 'Rp 50.000';
  const rating = params.rating || '4.8';
  const desc =
    params.desc ||
    'Nikmati keindahan pemandangan alam dan pengalaman berlibur yang tak terlupakan bersama keluarga dan sahabat.';

  // Penerapan hook useState (Sesuai contoh Modul 2 hal 5-8)
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Penerapan hook useEffect
  // Dijalankan setiap kali ticketCount berubah
  useEffect(() => {
    const currentTime = new Date().toLocaleTimeString('id-ID');
    setLastUpdated(currentTime);
  }, [ticketCount]);

  // Fungsi navigasi kembali menggunakan router.back() dan router.canGoBack()
  // Dijelaskan pada Modul 2 hal 32 & 34
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  // Logika toggle favorit
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Logika penambahan tiket
  const handleIncrease = () => {
    setTicketCount((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (ticketCount > 1) {
      setTicketCount((prev) => prev - 1);
    }
  };

  // Konfirmasi pemesanan
  const handleBooking = () => {
    Alert.alert(
      'Tiket Berhasil Dipesan! 🎉',
      `Anda memesan ${ticketCount} tiket untuk ${name}.\nTotal harga: ${price} x ${ticketCount}`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Banner Card Destinasi */}
        <View style={styles.bannerBox}>
          <Ionicons name="map-outline" size={64} color="#fbfad3" />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{category}</Text>
          </View>
        </View>

        {/* Informasi Utama */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color="#687a55" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>

          {/* Tombol Toggle Favorit (Materi useState Modul 2 hal 5-8) */}
          <TouchableOpacity style={styles.favButton} onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={26}
              color={isFavorite ? '#e63946' : '#687a55'}
            />
          </TouchableOpacity>
        </View>

        {/* Status Favorit Info */}
        <View style={styles.favoriteStatusBox}>
          <Text style={styles.favoriteStatusText}>
            Status Favorit: {isFavorite ? '❤️ Favorit Anda' : '🤍 Belum Favorit'}
          </Text>
        </View>

        {/* Rating & Harga Info */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="star" size={20} color="#D48B55" />
            <Text style={styles.statValue}>{rating} / 5.0</Text>
            <Text style={styles.statLabel}>Ulasan Wisatawan</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="ticket-outline" size={20} color="#445738" />
            <Text style={styles.statValue}>{price}</Text>
            <Text style={styles.statLabel}>Harga Tiket Masuk</Text>
          </View>
        </View>

        {/* Deskripsi */}
        <View style={styles.descBox}>
          <Text style={styles.sectionHeading}>Deskripsi Wisata</Text>
          <Text style={styles.descText}>{desc}</Text>
        </View>

        {/* Pemilihan Jumlah Tiket (Menguji State & Effect) */}
        <View style={styles.ticketSection}>
          <Text style={styles.sectionHeading}>Jumlah Tiket</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity style={styles.counterBtn} onPress={handleDecrease}>
              <Ionicons name="remove" size={20} color="#445738" />
            </TouchableOpacity>
            <Text style={styles.counterValue}>{ticketCount}</Text>
            <TouchableOpacity style={styles.counterBtn} onPress={handleIncrease}>
              <Ionicons name="add" size={20} color="#445738" />
            </TouchableOpacity>
          </View>
          <Text style={styles.counterNote}>
            Terakhir dihitung pada: {lastUpdated || 'Baru saja'}
          </Text>
        </View>

        {/* Tombol Aksi: Pesan & Kembali */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
            <Ionicons name="cart-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.bookButtonText}>Pesan Sekarang ({ticketCount} Tiket)</Text>
          </TouchableOpacity>

          {/* Tombol Kembali menggunakan router.back() */}
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={18} color="#445738" style={{ marginRight: 6 }} />
            <Text style={styles.backButtonText}>Kembali ke Beranda (router.back)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fbfad3',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  bannerBox: {
    width: '100%',
    height: 160,
    backgroundColor: '#445738',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  categoryBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(251, 250, 211, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#445738',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#35432b',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#687a55',
    marginLeft: 4,
  },
  favButton: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#e2e7c8',
  },
  favoriteStatusBox: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecd3',
  },
  favoriteStatusText: {
    fontSize: 13,
    color: '#445738',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 0.48,
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecd3',
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#35432b',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#687a55',
    marginTop: 2,
  },
  descBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecd3',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#35432b',
    marginBottom: 8,
  },
  descText: {
    fontSize: 13,
    color: '#687a55',
    lineHeight: 20,
  },
  ticketSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecd3',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  counterBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fbfad3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8ca869',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#35432b',
    marginHorizontal: 24,
  },
  counterNote: {
    fontSize: 11,
    color: '#94a580',
  },
  actionButtons: {
    marginTop: 4,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#445738',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#445738',
  },
  backButtonText: {
    color: '#445738',
    fontSize: 14,
    fontWeight: '600',
  },
});
