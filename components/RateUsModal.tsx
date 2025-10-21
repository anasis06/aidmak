import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { X, Star } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

interface RateUsModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function RateUsModal({ visible, onClose, onSubmit }: RateUsModalProps) {
  const [rating, setRating] = useState(0);
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      setRating(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
      handleClose();
    }
  };

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <View style={styles.closeButtonCircle}>
                  <X size={20} color={Colors.text.primary} />
                </View>
              </TouchableOpacity>

              <View style={styles.content}>
                <Text style={styles.title}>Rate Us</Text>

                <Text style={styles.description}>
                  Your input is supper important in helping us understand your needs better, so we can
                  customize our services to suit you perfectly
                </Text>

                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleStarPress(star)}
                      activeOpacity={0.7}
                      style={styles.starButton}
                    >
                      <Star
                        size={40}
                        color={star <= rating ? '#8B5CF6' : Colors.text.primary}
                        fill={star <= rating ? '#8B5CF6' : 'transparent'}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    rating === 0 && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                  disabled={rating === 0}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomIndicator} />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: Colors.background.secondary,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    minHeight: 400,
  },

  closeButton: {
    position: 'absolute',
    top: Layout.spacing.lg,
    right: Layout.spacing.lg,
    zIndex: 10,
  },

  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    alignItems: 'center',
    paddingTop: Layout.spacing.lg,
  },

  title: {
    fontSize: 24,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.lg,
  },

  description: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.xxl,
  },

  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.xxl,
    paddingVertical: Layout.spacing.md,
  },

  starButton: {
    padding: Layout.spacing.xs,
  },

  submitButton: {
    width: '100%',
    backgroundColor: Colors.primary.purple,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitButtonDisabled: {
    opacity: 0.5,
  },

  submitButtonText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.primary,
  },

  bottomIndicator: {
    width: 134,
    height: 5,
    backgroundColor: Colors.text.primary,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: Layout.spacing.lg,
  },
});
