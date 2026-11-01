import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { networkService } from '../services/networkService';

interface OfflineBannerProps {
  onCheckConnection?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onCheckConnection }) => {
  const [isOffline, setIsOffline] = useState<boolean>(!networkService.isConnected());
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [showRestored, setShowRestored] = useState<boolean>(false);
  const slideAnim = useRef(new Animated.Value(isOffline ? 1 : 0)).current;
  const wasOffline = useRef(isOffline);

  useEffect(() => {
    const unsubscribe = networkService.addListener((online) => {
      const offline = !online;
      if (wasOffline.current && !offline) {
        // Baru saja kembali online
        setShowRestored(true);
        setTimeout(() => {
          setShowRestored(false);
        }, 3200);
      }
      wasOffline.current = offline;
      setIsOffline(offline);

      Animated.timing(slideAnim, {
        toValue: offline || showRestored ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => unsubscribe();
  }, [slideAnim, showRestored]);

  const handleCheckConnection = async () => {
    setIsChecking(true);
    if (onCheckConnection) {
      await onCheckConnection();
    } else {
      await networkService.checkRealConnection();
    }
    setIsChecking(false);
  };

  if (!isOffline && !showRestored) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        showRestored ? styles.restoredBanner : styles.offlineBanner,
        {
          opacity: slideAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.iconBox}>
          <Ionicons
            name={showRestored ? 'cloud-done-outline' : 'cloud-offline-outline'}
            size={22}
            color="#ffffff"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.bannerTitle}>
            {showRestored ? 'Koneksi Terhubung Kembali' : 'Mode Offline'}
          </Text>
          <Text style={styles.bannerSubtitle}>
            {showRestored
              ? 'Aplikasi kembali online, data terbaru siap disinkronkan.'
              : 'Menampilkan data dari penyimpanan lokal (Cache).'}
          </Text>
        </View>

        {!showRestored && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCheckConnection}
            style={styles.retryButton}
            disabled={isChecking}
          >
            {isChecking ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="refresh" size={14} color="#ffffff" style={{ marginRight: 4 }} />
                <Text style={styles.retryButtonText}>Cek</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  offlineBanner: {
    backgroundColor: '#b85d19',
    borderColor: '#e0792b',
    borderWidth: 1,
  },
  restoredBanner: {
    backgroundColor: '#3b7a57',
    borderColor: '#4ca775',
    borderWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  bannerSubtitle: {
    color: '#fbe8dc',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

