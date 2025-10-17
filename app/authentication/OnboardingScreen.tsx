import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    router.push('/authentication/LoginScreen');
  };

  const handleSignUp = () => {
    router.push('/authentication/SignUpScreen');
  };

  return (
    <SafeAreaContainer style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={[styles.decorativeDot, styles.dot1]} />
          <View style={[styles.decorativeDot, styles.dot2]} />
          <View style={[styles.decorativeDot, styles.dot3]} />
          <View style={[styles.decorativeDot, styles.dot4]} />
          <View style={[styles.decorativeDot, styles.dot5]} />

          <View style={[styles.avatarContainer, styles.avatar1]}>
            <View style={styles.avatarCircle}>
              <Image
                source={require('@/assets/images/avatar-fair.png')}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={[styles.avatarContainer, styles.avatar2]}>
            <View style={styles.avatarCircle}>
              <Image
                source={require('@/assets/images/avatar-medium.png')}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={[styles.avatarContainer, styles.avatar3]}>
            <View style={styles.avatarCircle}>
              <Image
                source={require('@/assets/images/avatar-dark.png')}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <Animated.View
          style={[
            styles.textSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Where style meets{'\n'}intelligent simplicity</Text>
          <Text style={styles.subtitle}>
            Integrating trends, preferences, and smart{'\n'}wardrobe tools to inspire your daily looks
          </Text>
        </Animated.View>

        <View style={styles.buttonSection}>
          <Button title="Login" onPress={handleLogin} variant="primary" size="large" />
          <View style={styles.buttonSpacing} />
          <Button title="Sign up" onPress={handleSignUp} variant="outline" size="large" />
        </View>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
  },

  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xl,
    justifyContent: 'space-between',
  },

  avatarSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: height * 0.05,
  },

  avatarContainer: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  avatar1: {
    top: -20,
    left: width * 0.15,
  },

  avatar2: {
    top: -40,
    right: width * 0.12,
  },

  avatar3: {
    top: 100,
    left: width * 0.35,
  },

  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },

  avatarImage: {
    width: '140%',
    height: '140%',
  },

  decorativeDot: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  dot1: {
    width: 12,
    height: 12,
    top: 10,
    left: width * 0.1,
    backgroundColor: Colors.accent.cream,
  },

  dot2: {
    width: 8,
    height: 8,
    top: 60,
    right: width * 0.08,
    backgroundColor: Colors.accent.lightPurple,
  },

  dot3: {
    width: 10,
    height: 10,
    bottom: 80,
    left: width * 0.12,
    backgroundColor: Colors.accent.mint,
  },

  dot4: {
    width: 14,
    height: 14,
    bottom: 40,
    right: width * 0.15,
    backgroundColor: Colors.accent.peach,
  },

  dot5: {
    width: 6,
    height: 6,
    top: 140,
    right: width * 0.25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  textSection: {
    marginBottom: Layout.spacing.xxl,
  },

  title: {
    fontSize: 32,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: Layout.spacing.md,
  },

  subtitle: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  buttonSection: {
    width: '100%',
    marginBottom: Layout.spacing.lg,
  },

  buttonSpacing: {
    height: Layout.spacing.md,
  },
});
