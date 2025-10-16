import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useUser } from '@/hooks/useUser';

type SkinTone = 'fair' | 'medium' | 'dusky' | 'dark';

interface SkinToneOption {
  id: SkinTone;
  label: string;
  image: any;
}

const skinToneOptions: SkinToneOption[] = [
  {
    id: 'fair',
    label: 'Fair',
    image: require('@/assets/images/avatar-fair.png'),
  },
  {
    id: 'medium',
    label: 'Medium',
    image: require('@/assets/images/avatar-medium.png'),
  },
  {
    id: 'dusky',
    label: 'Dusky',
    image: require('@/assets/images/avatar-medium.png'),
  },
  {
    id: 'dark',
    label: 'Dark',
    image: require('@/assets/images/avatar-dark.png'),
  },
];

export default function SkinToneScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [selectedTone, setSelectedTone] = useState<SkinTone | null>(null);

  const handleContinue = () => {
    if (selectedTone) {
      updateProfile({ skinTone: selectedTone });
      router.push('/(tabs)');
    }
  };

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <ProgressBar progress={5} total={5} />
      </View>

      <View style={styles.container}>
        <View style={styles.contentSection}>
          <Text style={styles.title}>What is your skin color?</Text>

          <View style={styles.optionsContainer}>
            {skinToneOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.option, selectedTone === option.id && styles.selectedOption]}
                onPress={() => setSelectedTone(option.id)}
                activeOpacity={0.7}
              >
                <Image source={option.image} style={styles.avatar} resizeMode="cover" />
                <Text style={styles.optionText}>{option.label}</Text>
                <View style={[styles.radio, selectedTone === option.id && styles.radioSelected]}>
                  {selectedTone === option.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleContinue}
            variant="primary"
            size="large"
            disabled={!selectedTone}
          />
        </View>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background.primary,
  },

  header: {
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.lg,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    paddingLeft: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },

  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    justifyContent: 'space-between',
  },

  contentSection: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xxl,
    marginTop: Layout.spacing.lg,
  },

  optionsContainer: {
    gap: Layout.spacing.md,
  },

  option: {
    height: 80,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.background.secondary,
  },

  selectedOption: {
    borderColor: Colors.background.secondary,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Layout.spacing.md,
  },

  optionText: {
    flex: 1,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.primary,
  },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.text.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioSelected: {
    borderColor: Colors.primary.purple,
  },

  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary.purple,
  },

  buttonContainer: {
    paddingBottom: Layout.spacing.xl,
  },
});
