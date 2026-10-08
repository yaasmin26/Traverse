import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface AppInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  prefix?: React.ReactNode;
  containerStyle?: ViewStyle;
  variant?: 'white' | 'cream';
  editable?: boolean;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  rightIconName,
  onRightIconPress,
  prefix,
  containerStyle,
  variant = 'white',
  editable = true,
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          variant === 'cream' ? styles.creamBg : styles.whiteBg,
        ]}
      >
        {prefix}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#a7b399"
          secureTextEntry={secureTextEntry}
          editable={editable}
        />
        {rightIconName && (
          <TouchableOpacity
            disabled={!onRightIconPress}
            onPress={onRightIconPress}
            style={styles.rightIcon}
          >
            <Ionicons name={rightIconName} size={20} color={colors.primaryDark} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  whiteBg: {
    backgroundColor: '#ffffff',
  },
  creamBg: {
    backgroundColor: '#fbf9d4',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textDark,
    height: '100%',
  },
  rightIcon: {
    padding: 4,
    marginLeft: 8,
  },
});
