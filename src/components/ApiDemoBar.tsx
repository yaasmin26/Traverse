import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { networkService } from '../services/networkService';
import { apiService, SimulationMode } from '../services/apiService';

interface ApiDemoBarProps {
  onTriggerReload: () => void;
}

export const ApiDemoBar: React.FC<ApiDemoBarProps> = ({ onTriggerReload }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [simMode, setSimMode] = useState<SimulationMode>(apiService.getSimulationMode());
  const [isOfflineSim, setIsOfflineSim] = useState<boolean>(networkService.getIsSimulatedOffline());
  const [realConnected, setRealConnected] = useState<boolean>(networkService.isConnected());

  useEffect(() => {
    const unsub = networkService.addListener((online) => {
      setRealConnected(online);
      setIsOfflineSim(networkService.getIsSimulatedOffline());
    });
    return () => unsub();
  }, []);

  const handleSelectSimMode = (mode: SimulationMode) => {
    setSimMode(mode);
    apiService.setSimulationMode(mode);
    onTriggerReload();
  };

  const handleToggleOffline = () => {
    const nextState = !isOfflineSim;
    setIsOfflineSim(nextState);
    networkService.setSimulatedOfflineMode(nextState);
    onTriggerReload();
  };

  return (
    <View style={styles.outerContainer}>
      {/* Header Pill / Bar */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setExpanded(!expanded)}
        style={styles.pillContainer}
      >
        <View style={styles.pillLeft}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: realConnected ? '#2ecc71' : '#e74c3c' },
            ]}
          />
          <Text style={styles.pillTitle}>
            API & Network Panel ({realConnected ? 'Online' : 'Offline'})
          </Text>
        </View>

        <View style={styles.pillRight}>
          {simMode !== 'none' && (
            <View style={styles.activeSimBadge}>
              <Text style={styles.activeSimText}>{simMode}</Text>
            </View>
          )}
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#475635"
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Control Box */}
      {expanded && (
        <View style={styles.controlBox}>
          <Text style={styles.instructionText}>
            Uji penanganan API Error, State (Loading/Error/Retry), dan Mode Offline:
          </Text>

          {/* Tombol Pengujian Simulasi API */}
          <View style={styles.buttonGrid}>
            <TouchableOpacity
              onPress={() => handleSelectSimMode('none')}
              style={[
                styles.simBtn,
                simMode === 'none' && styles.simBtnActive,
                { borderColor: '#2ecc71' },
              ]}
            >
              <Text
                style={[
                  styles.simBtnText,
                  simMode === 'none' && styles.simBtnTextActive,
                ]}
              >
                ✓ Normal (200 OK)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelectSimMode('error_500')}
              style={[
                styles.simBtn,
                simMode === 'error_500' && styles.simBtnActive,
                { borderColor: '#e74c3c' },
              ]}
            >
              <Text
                style={[
                  styles.simBtnText,
                  simMode === 'error_500' && styles.simBtnTextActive,
                ]}
              >
                ⚠ Error 500
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelectSimMode('error_404')}
              style={[
                styles.simBtn,
                simMode === 'error_404' && styles.simBtnActive,
                { borderColor: '#e67e22' },
              ]}
            >
              <Text
                style={[
                  styles.simBtnText,
                  simMode === 'error_404' && styles.simBtnTextActive,
                ]}
              >
                🔍 Error 404
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelectSimMode('timeout')}
              style={[
                styles.simBtn,
                simMode === 'timeout' && styles.simBtnActive,
                { borderColor: '#9b59b6' },
              ]}
            >
              <Text
                style={[
                  styles.simBtnText,
                  simMode === 'timeout' && styles.simBtnTextActive,
                ]}
              >
                ⏱ Timeout
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelectSimMode('slow_network')}
              style={[
                styles.simBtn,
                simMode === 'slow_network' && styles.simBtnActive,
                { borderColor: '#3498db' },
              ]}
            >
              <Text
                style={[
                  styles.simBtnText,
                  simMode === 'slow_network' && styles.simBtnTextActive,
                ]}
              >
                🐢 Slow Loading
              </Text>
            </TouchableOpacity>

            {/* Toggle Offline Simulation */}
            <TouchableOpacity
              onPress={handleToggleOffline}
              style={[
                styles.simBtn,
                isOfflineSim && styles.offlineActiveBtn,
                { borderColor: '#b85d19' },
              ]}
            >
              <Text
                style={[
                  styles.simBtnText,
                  isOfflineSim && styles.offlineActiveBtnText,
                ]}
              >
                {isOfflineSim ? '📴 Matikan Offline' : '📵 Mode Offline'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d7e2c5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f6f9f0',
  },
  pillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 8,
  },
  pillTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#384628',
  },
  pillRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeSimBadge: {
    backgroundColor: '#fcebe6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#fcd3c7',
  },
  activeSimText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#d32f2f',
  },
  controlBox: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#edf2e4',
  },
  instructionText: {
    fontSize: 11,
    color: '#657754',
    marginBottom: 8,
    lineHeight: 15,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  simBtn: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#fafcf7',
  },
  simBtnActive: {
    backgroundColor: '#eaf4db',
  },
  simBtnText: {
    fontSize: 11,
    color: '#475635',
    fontWeight: '600',
  },
  simBtnTextActive: {
    color: '#283818',
    fontWeight: '700',
  },
  offlineActiveBtn: {
    backgroundColor: '#b85d19',
    borderColor: '#b85d19',
  },
  offlineActiveBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

