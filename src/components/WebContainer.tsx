import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions, SafeAreaView } from 'react-native';

interface WebContainerProps {
  children: ReactNode;
}

export const WebContainer: React.FC<WebContainerProps> = ({ children }) => {
  const { width } = useWindowDimensions();
  const isWebDesktop = Platform.OS === 'web' && width > 500;

  if (!isWebDesktop) {
    return <View style={{ flex: 1 }}>{children}</View>;
  }

  return (
    <View style={styles.webBackdrop}>
      <View style={styles.phoneFrame}>
        <SafeAreaView style={styles.phoneInner}>{children}</SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    backgroundColor: '#3d4f2f',
  },
  webBackdrop: {
    flex: 1,
    minHeight: '100%' as any,
    backgroundColor: '#232f1b',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  phoneFrame: {
    width: 430,
    height: 932,
    maxHeight: '96vh' as any,
    borderRadius: 44,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 20,
    borderWidth: 8,
    borderColor: '#1e2817',
  },
  phoneInner: {
    flex: 1,
    backgroundColor: '#fbfad3',
  },
});
