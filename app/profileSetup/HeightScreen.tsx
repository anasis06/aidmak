import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useUser } from '@/hooks/useUser';

type Unit = 'CM' | 'FT';

const CM_MIN = 100;
const CM_MAX = 250;

export default function HeightScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [unit, setUnit] = useState<Unit>('CM');
  const [heightInput, setHeightInput] = useState('');
  const [error, setError] = useState('');

  const validateHeight = (value: string): boolean => {
    if (!value) {
      setError('');
      return false;
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return false;
    }

    if (numValue < CM_MIN) {
      setError(`Height must be at least ${CM_MIN}cm`);
      return false;
    }

    if (numValue > CM_MAX) {
      setError(`Height must be less than ${CM_MAX}cm`);
      return false;
    }

    setError('');
    return true;
  };

  const handleHeightChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setHeightInput(numericValue);
    validateHeight(numericValue);
  };

  const handleContinue = () => {
    const heightCm = parseFloat(heightInput);
    updateProfile({ height: heightCm });
    router.push('/profileSetup/WeightScreen');
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
  };

  const isValid = heightInput && !error;

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <ProgressBar progress={2} total={5} />
      </View>

      <View style={styles.container}>
        <View style={styles.contentSection}>
          <Text style={styles.title}>What's your current height?</Text>

          <View style={styles.unitToggle}>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'CM' && styles.unitButtonActive]}
              onPress={() => handleUnitChange('CM')}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitButtonText, unit === 'CM' && styles.unitButtonTextActive]}>
                CM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'FT' && styles.unitButtonActive]}
              onPress={() => handleUnitChange('FT')}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitButtonText, unit === 'FT' && styles.unitButtonTextActive]}>
                FT
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <View style={[styles.inputContainer, error && styles.inputContainerError]}>
              <TextInput
                style={styles.input}
                value={heightInput}
                onChangeText={handleHeightChange}
                placeholder="Enter height"
                placeholderTextColor={Colors.text.tertiary}
                keyboardType="numeric"
              />
              <Text style={styles.inputUnit}>{unit.toLowerCase()}</Text>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleContinue}
            variant="primary"
            size="large"
            disabled={!isValid}
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

  unitToggle: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.lg,
    padding: 4,
    marginBottom: Layout.spacing.xxl * 2,
  },

  unitButton: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: Layout.borderRadius.md,
  },

  unitButtonActive: {
    backgroundColor: Colors.primary.purple,
  },

  unitButtonText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.secondary,
  },

  unitButtonTextActive: {
    color: Colors.text.primary,
  },

  inputSection: {
    gap: Layout.spacing.sm,
  },

  inputContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.xl,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  },

  inputContainerError: {
    borderColor: '#ff334b',
  },

  input: {
    flex: 1,
    fontSize: Fonts.sizes.base,
    color: Colors.text.primary,
    fontWeight: Fonts.weights.medium,
  },

  inputUnit: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.secondary,
    fontWeight: Fonts.weights.medium,
    marginLeft: Layout.spacing.sm,
  },

  errorText: {
    fontSize: Fonts.sizes.sm,
    color: '#ff334b',
    marginTop: Layout.spacing.xs,
    marginLeft: Layout.spacing.sm,
  },

  buttonContainer: {
    paddingBottom: Layout.spacing.xl,
  },
});
