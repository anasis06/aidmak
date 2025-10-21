import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  const { updateProfileData } = useProfileSetup();
  const [unit, setUnit] = useState<Unit>('FT');
  const [heightCm, setHeightCm] = useState(167);
  const [heightFt, setHeightFt] = useState(5.5);

  useEffect(() => {
    updateProfileData({ height: heightCm });
  }, [heightCm]);

  const handleHeightChange = (value: number) => {
    if (unit === 'CM') {
      setHeightCm(value);
      setHeightFt(cmToFeet(value));
    } else {
      setHeightFt(value);
      setHeightCm(feetToCm(value));
    }
  };

  const handleContinue = () => {
    updateProfileData({ height: heightCm });
    router.push({
      pathname: '/profileSetup/WeightScreen',
      params: { userId },
    });
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
  };

  const displayValue = unit === 'CM' ? heightCm : heightFt;
  const displayUnit = unit === 'CM' ? 'cm' : 'ft';

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <ProgressBar progress={2} total={8} />
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
});
