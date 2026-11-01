import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApiError } from '../services/apiService';
import { colors } from '../theme/colors';

interface ApiStateViewProps {
  isLoading: boolean;
  error: ApiError | null;
  onRetry: () => void;
  loadingMessage?: string;
  isFromCache?: boolean;
  children: React.ReactNode;
}

export const ApiStateView: React.FC<ApiStateViewProps> = ({
  isLoading,
  error,
  onRetry,
  loadingMessage = 'Memuat data dari server...',
  isFromCache = false,
  children,
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // 1. STATE: LOADING
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#586d42" />
          <Text style={styles.loadingTitle}>{loadingMessage}</Text>
          <Text style={styles.loadingSubtitle}>Menghubungi endpoint API...</Text>
        </View>
      </View>
    );
  }

  // 2. STATE: ERROR (tanpa data fallback cache)
  if (error && !isFromCache) {
    const isOffline = error.code === 'OFFLINE';
    const isTimeout = error.code === 'TIMEOUT';

    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          {/* Header Kartu Error */}
          <View style={styles.errorHeader}>
            <View
              style={[
                styles.errorIconCircle,
                { backgroundColor: isOffline ? '#ffefe6' : '#fde8e8' },
              ]}
            >
              <Ionicons
                name={
                  isOffline
                    ? 'cloud-offline-outline'
                    : isTimeout
                    ? 'time-outline'
                    : 'alert-circle-outline'
                }
                size={28}
                color={isOffline ? '#b85d19' : '#d32f2f'}
              />
            </View>

            <View style={styles.errorBadge}>
              <Text style={styles.errorBadgeText}>
                {error.status ? `Error ${error.status}` : error.code}
              </Text>
            </View>
          </View>

          {/* Pesan Error Ramah Pengguna */}
          <Text style={styles.errorTitle}>
            {isOffline
              ? 'Koneksi Terputus'
              : isTimeout
              ? 'Waktu Permintaan Habis'
              : 'Gagal Memuat Data'}
          </Text>
          <Text style={styles.errorMessage}>{error.message}</Text>

          {/* Waktu Kejadian */}
          <Text style={styles.timestampText}>
            Waktu: {error.timestamp || new Date().toLocaleTimeString('id-ID')}
          </Text>

          {/* Tombol Detail Teknis untuk Praktikum/Pengujian */}
          {error.details && (
            <View style={styles.detailsSection}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowDetails(!showDetails)}
                style={styles.detailsToggle}
              >
                <Text style={styles.detailsToggleText}>
                  {showDetails ? 'Sembunyikan Detail Teknis ▲' : 'Lihat Detail Teknis ▼'}
                </Text>
              </TouchableOpacity>

              {showDetails && (
                <View style={styles.detailsBox}>
                  <Text style={styles.detailsText}>
                    Endpoint: {error.endpoint || 'N/A'}
                  </Text>
                  <Text style={styles.detailsText}>
                    Rincian: {error.details}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* 3. STATE: RETRY (Tombol Coba Lagi) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onRetry}
            style={styles.retryButton}
          >
            <Ionicons name="refresh" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.retryButtonText}>Coba Lagi (Retry)</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3. STATE: SUKSES atau FALLBACK DARI CACHE (Data tetap ditampilkan)
  return (
    <View style={styles.contentWrapper}>
      {isFromCache && error && (
        <View style={styles.cacheWarningBar}>
          <Ionicons name="information-circle-outline" size={16} color="#8a5314" />
          <Text style={styles.cacheWarningText}>
            Menampilkan data tersimpan (Cache lokal).
          </Text>
          <TouchableOpacity onPress={onRetry} style={styles.cacheRetryLink}>
            <Text style={styles.cacheRetryText}>Segarkan</Text>
          </TouchableOpacity>
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    width: '100%',
  },
  loadingContainer: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  loadingBox: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2ebd5',
  },
  loadingTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#344324',
  },
  loadingSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#768863',
  },
  errorContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  errorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#fcdada',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  errorIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBadge: {
    backgroundColor: '#fde8e8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f9c5c5',
  },
  errorBadgeText: {
    color: '#d32f2f',
    fontSize: 11,
    fontWeight: '700',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2915',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 13,
    color: '#556447',
    lineHeight: 18,
    marginBottom: 6,
  },
  timestampText: {
    fontSize: 11,
    color: '#8c9c7e',
    marginBottom: 12,
  },
  detailsSection: {
    marginBottom: 14,
  },
  detailsToggle: {
    paddingVertical: 4,
  },
  detailsToggleText: {
    fontSize: 12,
    color: '#586d42',
    fontWeight: '600',
  },
  detailsBox: {
    backgroundColor: '#f6f9f2',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e5ecd9',
  },
  detailsText: {
    fontSize: 11,
    color: '#475635',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  retryButton: {
    backgroundColor: '#586d42',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 10,
    shadowColor: '#586d42',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  cacheWarningBar: {
    backgroundColor: '#fff4e5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fedbb0',
  },
  cacheWarningText: {
    flex: 1,
    fontSize: 12,
    color: '#8a5314',
    marginLeft: 6,
  },
  cacheRetryLink: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cacheRetryText: {
    fontSize: 12,
    color: '#b85d19',
    fontWeight: '700',
  },
});

