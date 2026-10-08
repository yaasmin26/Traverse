import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 6,
}) => {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.text}>{`${currentStep}/${totalSteps}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    paddingHorizontal: 20,
  },
  track: {
    flex: 1,
    height: 10,
    backgroundColor: '#e7ecce',
    borderRadius: 5,
    overflow: 'hidden',
    maxWidth: 240,
  },
  fill: {
    height: '100%',
    backgroundColor: '#86a761',
    borderRadius: 5,
  },
  text: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
