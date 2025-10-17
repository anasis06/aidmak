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

          <View style={styles.platformContainer}>
            <Image
              source={require('@/assets/images/Vector.png')}
              style={styles.platformImage}
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
    paddingTop: height * 0.08,
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
  },

  circle1: {
    width: 0,
    height: 0,
    backgroundColor: 'rgba(60, 60, 60, 0.9)',
    left: '8%',
    top: '18%',
  },

  circle2: {
    width: 0,
    height: 0,
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    right: '5%',
    top: '12%',
  },

  circle3: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(45, 45, 45, 0.8)',
    right: '8%',
    bottom: '20%',
  },

  mainIllustrationContainer: {
    width: 220,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    marginBottom: 30,
  },

  mainIllustration: {
    width: '100%',
    height: '100%',
  },

  objectsContainer: {
    position: 'absolute',
    right: '10%',
    top: '25%',
    width: 60,
    height: 90,
    zIndex: 5,
  },

  objectsImage: {
    width: '100%',
    height: '100%',
  },

  platformContainer: {
    position: 'absolute',
    bottom: 20,
    width: width * 0.7,
    height: 30,
    zIndex: 1,
  },

  platformImage: {
    width: '100%',
    height: '100%',
  },

  plantContainer: {
    position: 'absolute',
    bottom: 35,
    right: '18%',
    width: 45,
    height: 55,
    zIndex: 15,
  },

  plantImage: {
    width: '100%',
    height: '100%',
  },

  textSection: {
    marginBottom: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.sm,
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
