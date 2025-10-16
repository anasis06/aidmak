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

interface Measurements {
  chest: string;
  waist: string;
  hips: string;
}

interface ValidationErrors {
  chest: string;
  waist: string;
  hips: string;
}

const MIN_MEASUREMENT = 30;
const MAX_MEASUREMENT = 200;

export default function BodyMeasurementsScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [measurements, setMeasurements] = useState<Measurements>({
    chest: '',
    waist: '',
    hips: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({
    chest: '',
    waist: '',
    hips: '',
  });

  const handleContinue = () => {
    updateProfile({
      bodyMeasurements: {
        chest: parseFloat(measurements.chest) || 0,
        waist: parseFloat(measurements.waist) || 0,
        hips: parseFloat(measurements.hips) || 0,
      },
    });
    router.push('/profileSetup/SkinToneScreen');
  };

  const validateMeasurement = (field: keyof Measurements, value: string): string => {
    if (!value) {
      return '';
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      return 'Please enter a valid number';
    }

    if (numValue < MIN_MEASUREMENT) {
      return `Measurement must be at least ${MIN_MEASUREMENT}cm`;
    }

    if (numValue > MAX_MEASUREMENT) {
      return `Measurement must be less than ${MAX_MEASUREMENT}cm`;
    }

    return '';
  };

  const updateMeasurement = (field: keyof Measurements, value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');

    setMeasurements((prev) => ({
      ...prev,
      [field]: numericValue,
    }));

    const error = validateMeasurement(field, numericValue);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const isFormValid =
    measurements.chest &&
    measurements.waist &&
    measurements.hips &&
    !errors.chest &&
    !errors.waist &&
    !errors.hips;

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <ProgressBar progress={4} total={5} />
      </View>

      <View style={styles.container}>
        <View style={styles.contentSection}>
          <Text style={styles.title}>Body measurements</Text>

          <View style={styles.formContainer}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Chest</Text>
              <View style={[styles.inputContainer, errors.chest && styles.inputContainerError]}>
                <TextInput
                  style={styles.input}
                  value={measurements.chest}
                  onChangeText={(value) => updateMeasurement('chest', value)}
                  placeholder="Cm"
                  placeholderTextColor={Colors.text.tertiary}
                  keyboardType="numeric"
                />
              </View>
              {errors.chest ? <Text style={styles.errorText}>{errors.chest}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Waist</Text>
              <View style={[styles.inputContainer, errors.waist && styles.inputContainerError]}>
                <TextInput
                  style={styles.input}
                  value={measurements.waist}
                  onChangeText={(value) => updateMeasurement('waist', value)}
                  placeholder="Cm"
                  placeholderTextColor={Colors.text.tertiary}
                  keyboardType="numeric"
                />
              </View>
              {errors.waist ? <Text style={styles.errorText}>{errors.waist}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Hips</Text>
              <View style={[styles.inputContainer, errors.hips && styles.inputContainerError]}>
                <TextInput
                  style={styles.input}
                  value={measurements.hips}
                  onChangeText={(value) => updateMeasurement('hips', value)}
                  placeholder="Cm"
                  placeholderTextColor={Colors.text.tertiary}
                  keyboardType="numeric"
                />
              </View>
              {errors.hips ? <Text style={styles.errorText}>{errors.hips}</Text> : null}
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleContinue}
            variant="primary"
            size="large"
            disabled={!isFormValid}
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

  formContainer: {
    gap: Layout.spacing.lg,
  },

  fieldGroup: {
    gap: Layout.spacing.sm,
  },

  label: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.primary,
  },

  inputContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.xl,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.lg,
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  },

  inputContainerError: {
    borderColor: Colors.status.error,
  },

  input: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.primary,
    fontWeight: Fonts.weights.medium,
  },

  errorText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.status.error,
    marginTop: Layout.spacing.xs,
    marginLeft: Layout.spacing.sm,
  },

  buttonContainer: {
    paddingBottom: Layout.spacing.xl,
  },
});
