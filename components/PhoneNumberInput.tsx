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
import { ChevronDown } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { COUNTRIES, Country } from '@/constants/Countries';
import CountryCodeModal from './CountryCodeModal';

interface PhoneNumberInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  value: string;
  onChangeText: (phone: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  error,
  containerStyle,
  value,
  onChangeText,
  countryCode,
  onCountryCodeChange,
  ...props
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedCountry = COUNTRIES.find(c => c.dialCode === countryCode) || COUNTRIES[0];

  const handleCountrySelect = (country: Country) => {
    onCountryCodeChange(country.dialCode);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[styles.countrySelector, error && styles.inputError]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.countryCode}>{selectedCountry.dialCode}</Text>
          <ChevronDown size={16} color={Colors.text.tertiary} />
        </TouchableOpacity>

        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholderTextColor={Colors.text.tertiary}
          keyboardType="phone-pad"
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <CountryCodeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleCountrySelect}
        selectedDialCode={countryCode}
      />
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

  inputRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },

  countrySelector: {
    height: Layout.inputHeight.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.lg,
    paddingHorizontal: Layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border.light,
    minWidth: 100,
  },

  flag: {
    fontSize: 20,
  },

  countryCode: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.primary,
    fontWeight: Fonts.weights.medium,
  },

  input: {
    flex: 1,
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

  errorText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.status.error,
    marginTop: Layout.spacing.xs,
  },
});
