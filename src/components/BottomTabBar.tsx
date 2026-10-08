import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect, Line, Circle, Text as SvgText } from 'react-native-svg';
import { useApp, TabName } from '../context/AppContext';

// Figma Icons Reconstructed with Crisp Vector Graphics

const HomeIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Path
      d="M4.5 12.5L14 4.5L23.5 12.5V22.5C23.5 23.3 22.8 24 22 24H6C5.2 24 4.5 23.3 4.5 22.5V12.5Z"
      stroke={color}
      strokeWidth={2.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11 24V16.5C11 16 11.4 15.5 12 15.5H16C16.6 15.5 17 16 17 16.5V24"
      stroke={color}
      strokeWidth={2.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CalendarIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Rect
      x="4.5"
      y="6.5"
      width="19"
      height="17.5"
      rx="4.5"
      stroke={color}
      strokeWidth={2.3}
    />
    <Line x1="9" y1="3" x2="9" y2="7" stroke={color} strokeWidth={2.3} strokeLinecap="round" />
    <Line x1="19" y1="3" x2="19" y2="7" stroke={color} strokeWidth={2.3} strokeLinecap="round" />
    <Line x1="4.5" y1="11.5" x2="23.5" y2="11.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    <SvgText
      x="14"
      y="18.5"
      fontSize="9.5"
      fontWeight="700"
      fill={color}
      textAnchor="middle"
      fontFamily="sans-serif"
    >
      11
    </SvgText>
  </Svg>
);

const TicketIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={30} height={26} viewBox="0 0 30 26" fill="none">
    <Path
      d="M4.5 3.5H12C12.2 5.8 13.3 6.8 15 6.8C16.7 6.8 17.8 5.8 18 3.5H25.5C26.6 3.5 27.5 4.4 27.5 5.5V20.5C27.5 21.6 26.6 22.5 25.5 22.5H18C17.8 20.2 16.7 19.2 15 19.2C13.3 19.2 12.2 20.2 12 22.5H4.5C3.4 22.5 2.5 21.6 2.5 20.5V5.5C2.5 4.4 3.4 3.5 4.5 3.5Z"
      stroke={color}
      strokeWidth={2.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="15" cy="10" r="1.1" fill={color} />
    <Circle cx="15" cy="13" r="1.1" fill={color} />
    <Circle cx="15" cy="16" r="1.1" fill={color} />
  </Svg>
);

const PromoIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
    <Path
      d="M15 2.5C16.3 2.5 17.5 3.6 18.7 4C19.9 4.4 21.3 4 22.4 4.8C23.5 5.6 24 7 24.9 8C25.8 9 27.2 9.5 27.7 10.7C28.2 11.9 27.8 13.3 28.1 14.6C28.4 15.9 27.8 17.3 27.3 18.5C26.8 19.7 25.3 20.2 24.4 21.2C23.5 22.2 22.9 23.5 21.8 24.3C20.7 25.1 19.3 24.7 18.1 25.1C16.9 25.5 15.7 26.5 14.5 26.5C13.3 26.5 12.1 25.5 10.9 25.1C9.7 24.7 8.3 25.1 7.2 24.3C6.1 23.5 5.5 22.2 4.6 21.2C3.7 20.2 2.2 19.7 1.7 18.5C1.2 17.3 1.6 15.9 1.9 14.6C2.2 13.3 1.8 11.9 2.3 10.7C2.8 9.5 4.2 9 5.1 8C6 7 6.5 5.6 7.6 4.8C8.7 4 10.1 4.4 11.3 4C12.5 3.6 13.7 2.5 15 2.5Z"
      stroke={color}
      strokeWidth={2.1}
      strokeLinejoin="round"
    />
    <Line x1="19.5" y1="10.5" x2="10.5" y2="19.5" stroke={color} strokeWidth={2.1} strokeLinecap="round" />
    <Circle cx="11.5" cy="11.5" r="1.6" fill={color} />
    <Circle cx="18.5" cy="18.5" r="1.6" fill={color} />
  </Svg>
);

const ProfileIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Circle cx="14" cy="9.5" r="4.3" stroke={color} strokeWidth={2.3} />
    <Path
      d="M5.5 23.5C5.5 19 9.5 16.5 14 16.5C18.5 16.5 22.5 19 22.5 23.5"
      stroke={color}
      strokeWidth={2.3}
      strokeLinecap="round"
    />
  </Svg>
);

interface TabItemConfig {
  key: TabName;
  icon: (color: string) => React.ReactNode;
}

const TABS: TabItemConfig[] = [
  { key: 'home', icon: (color) => <HomeIcon color={color} /> },
  { key: 'calendar', icon: (color) => <CalendarIcon color={color} /> },
  { key: 'ticket', icon: (color) => <TicketIcon color={color} /> },
  { key: 'promo', icon: (color) => <PromoIcon color={color} /> },
  { key: 'profile', icon: (color) => <ProfileIcon color={color} /> },
];

const PILL_SIZE = 54;

export const BottomTabBar: React.FC = () => {
  const { currentTab, setTab } = useApp();
  const [containerWidth, setContainerWidth] = useState<number>(382);

  // Tab index: 0..4
  const activeIndex = TABS.findIndex((t) => t.key === currentTab);
  const slideAnim = useRef(new Animated.Value(activeIndex >= 0 ? activeIndex : 0)).current;

  useEffect(() => {
    if (activeIndex >= 0) {
      Animated.spring(slideAnim, {
        toValue: activeIndex,
        friction: 7.5,
        tension: 65,
        useNativeDriver: false,
      }).start();
    }
  }, [activeIndex]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && Math.abs(width - containerWidth) > 1) {
      setContainerWidth(width);
    }
  };

  const tabWidth = containerWidth / 5;
  const pillLeft = slideAnim.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [
      (tabWidth - PILL_SIZE) / 2,
      tabWidth + (tabWidth - PILL_SIZE) / 2,
      tabWidth * 2 + (tabWidth - PILL_SIZE) / 2,
      tabWidth * 3 + (tabWidth - PILL_SIZE) / 2,
      tabWidth * 4 + (tabWidth - PILL_SIZE) / 2,
    ],
  });

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View style={styles.barShadowWrapper}>
        <LinearGradient
          colors={[
            'rgba(255, 255, 248, 0.95)',
            'rgba(240, 248, 226, 0.88)',
            'rgba(220, 238, 200, 0.94)',
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.glassContainer}
          onLayout={handleLayout}
        >
          {/* Glass Top Highlight Line */}
          <View style={styles.glossHighlight} />

          {/* Animated Liquid Dark Olive Pill Indicator */}
          <Animated.View
            style={[
              styles.activePill,
              {
                left: pillLeft,
              },
            ]}
          />

          {/* 5 Tabs */}
          <View style={styles.tabsRow}>
            {TABS.map((tab, index) => {
              const isActive = activeIndex === index;
              const iconColor = isActive ? '#faf9d4' : '#384826';

              return (
                <TouchableOpacity
                  key={tab.key}
                  activeOpacity={0.75}
                  onPress={() => setTab(tab.key)}
                  style={styles.tabButton}
                >
                  <View style={styles.iconContainer}>{tab.icon(iconColor)}</View>
                </TouchableOpacity>
              );
            })}
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  barShadowWrapper: {
    width: 382,
    maxWidth: '92%',
    borderRadius: 36,
    shadowColor: '#1d2712',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
  },
  glassContainer: {
    height: 70,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        } as any)
      : {}),
  },
  glossHighlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 1,
  },
  activePill: {
    position: 'absolute',
    width: PILL_SIZE,
    height: PILL_SIZE,
    borderRadius: PILL_SIZE / 2,
    backgroundColor: '#384826',
    top: (70 - PILL_SIZE) / 2,
    shadowColor: '#1a2510',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 7,
    elevation: 6,
  },
  tabsRow: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconContainer: {
    width: PILL_SIZE,
    height: PILL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
