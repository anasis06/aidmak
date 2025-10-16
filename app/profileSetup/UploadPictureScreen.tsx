import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useUser } from '@/hooks/useUser';

export default function UploadPictureScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = () => {
    router.push('/profileSetup/CameraFaceDetectionScreen');
  };

  const handleContinue = () => {
    if (imageUri) {
      updateProfile({ profilePicture: imageUri });
    }
    router.push('/(tabs)');
  };

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <ProgressBar progress={6} total={7} />
      </View>

      <View style={styles.container}>
        <View style={styles.contentSection}>
          <Text style={styles.title}>Upload Your Picture</Text>

          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Camera size={48} color={Colors.text.secondary} strokeWidth={1.5} />
                </View>
              )}
            </View>

            <Text style={styles.subtitle}>
              We'll do this by analyzing your complexion and facial features
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Take Photo"
            onPress={takePhoto}
            variant="primary"
            size="large"
          />
          <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
            <Text style={styles.secondaryButtonText}>Choose from Library</Text>
          </TouchableOpacity>
          {imageUri && (
            <Button
              title="Continue"
              onPress={handleContinue}
              variant="primary"
              size="large"
            />
          )}
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
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xxl * 2,
    marginTop: Layout.spacing.lg,
    alignSelf: 'flex-start',
  },

  avatarSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  avatarCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: Layout.spacing.xxl,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  subtitle: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Layout.spacing.xl,
    lineHeight: 22,
  },

  buttonContainer: {
    paddingBottom: Layout.spacing.xl,
    gap: Layout.spacing.md,
  },

  secondaryButton: {
    height: 56,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.primary.purple,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryButtonText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    color: Colors.primary.purple,
  },
});
