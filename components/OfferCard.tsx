import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { Share2 } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface OfferCardProps {
  brand: string;
  discount: string;
  description: string;
  specialOffer?: string;
  image: ImageSourcePropType;
  onPress: () => void;
  onShare?: () => void;
}

export default function OfferCard({
  brand,
  discount,
  description,
  specialOffer,
  image,
  onPress,
  onShare,
}: OfferCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="cover" />
        <View style={styles.overlay}>
          <Text style={styles.discountText}>{discount}</Text>
          <Text style={styles.overlaySubtext}>{description}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brandName}>{brand}</Text>
          {onShare && (
            <TouchableOpacity
              onPress={onShare}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Share2 size={20} color={Colors.text.primary} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.description}>{description}</Text>

        {specialOffer && (
          <Text style={styles.specialOffer}>{specialOffer}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },

  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  discountText: {
    fontSize: 24,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },

  overlaySubtext: {
    fontSize: 13,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.primary,
  },

  content: {
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  brandName: {
    fontSize: 24,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  description: {
    fontSize: 14,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.secondary,
    marginBottom: 8,
  },

  specialOffer: {
    fontSize: 14,
    fontWeight: Fonts.weights.semibold,
    color: '#9333EA',
  },
});
