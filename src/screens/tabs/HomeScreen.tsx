import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { AppAssets } from '../../assets';
import { colors } from '../../theme/colors';

// [MODUL 1 - 3.2 EXTERNAL STYLING] Diimpor dari file terpisah src/theme/externalStyles.ts
import { externalStyles } from '../../theme/externalStyles';

/**
 * ============================================================================
 * [MODUL 1 - 5.5.B TYPE & INTERFACE]
 * Pendefinisian struktur data menggunakan Type dan Interface TypeScript.
 * ============================================================================
 */
export type VehicleType = 'train' | 'bus' | 'taxi';

export interface TransportCategory {
  readonly id: string;
  name: string;
  type: VehicleType;
  icon: any;
  isPopular?: boolean;
}

export interface DestinationItem {
  readonly id: string;
  name: string;
  image: any;
  province?: string;
}

export interface StreetNewsItem {
  readonly id: string;
  title: string;
  image: any;
  location: string;
}

export interface TicketCardInfo {
  readonly bookingId: string;
  fromCode: string;
  toCode: string;
  depTime: string;
  arrTime: string;
  duration: string;
  trainClass: string;
  dateText: string;
}

// [FITUR CRUD] Interface untuk item Rencana Perjalanan
export interface TravelPlanItem {
  readonly id: string;
  destination: string;
  date: string;
  transport: string;
  notes?: string;
}

/**
 * ============================================================================
 * [MODUL 1 - 5.5.A ARRAY OF OBJECTS]
 * Data awal daftar kategori, destinasi, berita, tiket aktif, dan CRUD plans.
 * ============================================================================
 */
const TRANSPORT_CATEGORIES: TransportCategory[] = [
  { id: '1', name: 'Local\nTrain', type: 'train', icon: AppAssets.catLocalTrain, isPopular: true },
  { id: '2', name: 'City\nTrain', type: 'train', icon: AppAssets.catCityTrain, isPopular: true },
  { id: '3', name: 'Local Bus', type: 'bus', icon: AppAssets.catLocalBus, isPopular: false },
  { id: '4', name: 'City Bus', type: 'bus', icon: AppAssets.catCityBus, isPopular: false },
  { id: '5', name: 'Taxi', type: 'taxi', icon: AppAssets.catTaxi, isPopular: false },
];

const POPULAR_DESTINATIONS: DestinationItem[] = [
  { id: 'dest-1', name: 'Malang', image: AppAssets.homeDestMalang, province: 'Jawa Timur' },
  { id: 'dest-2', name: 'Surabaya', image: AppAssets.homeDestSurabaya, province: 'Jawa Timur' },
];

const STREET_NEWS_DATA: StreetNewsItem[] = [
  {
    id: 'news-1',
    title: 'Arus Lalu Lintas di Kota Malang Mengalami Kemacetan, Volume Kendaraan Meningkat Jelang Libur Akhir Pekan',
    image: AppAssets.homeNews1,
    location: 'Kota Malang',
  },
  {
    id: 'news-2',
    title: 'Kemacetan Parah di Daerah Polehan, Kendaraan Meningkat Akibat Penutupan',
    image: AppAssets.homeNews2,
    location: 'Polehan, Malang',
  },
];

const ACTIVE_TICKET: TicketCardInfo = {
  bookingId: '5V43KF',
  fromCode: 'MLG',
  toCode: 'BWI',
  depTime: '07.30',
  arrTime: '14:30',
  duration: '7h 30m',
  trainClass: 'KAI  •  Economy',
  dateText: '11 May 2022',
};

// Data Awal untuk Fitur CRUD Rencana Perjalanan
const INITIAL_TRAVEL_PLANS: TravelPlanItem[] = [
  {
    id: '1',
    destination: 'Pantai Balekambang',
    date: '15 Mei 2026',
    transport: 'Local Bus',
    notes: 'Sunset & wisata kuliner ikan bakar',
  },
  {
    id: '2',
    destination: 'Gunung Bromo',
    date: '22 Mei 2026',
    transport: 'City Train',
    notes: 'Sunrise tour & Jeep Penanjakan',
  },
];

