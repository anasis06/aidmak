import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

interface SafeAreaContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}

export const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
  children,
  style,
  backgroundColor = Colors.background.primary,
  edges = ['top', 'right', 'bottom', 'left'],
}) => {
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
