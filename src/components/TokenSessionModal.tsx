/**
 * ============================================================================
 * [TUGAS ORANG 1: ELVIRA - PANEL KONTROL SESI, TOKEN & PROTECT SESSION]
 * Komponen interaktif untuk menampilkan token aktif, header API, dan uji proteksi sesi
 * ============================================================================
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

interface TokenSessionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TokenSessionModal: React.FC<TokenSessionModalProps> = ({
  visible,
  onClose,
}) => {
  const { user, authToken, setAuthToken, isAuthenticated, logout, navigate } = useApp();

  const handleRegenerateToken = () => {
    const newToken = `jwt_bearer_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setAuthToken(newToken);
    Alert.alert('Sukses', 'Token sesi baru berhasil dibuat ulang (Regenerated)!');
  };

  const handleSimulateExpiredSession = () => {
    setAuthToken(null);
    onClose();
    Alert.alert(
      'Uji Proteksi Sesi Berhasil',
      'Token berhasil dihapus dari memori. Sistem sekarang dalam status TIDAK TERAUTENTIKASI. Mencoba mengakses menu akan langsung diblokir oleh Navigation Guard.',
      [
        {
          text: 'Coba Masuk (Akan Diblokir)',
          onPress: () => navigate('MainTabs'),
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header Modal */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.badgeOrang1}>
                <Text style={styles.badgeOrang1Text}>TUGAS ORANG 1</Text>
              </View>
              <Text style={styles.title}>Panel Sesi & Token (Elvira)</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#4e603c" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Bagian 1: Status Sesi (Protect Session) */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>1. Status Sesi (Protect Session)</Text>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isAuthenticated ? '#2ecc71' : '#e74c3c' },
                  ]}
                />
                <Text style={styles.statusText}>
                  {isAuthenticated ? 'Sesi Terautentikasi (Valid)' : 'Sesi Tidak Ditemukan (Terkunci)'}
                </Text>
              </View>
              <Text style={styles.descText}>
                Pengguna: <Text style={{ fontWeight: '700' }}>{user.name || 'Elvira'}</Text> ({user.email})
              </Text>
            </View>

            {/* Bagian 2: Nilai Token (Implement Token) */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>2. Token Autentikasi (Implement Token)</Text>
              <Text style={styles.descText}>
                Diterbitkan saat pengguna berhasil login dan disimpan di memori sesi:
              </Text>
              <View style={styles.tokenBox}>
                <Text style={styles.tokenText} numberOfLines={3}>
                  {authToken ? authToken : '(Tidak ada token aktif)'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.actionBtnSecondary}
                onPress={handleRegenerateToken}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={15} color="#586d42" style={{ marginRight: 6 }} />
                <Text style={styles.actionBtnSecondaryText}>Generate / Refresh Token Baru</Text>
              </TouchableOpacity>
            </View>

            {/* Bagian 3: Header Request API (Attach Token) */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>3. Header Otomatis (Attach Token)</Text>
              <Text style={styles.descText}>
                Header yang otomatis ditempelkan pada setiap pemanggilan API:
              </Text>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>Authorization: Bearer {authToken ? authToken.substring(0, 22) + '...' : 'none'}</Text>
                <Text style={styles.codeText}>Content-Type: application/json</Text>
                <Text style={styles.codeText}>X-Traverse-Client: Mobile-App-v1.0</Text>
              </View>
            </View>

            {/* Bagian 4: Uji Coba Keamanan (Protect Session Guard) */}
            <View style={[styles.sectionBox, { borderColor: '#ffd8d8' }]}>
              <Text style={[styles.sectionTitle, { color: '#c0392b' }]}>
                4. Uji Coba Sesi (Protect Session Guard)
              </Text>
              <Text style={styles.descText}>
                Simulasikan token habis atau terhapus untuk membuktikan sistem memblokir akses ke halaman utama:
              </Text>

              <TouchableOpacity
                style={styles.testGuardBtn}
                onPress={handleSimulateExpiredSession}
                activeOpacity={0.85}
              >
                <Ionicons name="shield-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.testGuardBtnText}>Uji Coba: Hapus Token (Protect Session)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => {
                  onClose();
                  logout();
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="log-out-outline" size={16} color="#d32f2f" style={{ marginRight: 6 }} />
                <Text style={styles.logoutBtnText}>Logout & Hapus Sesi</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    maxHeight: '85%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2e4',
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  badgeOrang1: {
    backgroundColor: '#e6f3d8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#c6e0aa',
  },
  badgeOrang1Text: {
    color: '#4e603c',
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#283818',
  },
  closeBtn: {
    padding: 6,
  },
  scroll: {
    paddingBottom: 10,
  },
  sectionBox: {
    backgroundColor: '#f9fbf6',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5ecd9',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3d4d29',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2d3748',
  },
  descText: {
    fontSize: 12,
    color: '#657754',
    lineHeight: 16,
    marginBottom: 8,
  },
  tokenBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d7e2c5',
    marginBottom: 8,
  },
  tokenText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#283818',
  },
  codeBox: {
    backgroundColor: '#2d3748',
    borderRadius: 8,
    padding: 10,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#a0aec0',
    marginBottom: 2,
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#586d42',
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#586d42',
  },
  testGuardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c0392b',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  testGuardBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff0f0',
    borderWidth: 1,
    borderColor: '#ffcdd2',
    paddingVertical: 9,
    borderRadius: 10,
  },
  logoutBtnText: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: '700',
  },
});
