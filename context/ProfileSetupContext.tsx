import React, { createContext, useContext, useState, ReactNode } from 'react';
import { profileService, UserProfile } from '@/services/profileService';

interface ProfileSetupData {
  gender?: string;
  height?: number;
  weight?: number;
  chestMeasurement?: number;
  waistMeasurement?: number;
  hipsMeasurement?: number;
  skinTone?: string;
  profilePictureUri?: string;
}

interface ProfileSetupContextType {
  profileData: ProfileSetupData;
  updateProfileData: (data: Partial<ProfileSetupData>) => void;
  saveProfile: (userId: string) => Promise<void>;
  clearProfileData: () => void;
  isLoading: boolean;
}

const ProfileSetupContext = createContext<ProfileSetupContextType | undefined>(undefined);

export const ProfileSetupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profileData, setProfileData] = useState<ProfileSetupData>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateProfileData = (data: Partial<ProfileSetupData>) => {
    setProfileData((prev) => ({ ...prev, ...data }));
  };

  const saveProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      let profilePictureUrl: string | undefined;

      if (profileData.profilePictureUri) {
        profilePictureUrl = await profileService.uploadProfilePicture(
          userId,
          profileData.profilePictureUri
        );
      }

      const profileToSave: Partial<UserProfile> = {
        user_id: userId,
        gender: profileData.gender,
        height: profileData.height,
        weight: profileData.weight,
        chest_measurement: profileData.chestMeasurement,
        waist_measurement: profileData.waistMeasurement,
        hips_measurement: profileData.hipsMeasurement,
        skin_tone: profileData.skinTone,
        profile_picture_url: profilePictureUrl,
      };

      await profileService.upsertProfile(profileToSave);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearProfileData = () => {
    setProfileData({});
  };

  return (
    <ProfileSetupContext.Provider
      value={{
        profileData,
        updateProfileData,
        saveProfile,
        clearProfileData,
        isLoading,
      }}
    >
      {children}
    </ProfileSetupContext.Provider>
  );
};

export const useProfileSetup = () => {
  const context = useContext(ProfileSetupContext);
  if (!context) {
    throw new Error('useProfileSetup must be used within ProfileSetupProvider');
  }
  return context;
};
