import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
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

const CM_MIN = 120;
const CM_MAX = 250;
const ITEM_WIDTH = 4;

export default function HeightScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const scrollViewRef = useRef<ScrollView>(null);
  const [unit, setUnit] = useState<Unit>('FT');
  const [heightCm, setHeightCm] = useState(167);

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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    const newHeight = CM_MIN + index;
    if (newHeight >= CM_MIN && newHeight <= CM_MAX) {
      setHeightCm(newHeight);
    }
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
  };

  const renderTape = () => {
    const items = [];
    for (let i = CM_MIN; i <= CM_MAX; i++) {
      const isLarge = i % 10 === 0;
      const isMedium = i % 5 === 0;

      items.push(
        <View key={i} style={styles.tapeItem}>
          <View
            style={[
              styles.tick,
              isLarge && styles.tickLarge,
              isMedium && !isLarge && styles.tickMedium,
            ]}
          />
          {isLarge && <Text style={styles.tickLabel}>{i}</Text>}
        </View>
      );
    }
    return items;
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

          <View style={styles.heightDisplay}>
            <View style={styles.valueContainer}>
              <Text style={styles.heightValue}>
                {unit === 'FT' ? cmToFeet(heightCm) : heightCm}
              </Text>
              <Text style={styles.heightUnit}>{unit.toLowerCase()}</Text>
            </View>

            <View style={styles.indicatorContainer}>
              <View style={styles.indicatorLine} />
            </View>

            <View style={styles.tapeContainer}>
              <View style={styles.tapePadding} />
              <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                snapToInterval={ITEM_WIDTH}
                decelerationRate="fast"
                contentContainerStyle={styles.tapeContent}
              >
                {renderTape()}
              </ScrollView>
              <View style={styles.tapePadding} />
            </View>

            <View style={styles.rulerLabelsContainer}>
              <Text style={styles.rulerLabel}>{CM_MIN}</Text>
              <Text style={styles.rulerLabel}>{Math.round((CM_MIN + CM_MAX) / 2)}</Text>
              <Text style={styles.rulerLabel}>{CM_MAX}</Text>
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

  indicatorContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },

  indicatorLine: {
    width: 2,
    height: 60,
    backgroundColor: Colors.text.primary,
  },

  tapeContainer: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    width: '100%',
  },

  tapePadding: {
    width: Layout.window.width / 2 - Layout.spacing.lg,
  },

  tapeContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: Layout.spacing.md,
  },

  tapeItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 60,
  },

  tick: {
    width: 1,
    height: 8,
    backgroundColor: Colors.text.tertiary,
  },

  tickMedium: {
    height: 16,
    backgroundColor: Colors.text.secondary,
  },

  tickLarge: {
    height: 24,
    width: 2,
    backgroundColor: Colors.text.primary,
  },

  tickLabel: {
    fontSize: 10,
    color: Colors.text.secondary,
    marginTop: 4,
    fontWeight: Fonts.weights.medium,
  },

  rulerLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: Layout.spacing.md,
  },

  rulerLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text.tertiary,
    fontWeight: Fonts.weights.medium,
  },

  buttonContainer: {
    paddingBottom: Layout.spacing.xl,
  },
});
