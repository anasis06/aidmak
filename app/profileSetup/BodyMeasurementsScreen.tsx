import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useProfileSetup } from '@/context/ProfileSetupContext';
import { profileService } from '@/services/profileService';

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
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const fromPreferences = params.fromPreferences as string;
  const { updateProfileData } = useProfileSetup();
  const [measurements, setMeasurements] = useState<Measurements>({
    chest: '',
    waist: '',
    hips: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(fromPreferences === 'true');

  const [errors, setErrors] = useState<ValidationErrors>({
    chest: '',
    waist: '',
    hips: '',
  });

  useEffect(() => {
    if (fromPreferences === 'true') {
      loadExistingMeasurements();
    }
  }, []);

  const loadExistingMeasurements = async () => {
    try {
      const profile = await profileService.getProfile(userId);
      if (profile) {
        setMeasurements({
          chest: profile.chest_measurement?.toString() || '',
          waist: profile.waist_measurement?.toString() || '',
          hips: profile.hips_measurement?.toString() || '',
        });
      }
    } catch (error) {
      console.error('Error loading measurements:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleContinue = async () => {
    if (fromPreferences === 'true') {
      setLoading(true);
      try {
        await profileService.updateProfile(userId, {
          chest_measurement: parseFloat(measurements.chest),
          waist_measurement: parseFloat(measurements.waist),
          hips_measurement: parseFloat(measurements.hips),
        });
        router.back();
      } catch (error) {
        console.error('Error updating measurements:', error);
      } finally {
        setLoading(false);
      }
    } else {
      updateProfileData({
        chestMeasurement: parseFloat(measurements.chest),
        waistMeasurement: parseFloat(measurements.waist),
        hipsMeasurement: parseFloat(measurements.hips),
      });
      router.push({
        pathname: '/profileSetup/SkinToneScreen',
        params: { userId }
      });
    }
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

  if (initialLoading) {
    return (
      <SafeAreaContainer style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.purple} />
        </View>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          {fromPreferences === 'true' && (
            <TouchableOpacity
              onPress={handleContinue}
              style={styles.saveButton}
              disabled={!isFormValid || loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.primary.purple} />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
        {fromPreferences !== 'true' && <ProgressBar progress={4} total={8} />}
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
          {loading ? (
            <View style={styles.buttonLoading}>
              <ActivityIndicator size="small" color={Colors.primary.purple} />
            </View>
          ) : (
            <Button
              title={fromPreferences === 'true' ? 'Save' : 'Next'}
              onPress={handleContinue}
              variant="primary"
              size="large"
              disabled={!isFormValid}
            />
          )}
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

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  saveButton: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    color: Colors.primary.purple,
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonLoading: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.xl,
  },
});
