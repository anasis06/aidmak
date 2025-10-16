export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const FontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const LineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
};

export const Fonts = {
  sizes: FontSizes,
  weights: FontWeights,
  lineHeights: LineHeights,
};
