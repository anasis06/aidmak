import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

interface LoaderProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  message,
  size = 'large',
  color = Colors.primary.purple,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },

  message: {
    marginTop: Layout.spacing.md,
    fontSize: Fonts.sizes.base,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
