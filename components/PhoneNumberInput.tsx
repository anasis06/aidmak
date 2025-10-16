import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
];

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
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[styles.countrySelector, error && styles.inputError]}
          onPress={() => setModalVisible(true)}
        >
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

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.countryList}>
              {COUNTRIES.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={styles.countryItem}
                  onPress={() => handleCountrySelect(country)}
                >
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <Text style={styles.countryName}>{country.name}</Text>
                  <Text style={styles.countryDialCode}>{country.dialCode}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    minWidth: 80,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay.dark,
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: Colors.background.secondary,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    maxHeight: '70%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  modalTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.primary,
  },

  modalClose: {
    fontSize: Fonts.sizes.base,
    color: Colors.primary.purple,
    fontWeight: Fonts.weights.semibold,
  },

  countryList: {
    flex: 1,
  },

  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  countryFlag: {
    fontSize: 24,
  },

  countryName: {
    flex: 1,
    fontSize: Fonts.sizes.base,
    color: Colors.text.primary,
  },

  countryDialCode: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.secondary,
    fontWeight: Fonts.weights.medium,
  },
});
