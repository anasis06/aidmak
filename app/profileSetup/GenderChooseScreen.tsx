import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useUser } from '@/hooks/useUser';

export default function GenderChooseScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other' | null>(null);

  const handleContinue = () => {
    if (selectedGender) {
      updateProfile({ gender: selectedGender });
      router.push('/profileSetup/HeightScreen');
    }
  };

  return (
    <SafeAreaContainer>
      <Header
        title="Choose Gender"
        showBackButton
        onBackPress={() => router.back()}
      />
      <View style={styles.container}>
        <Text style={styles.title}>What's your gender?</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.option, selectedGender === 'male' && styles.selectedOption]}
            onPress={() => setSelectedGender('male')}
          >
            <Text style={[styles.optionText, selectedGender === 'male' && styles.selectedOptionText]}>
              Male
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, selectedGender === 'female' && styles.selectedOption]}
            onPress={() => setSelectedGender('female')}
          >
            <Text style={[styles.optionText, selectedGender === 'female' && styles.selectedOptionText]}>
              Female
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, selectedGender === 'other' && styles.selectedOption]}
            onPress={() => setSelectedGender('other')}
          >
            <Text style={[styles.optionText, selectedGender === 'other' && styles.selectedOptionText]}>
              Other
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          size="large"
          disabled={!selectedGender}
        />
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xl,
  },

  title: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xxl,
  },

  optionsContainer: {
    flex: 1,
    gap: Layout.spacing.md,
  },

  option: {
    height: 80,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.light,
  },

  selectedOption: {
    borderColor: Colors.primary.purple,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },

  optionText: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.secondary,
  },

  selectedOptionText: {
    color: Colors.primary.purple,
  },
});
