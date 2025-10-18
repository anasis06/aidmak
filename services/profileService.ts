import { supabase } from './api';

export interface UserProfile {
  id?: string;
  user_id: string;
  gender?: string;
  height?: number;
  weight?: number;
  skin_tone?: string;
  profile_picture_url?: string;
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
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      throw new Error(`Failed to upload profile picture: ${error}`);
    }
  },
};
