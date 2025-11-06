import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react-native';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { wardrobeService, WardrobeItem, Outfit } from '@/services/wardrobeService';
import { userService } from '@/services/userService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = (SCREEN_WIDTH - 48) / 2;

type Category = 'Tops' | 'Bottom' | 'Full Body' | 'Layers' | 'Shoes';
type SubCategory = 'Casual' | 'Formal' | 'Ethnic' | 'Party';

const categoryTabs: Category[] = ['Tops', 'Bottom', 'Full Body', 'Layers', 'Shoes'];
const subCategoryTabs: SubCategory[] = ['Casual', 'Formal', 'Ethnic', 'Party'];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [fullName, setFullName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Bottom');
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory>('Casual');
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [recentOutfits, setRecentOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [outfitIndex, setOutfitIndex] = useState(0);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id, selectedCategory, selectedSubCategory]);

  const loadData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const [items, outfits, userData] = await Promise.all([
        wardrobeService.getWardrobeItemsBySubCategory(user.id, selectedSubCategory),
        wardrobeService.getRecentOutfits(user.id, 3),
        fetchUserName(user.id),
      ]);

      setWardrobeItems(items);
      setRecentOutfits(outfits);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserName = async (userId: string) => {
    try {
      const userData = await userService.getUserById(userId);
      if (userData?.full_name) {
        setFullName(userData.full_name);
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const handlePreviousOutfit = () => {
    setOutfitIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextOutfit = () => {
    setOutfitIndex((prev) => (prev < 2 ? prev + 1 : prev));
  };

  const renderCategoryTabs = () => (
    <View style={styles.categoryTabsContainer}>
      {categoryTabs.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryTab,
            selectedCategory === category && styles.categoryTabActive,
          ]}
          onPress={() => setSelectedCategory(category)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.categoryTabText,
              selectedCategory === category && styles.categoryTabTextActive,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSubCategoryTabs = () => (
    <View style={styles.subCategoryTabsContainer}>
      {subCategoryTabs.map((subCategory) => (
        <TouchableOpacity
          key={subCategory}
          style={[
            styles.subCategoryTab,
            selectedSubCategory === subCategory && styles.subCategoryTabActive,
          ]}
          onPress={() => setSelectedSubCategory(subCategory)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.subCategoryTabText,
              selectedSubCategory === subCategory && styles.subCategoryTabTextActive,
            ]}
          >
            {subCategory}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderWardrobeGrid = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.purple} />
        </View>
      );
    }

    if (wardrobeItems.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items in this category</Text>
        </View>
      );
    }

    return (
      <View style={styles.gridContainer}>
        {wardrobeItems.slice(0, 4).map((item) => (
          <TouchableOpacity key={item.id} style={styles.gridItem} activeOpacity={0.8}>
            <View style={styles.gridItemPlaceholder} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRecentOutfits = () => {
    if (recentOutfits.length === 0) return null;

    return (
      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent tried outfits</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentScroll}
        >
          {recentOutfits.map((outfit) => (
            <TouchableOpacity key={outfit.id} style={styles.recentItem} activeOpacity={0.8}>
              <View style={styles.recentItemPlaceholder} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaContainer>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>Home</Text>
            <Text style={styles.headerGreeting}>Hey{fullName ? `, ${fullName}` : ''}!</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            activeOpacity={0.7}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={24} color={Colors.primary.purple} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/Group.png')}
              style={styles.avatarImage}
              resizeMode="contain"
            />
            <View style={styles.avatarPedestal} />
          </View>

          <TouchableOpacity
            style={[styles.navButton, styles.navButtonLeft]}
            onPress={handlePreviousOutfit}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={Colors.text.primary} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.navButtonRight]}
            onPress={handleNextOutfit}
            activeOpacity={0.7}
          >
            <ChevronRight size={24} color={Colors.text.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {renderCategoryTabs()}

        {renderSubCategoryTabs()}

        {renderWardrobeGrid()}

        <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>Add new dress</Text>
        </TouchableOpacity>

        {renderRecentOutfits()}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.md,
  },

  headerLabel: {
    fontSize: 14,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.secondary,
    marginBottom: 4,
  },

  headerGreeting: {
    fontSize: 28,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  notificationButton: {
    padding: 8,
  },

  avatarSection: {
    height: 380,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: Layout.spacing.lg,
  },

  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },

  avatarImage: {
    width: SCREEN_WIDTH * 0.6,
    height: 320,
  },

  avatarPedestal: {
    width: 200,
    height: 60,
    backgroundColor: '#1A1A1A',
    borderRadius: 100,
    marginTop: -20,
    transform: [{ scaleX: 1.2 }],
  },

  navButton: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  navButtonLeft: {
    left: Layout.spacing.xl,
  },

  navButtonRight: {
    right: Layout.spacing.xl,
  },

  categoryTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.lg,
    gap: 8,
    marginBottom: Layout.spacing.lg,
  },

  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.text.primary,
    backgroundColor: 'transparent',
  },

  categoryTabActive: {
    backgroundColor: Colors.primary.purple,
    borderColor: Colors.primary.purple,
  },

  categoryTabText: {
    fontSize: 14,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.primary,
  },

  categoryTabTextActive: {
    color: Colors.text.primary,
  },

  subCategoryTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.lg,
    gap: 8,
    marginBottom: Layout.spacing.lg,
  },

  subCategoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },

  subCategoryTabActive: {
    backgroundColor: Colors.primary.purple,
  },

  subCategoryTabText: {
    fontSize: 14,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.secondary,
  },

  subCategoryTabTextActive: {
    color: Colors.text.primary,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Layout.spacing.lg,
    gap: 12,
    marginBottom: Layout.spacing.lg,
  },

  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
  },

  gridItemImage: {
    width: '100%',
    height: '100%',
  },

  gridItemPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2A2A',
  },

  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },

  addButton: {
    marginHorizontal: Layout.spacing.lg,
    backgroundColor: Colors.primary.purple,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  recentSection: {
    marginBottom: Layout.spacing.xl,
  },

  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },

  recentTitle: {
    fontSize: 18,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  seeAllText: {
    fontSize: 14,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.secondary,
  },

  recentScroll: {
    paddingHorizontal: Layout.spacing.lg,
    gap: 12,
  },

  recentItem: {
    width: 140,
    height: 180,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },

  recentItemImage: {
    width: '100%',
    height: '100%',
  },

  recentItemPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2A2A',
  },

  bottomSpacer: {
    height: 24,
  },
});
