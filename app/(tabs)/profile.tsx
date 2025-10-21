import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Bell } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { CircularProgress } from '@/components/CircularProgress';
import RateUsModal from '@/components/RateUsModal';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profileService';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(80);
  const [showRateUsModal, setShowRateUsModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      const profile = await profileService.getProfile(user.id);
      const completion = calculateProfileCompletion(profile);
      setProfileCompletion(completion);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (profile: any): number => {
    if (!profile) return 0;

    const fields = [
      profile.gender,
      profile.height,
      profile.weight,
      profile.chest_measurement,
      profile.waist_measurement,
      profile.hips_measurement,
      profile.skin_tone,
      profile.profile_picture_url,
    ];

    const completedFields = fields.filter((field) => field != null && field !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const handleChangePreferences = () => {
    router.push('/profile/YourPreferencesScreen');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy content would be displayed here.');
  };

  const handleTermsOfUse = () => {
    Alert.alert('Terms of Use', 'Terms of use content would be displayed here.');
  };

  const handleRateUs = () => {
    setShowRateUsModal(true);
  };

  const handleRateUsSubmit = (rating: number) => {
    console.log('User rating:', rating);
    Alert.alert('Thank you!', `You rated us ${rating} star${rating !== 1 ? 's' : ''}!`);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/authentication/OnboardingScreen');
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaContainer style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color={Colors.primary.purple} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Preference</Text>

        <TouchableOpacity
          style={styles.preferenceCard}
          onPress={handleChangePreferences}
          activeOpacity={0.7}
        >
          <Text style={styles.preferenceCardText}>Change your Preferences</Text>
          <CircularProgress percentage={profileCompletion} size={50} strokeWidth={4} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>General</Text>

        <View style={styles.menuContainer}>
          <MenuItem label="Privacy policy" onPress={handlePrivacyPolicy} />
          <View style={styles.divider} />
          <MenuItem label="Terms of use" onPress={handleTermsOfUse} />
          <View style={styles.divider} />
          <MenuItem label="Rate us" onPress={handleRateUs} />
          <View style={styles.divider} />
          <MenuItem label="Logout" onPress={handleLogout} />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <RateUsModal
        visible={showRateUsModal}
        onClose={() => setShowRateUsModal(false)}
        onSubmit={handleRateUsSubmit}
      />
    </SafeAreaContainer>
  );
}

interface MenuItemProps {
  label: string;
  onPress: () => void;
}

function MenuItem({ label, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.menuItemText}>{label}</Text>
      <ChevronRight size={20} color={Colors.text.secondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background.primary,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },

  headerTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },

  sectionTitle: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },

  preferenceCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.lg,
  },

  preferenceCardText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.primary,
  },

  menuContainer: {
    backgroundColor: Colors.background.primary,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.lg,
  },

  menuItemText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.primary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.background.secondary,
  },

  bottomSpacer: {
    height: Layout.spacing.xxl * 2,
  },
});
