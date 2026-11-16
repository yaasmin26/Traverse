import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Data statis destinasi wisata nusantara
const INITIAL_DESTINATIONS = [
  {
    id: '1',
    name: 'Gunung Bromo',
    location: 'Probolinggo, Jawa Timur',
    category: 'Gunung',
    price: 'Rp 35.000',
    rating: '4.8',
    icon: 'image-outline',
    desc: 'Pesona kawah aktif dengan pemandangan sunrise ikonik dan lautan pasir yang memukau.',
  },
  {
    id: '2',
    name: 'Pantai Kuta',
    location: 'Badung, Bali',
    category: 'Pantai',
    price: 'Gratis',
    rating: '4.7',
    icon: 'water-outline',
    desc: 'Pantai berpasir putih terkenal dengan pemandangan matahari terbenam dan ombak selancar.',
  },
  {
    id: '3',
    name: 'Candi Borobudur',
    location: 'Magelang, Jawa Tengah',
    category: 'Budaya',
    price: 'Rp 50.000',
    rating: '4.9',
    icon: 'business-outline',
    desc: 'Candi Buddha terbesar di dunia peninggalan wangsa Syailendra dengan relief megah.',
  },
  {
    id: '4',
    name: 'Ranu Kumbolo',
    location: 'Lumajang, Jawa Timur',
    category: 'Gunung',
    price: 'Rp 40.000',
    rating: '4.9',
    icon: 'leaf-outline',
    desc: 'Danau air tawar alami yang berada di lereng Gunung Semeru pada ketinggian 2.400 mdpl.',
  },
  {
    id: '5',
    name: 'Labuan Bajo',
    location: 'Manggarai Barat, NTT',
    category: 'Pantai',
    price: 'Rp 150.000',
    rating: '4.9',
    icon: 'boat-outline',
    desc: 'Pintu gerbang menuju Taman Nasional Komodo dengan gugusan pulau eksotis nan memesona.',
  },
  {
    id: '6',
    name: 'Desa Penglipuran',
    location: 'Bangli, Bali',
    category: 'Budaya',
    price: 'Rp 25.000',
    rating: '4.7',
    icon: 'home-outline',
    desc: 'Desa adat yang dinobatkan sebagai salah satu desa terbersih di dunia dengan tata ruang asri.',
  },
];

const CATEGORIES = ['Semua', 'Gunung', 'Pantai', 'Budaya'];

/**
 * Halaman Utama (Home Screen)
 * Kriteria Penilaian:
 * 1. Menerapkan useState (kategori aktif, teks pencarian, list destinasi)
 * 2. Menerapkan useEffect (filtering data saat state kategori atau pencarian berubah)
 * 3. Menerapkan router.push() untuk navigasi ke halaman Detail dan Profile
 */
export default function HomeScreen() {
  const router = useRouter();

  // Mengambil nama pengguna dari parameter route (Modul 2 hal 21-22)
  const params = useLocalSearchParams<{ username?: string }>();
  const username = params.username || 'yaasmin';

  // Penerapan hook useState
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredList, setFilteredList] = useState(INITIAL_DESTINATIONS);

  // Penerapan hook useEffect
  // Dijalankan setiap kali selectedCategory atau searchQuery berubah
  useEffect(() => {
    let result = INITIAL_DESTINATIONS;

    // Filter kategori
    if (selectedCategory !== 'Semua') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Filter kata kunci pencarian
    if (searchQuery.trim() !== '') {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredList(result);
  }, [selectedCategory, searchQuery]);

  // Navigasi ke Halaman Detail menggunakan router.push()
  const handleOpenDetail = (item: typeof INITIAL_DESTINATIONS[0]) => {
    router.push({
      pathname: '/detail',
      params: {
        id: item.id,
        name: item.name,
        location: item.location,
        category: item.category,
        price: item.price,
        rating: item.rating,
        desc: item.desc,
        username: username,
      },
    });
  };

  // Navigasi ke Halaman Profil menggunakan router.push()
  const handleOpenProfile = () => {
    router.push({
      pathname: '/profile',
      params: { username: username },
    });
  };
    const handleOpenDemo = () => {
    router.push({
      pathname: '/demo',
    });
  };

  const handleOpenTodoList = () => {
    router.push('/');
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Sapaan & Profil */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingTitle}>Halo, {username}! 🌿</Text>
            <Text style={styles.greetingSub}>Mau berlibur ke mana hari ini?</Text>
          </View>
          <TouchableOpacity style={styles.profileIconBtn} onPress={handleOpenProfile}>
            <Ionicons name="person-circle-outline" size={38} color="#445738" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleOpenTodoList}
          style={{
            backgroundColor: '#2563eb',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginBottom: 10,
            elevation: 2,
            shadowColor: '#2563eb',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
          }}
        >
          <Ionicons name="checkbox-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 13 }}>
            Tugas Modul 3: Todo List Async
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOpenDemo}
          style={{
            backgroundColor: '#445738',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginBottom: 14,
            elevation: 2,
            shadowColor: '#445738',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <Ionicons name="sparkles-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 13 }}>
            Info & Cerita Wisata (Demo Modul 3)
          </Text>
        </TouchableOpacity>

        {/* Input Pencarian (State: searchQuery) */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#687a55" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari destinasi atau lokasi..."
            placeholderTextColor="#94a580"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#687a55" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Kategori (State: selectedCategory) */}
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Daftar Destinasi Wisata */}
        <View style={styles.destListHeader}>
          <Text style={styles.sectionTitle}>
            Destinasi Populer ({filteredList.length})
          </Text>
        </View>

        {filteredList.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={48} color="#94a580" />
            <Text style={styles.emptyText}>Destinasi tidak ditemukan.</Text>
          </View>
        ) : (
          filteredList.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => handleOpenDetail(item)}
            >
              <View style={styles.cardIconBox}>
                <Ionicons name={item.icon as any} size={28} color="#ffffff" />
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.cardRow}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={13} color="#D48B55" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={styles.cardLocation}>
                  <Ionicons name="location-outline" size={12} color="#687a55" /> {item.location}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardPrice}>{item.price}</Text>
                  <View style={styles.detailButton}>
                    <Text style={styles.detailButtonText}>Lihat Detail</Text>
                    <Ionicons name="chevron-forward" size={14} color="#445738" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#35432b',
  },
  greetingSub: {
    fontSize: 13,
    color: '#687a55',
    marginTop: 2,
  },
  profileIconBtn: {
    padding: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e7c8',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#35432b',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e7c8',
  },
  categoryPillActive: {
    backgroundColor: '#445738',
    borderColor: '#445738',
  },
  categoryText: {
    fontSize: 13,
    color: '#687a55',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  destListHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#35432b',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    color: '#687a55',
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e9ecd3',
    shadowColor: '#445738',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardIconBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#445738',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#35432b',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbfad3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#35432b',
    marginLeft: 3,
  },
  cardLocation: {
    fontSize: 12,
    color: '#687a55',
    marginTop: 4,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#749e39',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: 12,
    color: '#445738',
    fontWeight: '600',
    marginRight: 2,
  },
});
