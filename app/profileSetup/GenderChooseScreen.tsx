import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useProfileSetup } from '@/context/ProfileSetupContext';

export default function GenderChooseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const { updateProfileData } = useProfileSetup();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other' | null>(null);

  const handleContinue = () => {
    if (selectedGender) {
      updateProfileData({ gender: selectedGender });
      router.push({
        pathname: '/profileSetup/HeightScreen',
        params: { userId }
      });
    }
  };

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <ProgressBar progress={1} total={7} />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>What's your gender?</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.option, selectedGender === 'male' && styles.selectedOption]}
            onPress={() => setSelectedGender('male')}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>Male</Text>
            <View style={[styles.radio, selectedGender === 'male' && styles.radioSelected]}>
              {selectedGender === 'male' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, selectedGender === 'female' && styles.selectedOption]}
            onPress={() => setSelectedGender('female')}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>Female</Text>
            <View style={[styles.radio, selectedGender === 'female' && styles.radioSelected]}>
              {selectedGender === 'female' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, selectedGender === 'other' && styles.selectedOption]}
            onPress={() => setSelectedGender('other')}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>Other</Text>
            <View style={[styles.radio, selectedGender === 'other' && styles.radioSelected]}>
              {selectedGender === 'other' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleContinue}
            variant="primary"
            size="large"
            disabled={!selectedGender}
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

  title: {
    fontSize: 28,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xxl,
    marginTop: Layout.spacing.lg,
  },

  optionsContainer: {
    flex: 1,
    gap: Layout.spacing.md,
  },

  option: {
    height: 70,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.background.secondary,
  },

  selectedOption: {
    borderColor: Colors.background.secondary,
  },

  optionText: {
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
