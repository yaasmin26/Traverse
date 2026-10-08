import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp, AddonItem } from '../../context/AppContext';
import { AppHeader } from '../../components/AppHeader';
import { colors } from '../../theme/colors';

const placeNames: Record<string, string> = {
  umm: 'Danau UMM',
  kayutangan: 'Kayutangan',
  bromo: 'Bromo',
  ub: 'IUB/UB',
};

export const TicketAddonsScreen: React.FC = () => {
  const { navigate, goBack, addons, setAddons, deleteAddon, selectedPlaceId } = useApp();
  const [selectAll, setSelectAll] = useState(true);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newUnitLabel, setNewUnitLabel] = useState('/pax');

  const destinationTitle = placeNames[selectedPlaceId] || 'Kayutangan';

  const updateCount = (id: string, delta: number) => {
    setAddons((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextCount = Math.max(0, item.count + delta);
          return { ...item, count: nextCount };
        }
        return item;
      })
    );
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setAddons((prev) => prev.map((item) => ({ ...item, count: 0 })));
      setSelectAll(false);
    } else {
      setAddons((prev) =>
        prev.map((item) => ({ ...item, count: item.count > 0 ? item.count : 1 }))
      );
      setSelectAll(true);
    }
  };

  const handleAddCustomAddon = () => {
    if (!newTitle.trim()) return;
    const priceNum = parseInt(newPrice.replace(/[^0-9]/g, ''), 10) || 25000;
    const newAddon: AddonItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      unitPrice: priceNum,
      unitLabel: newUnitLabel,
      count: 1,
    };
    setAddons((prev) => [...prev, newAddon]);
    setNewTitle('');
    setNewPrice('');
    setIsAddModalVisible(false);
  };

  const total = addons.reduce(
    (sum, item) => sum + item.unitPrice * item.count,
    0
  );

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
        <AppHeader
          title="Ticket"
          subtitle="Find your ticket for your travel"
          showBack
          onBack={goBack}
          rightIcon="ticket"
        />

        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>Way to buy at {destinationTitle}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsAddModalVisible(true)}
            style={styles.addCustomPill}
          >
            <Ionicons name="add" size={16} color="#ffffff" />
            <Text style={styles.addCustomText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.addonsList}>
          {addons.map((item) => (
            <View key={item.id} style={styles.addonRow}>
              {/* Info Pill */}
              <View style={styles.infoPill}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>
                  Rp {item.unitPrice.toLocaleString('id-ID')}
                  {item.unitLabel}
                </Text>
              </View>

              {/* Counter Pill */}
              <View style={styles.counterPill}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateCount(item.id, -1)}
                  style={styles.counterBtn}
                >
                  <Text style={styles.counterOpText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.counterValueText}>{item.count}</Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateCount(item.id, 1)}
                  style={styles.counterBtn}
                >
                  <Text style={styles.counterOpText}>+</Text>
                </TouchableOpacity>
              </View>

              {addons.length > 1 && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={() => deleteAddon(item.id)}
                  style={styles.deleteAddonBtn}
                >
                  <Ionicons name="trash-outline" size={18} color="#d32f2f" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Select All Row */}
          <View style={styles.addonRow}>
            <View style={styles.infoPill}>
              <Text style={styles.itemTitle}>Select All</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggleSelectAll}
              style={[
                styles.selectCircle,
                selectAll && styles.selectCircleActive,
              ]}
            >
              {selectAll && (
                <Ionicons name="checkmark" size={24} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Total From This Page */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total From This Page</Text>
          <View style={styles.totalBox}>
            <Text style={styles.totalValue}>
              Rp {total.toLocaleString('id-ID')}
            </Text>
          </View>
        </View>

        {/* Action Buttons: NEXT to Payment & BACK */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigate('PaymentReceipt')}
          style={styles.actionBtn}
        >
          <Text style={styles.actionBtnText}>NEXT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={goBack}
          style={styles.backOutlineBtn}
        >
          <Text style={styles.backOutlineText}>BACK</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal to add custom addon */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Custom Item / Activity</Text>
            <Text style={styles.modalSubtitle}>
              Include extra tickets, snacks, or activity packages
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Item Name (e.g. Tour Guide, Coffee)"
              placeholderTextColor="#888"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Price in Rp (e.g. 50000)"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={newPrice}
              onChangeText={setNewPrice}
            />

            {/* Unit label selector */}
            <View style={styles.unitSelectorRow}>
              {(['/pax', '/session', '/item'] as const).map((unit) => (
                <TouchableOpacity
                  key={unit}
                  activeOpacity={0.8}
                  onPress={() => setNewUnitLabel(unit)}
                  style={[
                    styles.unitChip,
                    newUnitLabel === unit && styles.unitChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.unitChipText,
                      newUnitLabel === unit && styles.unitChipTextActive,
                    ]}
                  >
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsAddModalVisible(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleAddCustomAddon}
                style={styles.modalSubmitBtn}
              >
                <Text style={styles.modalSubmitText}>Add to Order</Text>
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
    paddingHorizontal: 20,
    paddingTop: 44,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 20,
    marginBottom: 16,
    marginLeft: 4,
  },
  addonsList: {
    gap: 14,
  },
  addonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoPill: {
    flex: 1,
    backgroundColor: '#fbf9d4',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#657854',
    marginTop: 2,
    fontWeight: '500',
  },
  counterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    height: 52,
    width: 100,
    borderRadius: 26,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  counterBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterOpText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  counterValueText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  selectCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fbf9d4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  selectCircleActive: {
    backgroundColor: '#749e39',
  },
  totalSection: {
    marginTop: 24,
    gap: 8,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  totalBox: {
    backgroundColor: '#fbf9d4',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  actionBtn: {
    height: 50,
    backgroundColor: '#749e39',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  backOutlineBtn: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backOutlineText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  addCustomPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#749e39',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  addCustomText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fbf9d4',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#657854',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.primaryDark,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6e4be',
  },
  unitSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  unitChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#e6edd8',
  },
  unitChipActive: {
    backgroundColor: '#749e39',
  },
  unitChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  unitChipTextActive: {
    color: '#ffffff',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eae8cb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  modalSubmitBtn: {
    flex: 1.5,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#749e39',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  deleteAddonBtn: {
    padding: 8,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
