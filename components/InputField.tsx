import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  isPassword?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  containerStyle,
  isPassword = false,
  ...props
}) => {
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholderTextColor={Colors.text.tertiary}
          secureTextEntry={isSecure}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsSecure(!isSecure)}
          >
            {isSecure ? (
              <EyeOff size={20} color={Colors.text.tertiary} />
            ) : (
              <Eye size={20} color={Colors.text.tertiary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Layout.spacing.md,
  },

  label: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },

  inputContainer: {
    position: 'relative',
    width: '100%',
  },

  input: {
    width: '100%',
    height: Layout.inputHeight.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.lg,
    paddingHorizontal: Layout.spacing.md,
    fontSize: Fonts.sizes.base,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },

  inputError: {
    borderColor: Colors.status.error,
  },

  iconContainer: {
    position: 'absolute',
    right: Layout.spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },

  errorText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.status.error,
    marginTop: Layout.spacing.xs,
  },
});
