import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ITEM_HEIGHT = 8;

interface VerticalRulerProps {
  minValue: number;
  maxValue: number;
  step: number;
  initialValue: number;
  onValueChange: (value: number) => void;
  unit: string;
  showLabels?: boolean;
}

export function VerticalRuler({
  minValue,
  maxValue,
  step,
  initialValue,
  onValueChange,
  unit,
  showLabels = true,
}: VerticalRulerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const lastValue = useRef(initialValue);

  const totalSteps = Math.floor((maxValue - minValue) / step);
  const contentHeight = totalSteps * ITEM_HEIGHT;
  const paddingVertical = SCREEN_HEIGHT * 0.35;

  useEffect(() => {
    const initialOffset = ((initialValue - minValue) / step) * ITEM_HEIGHT;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: initialOffset,
        animated: false,
      });
    }, 100);
  }, []);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const stepIndex = Math.round(offsetY / ITEM_HEIGHT);
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
    const majorInterval = unit === 'ft' ? 1 : 10;

    for (let i = 0; i <= totalSteps; i++) {
      const value = minValue + i * step;
      const isMajorTick = value % majorInterval === 0;

      ticks.push(
        <View key={i} style={styles.tickRow}>
          <View
            style={[
              styles.tick,
              isMajorTick && styles.tickMajor,
            ]}
          />
          {showLabels && isMajorTick && (
            <Text style={styles.tickLabel}>{`${value} ${unit}`}</Text>
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
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingVertical,
            height: contentHeight + paddingVertical * 2,
          },
        ]}
      >
        {renderTicks()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT * 0.7,
    position: 'relative',
    alignItems: 'flex-end',
  },

  centerIndicator: {
    position: 'absolute',
    right: 0,
    top: SCREEN_HEIGHT * 0.35,
    width: 100,
    height: 2,
    backgroundColor: Colors.text.primary,
    zIndex: 10,
  },

  scrollContent: {
    alignItems: 'flex-end',
  },

  tickRow: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 120,
  },

  tick: {
    width: 12,
    height: 1,
    backgroundColor: Colors.text.tertiary,
  },

  tickMajor: {
    width: 20,
    height: 2,
    backgroundColor: Colors.text.secondary,
  },

  tickLabel: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.secondary,
    marginLeft: Layout.spacing.sm,
    minWidth: 100,
    textAlign: 'right',
    flexShrink: 0,
  },
});
