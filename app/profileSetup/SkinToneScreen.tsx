import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useProfileSetup } from '@/context/ProfileSetupContext';
import { profileService } from '@/services/profileService';

type SkinTone = 'fair' | 'medium' | 'dusky' | 'dark';

interface SkinToneOption {
  id: SkinTone;
  label: string;
  image: any;
}

const skinToneOptions: SkinToneOption[] = [
  {
    id: 'fair',
    label: 'Fair',
    image: require('@/assets/images/unnamed 1.png'),
  },
  {
    id: 'medium',
    label: 'Medium',
    image: require('@/assets/images/unnamed 1 (1).png'),
  },
  {
    id: 'dusky',
    label: 'Dusky',
    image: require('@/assets/images/unnamed 1 (2).png'),
  },
  {
    id: 'dark',
    label: 'Dark',
    image: require('@/assets/images/unnamed 1 (2).png'),
  },
];

export default function SkinToneScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const fromPreferences = params.fromPreferences as string;
  const { updateProfileData } = useProfileSetup();
  const [selectedTone, setSelectedTone] = useState<SkinTone | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(fromPreferences === 'true');

  useEffect(() => {
    if (fromPreferences === 'true') {
      loadExistingSkinTone();
    }
  }, []);

  const loadExistingSkinTone = async () => {
    try {
      const profile = await profileService.getProfile(userId);
      if (profile?.skin_tone) {
        setSelectedTone(profile.skin_tone as SkinTone);
      }
    } catch (error) {
      console.error('Error loading skin tone:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedTone) return;

    if (fromPreferences === 'true') {
      setLoading(true);
      try {
        await profileService.updateProfile(userId, { skin_tone: selectedTone });
        router.back();
      } catch (error) {
        console.error('Error updating skin tone:', error);
      } finally {
        setLoading(false);
      }
    } else {
      updateProfileData({ skinTone: selectedTone });
      router.push({
        pathname: '/profileSetup/UploadPictureScreen',
        params: { userId }
      });
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaContainer style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.purple} />
        </View>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          {fromPreferences === 'true' && (
            <TouchableOpacity
              onPress={handleContinue}
              style={styles.saveButton}
              disabled={!selectedTone || loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.primary.purple} />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
        {fromPreferences !== 'true' && <ProgressBar progress={5} total={8} />}
      </View>

      <View style={styles.container}>
        <View style={styles.contentSection}>
          <Text style={styles.title}>What is your skin color?</Text>

          <View style={styles.optionsContainer}>
            {skinToneOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.option, selectedTone === option.id && styles.selectedOption]}
                onPress={() => setSelectedTone(option.id)}
                activeOpacity={0.7}
              >
                <Image source={option.image} style={styles.avatar} resizeMode="cover" />
                <Text style={styles.optionText}>{option.label}</Text>
                <View style={[styles.radio, selectedTone === option.id && styles.radioSelected]}>
                  {selectedTone === option.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {loading ? (
            <View style={styles.buttonLoading}>
              <ActivityIndicator size="small" color={Colors.primary.purple} />
            </View>
          ) : (
            <Button
              title={fromPreferences === 'true' ? 'Save' : 'Next'}
              onPress={handleContinue}
              variant="primary"
              size="large"
              disabled={!selectedTone}
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

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  saveButton: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    color: Colors.primary.purple,
  },

  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    justifyContent: 'space-between',
  },

  contentSection: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xxl,
    marginTop: Layout.spacing.lg,
  },

  optionsContainer: {
    gap: Layout.spacing.md,
  },

  option: {
    height: 80,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.background.secondary,
  },

  selectedOption: {
    borderColor: Colors.background.secondary,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: Layout.spacing.md,
    backgroundColor: Colors.background.tertiary,
  },

  optionText: {
    flex: 1,
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.primary,
  },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.text.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioSelected: {
    borderColor: Colors.primary.purple,
  },

  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary.purple,
  },

  buttonContainer: {
    paddingBottom: Layout.spacing.xl,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonLoading: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.xl,
  },
});
