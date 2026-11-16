import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 1. Mengimpor tipe data Interface dari types/ (Kriteria: Object Interface)
import { TravelStory } from '../types/demo';

// 2. Mengimpor fungsi async & promise dari services/ (Kriteria: Async Function & Promise)
import { getTravelStories, checkTicketQuota } from '../services/demoService';

const DESTINATIONS = ['Gunung Bromo', 'Pantai Kuta', 'Ranu Kumbolo'];

export default function DemoScreen() {
  const router = useRouter();

  // State untuk data cerita dari External API (bertipe TravelStory[])
  const [stories, setStories] = useState<TravelStory[]>([]);
  const [loadingStories, setLoadingStories] = useState<boolean>(false);
  const [storyError, setStoryError] = useState<string | null>(null);

  // State untuk fitur Cek Kuota Tiket (Demonstrasi Promise, resolve, reject, .then)
  const [selectedDestination, setSelectedDestination] = useState<string>('Gunung Bromo');
  const [checkingQuota, setCheckingQuota] = useState<boolean>(false);
  const [quotaResult, setQuotaResult] = useState<string>('');
  const [quotaIsSuccess, setQuotaIsSuccess] = useState<boolean | null>(null);

  /**
   * Kriteria 2: Custom Async Function untuk memuat data cerita wisata
   * Menerima parameter destinasi agar data ulasan menyesuaikan pilihan
   */
  const loadStories = async (destinationName: string = selectedDestination) => {
    setLoadingStories(true);
    setStoryError(null);

    try {
      const data = await getTravelStories(destinationName);
      setStories(data);
    } catch (err: any) {
      setStoryError(err.message || 'Gagal memuat cerita wisata');
    } finally {
      setLoadingStories(false);
    }
  };

  /**
   * Kriteria 3: Menangani Promise menggunakan method .then() dan .catch()
   */
  const handleCheckQuota = () => {
    setCheckingQuota(true);
    setQuotaResult('');
    setQuotaIsSuccess(null);

    // Memanggil checkTicketQuota yang mengembalikan Promise
    checkTicketQuota(selectedDestination)
      .then((message) => {
        // .then() menangani hasil saat resolve() terpanggil
        setQuotaResult(message);
        setQuotaIsSuccess(true);
      })
      .catch((error) => {
        // .catch() menangani pesan saat reject() terpanggil
        setQuotaResult(error);
        setQuotaIsSuccess(false);
      })
      .finally(() => {
        setCheckingQuota(false);
      });
  };

  // Otomatis memuat ulang ulasan setiap kali destinasi yang dipilih berganti
  useEffect(() => {
    loadStories(selectedDestination);
  }, [selectedDestination]);

  // Fungsi tombol kembali (menggunakan router.canGoBack sesuai Modul 2)
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Layar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#445738" />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Info & Cerita Wisata</Text>
            <Text style={styles.headerSubtitle}>Traverse Community & Live Status</Text>
          </View>
        </View>

        {/* ============================================================== */}
        {/* FITUR 1: CEK KUOTA TIKET (PROMISE, RESOLVE, REJECT, .THEN)     */}
        {/* ============================================================== */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="ticket-outline" size={20} color="#445738" />
            <Text style={styles.cardTitle}>Cek Ketersediaan Kuota Tiket</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Pilih destinasi untuk mengecek ketersediaan tiket hari ini secara realtime:
          </Text>

          {/* Pilihan Destinasi */}
          <View style={styles.pillRow}>
            {DESTINATIONS.map((dest) => {
              const isSelected = selectedDestination === dest;
              return (
                <TouchableOpacity
                  key={dest}
                  style={[styles.destPill, isSelected && styles.destPillActive]}
                  onPress={() => {
                    setSelectedDestination(dest);
                    setQuotaResult('');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.destPillText, isSelected && styles.destPillTextActive]}>
                    {dest}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tombol Cek Kuota (Memanggil Promise & .then) */}
          <TouchableOpacity
            style={styles.checkButton}
            onPress={handleCheckQuota}
            disabled={checkingQuota}
            activeOpacity={0.8}
          >
            {checkingQuota ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="search" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.checkButtonText}>Cek Kuota Sekarang</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Hasil Pengecekan (.then / .catch) */}
          {quotaResult !== '' && !checkingQuota && (
            <View
              style={[
                styles.resultBox,
                quotaIsSuccess ? styles.resultSuccess : styles.resultFailed,
              ]}
            >
              <Ionicons
                name={quotaIsSuccess ? 'checkmark-circle' : 'alert-circle'}
                size={18}
                color={quotaIsSuccess ? '#2e7d32' : '#c62828'}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.resultText,
                  quotaIsSuccess ? styles.resultTextSuccess : styles.resultTextFailed,
                ]}
              >
                {quotaResult}
              </Text>
            </View>
          )}
        </View>

        {/* ============================================================== */}
        {/* FITUR 2: CERITA WISATAWAN (EXTERNAL API, CUSTOM ASYNC)         */}
        {/* ============================================================== */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <View style={styles.cardHeader}>
              <Ionicons name="newspaper-outline" size={20} color="#445738" />
              <Text style={styles.cardTitle}>Cerita & Ulasan Pengunjung</Text>
            </View>

            {/* Tombol Refresh API */}
            <TouchableOpacity
              onPress={() => loadStories(selectedDestination)}
              disabled={loadingStories}
              style={styles.refreshIconBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={18} color="#445738" />
            </TouchableOpacity>
          </View>

          <Text style={styles.cardSubtitle}>
            Ulasan perjalanan wisatawan untuk {selectedDestination} yang diambil langsung dari server API eksternal:
          </Text>

          {/* Error State */}
          {storyError && (
            <View style={styles.errorBox}>
              <Ionicons name="warning-outline" size={16} color="#d32f2f" />
              <Text style={styles.errorText}>{storyError}</Text>
            </View>
          )}

          {/* Loading State */}
          {loadingStories ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#445738" />
              <Text style={styles.loadingText}>Memuat ulasan perjalanan...</Text>
            </View>
          ) : (
            stories.map((item) => (
              <View key={item.id} style={styles.storyCard}>
                <View style={styles.storyHeader}>
                  <Text style={styles.storyId}>Cerita #{item.id}</Text>
                  {item.views !== undefined && (
                    <Text style={styles.storyViews}>👁️ {item.views} dilihat</Text>
                  )}
                </View>
                <Text style={styles.storyTitle}>{item.title}</Text>
                <Text style={styles.storyBody} numberOfLines={3}>
                  {item.body}
                </Text>
                {item.tags && item.tags.length > 0 && (
                  <View style={styles.tagRow}>
                    {item.tags.map((tag, idx) => (
                      <View key={idx} style={styles.tagPill}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}
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
    padding: 16,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e7c8',
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#35432b',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#687a55',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e7c8',
    elevation: 2,
    shadowColor: '#445738',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#35432b',
    marginLeft: 6,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#687a55',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 12,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  destPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fbfad3',
    borderWidth: 1,
    borderColor: '#d7dfb8',
  },
  destPillActive: {
    backgroundColor: '#445738',
    borderColor: '#445738',
  },
  destPillText: {
    fontSize: 12,
    color: '#445738',
    fontWeight: '600',
  },
  destPillTextActive: {
    color: '#ffffff',
  },
  checkButton: {
    flexDirection: 'row',
    backgroundColor: '#445738',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
  },
  resultSuccess: {
    backgroundColor: '#edf7ed',
    borderColor: '#c8e6c9',
  },
  resultFailed: {
    backgroundColor: '#fdeeed',
    borderColor: '#ffcdd2',
  },
  resultText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  resultTextSuccess: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  resultTextFailed: {
    color: '#c62828',
    fontWeight: '600',
  },
  refreshIconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#fbfad3',
  },
  loadingBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    fontSize: 12,
    color: '#687a55',
    marginLeft: 8,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginLeft: 6,
  },
  storyCard: {
    backgroundColor: '#fbfad3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e7c8',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  storyId: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#445738',
  },
  storyViews: {
    fontSize: 10,
    color: '#687a55',
  },
  storyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#35432b',
    marginBottom: 4,
  },
  storyBody: {
    fontSize: 11,
    color: '#687a55',
    lineHeight: 16,
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tagPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d7dfb8',
  },
  tagText: {
    fontSize: 9,
    color: '#445738',
    fontWeight: '500',
  },
});
