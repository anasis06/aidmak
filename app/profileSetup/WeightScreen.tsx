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

type Unit = 'KG' | 'LB';

const KG_MIN = 20;
const KG_MAX = 300;

export default function WeightScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [unit, setUnit] = useState<Unit>('KG');
  const [weightInput, setWeightInput] = useState('');
  const [error, setError] = useState('');

  const validateWeight = (value: string): boolean => {
    if (!value) {
      setError('');
      return false;
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return false;
    }

    if (numValue < KG_MIN) {
      setError(`Weight must be at least ${KG_MIN}kg`);
      return false;
    }

    if (numValue > KG_MAX) {
      setError(`Weight must be less than ${KG_MAX}kg`);
      return false;
    }

    setError('');
    return true;
  };

  const handleWeightChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setWeightInput(numericValue);
    validateWeight(numericValue);
  };

  const handleContinue = () => {
    const weightKg = parseFloat(weightInput);
    updateProfile({ weight: weightKg });
    router.push('/profileSetup/BodyMeasurementsScreen');
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
  };

  const isValid = weightInput && !error;

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <ProgressBar progress={3} total={5} />
      </View>

      <View style={styles.container}>
        <View style={styles.contentSection}>
          <Text style={styles.title}>What's your current weight?</Text>

          <View style={styles.unitToggle}>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'KG' && styles.unitButtonActive]}
              onPress={() => handleUnitChange('KG')}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitButtonText, unit === 'KG' && styles.unitButtonTextActive]}>
                KG
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'LB' && styles.unitButtonActive]}
              onPress={() => handleUnitChange('LB')}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitButtonText, unit === 'LB' && styles.unitButtonTextActive]}>
                LB
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <View style={[styles.inputContainer, error && styles.inputContainerError]}>
              <TextInput
                style={styles.input}
                value={weightInput}
                onChangeText={handleWeightChange}
                placeholder="Enter weight"
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
