import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = 8;

interface HorizontalRulerProps {
  minValue: number;
  maxValue: number;
  step: number;
  initialValue: number;
  onValueChange: (value: number) => void;
  unit: string;
}

export function HorizontalRuler({
  minValue,
  maxValue,
  step,
  initialValue,
  onValueChange,
  unit,
}: HorizontalRulerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const lastValue = useRef(initialValue);

  const totalSteps = Math.floor((maxValue - minValue) / step);
  const contentWidth = totalSteps * ITEM_WIDTH;
  const paddingHorizontal = SCREEN_WIDTH / 2;

  useEffect(() => {
    const initialOffset = ((initialValue - minValue) / step) * ITEM_WIDTH;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: initialOffset,
        animated: false,
      });
    }, 100);
  }, []);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const stepIndex = Math.round(offsetX / ITEM_WIDTH);
    const newValue = Math.min(
      maxValue,
      Math.max(minValue, minValue + stepIndex * step)
    );

    if (newValue !== lastValue.current) {
      lastValue.current = newValue;
      setCurrentValue(newValue);
      onValueChange(newValue);
    }
  };

  const renderTicks = () => {
    const ticks = [];
    const majorInterval = 10;

    for (let i = 0; i <= totalSteps; i++) {
      const value = minValue + i * step;
      const isMajorTick = value % majorInterval === 0;

      ticks.push(
        <View key={i} style={styles.tickColumn}>
          <View
            style={[
              styles.tick,
              isMajorTick && styles.tickMajor,
            ]}
          />
          {isMajorTick && (
            <Text style={styles.tickLabel}>{value}</Text>
          )}
        </View>
      );
    }
    return ticks;
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerIndicator} />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal,
            width: contentWidth + paddingHorizontal * 2,
          },
        ]}
      >
        <View style={styles.ticksContainer}>
          {renderTicks()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    position: 'relative',
    justifyContent: 'flex-end',
  },

  centerIndicator: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 1,
    bottom: 0,
    top: 0,
    width: 2,
    backgroundColor: Colors.text.primary,
    zIndex: 10,
  },

  scrollContent: {
    alignItems: 'flex-end',
  },

  ticksContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  tickColumn: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  tick: {
    width: 6,
    height: 15,
    backgroundColor: Colors.text.tertiary,
  },

  tickMajor: {
    width: 2,
    height: 25,
    backgroundColor: Colors.text.secondary,
  },

  tickLabel: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.xs,
    position: 'absolute',
    bottom: -24,
  },
});
