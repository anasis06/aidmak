import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
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
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
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

          <View style={styles.bottomIndicator} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },

  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  header: {
    paddingVertical: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.lg,
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    marginHorizontal: Layout.spacing.lg,
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
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },

  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: 8,
  },

  countryItemSelected: {
    backgroundColor: '#1C1C1E',
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

  bottomIndicator: {
    height: 5,
    width: 134,
    backgroundColor: Colors.text.primary,
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: Layout.spacing.sm,
  },
});
