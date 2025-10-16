import React, { createContext, useState, ReactNode } from 'react';

export interface UserProfile {
  id?: string;
  email?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  bodyMeasurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
  };
  skinTone?: string;
  profilePicture?: string;
  isProfileComplete?: boolean;
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>({
    isProfileComplete: false,
  });

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const clearProfile = () => {
    setProfile({ isProfileComplete: false });
  };

  const value = {
    profile,
    updateProfile,
    clearProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
