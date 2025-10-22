import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import Accordion from '@/components/Accordion';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { ChevronLeft, Share2, ExternalLink } from 'lucide-react-native';

export default function OfferDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    brand,
    discount,
    description,
    validityTill,
    categories,
    terms,
    redemptionSteps,
  } = params;

  const steps = redemptionSteps ? JSON.parse(redemptionSteps as string) : [];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this offer from ${brand}: ${discount}! ${description}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRedeem = () => {
    console.log('Redeem offer for:', brand);
  };

  return (
    <SafeAreaContainer>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={28} color={Colors.text.primary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offers</Text>
        <TouchableOpacity
          onPress={handleShare}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Share2 size={24} color={Colors.text.primary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroImageContainer}>
          <Image
            source={require('@/assets/images/Group.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroDiscount}>{discount}</Text>
            <Text style={styles.heroDescription}>
              Where Comfort Meets Elegance
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.mainTitle}>{discount}</Text>
          <Text style={styles.mainDescription}>
            Discover the latest {brand} collection with up to 60% off on
            selected trendy sweaters, tops, and casual wear. Refresh your
            wardrobe with premium styles that combine comfort s and elegance.
          </Text>

          <View style={styles.accordionContainer}>
            <Accordion title="Details" defaultExpanded={true}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Validity till</Text>
                <Text style={styles.detailValue}>{validityTill}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Eligible Categories</Text>
                <Text style={styles.detailValue}>{categories}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>T&Cs</Text>
                <Text style={styles.detailValue}>{terms}</Text>
              </View>
            </Accordion>

            <Accordion title="How to redeem">
              <View style={styles.stepsContainer}>
                {steps.map((step: string, index: number) => (
                  <View key={index} style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </Accordion>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.redeemButton}
          onPress={handleRedeem}
          activeOpacity={0.8}
        >
          <ExternalLink size={20} color={Colors.text.primary} strokeWidth={2} />
          <Text style={styles.redeemButtonText}>Redeem now</Text>
        </TouchableOpacity>
      </View>
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

  headerTitle: {
    fontSize: 20,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  heroImageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    marginBottom: Layout.spacing.lg,
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Layout.spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  heroDiscount: {
    fontSize: 28,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },

  heroDescription: {
    fontSize: 14,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.primary,
  },

  content: {
    paddingHorizontal: Layout.spacing.lg,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },

  mainDescription: {
    fontSize: 15,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: Layout.spacing.xl,
  },

  accordionContainer: {
    gap: 0,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  detailLabel: {
    fontSize: 15,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.secondary,
    flex: 1,
  },

  detailValue: {
    fontSize: 15,
    fontWeight: Fonts.weights.medium,
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'right',
  },

  stepsContainer: {
    gap: 16,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepNumberText: {
    fontSize: 14,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  stepText: {
    flex: 1,
    fontSize: 15,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.primary,
    lineHeight: 22,
    paddingTop: 4,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Layout.spacing.lg,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },

  redeemButton: {
    backgroundColor: Colors.primary.purple,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  redeemButtonText: {
    fontSize: 16,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },
});
