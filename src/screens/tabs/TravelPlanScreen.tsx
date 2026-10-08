import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp, SavedPlan } from '../../context/AppContext';
import { AppAssets } from '../../assets';
import { colors } from '../../theme/colors';

const POPULAR_DESTINATIONS = [
  'Malang',
  'Kayutangan',
  'Danau UMM',
  'Bromo',
  'Batu',
  'Surabaya',
  'Yogyakarta',
  'Paris',
  'Inggris',
];

const PRESET_DATES = [
  '20 April 2026',
  '25-27 April 2026',
  '1-3 Mei 2026',
  '10-12 Juni 2026',
  '15-18 Juli 2026',
];

const PRESET_BUDGETS = [
  'Rp 500.000',
  'Rp 1.000.000',
  'Rp 2.500.000',
  'Rp 5.000.000',
  'Rp 12.000.000',
];

export const TravelPlanScreen: React.FC = () => {
  const {
    navigate,
    travelPlan,
    setTravelPlan,
    setSelectedPlaceId,
    setPassengers,
    savedPlans,
    addSavedPlan,
    updateSavedPlan,
    deleteSavedPlan,
  } = useApp();

  const [activeSegment, setActiveSegment] = useState<'planned' | 'create'>('create');

  // Modals state for Destination, Date, Budget
  const [isDestModalVisible, setIsDestModalVisible] = useState(false);
  const [customDest, setCustomDest] = useState('');

  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [customDate, setCustomDate] = useState('');

  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [customBudget, setCustomBudget] = useState('');

  // Plan CRUD Modal State
  const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planFormName, setPlanFormName] = useState('');
  const [planFormDest, setPlanFormDest] = useState('');
  const [planFormDate, setPlanFormDate] = useState('');
  const [planFormBudget, setPlanFormBudget] = useState('');
  const [planFormPeople, setPlanFormPeople] = useState('2');
  const [planFormCategory, setPlanFormCategory] = useState('Landmark');
  const [planFormNotes, setPlanFormNotes] = useState('');

  // Delete Confirmation Modal State
  const [planToDelete, setPlanToDelete] = useState<SavedPlan | null>(null);

  const toggleCategory = (key: keyof typeof travelPlan.categories) => {
    setTravelPlan((prev) => {
      const nextCategories = { ...prev.categories, [key]: !prev.categories[key] };
      return { ...prev, categories: nextCategories };
    });
  };

  const updatePeopleCount = (delta: number) => {
    setTravelPlan((prev) => {
      const nextCount = Math.max(1, Math.min(10, prev.numPeople + delta));
      // Sync passengers array count
      setPassengers((curr) => {
        if (nextCount > curr.length) {
          const added = Array.from(
            { length: nextCount - curr.length },
            (_, i) => `Passenger ${curr.length + i + 1}`
          );
          return [...curr, ...added];
        } else if (nextCount < curr.length) {
          return curr.slice(0, nextCount);
        }
        return curr;
      });
      return { ...prev, numPeople: nextCount };
    });
  };

  const selectDestination = (dest: string) => {
    setTravelPlan((prev) => ({ ...prev, destination: dest }));
    setIsDestModalVisible(false);
  };

  const selectDate = (dt: string) => {
    setTravelPlan((prev) => ({ ...prev, date: dt }));
    setIsDateModalVisible(false);
  };

  const selectBudget = (b: string) => {
    setTravelPlan((prev) => ({ ...prev, budget: b }));
    setIsBudgetModalVisible(false);
  };

  // Open modal for creating new plan
  const handleOpenCreatePlan = () => {
    setEditingPlanId(null);
    setPlanFormName('');
    setPlanFormDest(travelPlan.destination || 'Malang');
    setPlanFormDate(travelPlan.date || '20 April 2026');
    setPlanFormBudget(travelPlan.budget || 'Rp 2.000.000');
    setPlanFormPeople(travelPlan.numPeople.toString());
    setPlanFormCategory('Landmark');
    setPlanFormNotes('');
    setIsPlanModalVisible(true);
  };

  // Open modal for editing existing plan
  const handleOpenEditPlan = (plan: SavedPlan) => {
    setEditingPlanId(plan.id);
    setPlanFormName(plan.name);
    setPlanFormDest(plan.destination);
    setPlanFormDate(plan.date);
    setPlanFormBudget(plan.budget);
    setPlanFormPeople(plan.numPeople.toString());
    setPlanFormCategory(plan.category);
    setPlanFormNotes(plan.notes || '');
    setIsPlanModalVisible(true);
  };

  // Save (Create or Update) Plan
  const handleSavePlan = () => {
    if (!planFormName.trim()) return;

    if (editingPlanId) {
      updateSavedPlan(editingPlanId, {
        name: planFormName.trim(),
        destination: planFormDest.trim() || 'Malang',
        date: planFormDate.trim() || '20 April 2026',
        budget: planFormBudget.trim() || 'Rp 2.000.000',
        numPeople: parseInt(planFormPeople, 10) || 2,
        category: planFormCategory,
        notes: planFormNotes.trim(),
      });
    } else {
      addSavedPlan({
        name: planFormName.trim(),
        destination: planFormDest.trim() || 'Malang',
        date: planFormDate.trim() || '20 April 2026',
        budget: planFormBudget.trim() || 'Rp 2.000.000',
        numPeople: parseInt(planFormPeople, 10) || 2,
        category: planFormCategory,
        image: AppAssets.ticketPlaceKayutangan,
        notes: planFormNotes.trim(),
      });
    }
    setIsPlanModalVisible(false);
  };

  // Save current form from "Create New Plan" tab into Planned
  const handleSaveCurrentAsPlan = () => {
    addSavedPlan({
      name: `Trip to ${travelPlan.destination}`,
      destination: travelPlan.destination,
      date: travelPlan.date,
      budget: travelPlan.budget,
      numPeople: travelPlan.numPeople,
      category: 'Landmark',
      image: AppAssets.ticketPlaceKayutangan,
      notes: 'Created from Travel Planner',
    });
    setActiveSegment('planned');
  };

  const handleSelectPlannedCard = (planName: string) => {
    setTravelPlan((prev) => ({ ...prev, destination: planName }));
    if (planName.toLowerCase().includes('bromo')) {
      setSelectedPlaceId('bromo');
    } else if (planName.toLowerCase().includes('umm')) {
      setSelectedPlaceId('umm');
    } else if (planName.toLowerCase().includes('ub')) {
      setSelectedPlaceId('ub');
    } else {
      setSelectedPlaceId('kayutangan');
    }
    navigate('TicketPlaces');
  };

  const handleNext = () => {
    const dest = travelPlan.destination.toLowerCase();
    if (dest.includes('bromo')) {
      setSelectedPlaceId('bromo');
    } else if (dest.includes('umm')) {
      setSelectedPlaceId('umm');
    } else if (dest.includes('ub')) {
      setSelectedPlaceId('ub');
    } else {
      setSelectedPlaceId('kayutangan');
    }
    navigate('TicketPlaces');
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
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>My Travel Plan</Text>
            <Text style={styles.subtitle}>It’s my dream mas, not her</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsDateModalVisible(true)}
            style={styles.calendarIconBtn}
          >
            <Ionicons name="calendar-outline" size={30} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Segmented Switch: Planned vs Create New Plan */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveSegment('planned')}
            style={[
              styles.segmentItem,
              activeSegment === 'planned' && styles.segmentItemActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                activeSegment === 'planned' && styles.segmentTextActive,
              ]}
            >
              Planned ({savedPlans.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveSegment('create')}
            style={[
              styles.segmentItem,
              activeSegment === 'create' && styles.segmentItemActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                activeSegment === 'create' && styles.segmentTextActive,
              ]}
            >
              Create New Plan
            </Text>
          </TouchableOpacity>
        </View>

        {/* PLANNED VIEW (Travel Plan.png) - FULL CRUD */}
        {activeSegment === 'planned' && (
          <View style={styles.plannedList}>
            <View style={styles.plannedHeaderRow}>
              <Text style={styles.plannedHeaderTitle}>Your Dream Destinations</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleOpenCreatePlan}
                style={styles.addPlanBtn}
              >
                <Ionicons name="add" size={16} color="#ffffff" />
                <Text style={styles.addPlanBtnText}>Add Plan</Text>
              </TouchableOpacity>
            </View>

            {savedPlans.map((plan) => (
              <View key={plan.id} style={styles.planCard}>
                <Image source={plan.image} style={styles.planCardImg} resizeMode="cover" />
                
                {/* Plan Info Overlay */}
                <View style={styles.planPill}>
                  <Text style={styles.planPillText}>{plan.name}</Text>
                  <Text style={styles.planSubtitleText}>{plan.destination}</Text>
                </View>

                {/* CRUD Action Buttons on Top Right */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleOpenEditPlan(plan)}
                    style={styles.actionCircleBtn}
                  >
                    <Ionicons name="pencil" size={15} color="#ffffff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setPlanToDelete(plan)}
                    style={[styles.actionCircleBtn, styles.deleteCircleBtn]}
                  >
                    <Ionicons name="trash" size={15} color="#ffffff" />
                  </TouchableOpacity>
                </View>

                {/* Plan Details & Book Button */}
                <View style={styles.planBottomBar}>
                  <View style={styles.planMetaBadge}>
                    <Text style={styles.planMetaText}>
                      {plan.date} • {plan.budget}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleSelectPlannedCard(plan.name)}
                    style={styles.bookThisPill}
                  >
                    <Text style={styles.bookThisText}>Book Now →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {savedPlans.length === 0 && (
              <View style={styles.emptyPlansCard}>
                <Ionicons name="map-outline" size={48} color="#749e39" />
                <Text style={styles.emptyPlansTitle}>No Plans Yet</Text>
                <Text style={styles.emptyPlansSubtitle}>
                  Create your dream travel plan or save destinations to your wishlist!
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleOpenCreatePlan}
                  style={styles.emptyCreateBtn}
                >
                  <Text style={styles.emptyCreateText}>+ Add First Plan</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* CREATE NEW PLAN VIEW */}
        {activeSegment === 'create' && (
          <View style={styles.createPlanForm}>
            {/* Travel Destination */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Travel Destination</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsDestModalVisible(true)}
                style={styles.selectPill}
              >
                <Text style={styles.selectPillText}>{travelPlan.destination}</Text>
                <Ionicons name="chevron-down" size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Travel Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Travel Date</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsDateModalVisible(true)}
                style={styles.selectPill}
              >
                <Text style={styles.selectPillText}>{travelPlan.date}</Text>
                <Ionicons name="chevron-down" size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Travel Budget & Number of People */}
            <View style={styles.budgetRow}>
              <View style={styles.budgetCol}>
                <Text style={styles.inputLabel}>Travel Budget</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsBudgetModalVisible(true)}
                  style={styles.selectPill}
                >
                  <Text style={styles.selectPillText}>{travelPlan.budget}</Text>
                  <Ionicons name="chevron-down" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <View style={styles.peopleCol}>
                <Text style={styles.inputLabel}>Number of People</Text>
                <View style={styles.peopleCounterPill}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => updatePeopleCount(-1)}
                    style={styles.peopleCounterBtn}
                  >
                    <Text style={styles.peopleCounterOp}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.peopleText}>{travelPlan.numPeople}</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => updatePeopleCount(1)}
                    style={styles.peopleCounterBtn}
                  >
                    <Text style={styles.peopleCounterOp}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Category Checkboxes */}
            <View style={styles.categoriesSection}>
              <Text style={styles.inputLabel}>Preferences</Text>

              {/* All */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleCategory('all')}
                style={styles.categoryPill}
              >
                <Text style={styles.categoryPillText}>All</Text>
                <View
                  style={[
                    styles.checkCircle,
                    travelPlan.categories.all && styles.checkCircleActive,
                  ]}
                >
                  {travelPlan.categories.all && (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Landmark */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleCategory('landmark')}
                style={styles.categoryPill}
              >
                <View style={styles.catLeft}>
                  <MaterialCommunityIcons name="bank" size={20} color={colors.primaryDark} />
                  <Text style={styles.categoryPillText}>Landmark</Text>
                </View>
                <View
                  style={[
                    styles.checkCircle,
                    travelPlan.categories.landmark && styles.checkCircleActive,
                  ]}
                >
                  {travelPlan.categories.landmark && (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Cullinary */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleCategory('cullinary')}
                style={styles.categoryPill}
              >
                <View style={styles.catLeft}>
                  <MaterialCommunityIcons name="storefront-outline" size={20} color={colors.primaryDark} />
                  <Text style={styles.categoryPillText}>Cullinary</Text>
                </View>
                <View
                  style={[
                    styles.checkCircle,
                    travelPlan.categories.cullinary && styles.checkCircleActive,
                  ]}
                >
                  {travelPlan.categories.cullinary && (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Nature */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleCategory('nature')}
                style={styles.categoryPill}
              >
                <View style={styles.catLeft}>
                  <Ionicons name="image-outline" size={20} color={colors.primaryDark} />
                  <Text style={styles.categoryPillText}>Nature</Text>
                </View>
                <View
                  style={[
                    styles.checkCircle,
                    travelPlan.categories.nature && styles.checkCircleActive,
                  ]}
                >
                  {travelPlan.categories.nature && (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Viral Places */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleCategory('viral')}
                style={styles.categoryPill}
              >
                <View style={styles.catLeft}>
                  <Ionicons name="phone-portrait-outline" size={20} color={colors.primaryDark} />
                  <Text style={styles.categoryPillText}>Viral Places</Text>
                </View>
                <View
                  style={[
                    styles.checkCircle,
                    travelPlan.categories.viral && styles.checkCircleActive,
                  ]}
                >
                  {travelPlan.categories.viral && (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Action Buttons: NEXT to Book & Save to Planned */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleNext}
              style={styles.nextBtn}
            >
              <Text style={styles.nextBtnText}>NEXT (Book Tickets)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSaveCurrentAsPlan}
              style={styles.savePlanBtn}
            >
              <Ionicons name="bookmark-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.savePlanBtnText}>Save to Planned Wishlist</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom tab spacer */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Destination Picker Modal */}
      <Modal
        visible={isDestModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDestModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Destination</Text>
            <Text style={styles.modalSubtitle}>Where would you like to travel?</Text>

            <View style={styles.modalOptionsList}>
              {POPULAR_DESTINATIONS.map((dest) => (
                <TouchableOpacity
                  key={dest}
                  activeOpacity={0.7}
                  onPress={() => selectDestination(dest)}
                  style={[
                    styles.modalOptionItem,
                    travelPlan.destination === dest && styles.modalOptionItemActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      travelPlan.destination === dest && styles.modalOptionTextActive,
                    ]}
                  >
                    {dest}
                  </Text>
                  {travelPlan.destination === dest && (
                    <Ionicons name="checkmark" size={18} color="#ffffff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customInputRow}>
              <TextInput
                style={styles.customTextInput}
                placeholder="Or type custom destination..."
                placeholderTextColor="#888"
                value={customDest}
                onChangeText={setCustomDest}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (customDest.trim()) {
                    selectDestination(customDest.trim());
                    setCustomDest('');
                  }
                }}
                style={styles.applyBtn}
              >
                <Text style={styles.applyBtnText}>Set</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsDestModalVisible(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={isDateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Travel Date</Text>
            <Text style={styles.modalSubtitle}>Pick departure or travel schedule</Text>

            <View style={styles.modalOptionsList}>
              {PRESET_DATES.map((dt) => (
                <TouchableOpacity
                  key={dt}
                  activeOpacity={0.7}
                  onPress={() => selectDate(dt)}
                  style={[
                    styles.modalOptionItem,
                    travelPlan.date === dt && styles.modalOptionItemActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      travelPlan.date === dt && styles.modalOptionTextActive,
                    ]}
                  >
                    {dt}
                  </Text>
                  {travelPlan.date === dt && (
                    <Ionicons name="checkmark" size={18} color="#ffffff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customInputRow}>
              <TextInput
                style={styles.customTextInput}
                placeholder="Or type custom date (e.g. 15 Mei 2026)..."
                placeholderTextColor="#888"
                value={customDate}
                onChangeText={setCustomDate}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (customDate.trim()) {
                    selectDate(customDate.trim());
                    setCustomDate('');
                  }
                }}
                style={styles.applyBtn}
              >
                <Text style={styles.applyBtnText}>Set</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsDateModalVisible(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Budget Picker Modal */}
      <Modal
        visible={isBudgetModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsBudgetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Travel Budget</Text>
            <Text style={styles.modalSubtitle}>Set expected vacation budget</Text>

            <View style={styles.modalOptionsList}>
              {PRESET_BUDGETS.map((b) => (
                <TouchableOpacity
                  key={b}
                  activeOpacity={0.7}
                  onPress={() => selectBudget(b)}
                  style={[
                    styles.modalOptionItem,
                    travelPlan.budget === b && styles.modalOptionItemActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      travelPlan.budget === b && styles.modalOptionTextActive,
                    ]}
                  >
                    {b}
                  </Text>
                  {travelPlan.budget === b && (
                    <Ionicons name="checkmark" size={18} color="#ffffff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customInputRow}>
              <TextInput
                style={styles.customTextInput}
                placeholder="Or type custom budget (e.g. Rp 3.000.000)..."
                placeholderTextColor="#888"
                value={customBudget}
                onChangeText={setCustomBudget}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (customBudget.trim()) {
                    selectBudget(customBudget.trim());
                    setCustomBudget('');
                  }
                }}
                style={styles.applyBtn}
              >
                <Text style={styles.applyBtnText}>Set</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsBudgetModalVisible(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Plan Create & Edit Modal (CRUD) */}
      <Modal
        visible={isPlanModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPlanModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView
            contentContainerStyle={styles.planModalScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>
                  {editingPlanId ? 'Edit Travel Plan' : 'Create New Travel Plan'}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsPlanModalVisible(false)}
                >
                  <Ionicons name="close-circle" size={26} color={colors.primaryDark} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>
                {editingPlanId
                  ? 'Update your dream destination and travel details'
                  : 'Add a new vacation plan to your personal wishlist'}
              </Text>

              {/* Plan Title */}
              <Text style={styles.formInputLabel}>Plan Title</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Liburan Bromo Seru, Paris Getaway"
                placeholderTextColor="#888"
                value={planFormName}
                onChangeText={setPlanFormName}
              />

              {/* Destination */}
              <Text style={styles.formInputLabel}>Destination</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Bromo, Malang, Paris, Bali"
                placeholderTextColor="#888"
                value={planFormDest}
                onChangeText={setPlanFormDest}
              />

              {/* Date & People */}
              <View style={styles.formDoubleRow}>
                <View style={{ flex: 1.5 }}>
                  <Text style={styles.formInputLabel}>Date</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="e.g. 20-25 Mei 2026"
                    placeholderTextColor="#888"
                    value={planFormDate}
                    onChangeText={setPlanFormDate}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.formInputLabel}>People</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="e.g. 4"
                    keyboardType="numeric"
                    placeholderTextColor="#888"
                    value={planFormPeople}
                    onChangeText={setPlanFormPeople}
                  />
                </View>
              </View>

              {/* Budget */}
              <Text style={styles.formInputLabel}>Budget</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Rp 3.000.000"
                placeholderTextColor="#888"
                value={planFormBudget}
                onChangeText={setPlanFormBudget}
              />

              {/* Category selector */}
              <Text style={styles.formInputLabel}>Category</Text>
              <View style={styles.categoryPillsRow}>
                {(['Landmark', 'Cullinary', 'Nature', 'Viral'] as const).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    activeOpacity={0.8}
                    onPress={() => setPlanFormCategory(cat)}
                    style={[
                      styles.categoryChip,
                      planFormCategory === cat && styles.categoryChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        planFormCategory === cat && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Notes */}
              <Text style={styles.formInputLabel}>Notes / Activities (Optional)</Text>
              <TextInput
                style={[styles.modalInput, styles.modalInputNotes]}
                placeholder="e.g. Sewa jeep, sunrise point, cobain bakso malang"
                placeholderTextColor="#888"
                multiline
                numberOfLines={2}
                value={planFormNotes}
                onChangeText={setPlanFormNotes}
              />

              {/* Modal Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsPlanModalVisible(false)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSavePlan}
                  style={styles.modalSubmitBtn}
                >
                  <Text style={styles.modalSubmitText}>
                    {editingPlanId ? 'Save Changes' : 'Add to Wishlist'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Delete Confirmation Modal (CRUD Delete) */}
      <Modal
        visible={!!planToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setPlanToDelete(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteConfirmCard}>
            <View style={styles.deleteIconWrapper}>
              <Ionicons name="trash-outline" size={36} color="#d32f2f" />
            </View>

            <Text style={styles.deleteConfirmTitle}>Delete Plan?</Text>
            <Text style={styles.deleteConfirmMsg}>
              Are you sure you want to delete "{planToDelete?.name}"? This action cannot be undone.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setPlanToDelete(null)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  if (planToDelete) {
                    deleteSavedPlan(planToDelete.id);
                    setPlanToDelete(null);
                  }
                }}
                style={styles.deleteConfirmBtn}
              >
                <Text style={styles.deleteConfirmBtnText}>Yes, Delete</Text>
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
    paddingTop: 48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: colors.primaryDark,
    marginTop: 2,
  },
  calendarIconBtn: {
    padding: 4,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#b7ca98',
    borderRadius: 22,
    height: 44,
    padding: 3,
    marginBottom: 24,
  },
  segmentItem: {
    flex: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: '#445738',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  segmentTextActive: {
    color: '#fcfad5',
  },
  plannedList: {
    gap: 16,
  },
  plannedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  plannedHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  addPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#749e39',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  addPlanBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  planCard: {
    height: 140,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planCardImg: {
    width: '100%',
    height: '100%',
  },
  planPill: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    backgroundColor: 'rgba(57, 74, 45, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 12,
  },
  planPillText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  bookThisPill: {
    position: 'absolute',
    bottom: 12,
    right: 14,
    backgroundColor: '#fbf9d4',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  bookThisText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  createPlanForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '500',
    marginLeft: 2,
  },
  selectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8da868',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  selectPillText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  budgetCol: {
    flex: 2,
    gap: 6,
  },
  peopleCol: {
    flex: 1.2,
    gap: 6,
  },
  peopleCounterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8da868',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 10,
  },
  peopleCounterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  peopleCounterOp: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 20,
  },
  peopleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  categoriesSection: {
    gap: 10,
    marginTop: 6,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#a9c186',
    height: 46,
    borderRadius: 23,
    paddingHorizontal: 18,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#749e39',
  },
  nextBtn: {
    height: 50,
    backgroundColor: '#fbf9d4',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.5,
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
  modalOptionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  modalOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e6e4be',
    gap: 6,
  },
  modalOptionItemActive: {
    backgroundColor: '#749e39',
    borderColor: '#749e39',
  },
  modalOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  modalOptionTextActive: {
    color: '#ffffff',
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  customTextInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.primaryDark,
    borderWidth: 1,
    borderColor: '#e6e4be',
  },
  applyBtn: {
    backgroundColor: '#749e39',
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  modalCloseBtn: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eae8cb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  modalInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.primaryDark,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e6e4be',
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
  planSubtitleText: {
    fontSize: 11,
    color: '#e2edd5',
    fontWeight: '500',
    marginTop: 1,
  },
  cardActionsRow: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(57, 74, 45, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteCircleBtn: {
    backgroundColor: 'rgba(211, 47, 47, 0.85)',
  },
  planBottomBar: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planMetaBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  planMetaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyPlansCard: {
    backgroundColor: 'rgba(251, 249, 212, 0.8)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPlansTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
    marginTop: 12,
  },
  emptyPlansSubtitle: {
    fontSize: 13,
    color: '#556947',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  emptyCreateBtn: {
    backgroundColor: '#749e39',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyCreateText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  savePlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e4edd2',
    borderWidth: 1.5,
    borderColor: '#749e39',
    gap: 8,
    marginTop: -4,
  },
  savePlanBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  planModalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  formInputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 4,
    marginLeft: 2,
  },
  formDoubleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#e6edd8',
  },
  categoryChipActive: {
    backgroundColor: '#749e39',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  categoryChipTextActive: {
    color: '#ffffff',
  },
  modalInputNotes: {
    height: 60,
    textAlignVertical: 'top',
  },
  deleteConfirmCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fbf9d4',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  deleteIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  deleteConfirmTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  deleteConfirmMsg: {
    fontSize: 13,
    color: '#556947',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  deleteConfirmBtn: {
    flex: 1.5,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#d32f2f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteConfirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
