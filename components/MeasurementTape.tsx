import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

interface MeasurementTapeProps {
  min: number;
  max: number;
  initialValue: number;
  step?: number;
  onValueChange: (value: number) => void;
  unit?: string;
}

const ITEM_WIDTH = 8;
const SCREEN_WIDTH = Layout.window.width;
const VISIBLE_RANGE = 40;

export function MeasurementTape({
  min,
  max,
  initialValue,
  step = 1,
  onValueChange,
  unit = '',
}: MeasurementTapeProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const isScrolling = useRef(false);

  useEffect(() => {
    const initialOffset = (initialValue - min) * ITEM_WIDTH;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: initialOffset, animated: false });
    }, 100);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isScrolling.current) {
      isScrolling.current = true;
    }

    const offsetX = event.nativeEvent.contentOffset.x;
    const rawValue = offsetX / ITEM_WIDTH + min;
    const snappedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, snappedValue));

    if (clampedValue !== currentValue) {
      setCurrentValue(clampedValue);
      onValueChange(clampedValue);
    }
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    isScrolling.current = false;
    const offsetX = event.nativeEvent.contentOffset.x;
    const rawValue = offsetX / ITEM_WIDTH + min;
    const snappedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, snappedValue));
    const targetOffset = (clampedValue - min) * ITEM_WIDTH;

    scrollViewRef.current?.scrollTo({ x: targetOffset, animated: true });
    setCurrentValue(clampedValue);
    onValueChange(clampedValue);
  };

  const renderTicks = () => {
    const ticks = [];
    for (let i = min; i <= max; i += step) {
      const isLarge = i % 10 === 0;
      const isMedium = i % 5 === 0;

      ticks.push(
        <View key={i} style={styles.tickContainer}>
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
    return ticks;
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerIndicator}>
        <View style={styles.indicatorLine} />
      </View>

      <View style={styles.tapeWrapper}>
        <View style={styles.tapePadding} />
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          decelerationRate="fast"
          contentContainerStyle={styles.tapeContent}
        >
          {renderTicks()}
        </ScrollView>
        <View style={styles.tapePadding} />
      </View>

      <View style={styles.labelsContainer}>
        <Text style={styles.labelText}>{min}</Text>
        <Text style={styles.labelText}>{Math.round((min + max) / 2)}</Text>
        <Text style={styles.labelText}>{max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },

  centerIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -1,
    zIndex: 10,
    alignItems: 'center',
  },

  indicatorLine: {
    width: 2,
    height: 80,
    backgroundColor: Colors.text.primary,
  },

  tapeWrapper: {
    flexDirection: 'row',
    height: 100,
    width: '100%',
  },

  tapePadding: {
    width: SCREEN_WIDTH / 2,
  },

  tapeContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 8,
  },

  tickContainer: {
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
    width: 1.5,
    backgroundColor: Colors.text.secondary,
  },

  tickLarge: {
    height: 28,
    width: 2,
    backgroundColor: Colors.text.primary,
  },

  tickLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 4,
    fontWeight: Fonts.weights.medium,
  },

  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 8,
  },

  labelText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text.tertiary,
    fontWeight: Fonts.weights.medium,
  },
});
