import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import OfferCard from '@/components/OfferCard';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { Bell } from 'lucide-react-native';
import { Offer } from '@/types/offer';
import { offersService, OfferData } from '@/services/offersService';

const imageMap: { [key: string]: any } = {
  'Group.png': require('@/assets/images/Group.png'),
  'OBJECTS.png': require('@/assets/images/OBJECTS.png'),
  'Vector.png': require('@/assets/images/Vector.png'),
};

export default function OffersScreen() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await offersService.getActiveOffers();

      const transformedOffers: Offer[] = data.map((offer: OfferData) => ({
        id: offer.id,
        brand: offer.brand,
        discount: offer.discount,
        description: offer.description,
        specialOffer: offer.special_offer || undefined,
        image: imageMap[offer.image_url] || require('@/assets/images/Group.jpg'),
        validityTill: new Date(offer.validity_till).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        categories: offer.categories,
        terms: offer.terms,
        redemptionSteps: offer.redemption_steps,
      }));

      setOffers(transformedOffers);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferPress = (offer: Offer) => {
    router.push({
      pathname: '/offerDetail',
      params: {
        offerId: offer.id,
        brand: offer.brand,
        discount: offer.discount,
        description: offer.description,
        validityTill: offer.validityTill,
        categories: offer.categories,
        terms: offer.terms,
        redemptionSteps: JSON.stringify(offer.redemptionSteps),
        image: offer.image,
      },
    });
  };

  const handleShare = async (offer: Offer) => {
    try {
      await Share.share({
        message: `Check out this offer from ${offer.brand}: ${offer.discount}! ${offer.description}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Offers</Text>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => router.push('/notifications')}
          activeOpacity={0.7}
        >
          <Bell size={24} color={Colors.primary.purple} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.purple} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {offers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No active offers available</Text>
            </View>
          ) : (
            offers.map((offer) => (
              <OfferCard
                key={offer.id}
                brand={offer.brand}
                discount={offer.discount}
                description={offer.description}
                specialOffer={offer.specialOffer}
                image={offer.image}
                onPress={() => handleOfferPress(offer)}
                onShare={() => handleShare(offer)}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },

  title: {
    fontSize: 24,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
