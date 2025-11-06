import { supabase } from './api';
import { UserProfile } from '@/context/UserContext';

interface CreateUserData {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
}

interface CheckUserExistsResult {
  exists: boolean;
  field?: 'email' | 'phone';
  message?: string;
}

export const userService = {
  checkUserExists: async (email: string, phoneNumber: string, countryCode: string): Promise<CheckUserExistsResult> => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    const { data: emailCheck } = await supabase
      .from('users')
      .select('id')
      .ilike('email', email)
      .maybeSingle();

    if (emailCheck) {
      return {
        exists: true,
        field: 'email',
        message: 'This email already exists.'
      };
    }

    const { data: phoneCheck } = await supabase
      .from('users')
      .select('id')
      .eq('phone_number', fullPhoneNumber)
      .maybeSingle();

    if (phoneCheck) {
      return {
        exists: true,
        field: 'phone',
        message: 'This phone number already exists, please enter a different number.'
      };
    }

    return { exists: false };
  },

  createUser: async (userData: CreateUserData) => {
    const fullPhoneNumber = `${userData.countryCode}${userData.phoneNumber}`;

    const { data, error } = await supabase
      .from('users')
      .insert({
        full_name: userData.fullName,
        email: userData.email.toLowerCase(),
        phone_number: fullPhoneNumber,
        country_code: userData.countryCode,
        is_verified: false,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        if (error.message.includes('email')) {
          throw new Error('This email already exists.');
        }
        if (error.message.includes('phone_number')) {
          throw new Error('This phone number already exists, please enter a different number.');
        }
      }
      throw new Error(error.message);
    }

    return data;
  },

  getUserByPhone: async (phoneNumber: string, countryCode: string) => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', fullPhoneNumber)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  getUserByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  getUserById: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  verifyUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
  createProfile: async (userId: string, profileData: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
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

      const fileExt = fileUri.split('.').pop();
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
