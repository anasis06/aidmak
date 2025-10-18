import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useProfileSetup } from '@/context/ProfileSetupContext';

export default function UploadPictureScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const capturedImageUri = params.capturedImage as string | undefined;
  const { profileData, updateProfileData, saveProfile, isLoading } = useProfileSetup();
  const [imageUri, setImageUri] = useState<string | null>(capturedImageUri || null);
  const [showPreview, setShowPreview] = useState(!!capturedImageUri);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setShowPreview(true);
    }
  };

  const takePhoto = () => {
    router.push({
      pathname: '/profileSetup/CameraFaceDetectionScreen',
      params: { userId }
    });
  };

  const handleRetake = () => {
    setImageUri(null);
    setShowPreview(false);
  };

  const handleContinue = async () => {
    if (!imageUri || !userId) return;

    try {
      updateProfileData({ profilePictureUri: imageUri });
      await saveProfile(userId);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
    }
  };

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <ProgressBar progress={6} total={8} />
      </View>

      <View style={styles.container}>
        {!showPreview ? (
          <>
            <View style={styles.contentSection}>
              <Text style={styles.title}>Upload Your Picture</Text>

              <View style={styles.avatarSection}>
                <View style={styles.avatarCircle}>
                  <View style={styles.avatarPlaceholder}>
                    <Camera size={48} color={Colors.text.secondary} strokeWidth={1.5} />
                  </View>
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
            </View>
          </>
        ) : (
          <>
            <View style={styles.contentSection}>
              <Text style={styles.title}>Review Your Picture</Text>

              <View style={styles.avatarSection}>
                <View style={styles.avatarCircle}>
                  {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                  )}
                </View>

                <Text style={styles.subtitle}>
                  Are you satisfied with this photo?
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary.purple} />
                  <Text style={styles.loadingText}>Saving your profile...</Text>
                </View>
              ) : (
                <>
                  <Button
                    title="Continue"
                    onPress={handleContinue}
                    variant="primary"
                    size="large"
                  />
                  <TouchableOpacity style={styles.secondaryButton} onPress={handleRetake}>
                    <Text style={styles.secondaryButtonText}>Retake Photo</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        )}
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

  loadingContainer: {
    paddingVertical: Layout.spacing.xl,
    alignItems: 'center',
    gap: Layout.spacing.md,
  },

  loadingText: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.secondary,
    fontWeight: Fonts.weights.medium,
  },
});