export const HomeScreen: React.FC = () => {
  const { user, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('1');

  // ==========================================
  // [STATE CRUD: CREATE, READ, UPDATE, DELETE]
  // ==========================================
  const [travelPlans, setTravelPlans] = useState<TravelPlanItem[]>(INITIAL_TRAVEL_PLANS);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  // Form Fields State
  const [inputDestination, setInputDestination] = useState<string>('');
  const [inputDate, setInputDate] = useState<string>('');
  const [inputTransport, setInputTransport] = useState<string>('Local Train');
  const [inputNotes, setInputNotes] = useState<string>('');

  /**
   * ============================================================================
   * [MODUL 1 - 5.3.B CUSTOM FUNCTIONS & OPERASI CRUD]
   * ============================================================================
   */

  // 1. Helper Format Saldo Rupiah
  const formatCurrency = (amount: number): string => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  // Helper Aksi Avatar / Logout
  const handleAvatarPress = () => {
    Alert.alert(
      'Profil Pengguna',
      `Nama: ${user.name || 'Yaasmin'}\nEmail: ${user.email}\nSaldo: ${formatCurrency(user.balance)}`,
      [
        { text: 'Tutup', style: 'cancel' },
        {
          text: 'Keluar (Logout)',
          style: 'destructive',
          onPress: () => navigate('LoginLanding'),
        },
      ]
    );
  };

  // 2. [CRUD: CREATE & UPDATE] Simpan data baru atau perbarui data yang ada
  const handleSavePlan = () => {
    if (!inputDestination.trim()) {
      Alert.alert('Perhatian', 'Nama destinasi tidak boleh kosong!');
      return;
    }

    if (editingPlanId) {
      // Operasi UPDATE
      setTravelPlans((prev) =>
        prev.map((plan) =>
          plan.id === editingPlanId
            ? {
                ...plan,
                destination: inputDestination.trim(),
                date: inputDate.trim() || '15 Mei 2026',
                transport: inputTransport,
                notes: inputNotes.trim(),
              }
            : plan
        )
      );
      Alert.alert('Sukses', 'Rencana perjalanan berhasil diperbarui!');
    } else {
      // Operasi CREATE
      const newPlan: TravelPlanItem = {
        id: Date.now().toString(),
        destination: inputDestination.trim(),
        date: inputDate.trim() || '20 Mei 2026',
        transport: inputTransport,
        notes: inputNotes.trim(),
      };
      setTravelPlans((prev) => [newPlan, ...prev]);
      Alert.alert('Sukses', 'Rencana perjalanan baru berhasil ditambahkan!');
    }

    setModalVisible(false);
  };

  // 3. [CRUD: DELETE] Menghapus data dari array of objects
  const handleDeletePlan = (id: string, name: string) => {
    Alert.alert(
      'Hapus Rencana',
      `Apakah kamu yakin ingin menghapus rencana ke "${name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setTravelPlans((prev) => prev.filter((p) => p.id !== id));
          },
        },
      ]
    );
  };

  // 4. Membuka modal form untuk EDIT (UPDATE)
  const handleEditPlan = (plan: TravelPlanItem) => {
    setEditingPlanId(plan.id);
    setInputDestination(plan.destination);
    setInputDate(plan.date);
    setInputTransport(plan.transport);
    setInputNotes(plan.notes || '');
    setModalVisible(true);
  };

  // 5. Membuka modal form untuk TAMBAH (CREATE)
  const handleOpenCreate = () => {
    setEditingPlanId(null);
    setInputDestination('');
    setInputDate('');
    setInputTransport('Local Train');
    setInputNotes('');
    setModalVisible(true);
  };

  // 6. Custom Card Function untuk merender setiap item Kategori Transportasi
  const renderCategoryItem = (item: TransportCategory, index: number) => {
    const isSelected = selectedCategoryId === item.id;

    return (
      <TouchableOpacity
        key={item.id} // [MODUL 1 - 5.4.A] Key unik prop
        activeOpacity={0.82}
        onPress={() => setSelectedCategoryId(item.id)}
        style={externalStyles.categoryItem}
      >
        {/* [MODUL 1 - 3.3 INLINE STYLING] */}
        <View
          style={[
            externalStyles.categoryIconCircle,
            {
              backgroundColor: isSelected ? '#708d3f' : '#8aa754',
              transform: [{ scale: isSelected ? 1.05 : 1 }],
            },
          ]}
        >
          <Image
            source={item.icon}
            style={styles.catIconImage}
            resizeMode="contain"
          />
        </View>
        <Text style={externalStyles.categoryLabel}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // 7. Custom Card Function untuk merender Destinasi Populer (FlatList)
  const renderDestinationCard = ({ item }: { item: DestinationItem }) => {
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.85}
        style={externalStyles.destinationCard}
      >
        <Image
          source={item.image}
          style={styles.destImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  // 8. Custom Card Function untuk merender kartu Rencana Perjalanan (CRUD: READ)
  const renderPlanCard = (plan: TravelPlanItem) => {
    return (
      <View key={plan.id} style={styles.planCard}>
        <View style={styles.planHeader}>
          <View style={styles.planTitleBox}>
            <Text style={styles.planDestText}>{plan.destination}</Text>
            <View style={styles.planBadgeRow}>
              <View style={styles.planTransportBadge}>
                <Ionicons
                  name={
                    plan.transport.includes('Bus')
                      ? 'bus-outline'
                      : plan.transport.includes('Train')
                      ? 'train-outline'
                      : 'car-outline'
                  }
                  size={12}
                  color="#ffffff"
                />
                <Text style={styles.planTransportText}>{plan.transport}</Text>
              </View>
              <Text style={styles.planDateText}>{plan.date}</Text>
            </View>
          </View>

          {/* Tombol Aksi: Edit (Update) & Hapus (Delete) */}
          <View style={styles.planActionRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleEditPlan(plan)}
              style={styles.planActionBtn}
            >
              <Ionicons name="pencil" size={15} color="#4e603c" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleDeletePlan(plan.id, plan.destination)}
              style={[styles.planActionBtn, styles.planDeleteBtn]}
            >
              <Ionicons name="trash-outline" size={15} color="#d32f2f" />
            </TouchableOpacity>
          </View>
        </View>

        {plan.notes ? (
          <Text style={styles.planNotesText}>{plan.notes}</Text>
        ) : null}
      </View>
    );
  };

  // 9. Custom Card Function untuk merender item Berita Jalanan
  const renderNewsCard = (item: StreetNewsItem) => {
    return (
      <View key={item.id} style={externalStyles.newsCard}>
        <Image
          source={item.image}
          style={externalStyles.newsImage}
          resizeMode="cover"
        />
        <Text style={externalStyles.newsTitle} numberOfLines={3}>
          {item.title}
        </Text>
      </View>
    );
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
        {/* Header Hijau Gelap sesuai Figma */}
        <LinearGradient
          colors={['#586d42', '#69834e', '#7b9859']}
          style={styles.headerSection}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          {/* Header Row: Nama User, Saldo, Avatar */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greetingText}>Hi, {user.name || 'Yaasmin'}</Text>
              <View style={styles.balanceRow}>
                <Ionicons name="compass-outline" size={16} color="#ffffff" />
                <Text style={styles.balanceText}>{formatCurrency(user.balance)}</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAvatarPress}
              style={styles.avatarWrapper}
            >
              <Image
                source={AppAssets.avatarYaasmin}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar Input */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#e5edd8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#e5edd8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity activeOpacity={0.7} style={styles.micButton}>
              <Ionicons name="mic-outline" size={20} color="#e5edd8" />
            </TouchableOpacity>
          </View>

          {/* Tiket Aktif (KAI Economy MLG -> BWI) */}
          <TouchableOpacity activeOpacity={0.9} style={externalStyles.ticketCard}>
            <View style={styles.ticketCardHeader}>
              <View style={styles.todayPill}>
                <Text style={styles.todayText}>Today</Text>
              </View>
              <Text style={{ fontSize: 14, color: colors.primaryDark, fontWeight: '500' }}>
                {ACTIVE_TICKET.dateText}
              </Text>
            </View>

            <View style={styles.routeRow}>
              <View style={styles.stationBlock}>
                <View style={styles.stationCodeRow}>
                  <Text style={styles.stationCode}>{ACTIVE_TICKET.fromCode}</Text>
                  <MaterialCommunityIcons name="train" size={18} color={colors.primaryDark} />
                </View>
                <Text style={styles.stationTime}>{ACTIVE_TICKET.depTime}</Text>
              </View>

              <View style={styles.flightLineArea}>
                <Text style={styles.dashLine}>--------------------------→</Text>
                <Text style={styles.durationText}>{ACTIVE_TICKET.duration}</Text>
              </View>

              <View style={styles.stationBlockRight}>
                <View style={styles.stationCodeRow}>
                  <MaterialCommunityIcons name="train" size={18} color={colors.primaryDark} />
                  <Text style={styles.stationCode}>{ACTIVE_TICKET.toCode}</Text>
                </View>
                <Text style={styles.stationTime}>{ACTIVE_TICKET.arrTime}</Text>
              </View>
            </View>

            <Text style={styles.classText}>{ACTIVE_TICKET.trainClass}</Text>

            <View style={styles.ticketDivider} />

            <View style={styles.bookingIdRow}>
              <Text style={styles.bookingIdLabel}>Booking ID</Text>
              <Text style={styles.bookingIdValue}>{ACTIVE_TICKET.bookingId}</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* Konten Utama Aplikasi */}
        <View style={styles.mainContent}>
          {/* 5 Kategori Transportasi (Loop .map) */}
          <View style={styles.categoryRow}>
            {TRANSPORT_CATEGORIES.map((category, index) =>
              renderCategoryItem(category, index)
            )}
          </View>

          {/* Section: Popular Destinations (Loop FlatList) */}
          <View style={externalStyles.sectionHeader}>
            <Text style={externalStyles.sectionTitle}>Popular destinations</Text>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={POPULAR_DESTINATIONS}
            renderItem={renderDestinationCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.destScroll}
          />

          {/**
           * ============================================================================
           * [FITUR CRUD LENGKAP: CREATE, READ, UPDATE, DELETE]
           * Section interaktif pengelolaan rencana perjalanan
           * ============================================================================
           */}
          <View style={styles.crudSectionHeader}>
            <View>
              <Text style={externalStyles.sectionTitle}>Rencana Perjalanan</Text>
              <Text style={styles.crudSubtitle}>Kelola destinasi favoritmu (CRUD)</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleOpenCreate}
              style={styles.addPlanBtn}
            >
              <Ionicons name="add" size={18} color="#ffffff" />
              <Text style={styles.addPlanBtnText}>Tambah</Text>
            </TouchableOpacity>
          </View>

          {/* Daftar Kartu Rencana (CRUD: READ) */}
          <View style={styles.plansContainer}>
            {travelPlans.length === 0 ? (
              <View style={styles.emptyPlanBox}>
                <Ionicons name="map-outline" size={32} color="#7d995e" />
                <Text style={styles.emptyPlanText}>
                  Belum ada rencana perjalanan. Tekan tombol "+ Tambah" di atas!
                </Text>
              </View>
            ) : (
              travelPlans.map((plan) => renderPlanCard(plan))
            )}
          </View>

          {/* Traverse Promo Banner */}
          <View style={externalStyles.promoBanner}>
            <Image
              source={AppAssets.logo}
              style={styles.promoLogo}
              resizeMode="contain"
            />
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoTitle}>Traverse</Text>
              <Text style={styles.promoSubtitle}>
                make your trip faster by using the best routes
              </Text>
            </View>
            <Ionicons name="location-outline" size={24} color="#fbfad4" />
          </View>

          {/* Section: Explore Map */}
          <View style={externalStyles.sectionHeader}>
            <Text style={externalStyles.sectionTitle}>Explore</Text>
          </View>

          <TouchableOpacity activeOpacity={0.9} style={styles.mapCard}>
            <Image
              source={AppAssets.homeExploreMap}
              style={styles.mapImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Section: Latest Street News */}
          <View style={externalStyles.sectionHeader}>
            <Text style={externalStyles.sectionTitle}>Latest Street News</Text>
          </View>

          <View style={styles.newsRow}>
            {STREET_NEWS_DATA.map((newsItem) => renderNewsCard(newsItem))}
          </View>
        </View>

        {/* Spacer bawah untuk floating bottom bar */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/**
       * ============================================================================
       * [MODAL FORM CRUD: CREATE & UPDATE]
       * Modal interaktif untuk menambah atau mengedit rencana perjalanan
       * ============================================================================
       */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPlanId ? 'Edit Rencana' : 'Tambah Rencana Baru'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#4e603c" />
              </TouchableOpacity>
            </View>

            {/* Input Destinasi */}
            <Text style={styles.modalLabel}>Destinasi Wisata</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Contoh: Pantai Balekambang"
              placeholderTextColor="#9ba888"
              value={inputDestination}
              onChangeText={setInputDestination}
            />

            {/* Input Tanggal */}
            <Text style={styles.modalLabel}>Tanggal Perjalanan</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Contoh: 15 Mei 2026"
              placeholderTextColor="#9ba888"
              value={inputDate}
              onChangeText={setInputDate}
            />

            {/* Pilihan Transportasi */}
            <Text style={styles.modalLabel}>Pilihan Transportasi</Text>
            <View style={styles.chipRow}>
              {['Local Train', 'City Train', 'Local Bus', 'Taxi'].map((t) => {
                const isSelected = inputTransport === t;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setInputTransport(t)}
                    style={[styles.chip, isSelected && styles.chipActive]}
                  >
                    <Text
                      style={[styles.chipText, isSelected && styles.chipTextActive]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Input Catatan */}
            <Text style={styles.modalLabel}>Catatan Perjalanan (Opsional)</Text>
            <TextInput
              style={[styles.modalInput, { height: 60, textAlignVertical: 'top' }]}
              placeholder="Catatan aktivitas atau rute..."
              placeholderTextColor="#9ba888"
              multiline
              value={inputNotes}
              onChangeText={setInputNotes}
            />

            {/* Tombol Aksi Simpan / Batal */}
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSavePlan}
              >
                <Text style={styles.modalSaveText}>
                  {editingPlanId ? 'Simpan Perubahan' : 'Tambah Rencana'}
                </Text>
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
    paddingBottom: 20,
  },
  headerSection: {
    paddingTop: 48,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 72, 35, 0.28)',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#ffffff',
  },
  micButton: {
    padding: 4,
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  ticketCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  todayPill: {
    backgroundColor: '#07a829',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
  },
  todayText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
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
  stationCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stationCode: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  stationTime: {
    fontSize: 13,
    color: '#556947',
    marginTop: 2,
    fontWeight: '500',
  },
  flightLineArea: {
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
  classText: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '500',
    textDecorationLine: 'underline',
    marginBottom: 12,
  },
  ticketDivider: {
    height: 1,
    backgroundColor: '#e6e4be',
    marginVertical: 12,
  },
  bookingIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingIdLabel: {
    fontSize: 14,
    color: colors.primaryDark,
  },
  bookingIdValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  catIconImage: {
    width: 44,
    height: 44,
  },
  destScroll: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 20,
    marginBottom: 24,
  },
  destImage: {
    width: '100%',
    height: '100%',
  },
  promoLogo: {
    width: 44,
    height: 36,
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    color: '#fbfad4',
    fontSize: 15,
    fontWeight: '700',
  },
  promoSubtitle: {
    color: '#e0eed0',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  mapCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapImage: {
    width: '100%',
    height: 100,
  },
  newsRow: {
    flexDirection: 'row',
    gap: 14,
  },

  // ==========================================
  // STYLES FITUR CRUD (RENCANA PERJALANAN)
  // ==========================================
  crudSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  crudSubtitle: {
    fontSize: 12,
    color: '#556947',
    marginTop: 2,
  },
  addPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#586d42',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  addPlanBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  plansContainer: {
    gap: 10,
    marginBottom: 24,
  },
  emptyPlanBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#9cae83',
  },
  emptyPlanText: {
    fontSize: 13,
    color: '#556947',
    textAlign: 'center',
    marginTop: 8,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2eccd',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planTitleBox: {
    flex: 1,
  },
  planDestText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  planBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planTransportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#708d3f',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  planTransportText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  planDateText: {
    fontSize: 12,
    color: '#657a55',
  },
  planActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#eff5e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planDeleteBtn: {
    backgroundColor: '#fee2e2',
  },
  planNotesText: {
    fontSize: 12,
    color: '#5b6e4e',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5e8',
  },

  // ==========================================
  // STYLES MODAL CRUD
  // ==========================================
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(23, 33, 14, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fcfbe8',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 5,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c6d6ab',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: colors.primaryDark,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#e7efd3',
  },
  chipActive: {
    backgroundColor: '#586d42',
  },
  chipText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#e5ecd3',
  },
  modalCancelText: {
    color: colors.primaryDark,
    fontWeight: '600',
    fontSize: 13,
  },
  modalSaveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#586d42',
  },
  modalSaveText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
});
