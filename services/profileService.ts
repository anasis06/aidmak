import { supabase } from './api';

export interface StylePreferences {
  [key: string]: any;
}

export interface MeasurementsMetadata {
  [key: string]: any;
}

export interface UserProfile {
  id?: string;
  user_id: string;
  gender?: string;
  height?: number;
  weight?: number;
  skin_tone?: string;
  profile_picture_url?: string;
  chest_measurement?: number;
  waist_measurement?: number;
  hips_measurement?: number;
  inseam_measurement?: number;
  shoe_size?: number;
  clothing_size?: string;
  preferred_fit?: string;
  style_preferences?: StylePreferences;
  body_type?: string;
  additional_notes?: string;
  measurements_metadata?: MeasurementsMetadata;
  created_at?: string;
  updated_at?: string;
}

export const profileService = {
  createProfile: async (profileData: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  upsertProfile: async (profileData: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profileData, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  uploadProfilePicture: async (userId: string, fileUri: string) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const fileExt = fileUri.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      throw new Error(`Failed to upload profile picture: ${error}`);
    }
  },

  isProfileComplete: async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('is_profile_complete', { p_user_id: userId });

      if (error) {
        throw new Error(error.message);
      }

      return data || false;
    } catch (error) {
      console.error('Error checking profile completeness:', error);
      return false;
    }
  },

  subscribeToProfile: (userId: string, callback: (profile: UserProfile | null) => void) => {
    const channel = supabase
      .channel(`profile:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            callback(null);
          } else {
            callback(payload.new as UserProfile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  deleteProfile: async (userId: string) => {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  },
};
