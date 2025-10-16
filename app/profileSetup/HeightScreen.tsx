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

type Unit = 'CM' | 'FT';

export default function HeightScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [unit, setUnit] = useState<Unit>('FT');
  const [heightValue, setHeightValue] = useState(5.5);

  const handleContinue = () => {
    updateProfile({ height: heightValue });
    router.push('/profileSetup/WeightScreen');
  };

  const incrementHeight = () => {
    if (unit === 'FT') {
      setHeightValue((prev) => Math.min(prev + 0.1, 8));
    } else {
      setHeightValue((prev) => Math.min(prev + 1, 250));
    }
  };

  const decrementHeight = () => {
    if (unit === 'FT') {
      setHeightValue((prev) => Math.max(prev - 0.1, 4));
    } else {
      setHeightValue((prev) => Math.max(prev - 1, 120));
    }
  };

  const renderRuler = () => {
    const marks = [];
    const startValue = unit === 'FT' ? 4 : 120;
    const endValue = unit === 'FT' ? 8 : 250;
    const step = unit === 'FT' ? 1 : 30;

    for (let i = startValue; i <= endValue; i += step) {
      marks.push(
        <View key={i} style={styles.rulerMark}>
          <View style={styles.majorTick} />
          <Text style={styles.rulerLabel}>{i}</Text>
        </View>
      );
    }
    return marks;
  };

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
              onPress={() => {
                setUnit('CM');
                setHeightValue(167);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitButtonText, unit === 'CM' && styles.unitButtonTextActive]}>
                CM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'FT' && styles.unitButtonActive]}
              onPress={() => {
                setUnit('FT');
                setHeightValue(5.5);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.unitButtonText, unit === 'FT' && styles.unitButtonTextActive]}>
                FT
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heightDisplay}>
            <View style={styles.valueContainer}>
              <Text style={styles.heightValue}>
                {unit === 'FT' ? heightValue.toFixed(1) : Math.round(heightValue)}
              </Text>
              <Text style={styles.heightUnit}>{unit.toLowerCase()}</Text>
            </View>

            <View style={styles.sliderLine} />

            <View style={styles.rulerContainer}>{renderRuler()}</View>
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

  heightDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Layout.spacing.xl,
  },

  heightValue: {
    fontSize: 64,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  heightUnit: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.secondary,
    marginLeft: Layout.spacing.sm,
  },

  sliderLine: {
    width: 2,
    height: 120,
    backgroundColor: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },

  rulerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '90%',
    paddingHorizontal: Layout.spacing.lg,
  },

  rulerMark: {
    alignItems: 'center',
  },

  majorTick: {
    width: 2,
    height: 12,
    backgroundColor: Colors.text.secondary,
    marginBottom: 4,
  },

  rulerLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text.secondary,
    fontWeight: Fonts.weights.medium,
  },

  buttonContainer: {
    paddingBottom: Layout.spacing.xl,
  },
});
