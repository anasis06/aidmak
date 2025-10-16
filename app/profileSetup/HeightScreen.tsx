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

type Unit = 'CM' | 'FT';

const CM_MIN = 120;
const CM_MAX = 250;

export default function HeightScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [unit, setUnit] = useState<Unit>('FT');
  const [heightCm, setHeightCm] = useState(170);

  const handleContinue = () => {
    updateProfile({ height: heightCm });
    router.push('/profileSetup/WeightScreen');
  };

  const cmToFeet = (cm: number): string => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}.${inches}`;
  };

  const handleHeightChange = (value: number) => {
    setHeightCm(value);
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
  };

  const displayValue = unit === 'FT' ? cmToFeet(heightCm) : heightCm;

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

          <View style={styles.measurementSection}>
            <View style={styles.valueDisplay}>
              <Text style={styles.valueText}>{displayValue}</Text>
              <Text style={styles.unitText}>{unit.toLowerCase()}</Text>
            </View>

            <View style={styles.tapeSection}>
              <MeasurementTape
                min={CM_MIN}
                max={CM_MAX}
                initialValue={heightCm}
                step={1}
                onValueChange={handleHeightChange}
              />
            </View>

            <View style={styles.rulerMarks}>
              <View style={styles.rulerLine} />
              <View style={styles.rulerTicksContainer}>
                <View style={styles.rulerTick} />
                <View style={styles.rulerTick} />
                <View style={styles.rulerTick} />
                <View style={styles.rulerTick} />
                <View style={styles.rulerTick} />
                <View style={styles.rulerTick} />
                <View style={styles.rulerTick} />
                <View style={styles.rulerTick} />
              </View>
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

  rulerMarks: {
    alignItems: 'flex-end',
    paddingRight: Layout.spacing.xxl,
    marginTop: Layout.spacing.md,
  },

  rulerLine: {
    width: 2,
    height: 120,
    backgroundColor: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },

  rulerTicksContainer: {
    alignItems: 'flex-end',
    gap: 12,
  },

  rulerTick: {
    width: 20,
    height: 1.5,
    backgroundColor: Colors.text.tertiary,
  },

  buttonContainer: {
    paddingBottom: Layout.spacing.xl,
  },
});
