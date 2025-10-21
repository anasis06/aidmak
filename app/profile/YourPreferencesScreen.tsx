import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profileService';

export default function YourPreferencesScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user?.id) {
      setError('No user found. Please log in.');
      setLoading(false);
      return;
    }

    loadProfile();
  }, [authLoading, user?.id]);

  useFocusEffect(
    React.useCallback(() => {
      if (!authLoading && user?.id) {
        loadProfile();
      }
    }, [authLoading, user?.id])
  );

  const loadProfile = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      setError('No user found. Please log in.');
      setLoading(false);
      return;
    }

    console.log('Loading profile for user:', user.id);
    setLoading(true);
    setError(null);

    try {
      const profile = await profileService.getProfile(user.id);
      console.log('Profile loaded:', profile);

      if (!profile) {
        console.log('No profile found for user');
        setError('Profile not found. Please complete your profile setup.');
        setProfileData(null);
      } else {
        setProfileData(profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile. Please try again.');
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    console.log('Retry button pressed, authLoading:', authLoading, 'user:', user?.id);
    if (!authLoading && user?.id) {
      loadProfile();
    } else if (!user?.id) {
      router.replace('/authentication/LoginScreen');
    }
  };

  const handleEditGender = () => {
    if (user?.id) {
      router.push({
        pathname: '/profileSetup/GenderChooseScreen',
        params: { userId: user.id, fromPreferences: 'true' },
      });
    }
  };

  const handleEditHeight = () => {
    if (user?.id) {
      router.push({
        pathname: '/profileSetup/HeightScreen',
        params: { userId: user.id, fromPreferences: 'true' },
      });
    }
  };

  const handleEditWeight = () => {
    if (user?.id) {
      router.push({
        pathname: '/profileSetup/WeightScreen',
        params: { userId: user.id, fromPreferences: 'true' },
      });
    }
  };

  const handleEditBodyMeasurements = () => {
    if (user?.id) {
      router.push({
        pathname: '/profileSetup/BodyMeasurementsScreen',
        params: { userId: user.id, fromPreferences: 'true' },
      });
    }
  };

  const handleEditSkinTone = () => {
    if (user?.id) {
      router.push({
        pathname: '/profileSetup/SkinToneScreen',
        params: { userId: user.id, fromPreferences: 'true' },
      });
    }
  };

  const handleChangePhoto = () => {
    if (user?.id) {
      router.push({
        pathname: '/profileSetup/UploadPictureScreen',
        params: { userId: user.id, fromPreferences: 'true' },
      });
    }
  };

  const formatHeight = (height?: number) => {
    if (!height) return '-';
    const feet = Math.floor(height / 30.48);
    const inches = Math.round((height % 30.48) / 2.54);
    return `${feet}.${inches} ft`;
  };

  const formatWeight = (weight?: number) => {
    if (!weight) return '-';
    return `${weight} kg`;
  };

  const formatMeasurement = (measurement?: number) => {
    if (!measurement) return '-';
    return `${measurement} cm`;
  };

  const formatSkinTone = (skinTone?: string) => {
    if (!skinTone) return '-';
    return skinTone.charAt(0).toUpperCase() + skinTone.slice(1);
  };

  const formatGender = (gender?: string) => {
    if (!gender) return '-';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  if (loading || authLoading) {
    return (
      <SafeAreaContainer style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.purple} />
          <Text style={styles.loadingText}>Loading preferences...</Text>
        </View>
      </SafeAreaContainer>
    );
  }

  if (error) {
    return (
      <SafeAreaContainer style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Preferences</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>
              {!user?.id ? 'Go to Login' : 'Retry'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Preferences</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <PreferenceItem
          label="Gender"
          value={formatGender(profileData?.gender)}
          onPress={handleEditGender}
        />

        <View style={styles.divider} />

        <PreferenceItem
          label="Height"
          value={formatHeight(profileData?.height)}
          onPress={handleEditHeight}
        />

        <View style={styles.divider} />

        <PreferenceItem
          label="Weight"
          value={formatWeight(profileData?.weight)}
          onPress={handleEditWeight}
        />

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Body measurements</Text>

        <PreferenceItem
          label="Chest"
          value={formatMeasurement(profileData?.chest_measurement)}
          onPress={handleEditBodyMeasurements}
        />

        <View style={styles.divider} />

        <PreferenceItem
          label="Waist"
          value={formatMeasurement(profileData?.waist_measurement)}
          onPress={handleEditBodyMeasurements}
        />

        <View style={styles.divider} />

        <PreferenceItem
          label="Hips"
          value={formatMeasurement(profileData?.hips_measurement)}
          onPress={handleEditBodyMeasurements}
        />

        <View style={styles.divider} />

        <PreferenceItem
          label="Skin color"
          value={formatSkinTone(profileData?.skin_tone)}
          onPress={handleEditSkinTone}
        />

        <View style={styles.divider} />

        <PreferenceItem label="Change photo" value="" onPress={handleChangePhoto} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaContainer>
  );
}

interface PreferenceItemProps {
  label: string;
  value: string;
  onPress: () => void;
}

function PreferenceItem({ label, value, onPress }: PreferenceItemProps) {
  return (
    <TouchableOpacity style={styles.preferenceItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.preferenceLabel}>{label}</Text>
      <View style={styles.preferenceRight}>
        {value && <Text style={styles.preferenceValue}>{value}</Text>}
        <ChevronRight size={20} color={Colors.text.secondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background.primary,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },

  loadingText: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.sm,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    gap: Layout.spacing.lg,
  },

  errorText: {
    fontSize: Fonts.sizes.base,
    color: Colors.status.error,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: Colors.primary.purple,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
  },

  retryButtonText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.primary,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.secondary,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  headerSpacer: {
    width: 40,
  },

  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },

  sectionTitle: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
  },

  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.lg,
  },

  preferenceLabel: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.primary,
  },

  preferenceRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },

  preferenceValue: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.secondary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.background.secondary,
  },

  bottomSpacer: {
    height: Layout.spacing.xxl,
  },
});
