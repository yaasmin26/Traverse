import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp, CompletedBooking } from '../../context/AppContext';
import { AppAssets } from '../../assets';
import { AppHeader } from '../../components/AppHeader';
import { colors } from '../../theme/colors';

const placeNames: Record<string, string> = {
  umm: 'Danau UMM',
  kayutangan: 'Kayutangan',
  bromo: 'Bromo',
  ub: 'IUB/UB',
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 40, 335);
// Aspect ratio of the original qris-code.png voucher (335w x 510h)
const CARD_HEIGHT = Math.round(CARD_WIDTH * (510 / 335));

export const QRISPaymentScreen: React.FC = () => {
  const {
    navigate,
    goBack,
    paymentMethod,
    splitUsers,
    selectedDepartureTicket,
    selectedReturnTicket,
    passengers,
    addons,
    addBooking,
    selectedPlaceId,
  } = useApp();

  const [isVerifying, setIsVerifying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes countdown

  // Animated laser scan line
  const scanAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Laser loop
    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    scanLoop.start();

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      scanLoop.stop();
      clearInterval(timer);
    };
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const depTotal = (selectedDepartureTicket?.price || 150000) * passengers.length;
  const retTotal = selectedReturnTicket
    ? selectedReturnTicket.price * passengers.length
    : 0;
  const addonTotal = addons.reduce(
    (sum, a) => sum + a.unitPrice * a.count,
    0
  );
  const grandTotal = depTotal + retTotal + addonTotal;

  const selectedSplitUsers = splitUsers.filter((u) => u.selected);
  const amountToPay =
    paymentMethod === 'T-Split Bill'
      ? Math.round(grandTotal / (selectedSplitUsers.length || 1))
      : grandTotal;

  const handleConfirmPayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const destinationTitle = placeNames[selectedPlaceId] || 'Kayutangan';
      const newBooking: CompletedBooking = {
        id: 'TVR' + Math.floor(100 + Math.random() * 900),
        destination: destinationTitle,
        date: selectedDepartureTicket.date,
        fromCode: selectedDepartureTicket.from,
        toCode: selectedDepartureTicket.to,
        depTime: selectedDepartureTicket.depTime,
        arrTime: selectedDepartureTicket.arrTime,
        duration: selectedDepartureTicket.duration,
        operator: selectedDepartureTicket.operator,
        passengers: [...passengers],
        totalPrice: grandTotal,
        paymentMethod: paymentMethod,
        status: 'Upcoming',
      };
      addBooking(newBooking);
      setIsVerifying(false);
      navigate('PaymentSuccess');
    }, 1200);
  };

  // Interpolate laser line translation across the QR area
  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CARD_HEIGHT * 0.28, CARD_HEIGHT * 0.65],
  });

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
          title="Payment"
          subtitle="Pay to go!"
          showBack
          onBack={goBack}
          rightIcon="ticket"
        />

        <Animated.View style={[styles.mainBody, { opacity: fadeAnim }]}>
          {/* Header Title & Timer Badge */}
          <View style={styles.topMetaRow}>
            <View style={styles.scanPill}>
              <MaterialCommunityIcons name="qrcode-scan" size={14} color="#ffffff" />
              <Text style={styles.scanPillText}>QRIS STANDAR NASIONAL</Text>
            </View>

            <View style={styles.timerPill}>
              <View style={styles.pulsingDot} />
              <Text style={styles.timerText}>{formatTimer(timeLeft)}</Text>
            </View>
          </View>

          <Text style={styles.screenHeading}>SCAN THE QRIS</Text>
          <Text style={styles.screenSubtitle}>
            Pindai kode QR melalui aplikasi m-Banking atau e-Wallet Anda
          </Text>

          {/* QRIS Liquid Glass Ticket Card */}
          <View style={[styles.qrisCard, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
            {/* The Voucher Graphic */}
            <Image
              source={AppAssets.qrisCode}
              style={styles.qrisImage}
              resizeMode="cover"
            />

            {/* Glowing Laser Scan Bar */}
            <Animated.View
              style={[
                styles.laserLine,
                { transform: [{ translateY: scanTranslateY }] },
              ]}
            >
              <LinearGradient
                colors={['transparent', 'rgba(116, 158, 57, 0.85)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.laserGradient}
              />
            </Animated.View>

            {/* Ticket Notches */}
            <View style={styles.ticketNotchLeft} />
            <View style={styles.ticketNotchRight} />

            {/* Dynamic Price Banner Overlay on the green voucher footer */}
            <View style={styles.priceBannerOverlay}>
              <Text style={styles.priceBannerText}>
                Rp {amountToPay.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>

          {/* Quick Action Chips (Download, Share, Copy) */}
          <View style={styles.quickChipsRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => showToast('Kode QR berhasil disimpan ke galeri')}
              style={styles.actionChip}
            >
              <Ionicons name="download-outline" size={15} color="#445738" />
              <Text style={styles.actionChipText}>Unduh QR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => showToast('Tautan QRIS berhasil disalin')}
              style={styles.actionChip}
            >
              <Ionicons name="share-social-outline" size={15} color="#445738" />
              <Text style={styles.actionChipText}>Bagikan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => showToast(`Nominal Rp ${amountToPay.toLocaleString('id-ID')} disalin!`)}
              style={styles.actionChip}
            >
              <Ionicons name="copy-outline" size={15} color="#445738" />
              <Text style={styles.actionChipText}>Salin Nominal</Text>
            </TouchableOpacity>
          </View>

          {/* Payment Detail Card */}
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tipe Pembayaran</Text>
              <View style={styles.methodBadge}>
                <Text style={styles.methodBadgeText}>
                  {paymentMethod === 'T-Split Bill' ? 'T-Split Bill' : 'QRIS Langsung'}
                </Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Merchant</Text>
              <Text style={styles.detailValue}>Traverse Official</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Destinasi</Text>
              <Text style={styles.detailValue}>
                {placeNames[selectedPlaceId] || 'Kayutangan'}
              </Text>
            </View>

            {paymentMethod === 'T-Split Bill' && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bagian Patungan</Text>
                <Text style={styles.detailValue}>
                  1 dari {selectedSplitUsers.length || 1} orang
                </Text>
              </View>
            )}

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.totalPayLabel}>Total Tagihan</Text>
              <Text style={styles.totalPayValue}>
                Rp {amountToPay.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>

          {/* Supported Wallets Tag */}
          <View style={styles.supportedWallets}>
            <Text style={styles.supportedText}>
              BCA • Mandiri • BNI • BRI • GoPay • OVO • Dana • ShopeePay
            </Text>
          </View>

          {/* Confirm / NEXT Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleConfirmPayment}
            disabled={isVerifying}
            style={styles.confirmBtn}
          >
            {isVerifying ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.confirmBtnText}>Memverifikasi...</Text>
              </View>
            ) : (
              <View style={styles.btnContentRow}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
                <Text style={styles.confirmBtnText}>Saya Sudah Bayar</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Cancel button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={goBack}
            disabled={isVerifying}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>Ganti Metode Pembayaran</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Toast notification */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Ionicons name="information-circle" size={18} color="#ffffff" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 44,
  },
  mainBody: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 340,
    marginTop: 10,
    marginBottom: 12,
  },
  scanPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#445738',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
  },
  scanPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e53935',
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#364522',
  },
  screenHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#556947',
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: 18,
    lineHeight: 17,
  },
  qrisCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#203010',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  qrisImage: {
    width: '100%',
    height: '100%',
  },
  laserLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    zIndex: 10,
    shadowColor: '#749e39',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  laserGradient: {
    width: '100%',
    height: '100%',
  },
  ticketNotchLeft: {
    position: 'absolute',
    bottom: 42,
    left: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#b9cb9c',
    zIndex: 20,
  },
  ticketNotchRight: {
    position: 'absolute',
    bottom: 42,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#b9cb9c',
    zIndex: 20,
  },
  priceBannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: '#8fa968',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  priceBannerText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#2b3a1a',
    letterSpacing: 0.3,
  },
  quickChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#445738',
  },
  detailCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: '#5b6f49',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#d8e4c7',
    marginVertical: 6,
  },
  methodBadge: {
    backgroundColor: '#445738',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  methodBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  totalPayLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#364522',
  },
  totalPayValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#364522',
  },
  supportedWallets: {
    alignItems: 'center',
    marginBottom: 20,
  },
  supportedText: {
    fontSize: 11,
    color: '#556947',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  confirmBtn: {
    width: '100%',
    maxWidth: 340,
    height: 52,
    backgroundColor: '#445738',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#203010',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  backLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backLinkText: {
    fontSize: 13,
    color: '#445738',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#334220',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
});

