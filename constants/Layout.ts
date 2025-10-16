import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  window: {
    width,
    height,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },

  buttonHeight: {
    sm: 36,
    md: 48,
    lg: 56,
  },

  inputHeight: {
    sm: 40,
    md: 48,
    lg: 56,
  },
};
