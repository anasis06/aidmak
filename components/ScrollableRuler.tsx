import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const RULER_WIDTH = SCREEN_WIDTH * 3;
const INDICATOR_WIDTH = 2;

interface ScrollableRulerProps {
  minValue: number;
  maxValue: number;
  step: number;
  initialValue: number;
  onValueChange: (value: number) => void;
  tickHeight?: number;
  largeTickInterval?: number;
}

export function ScrollableRuler({
  minValue,
  maxValue,
  step,
  initialValue,
  onValueChange,
  tickHeight = 20,
  largeTickInterval = 10,
}: ScrollableRulerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const lastValue = useRef(initialValue);

  const totalSteps = Math.floor((maxValue - minValue) / step);
  const pixelsPerStep = 8;
  const contentWidth = totalSteps * pixelsPerStep;
  const paddingHorizontal = SCREEN_WIDTH / 2;

  useEffect(() => {
    if (!isInitialized) {
      const initialOffset = ((initialValue - minValue) / step) * pixelsPerStep;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: initialOffset,
          animated: false,
        });
        setIsInitialized(true);
      }, 100);
    }
  }, [isInitialized, initialValue, minValue, step, pixelsPerStep]);

  const handleValueUpdate = (value: number) => {
    if (value !== lastValue.current) {
      lastValue.current = value;
      onValueChange(value);
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const stepIndex = Math.round(event.contentOffset.x / pixelsPerStep);
      const newValue = Math.min(
        maxValue,
        Math.max(minValue, minValue + stepIndex * step)
      );
      runOnJS(handleValueUpdate)(newValue);
    },
  });

  const renderTicks = () => {
    const ticks = [];
    for (let i = 0; i <= totalSteps; i++) {
      const value = minValue + i * step;
      const isLargeTick = value % largeTickInterval === 0;
      const tickHeightValue = isLargeTick ? tickHeight * 1.5 : tickHeight;

      ticks.push(
        <View
          key={i}
          style={[
            styles.tick,
            {
              height: tickHeightValue,
              width: isLargeTick ? 2 : 1,
              backgroundColor: isLargeTick
                ? Colors.text.primary
                : Colors.text.tertiary,
            },
          ]}
        />
      );
    }
    return ticks;
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerIndicator} />
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={pixelsPerStep}
        decelerationRate="fast"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal,
            width: contentWidth + paddingHorizontal * 2,
          },
        ]}
      >
        <View style={[styles.rulerContainer, { width: contentWidth }]}>
          {renderTicks()}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    position: 'relative',
  },

  centerIndicator: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 1,
    top: 0,
    bottom: 0,
    width: INDICATOR_WIDTH,
    backgroundColor: Colors.text.primary,
    zIndex: 10,
  },

  scrollContent: {
    alignItems: 'flex-end',
  },

  rulerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },

  tick: {
    borderRadius: 1,
  },
});
