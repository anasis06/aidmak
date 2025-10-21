import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { HorizontalRuler } from '@/components/HorizontalRuler';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useProfileSetup } from '@/context/ProfileSetupContext';
import { profileService } from '@/services/profileService';

type Unit = 'KG' | 'LB';

const KG_MIN = 20;
const KG_MAX = 300;
const LB_MIN = 44;
const LB_MAX = 660;

const kgToLb = (kg: number): number => {
  return Math.round(kg * 2.20462);
};

const lbToKg = (lb: number): number => {
  return Math.round(lb / 2.20462);
};

export default function WeightScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const fromPreferences = params.fromPreferences as string;
  const { updateProfileData } = useProfileSetup();
  const [unit, setUnit] = useState<Unit>('KG');
  const [weightKg, setWeightKg] = useState(50);
  const [weightLb, setWeightLb] = useState(110);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(fromPreferences === 'true');

  useEffect(() => {
    if (fromPreferences === 'true') {
      loadExistingWeight();
    } else {
      updateProfileData({ weight: weightKg });
    }
  }, []);

  useEffect(() => {
    if (fromPreferences !== 'true') {
      updateProfileData({ weight: weightKg });
    }
  }, [weightKg]);

  const loadExistingWeight = async () => {
    try {
      const profile = await profileService.getProfile(userId);
      if (profile?.weight) {
        setWeightKg(profile.weight);
        setWeightLb(kgToLb(profile.weight));
      }
    } catch (error) {
      console.error('Error loading weight:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleWeightChange = (value: number) => {
    if (unit === 'KG') {
      setWeightKg(value);
      setWeightLb(kgToLb(value));
    } else {
      setWeightLb(value);
      setWeightKg(lbToKg(value));
    }
  };

  const handleContinue = async () => {
    if (fromPreferences === 'true') {
      setLoading(true);
      try {
        await profileService.updateProfile(userId, { weight: weightKg });
        router.back();
      } catch (error) {
        console.error('Error updating weight:', error);
      } finally {
        setLoading(false);
      }
    } else {
      updateProfileData({ weight: weightKg });
      router.push({
        pathname: '/profileSetup/BodyMeasurementsScreen',
        params: { userId },
      });
    }
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
  };

  const displayValue = unit === 'KG' ? weightKg : weightLb;
  const displayUnit = unit === 'KG' ? 'kg' : 'lb';

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
              disabled={loading}
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
        {fromPreferences !== 'true' && <ProgressBar progress={3} total={8} />}
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
              <Text
                style={[styles.unitButtonText, unit === 'KG' && styles.unitButtonTextActive]}
              >
                KG
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'LB' && styles.unitButtonActive]}
              onPress={() => handleUnitChange('LB')}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.unitButtonText, unit === 'LB' && styles.unitButtonTextActive]}
              >
                LB
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rulerSection}>
            <View style={styles.valueDisplay}>
              <Text style={styles.valueText}>
                {displayValue}
                <Text style={styles.unitText}>{displayUnit}</Text>
              </Text>
            </View>

            <View style={styles.rulerContainer}>
              <HorizontalRuler
                minValue={unit === 'KG' ? KG_MIN : LB_MIN}
                maxValue={unit === 'KG' ? KG_MAX : LB_MAX}
                step={1}
                initialValue={unit === 'KG' ? weightKg : weightLb}
                onValueChange={handleWeightChange}
                unit={displayUnit}
              />
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

  rulerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  valueDisplay: {
    marginBottom: Layout.spacing.xxl * 2,
  },

  valueText: {
    fontSize: 56,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    letterSpacing: -2,
  },

  unitText: {
    fontSize: 24,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.secondary,
  },

  rulerContainer: {
    width: '100%',
    paddingHorizontal: Layout.spacing.xl,
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
