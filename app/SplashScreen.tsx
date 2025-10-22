import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Layers, Sparkles } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/authentication/OnboardingScreen');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <View style={styles.layerBack}>
            <Layers
              size={70}
              color="#A78BFA"
              strokeWidth={1.5}
            />
          </View>
          <View style={styles.layerFront}>
            <Layers
              size={70}
              color={Colors.primary.purple}
              strokeWidth={1.5}
            />
          </View>
          <View style={styles.sparkleWrapper}>
            <Sparkles
              size={20}
              color={Colors.primary.purple}
              strokeWidth={2}
              fill={Colors.primary.purple}
            />
          </View>
        </View>
        <Text style={styles.appName}>AidMak</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    gap: 24,
  },

  logoWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },

  layerBack: {
    position: 'absolute',
    opacity: 0.7,
    transform: [{ translateX: -8 }, { translateY: 8 }],
  },

  layerFront: {
    position: 'absolute',
    transform: [{ translateX: 4 }, { translateY: -4 }],
  },

  sparkleWrapper: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  appName: {
    fontSize: 48,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    letterSpacing: -1,
  },
});
