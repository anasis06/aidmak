import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

export default function WardrobeScreen() {
  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Wardrobe</Text>
        <Text style={styles.subtitle}>Your digital closet</Text>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
  },

  title: {
    fontSize: Fonts.sizes.xxxl,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },

  subtitle: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.secondary,
  },
});
