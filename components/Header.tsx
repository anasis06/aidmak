import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>

      {title && (
        <View style={styles.centerContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}

      <View style={styles.rightContainer}>{rightComponent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: Layout.spacing.md,
    backgroundColor: Colors.background.primary,
  },

  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },

  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },

  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },

  backButton: {
    padding: Layout.spacing.xs,
  },

  title: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.primary,
  },
});
