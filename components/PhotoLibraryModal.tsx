import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';

interface PhotoLibraryModalProps {
  visible: boolean;
  onAllow: () => void;
  onCancel: () => void;
}

export function PhotoLibraryModal({ visible, onAllow, onCancel }: PhotoLibraryModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Give full access to your Photo{'\n'}Library?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={onAllow}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Allow Full Access</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },

  modalContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.xxl,
    padding: Layout.spacing.xxl,
    width: '100%',
    maxWidth: 400,
    gap: Layout.spacing.xl,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 30,
  },

  buttonContainer: {
    gap: Layout.spacing.md,
  },

  button: {
    height: 56,
    borderRadius: Layout.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryButton: {
    backgroundColor: Colors.primary.purple,
  },

  primaryButtonText: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  secondaryButton: {
    backgroundColor: Colors.primary.purple,
  },

  secondaryButtonText: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },
});
