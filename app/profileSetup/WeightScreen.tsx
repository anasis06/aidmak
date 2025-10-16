import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

export default function WeightScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [unit, setUnit] = useState<Unit>('KG');
  const [weightValue, setWeightValue] = useState(50);

  const handleContinue = () => {
    updateProfile({ weight: weightValue });
    router.push('/profileSetup/BodyMeasurementsScreen');
  };

  const renderScale = () => {
    const marks = [];
    const minWeight = unit === 'KG' ? 40 : 88;
    const maxWeight = unit === 'KG' ? 60 : 132;

    for (let i = minWeight; i <= maxWeight; i += (unit === 'KG' ? 5 : 11)) {
      const isCenter = Math.abs(i - weightValue) < 3;
      marks.push(
        <View key={i} style={styles.scaleMark}>
          <Text style={[styles.scaleLabel, isCenter && styles.scaleLabelCenter]}>{i}</Text>
          <View style={[styles.tick, isCenter && styles.tickCenter]} />
        </View>
      );
    }
    return marks;
  };

  const renderTicks = () => {
    const ticks = [];
    for (let i = 0; i < 30; i++) {
      const isLong = i % 5 === 0;
      ticks.push(
        <View
          key={i}
          style={[
            styles.smallTick,
            isLong && styles.longTick,
          ]}
        />
      );
    }
    return ticks;
  };

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
              onPress={() => {
                setUnit('KG');
                setWeightValue(50);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitButtonText, unit === 'KG' && styles.unitButtonTextActive]}>
                KG
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'LB' && styles.unitButtonActive]}
              onPress={() => {
                setUnit('LB');
                setWeightValue(110);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitButtonText, unit === 'LB' && styles.unitButtonTextActive]}>
                LB
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weightDisplay}>
            <View style={styles.valueContainer}>
              <Text style={styles.weightValue}>{weightValue}</Text>
              <Text style={styles.weightUnit}>{unit.toLowerCase()}</Text>
            </View>

            <View style={styles.indicatorLine} />

            <View style={styles.scaleContainer}>
              <View style={styles.scaleTrack}>
                {renderScale()}
              </View>
              <View style={styles.ticksContainer}>
                {renderTicks()}
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

  weightDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Layout.spacing.xl,
  },

  weightValue: {
    fontSize: 64,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  weightUnit: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.secondary,
    marginLeft: Layout.spacing.sm,
  },

  indicatorLine: {
    width: 2,
    height: 80,
    backgroundColor: Colors.text.primary,
    marginBottom: Layout.spacing.lg,
  },

  scaleContainer: {
    width: '100%',
    alignItems: 'center',
  },

  scaleTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },

  scaleMark: {
    alignItems: 'center',
  },

  scaleLabel: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.tertiary,
    fontWeight: Fonts.weights.medium,
    marginBottom: 4,
  },

  scaleLabelCenter: {
    color: Colors.text.primary,
    fontSize: Fonts.sizes.lg,
  },

  tick: {
    width: 2,
    height: 8,
    backgroundColor: Colors.text.tertiary,
  },

  tickCenter: {
    height: 12,
    backgroundColor: Colors.text.primary,
  },

  ticksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingHorizontal: Layout.spacing.lg,
    height: 20,
  },

  smallTick: {
    width: 1,
    height: 6,
    backgroundColor: Colors.text.tertiary,
  },

  longTick: {
    height: 10,
    backgroundColor: Colors.text.secondary,
  },

  buttonContainer: {
    paddingBottom: Layout.spacing.xl,
  },
});
