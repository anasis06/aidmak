import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { VerticalRuler } from '@/components/VerticalRuler';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useProfileSetup } from '@/context/ProfileSetupContext';
import { profileService } from '@/services/profileService';

type Unit = 'CM' | 'FT';

const CM_MIN = 100;
const CM_MAX = 250;
const FT_MIN = 3.3;
const FT_MAX = 8.2;

const cmToFeet = (cm: number): number => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return parseFloat(`${feet}.${inches}`);
};

const feetToCm = (feet: number): number => {
  const [ft, inches] = feet.toString().split('.').map(Number);
  const totalInches = ft * 12 + (inches || 0);
  return Math.round(totalInches * 2.54);
};

export default function HeightScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const fromPreferences = params.fromPreferences as string;
  const { updateProfileData } = useProfileSetup();
  const [unit, setUnit] = useState<Unit>('FT');
  const [heightCm, setHeightCm] = useState(167);
  const [heightFt, setHeightFt] = useState(5.5);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(fromPreferences === 'true');

  useEffect(() => {
    if (fromPreferences === 'true') {
      loadExistingHeight();
    } else {
      updateProfileData({ height: heightCm });
    }
  }, []);

  useEffect(() => {
    if (fromPreferences !== 'true') {
      updateProfileData({ height: heightCm });
    }
  }, [heightCm]);

  const loadExistingHeight = async () => {
    try {
      const profile = await profileService.getProfile(userId);
      if (profile?.height) {
        setHeightCm(profile.height);
        setHeightFt(cmToFeet(profile.height));
      }
    } catch (error) {
      console.error('Error loading height:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleHeightChange = (value: number) => {
    if (unit === 'CM') {
      setHeightCm(value);
      setHeightFt(cmToFeet(value));
    } else {
      setHeightFt(value);
      setHeightCm(feetToCm(value));
    }
  };

  const handleContinue = async () => {
    if (fromPreferences === 'true') {
      setLoading(true);
      try {
        await profileService.updateProfile(userId, { height: heightCm });
        router.back();
      } catch (error) {
        console.error('Error updating height:', error);
      } finally {
        setLoading(false);
      }
    } else {
      updateProfileData({ height: heightCm });
      router.push({
        pathname: '/profileSetup/WeightScreen',
        params: { userId },
      });
    }
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
  };

  const displayValue = unit === 'CM' ? heightCm : heightFt;
  const displayUnit = unit === 'CM' ? 'cm' : 'ft';

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
        {fromPreferences !== 'true' && <ProgressBar progress={2} total={8} />}
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
              <Text
                style={[styles.unitButtonText, unit === 'CM' && styles.unitButtonTextActive]}
              >
                CM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'FT' && styles.unitButtonActive]}
              onPress={() => handleUnitChange('FT')}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.unitButtonText, unit === 'FT' && styles.unitButtonTextActive]}
              >
                FT
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
              <VerticalRuler
                minValue={unit === 'CM' ? CM_MIN : FT_MIN}
                maxValue={unit === 'CM' ? CM_MAX : FT_MAX}
                step={unit === 'CM' ? 1 : 0.1}
                initialValue={unit === 'CM' ? heightCm : heightFt}
                onValueChange={handleHeightChange}
                unit={displayUnit}
                showLabels={true}
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
    marginBottom: Layout.spacing.xxl,
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  valueDisplay: {
    position: 'absolute',
    top: '30%',
    left: Layout.spacing.xxl,
    zIndex: 5,
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
    flex: 1,
    width: '100%',
    justifyContent: 'center',
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
