import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  Text,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { AppAssets } from '../../assets';
import { colors } from '../../theme/colors';

const SPLASH_SLIDES = [
  AppAssets.onboarding1,
  AppAssets.onboarding2,
  AppAssets.onboarding3,
];

export const OnboardingScreen: React.FC = () => {
  const { navigate } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [layoutWidth, setLayoutWidth] = useState<number>(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== layoutWidth) {
      setLayoutWidth(w);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (layoutWidth <= 0) return;
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / layoutWidth);
    if (index !== currentIndex && index >= 0 && index < SPLASH_SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const goToSlide = (index: number) => {
    if (layoutWidth <= 0) return;
    scrollRef.current?.scrollTo({ x: index * layoutWidth, animated: true });
    setCurrentIndex(index);
  };

  const handleScreenTap = () => {
    if (currentIndex < SPLASH_SLIDES.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      navigate('LoginLanding');
    }
  };

  return (
    <LinearGradient
      colors={colors.splashGradient}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      onLayout={handleLayout}
    >
      <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
        {/* Subtle Top Skip Button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('LoginLanding')}
            style={styles.skipBtn}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Paging Carousel matching Figma 1:1 */}
        {layoutWidth > 0 && (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}
            style={styles.scrollView}
          >
            {SPLASH_SLIDES.map((slideImg, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.96}
                onPress={handleScreenTap}
                style={[styles.slidePage, { width: layoutWidth }]}
              >
                <Image
                  source={slideImg}
                  style={styles.slideImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Interactive Touch Overlay for the 3 Figma Pagination Dots */}
        <View style={styles.dotsTouchRow} pointerEvents="box-none">
          {SPLASH_SLIDES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => goToSlide(i)}
              activeOpacity={0.7}
              style={styles.dotHitArea}
            />
          ))}
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    position: 'relative',
  },
  topBar: {
    position: 'absolute',
    top: 44,
    right: 20,
    zIndex: 20,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  slidePage: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  dotsTouchRow: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    zIndex: 15,
  },
  dotHitArea: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
