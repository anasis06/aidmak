import { StyleSheet } from 'react-native';
import { Colors } from './Colors';
import { Fonts } from './Fonts';
import { Layout } from './Layout';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  paddingHorizontal: {
    paddingHorizontal: Layout.spacing.lg,
  },

  paddingVertical: {
    paddingVertical: Layout.spacing.lg,
  },

  heading1: {
    fontSize: Fonts.sizes.xxxl,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    lineHeight: Fonts.sizes.xxxl * Fonts.lineHeights.tight,
  },

  heading2: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    lineHeight: Fonts.sizes.xxl * Fonts.lineHeights.tight,
  },

  heading3: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.primary,
    lineHeight: Fonts.sizes.xl * Fonts.lineHeights.normal,
  },

  bodyLarge: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.primary,
    lineHeight: Fonts.sizes.lg * Fonts.lineHeights.normal,
  },

  bodyMedium: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.primary,
    lineHeight: Fonts.sizes.base * Fonts.lineHeights.normal,
  },

  bodySmall: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.secondary,
    lineHeight: Fonts.sizes.sm * Fonts.lineHeights.normal,
  },

  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
