import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? Colors.primary.purple : Colors.text.primary}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Layout.borderRadius.xl,
  },

  primary: {
    backgroundColor: Colors.primary.purple,
  },

  secondary: {
    backgroundColor: Colors.background.secondary,
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.purple,
  },

  small: {
    height: Layout.buttonHeight.sm,
    paddingHorizontal: Layout.spacing.md,
  },

  medium: {
    height: Layout.buttonHeight.md,
    paddingHorizontal: Layout.spacing.lg,
  },

  large: {
    height: Layout.buttonHeight.lg,
    paddingHorizontal: Layout.spacing.xl,
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    fontWeight: Fonts.weights.semibold,
  },

  primaryText: {
    color: Colors.text.primary,
    fontSize: Fonts.sizes.base,
  },

  secondaryText: {
    color: Colors.text.primary,
    fontSize: Fonts.sizes.base,
  },

  outlineText: {
    color: Colors.primary.purple,
    fontSize: Fonts.sizes.base,
  },

  smallText: {
    fontSize: Fonts.sizes.sm,
  },

  mediumText: {
    fontSize: Fonts.sizes.base,
  },

  largeText: {
    fontSize: Fonts.sizes.lg,
  },
});
