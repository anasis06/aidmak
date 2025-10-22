import { supabase } from './api';

export interface OfferData {
  id: string;
  brand: string;
  discount: string;
  description: string;
  special_offer: string | null;
  image_url: string;
  validity_till: string;
  categories: string;
  terms: string;
  redemption_steps: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const offersService = {
  async getActiveOffers(): Promise<OfferData[]> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .gte('validity_till', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveOffers:', error);
      throw error;
    }
  },

  async getOfferById(id: string): Promise<OfferData | null> {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching offer:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getOfferById:', error);
      throw error;
    }
  },
};
