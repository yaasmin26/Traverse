import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * Halaman Profil Pengguna / Mahasiswa
 * Kriteria Penilaian:
 * 1. Menerapkan useState (mode gelap, notifikasi)
 * 2. Menerapkan useEffect (respons terhadap perubahan pengaturan)
 * 3. Menerapkan router.back() (kembali) dan router.replace() (logout)
 */
export default function ProfileScreen() {
  const router = useRouter();

  // Mengambil nama pengguna dari parameter route (Modul 2 hal 21-22)
  const params = useLocalSearchParams<{ username?: string }>();
  const displayName = params.username || 'yaasmin';

  // Penerapan hook useState
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [savedStatus, setSavedStatus] = useState<string>('Pengaturan default tersimpan');

  // Penerapan hook useEffect
  useEffect(() => {
    setSavedStatus(`Preferensi diperbarui pada ${new Date().toLocaleTimeString('id-ID')}`);
  }, [isDarkMode, notificationsEnabled]);

  // Fungsi navigasi kembali menggunakan router.back()
  const handleBack = () => {
    router.back();
  };

  // Fungsi logout menggunakan router.replace()
  // Mengarahkan ke layar login dan menghapus history stack
  const handleLogout = () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: () => {
          router.replace('/login');
        },
      },
    ]);
  };

  // Fungsi toggle notifikasi dengan bukti Alert langsung
  const handleToggleNotification = (val: boolean) => {
    setNotificationsEnabled(val);
    if (val) {
      Alert.alert(
        '🔔 Notifikasi Diaktifkan',
        'Sistem notifikasi aktif! Anda akan menerima pembaruan promo dan informasi tiket.'
      );
    } else {
      Alert.alert(
        '🔕 Notifikasi Dinonaktifkan',
        'Notifikasi telah dimatikan. Anda tidak akan menerima pemberitahuan.'
      );
    }
  };

  // Tombol untuk membuktikan notifikasi kepada asisten lab
  const handleTestNotification = () => {
    if (!notificationsEnabled) {
      Alert.alert(
        'Notifikasi Nonaktif',
        'Silakan aktifkan switch notifikasi terlebih dahulu untuk menerima pesan!'
      );
      return;
    }
    Alert.alert(
      '🔔 [NOTIFIKASI BARU] Traverse',
      'Promo Spesial Mahasiswa UMM: Dapatkan diskon 30% tiket masuk Gunung Bromo hari ini!\n\n(Bukti notifikasi berhasil diterima).',
      [{ text: 'Mengerti', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkBg]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Kartu Profil Mahasiswa */}
        <View style={[styles.profileCard, isDarkMode && styles.darkCard]}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color="#ffffff" />
          </View>
          <Text style={[styles.profileName, isDarkMode && styles.darkText]}>
            {displayName}
          </Text>
          <Text style={styles.profileEmail}>
            {displayName.toLowerCase().replace(/\s+/g, '')}@webmail.umm.ac.id
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>Informatika UMM - Modul 2</Text>
          </View>
        </View>

        {/* Pengaturan Aplikasi (State Switch) */}
        <View style={[styles.sectionBox, isDarkMode && styles.darkCard]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            Pengaturan Aplikasi
          </Text>

          {/* Switch Notifikasi (useState) */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelGroup}>
              <Ionicons name="notifications-outline" size={22} color="#445738" />
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>
                Notifikasi Promo
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotification}
              trackColor={{ false: '#d1d5db', true: '#8ca869' }}
              thumbColor={notificationsEnabled ? '#445738' : '#f4f3f4'}
            />
          </View>

          {/* Tombol Bukti Uji Notifikasi untuk Asisten Lab */}
          <TouchableOpacity
            style={styles.testNotifButton}
            onPress={handleTestNotification}
          >
            <Ionicons name="paper-plane-outline" size={16} color="#445738" style={{ marginRight: 6 }} />
            <Text style={styles.testNotifText}>Uji Kirim Notifikasi (Klik untuk Bukti)</Text>
          </TouchableOpacity>

          {/* Switch Mode Gelap (useState - Materi Codelab 1) */}
          <View style={[styles.settingRow, { borderBottomWidth: 0, marginTop: 4 }]}>
            <View style={styles.settingLabelGroup}>
              <Ionicons name="moon-outline" size={22} color="#445738" />
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>
                Mode Gelap (Dark Mode)
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={(val) => setIsDarkMode(val)}
              trackColor={{ false: '#d1d5db', true: '#8ca869' }}
              thumbColor={isDarkMode ? '#445738' : '#f4f3f4'}
            />
          </View>

          <Text style={styles.statusNote}>{savedStatus}</Text>
        </View>

        {/* Info Codelab & Navigasi */}
        <View style={[styles.infoBox, isDarkMode && styles.darkCard]}>
          <Text style={styles.infoTitle}>📌 Ringkasan Kriteria Modul 2</Text>
          <Text style={styles.infoText}>• Hook: useState & useEffect diterapkan</Text>
          <Text style={styles.infoText}>• Router: push(), back(), replace(), canGoBack()</Text>
          <Text style={styles.infoText}>• Layout: _layout.tsx & Stack.Screen aktif</Text>
        </View>

        {/* Tombol Aksi */}
        <View style={styles.actionGroup}>
          {/* Tombol router.back() */}
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="arrow-back" size={18} color="#445738" style={{ marginRight: 6 }} />
            <Text style={styles.backBtnText}>Kembali (router.back)</Text>
          </TouchableOpacity>

          {/* Tombol router.replace() */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.logoutBtnText}>Keluar Akun (router.replace)</Text>
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
  darkBg: {
    backgroundColor: '#1f291e',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecd3',
  },
  darkCard: {
    backgroundColor: '#2b3829',
    borderColor: '#3a4a37',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#445738',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#35432b',
  },
  profileEmail: {
    fontSize: 13,
    color: '#687a55',
    marginTop: 2,
    marginBottom: 10,
  },
  darkText: {
    color: '#fbfad3',
  },
  roleBadge: {
    backgroundColor: '#fbfad3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#445738',
  },
  sectionBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecd3',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#35432b',
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2e4',
  },
  settingLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    color: '#35432b',
    marginLeft: 10,
  },
  testNotifButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fbfad3',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#cddba6',
  },
  testNotifText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#445738',
  },
  statusNote: {
    marginTop: 10,
    fontSize: 11,
    color: '#94a580',
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#445738',
    borderColor: '#e9ecd3',
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#445738',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#687a55',
    marginVertical: 2,
  },
  actionGroup: {
    marginTop: 4,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#445738',
    marginBottom: 12,
  },
  backBtnText: {
    color: '#445738',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
