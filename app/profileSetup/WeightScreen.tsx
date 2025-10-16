import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { MeasurementTape } from '@/components/MeasurementTape';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useUser } from '@/hooks/useUser';

type Unit = 'KG' | 'LB';

const KG_MIN = 30;
const KG_MAX = 200;

export default function WeightScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [unit, setUnit] = useState<Unit>('KG');
  const [weightKg, setWeightKg] = useState(60);

  const handleContinue = () => {
    updateProfile({ weight: weightKg });
    router.push('/profileSetup/BodyMeasurementsScreen');
  };

  const kgToLbs = (kg: number): number => {
    return Math.round(kg * 2.20462);
  };

  const handleWeightChange = (value: number) => {
    setWeightKg(value);
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
  };

  const displayValue = unit === 'LB' ? kgToLbs(weightKg) : weightKg;

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

          <View style={styles.measurementSection}>
            <View style={styles.valueDisplay}>
              <Text style={styles.valueText}>{displayValue}</Text>
              <Text style={styles.unitText}>{unit.toLowerCase()}</Text>
            </View>

            <View style={styles.tapeSection}>
              <MeasurementTape
                min={KG_MIN}
                max={KG_MAX}
                initialValue={weightKg}
                step={1}
                onValueChange={handleWeightChange}
              />
            </View>

            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>40</Text>
              <Text style={styles.scaleLabel}>60</Text>
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

  measurementSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  valueDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Layout.spacing.xxl,
  },

  valueText: {
    fontSize: 72,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    lineHeight: 80,
  },

  unitText: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.secondary,
    marginLeft: Layout.spacing.sm,
  },

  tapeSection: {
    width: '100%',
    marginBottom: Layout.spacing.lg,
  },

  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '65%',
    marginTop: Layout.spacing.md,
  },

  scaleLabel: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.secondary,
  },

  buttonContainer: {
    paddingBottom: Layout.spacing.xl,
  },
});
