import { supabase } from './api';

export interface WardrobeItem {
  id: string;
  user_id: string;
  name: string;
  category: 'Tops' | 'Bottom' | 'Full Body' | 'Layers' | 'Shoes';
  sub_category: string | null;
  image_url: string;
  color: string | null;
  brand: string | null;
  size: string | null;
  created_at: string;
  updated_at: string;
}

export interface Outfit {
  id: string;
  user_id: string;
  name: string;
  image_url: string;
  items: string[];
  last_tried_at: string | null;
  favorite: boolean;
  created_at: string;
  updated_at: string;
}

export const wardrobeService = {
  async getWardrobeItems(userId: string, category?: string): Promise<WardrobeItem[]> {
    try {
      let query = supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching wardrobe items:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getWardrobeItems:', error);
      throw error;
    }
  },

  async getWardrobeItemsBySubCategory(
    userId: string,
    subCategory: string
  ): Promise<WardrobeItem[]> {
    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', userId)
        .eq('sub_category', subCategory)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wardrobe items by sub-category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getWardrobeItemsBySubCategory:', error);
      throw error;
    }
  },

  async getRecentOutfits(userId: string, limit: number = 3): Promise<Outfit[]> {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', userId)
        .not('last_tried_at', 'is', null)
        .order('last_tried_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent outfits:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecentOutfits:', error);
      throw error;
    }
  },

  async addWardrobeItem(item: Omit<WardrobeItem, 'id' | 'created_at' | 'updated_at'>): Promise<WardrobeItem> {
    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .insert([item])
        .select()
        .single();

      if (error) {
        console.error('Error adding wardrobe item:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in addWardrobeItem:', error);
      throw error;
    }
  },

  async updateOutfitLastTried(outfitId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('outfits')
        .update({ last_tried_at: new Date().toISOString() })
        .eq('id', outfitId);

      if (error) {
        console.error('Error updating outfit last tried:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateOutfitLastTried:', error);
      throw error;
    }
  },
};
