import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: 'ticket' | 'calendar' | 'bookmark' | 'none';
  onRightPress?: () => void;
  variant?: 'light' | 'dark';
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightIcon = 'none',
  onRightPress,
  variant = 'dark',
}) => {
  const isLight = variant === 'light';
  const textColor = isLight ? colors.textCream : colors.primaryDark;
  const subtitleColor = isLight ? '#d2e2bd' : colors.primaryDark;

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={28} color={textColor} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>

      {rightIcon !== 'none' && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onRightPress}
          style={styles.rightButton}
        >
          {rightIcon === 'ticket' && (
            <MaterialCommunityIcons name="ticket-outline" size={32} color={textColor} />
          )}
          {rightIcon === 'calendar' && (
            <Ionicons name="calendar-outline" size={28} color={textColor} />
          )}
          {rightIcon === 'bookmark' && (
            <Ionicons name="bookmark-outline" size={28} color={textColor} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 10,
    padding: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '400',
  },
  rightButton: {
    padding: 4,
    marginLeft: 12,
  },
});
