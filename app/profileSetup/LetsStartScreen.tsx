import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

const { width, height } = Dimensions.get('window');

export default function LetsStartScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/profileSetup/GenderChooseScreen');
  };

  return (
    <SafeAreaContainer style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustrationSection}>
          <View style={styles.backgroundShapes}>
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
          </View>

          <View style={styles.platformContainer}>
            <Image
              source={require('@/assets/images/Vector.png')}
              style={styles.platformImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.mainIllustrationContainer}>
            <Image
              source={require('@/assets/images/Group.png')}
              style={styles.mainIllustration}
              resizeMode="contain"
            />
          </View>

          <View style={styles.objectsContainer}>
            <Image
              source={require('@/assets/images/OBJECTS.png')}
              style={styles.objectsImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.plantContainer}>
            <Image
              source={require('@/assets/images/Group (1).png')}
              style={styles.plantImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.textSection}>
          <Text style={styles.title}>
            Want to feel confident and{'\n'}look flawless in every outfit?
          </Text>
          <Text style={styles.subtitle}>
            Discover the perfect style that matches your{'\n'}body, personality, and vibe.
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <Button
            title="Let's Start"
            onPress={handleNext}
            variant="primary"
            size="large"
          />
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

  illustrationSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: height * 0.05,
  },

  backgroundShapes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  circle1: {
    width: 280,
    height: 280,
    backgroundColor: 'rgba(60, 60, 60, 0.8)',
  },

  circle2: {
    width: 140,
    height: 140,
    top: 40,
    right: width * 0.15,
    backgroundColor: 'rgba(80, 80, 80, 0.6)',
  },

  circle3: {
    width: 100,
    height: 100,
    bottom: 100,
    right: width * 0.2,
    backgroundColor: 'rgba(70, 70, 70, 0.7)',
  },

  platformContainer: {
    position: 'absolute',
    bottom: 0,
    width: width * 0.8,
    height: 40,
    zIndex: 1,
  },

  platformImage: {
    width: '100%',
    height: '100%',
  },

  mainIllustrationContainer: {
    width: 280,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    marginBottom: 20,
  },

  mainIllustration: {
    width: '100%',
    height: '100%',
  },

  objectsContainer: {
    position: 'absolute',
    right: width * 0.12,
    top: '30%',
    width: 80,
    height: 120,
    zIndex: 2,
  },

  objectsImage: {
    width: '100%',
    height: '100%',
  },

  plantContainer: {
    position: 'absolute',
    bottom: 20,
    right: width * 0.15,
    width: 50,
    height: 60,
    zIndex: 4,
  },

  plantImage: {
    width: '100%',
    height: '100%',
  },

  textSection: {
    marginBottom: Layout.spacing.xl,
  },

  title: {
    fontSize: 28,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 36,
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
});
