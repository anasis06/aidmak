import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
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

export default function GenderChooseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const fromPreferences = params.fromPreferences as string;
  const { updateProfileData } = useProfileSetup();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other' | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(fromPreferences === 'true');

  useEffect(() => {
    if (fromPreferences === 'true') {
      loadExistingGender();
    }
  }, []);

  const loadExistingGender = async () => {
    try {
      const profile = await profileService.getProfile(userId);
      if (profile?.gender) {
        setSelectedGender(profile.gender as 'male' | 'female' | 'other');
      }
    } catch (error) {
      console.error('Error loading gender:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedGender) return;

    if (fromPreferences === 'true') {
      setLoading(true);
      try {
        await profileService.updateProfile(userId, { gender: selectedGender });
        router.back();
      } catch (error) {
        console.error('Error updating gender:', error);
      } finally {
        setLoading(false);
      }
    } else {
      updateProfileData({ gender: selectedGender });
      router.push({
        pathname: '/profileSetup/HeightScreen',
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
              disabled={!selectedGender || loading}
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
        {fromPreferences !== 'true' && <ProgressBar progress={1} total={8} />}
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>What's your gender?</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.option, selectedGender === 'male' && styles.selectedOption]}
            onPress={() => setSelectedGender('male')}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>Male</Text>
            <View style={[styles.radio, selectedGender === 'male' && styles.radioSelected]}>
              {selectedGender === 'male' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, selectedGender === 'female' && styles.selectedOption]}
            onPress={() => setSelectedGender('female')}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>Female</Text>
            <View style={[styles.radio, selectedGender === 'female' && styles.radioSelected]}>
              {selectedGender === 'female' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, selectedGender === 'other' && styles.selectedOption]}
            onPress={() => setSelectedGender('other')}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>Other</Text>
            <View style={[styles.radio, selectedGender === 'other' && styles.radioSelected]}>
              {selectedGender === 'other' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
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
              disabled={!selectedGender}
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonLoading: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 28,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xxl,
    marginTop: Layout.spacing.lg,
  },

  optionsContainer: {
    flex: 1,
    gap: Layout.spacing.md,
  },

  option: {
    height: 70,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.background.secondary,
  },

  selectedOption: {
    borderColor: Colors.background.secondary,
  },

  optionText: {
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
});
