import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { COUNTRIES, Country } from '@/constants/Countries';

interface CountryCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
  selectedDialCode?: string;
}

export default function CountryCodeModal({
  visible,
  onClose,
  onSelect,
  selectedDialCode,
}: CountryCodeModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return COUNTRIES;
    }

    const query = searchQuery.toLowerCase();
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dialCode.includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectCountry = (country: Country) => {
    onSelect(country);
    setSearchQuery('');
    onClose();
  };

  const renderCountryItem = ({ item }: { item: Country }) => {
    const isSelected = item.dialCode === selectedDialCode;

    return (
      <TouchableOpacity
        style={[styles.countryItem, isSelected && styles.countryItemSelected]}
        onPress={() => handleSelectCountry(item)}
        activeOpacity={0.7}
      >
        <View style={styles.countryLeft}>
          <Text style={styles.flagEmoji}>{item.flag}</Text>
          <Text style={styles.countryName}>{item.name}</Text>
        </View>
        <Text style={styles.dialCode}>{item.dialCode}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose your Country</Text>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={Colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <FlatList
            data={filteredCountries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.code}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={10}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },

  modalContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.xxl,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
  },

  header: {
    paddingTop: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.spacing.lg,
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 30,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.lg,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    height: 44,
  },

  searchIcon: {
    marginRight: Layout.spacing.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: Fonts.sizes.base,
    color: Colors.text.primary,
    paddingVertical: 0,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.spacing.md,
  },

  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },

  countryItemSelected: {
    backgroundColor: Colors.background.secondary,
  },

  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  flagEmoji: {
    fontSize: 24,
    marginRight: Layout.spacing.md,
  },

  countryName: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.primary,
    fontWeight: Fonts.weights.medium,
    flex: 1,
  },

  dialCode: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.primary,
    fontWeight: Fonts.weights.medium,
    marginLeft: Layout.spacing.md,
  },

  closeButton: {
    height: 56,
    borderRadius: Layout.borderRadius.xl,
    backgroundColor: Colors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Layout.spacing.xl,
    marginVertical: Layout.spacing.lg,
  },

  closeButtonText: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },
});
