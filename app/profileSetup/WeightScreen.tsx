import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  const { updateProfileData } = useProfileSetup();
  const [unit, setUnit] = useState<Unit>('KG');
  const [weightKg, setWeightKg] = useState(50);
  const [weightLb, setWeightLb] = useState(110);

  useEffect(() => {
    updateProfileData({ weight: weightKg });
  }, [weightKg]);

  const handleWeightChange = (value: number) => {
    if (unit === 'KG') {
      setWeightKg(value);
      setWeightLb(kgToLb(value));
    } else {
      setWeightLb(value);
      setWeightKg(lbToKg(value));
    }
  };

  const handleContinue = () => {
    updateProfileData({ weight: weightKg });
    router.push({
      pathname: '/profileSetup/BodyMeasurementsScreen',
      params: { userId },
    });
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
  };

  const displayValue = unit === 'KG' ? weightKg : weightLb;
  const displayUnit = unit === 'KG' ? 'kg' : 'lb';

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <ProgressBar progress={3} total={8} />
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
          <Button title="Next" onPress={handleContinue} variant="primary" size="large" />
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
});
