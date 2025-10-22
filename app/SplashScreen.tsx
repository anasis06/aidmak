import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
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
        <Image
          source={require('@/assets/images/aidmak-logo-for-dark-background-01 1.png')}
          style={styles.logo}
          resizeMode="contain"
        />
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

  logo: {
    width: 120,
    height: 120,
  },

  appName: {
    fontSize: 48,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    letterSpacing: -1,
  },
});
